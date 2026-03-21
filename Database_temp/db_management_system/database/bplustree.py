from graphviz import Digraph
import math

# B+ Tree Node class. Can be used as either internal or leaf node.
class BPlusTreeNode:
    def __init__(self, order, is_leaf=True):
        self.order = order                  # Maximum number of children a node can have
        self.is_leaf = is_leaf              # Flag to check if node is a leaf
        self.keys = []                      # List of keys in the node
        self.values = []                    # Used in leaf nodes to store associated values
        self.children = []                  # Used in internal nodes to store child pointers
        self.next = None                    # Points to next leaf node for range queries

    def is_full(self):
        # A node is full if it has reached the maximum number of keys (order - 1)
        return len(self.keys) >= self.order - 1


class BPlusTree:
    def __init__(self, order=8):
        self.order = order                          # Maximum number of children per internal node
        self.root = BPlusTreeNode(order)            # Start with an empty leaf node as root


    def search(self, key):
        """Search for a key in the B+ tree and return the associated value"""
        return self._search(self.root, key)

    def _search(self, node, key):
        """Helper function to recursively search for a key starting from the given node"""
        if node.is_leaf:
            # Binary search within leaf keys
            for i, k in enumerate(node.keys):
                if k == key:
                    return node.values[i]
            return None
        else:
            # Find the correct child to descend into
            i = 0
            while i < len(node.keys) and key >= node.keys[i]:
                i += 1
            return self._search(node.children[i], key)


    def insert(self, key, value):
        """Insert a new key-value pair into the B+ tree"""
        root = self.root

        if root.is_full():
            # Root is full — grow the tree upward
            new_root = BPlusTreeNode(self.order, is_leaf=False)
            new_root.children.append(self.root)
            self.root = new_root
            self._split_child(new_root, 0)
            self._insert_non_full(new_root, key, value)
        else:
            self._insert_non_full(root, key, value)

        return True

    def _insert_non_full(self, node, key, value):
        """Insert key-value into a node that is not full"""
        if node.is_leaf:
            # Insert in sorted order within the leaf
            i = len(node.keys) - 1
            node.keys.append(None)
            node.values.append(None)
            while i >= 0 and node.keys[i] > key:
                node.keys[i + 1] = node.keys[i]
                node.values[i + 1] = node.values[i]
                i -= 1
            node.keys[i + 1] = key
            node.values[i + 1] = value
        else:
            # Find the correct child to descend into
            i = len(node.keys) - 1
            while i >= 0 and node.keys[i] > key:
                i -= 1
            i += 1  # child index to descend

            if node.children[i].is_full():
                self._split_child(node, i)
                # After split, determine which of the two children to descend into
                if key >= node.keys[i]:
                    i += 1

            self._insert_non_full(node.children[i], key, value)

    def _split_child(self, parent, index):
        """
        Split the child node at given index in the parent.
        This is triggered when the child is full.
        """
        order = self.order
        child = parent.children[index]
        new_node = BPlusTreeNode(order, is_leaf=child.is_leaf)

        mid = len(child.keys) // 2  # index of the middle key

        if child.is_leaf:
            # --- Leaf split: copy-up semantics ---
            # new_node gets keys[mid:] and values[mid:]
            new_node.keys = child.keys[mid:]
            new_node.values = child.values[mid:]
            child.keys = child.keys[:mid]
            child.values = child.values[:mid]

            # Maintain the leaf linked list
            new_node.next = child.next
            child.next = new_node

            # The key that goes up to parent is the first key of the new (right) node
            up_key = new_node.keys[0]
        else:
            # --- Internal node split: push-up semantics ---
            up_key = child.keys[mid]

            new_node.keys = child.keys[mid + 1:]
            new_node.children = child.children[mid + 1:]
            child.keys = child.keys[:mid]
            child.children = child.children[:mid + 1]

        # Insert up_key and new_node into the parent
        parent.keys.insert(index, up_key)
        parent.children.insert(index + 1, new_node)


    def delete(self, key):
        """Delete a key from the B+ tree"""
        if self.root is None or len(self.root.keys) == 0:
            return False

        self._delete(self.root, key)

        # If the root has no keys but has a child, shrink the tree
        if not self.root.is_leaf and len(self.root.keys) == 0:
            self.root = self.root.children[0]

        return True

    def _delete(self, node, key):
        """Recursive helper function for delete operation"""
        min_keys = math.ceil(self.order / 2) - 1

        if node.is_leaf:
            # Find and remove the key in the leaf
            if key in node.keys:
                idx = node.keys.index(key)
                node.keys.pop(idx)
                node.values.pop(idx)
            # If key is not present, nothing to do
        else:
            # Find the index of the child to descend into
            i = 0
            while i < len(node.keys) and key >= node.keys[i]:
                i += 1

            child = node.children[i]

            # Ensure child has enough keys before descending
            if len(child.keys) <= min_keys:
                self._fill_child(node, i)
                # After fill, the tree structure may have changed — recompute index
                # Re-find i (the separator key might have shifted)
                i = 0
                while i < len(node.keys) and key >= node.keys[i]:
                    i += 1

            self._delete(node.children[i], key)

            # After deletion, update internal node separator keys if needed.
            # If the deleted key was a separator in this node, update it.
            for j in range(len(node.keys)):
                if node.keys[j] == key:
                    # Find the leftmost key of the right subtree of node.keys[j]
                    successor_leaf = node.children[j + 1]
                    while not successor_leaf.is_leaf:
                        successor_leaf = successor_leaf.children[0]
                    if successor_leaf.keys:
                        node.keys[j] = successor_leaf.keys[0]
                    else:
                        # The right subtree is now empty — remove both key and child
                        node.keys.pop(j)
                        node.children.pop(j + 1)
                    break

    def _fill_child(self, node, index):
        """Ensure that the child node has enough keys to allow safe deletion"""
        min_keys = math.ceil(self.order / 2) - 1
        child = node.children[index]

        # Try borrowing from left sibling first
        if index > 0 and len(node.children[index - 1].keys) > min_keys:
            self._borrow_from_prev(node, index)
        # Try borrowing from right sibling
        elif index < len(node.children) - 1 and len(node.children[index + 1].keys) > min_keys:
            self._borrow_from_next(node, index)
        # Must merge
        else:
            if index > 0:
                # Merge child with its left sibling
                self._merge(node, index - 1)
            else:
                # Merge child with its right sibling
                self._merge(node, index)

    def _borrow_from_prev(self, node, index):
        """Borrow a key from the left sibling"""
        child = node.children[index]
        left_sibling = node.children[index - 1]

        if child.is_leaf:
            # Move the last key-value of left_sibling to the front of child
            child.keys.insert(0, left_sibling.keys.pop())
            child.values.insert(0, left_sibling.values.pop())
            # Update the separator key in parent to the new first key of child
            node.keys[index - 1] = child.keys[0]
        else:
            # Pull the parent separator key down into child, push last key of left_sibling up
            child.keys.insert(0, node.keys[index - 1])
            node.keys[index - 1] = left_sibling.keys.pop()
            # Move the last child pointer of left_sibling to child
            child.children.insert(0, left_sibling.children.pop())

    def _borrow_from_next(self, node, index):
        """Borrow a key from the right sibling"""
        child = node.children[index]
        right_sibling = node.children[index + 1]

        if child.is_leaf:
            # Move the first key-value of right_sibling to the end of child
            child.keys.append(right_sibling.keys.pop(0))
            child.values.append(right_sibling.values.pop(0))
            # Update the separator key in parent to the new first key of right_sibling
            node.keys[index] = right_sibling.keys[0]
        else:
            # Pull the parent separator key down into child, push first key of right_sibling up
            child.keys.append(node.keys[index])
            node.keys[index] = right_sibling.keys.pop(0)
            # Move the first child pointer of right_sibling to child
            child.children.append(right_sibling.children.pop(0))

    def _merge(self, node, index):
        """Merge two child nodes into one"""
        left_child = node.children[index]
        right_child = node.children[index + 1]

        if left_child.is_leaf:
            # Merge right into left: copy all keys/values from right to left
            left_child.keys.extend(right_child.keys)
            left_child.values.extend(right_child.values)
            # Fix linked list
            left_child.next = right_child.next
        else:
            # Pull the separator key from parent down into left_child
            separator = node.keys[index]
            left_child.keys.append(separator)
            left_child.keys.extend(right_child.keys)
            left_child.children.extend(right_child.children)

        # Remove the separator key and right child pointer from parent
        node.keys.pop(index)
        node.children.pop(index + 1)


    def update(self, key, new_value):
        """Update the value associated with a key"""
        node = self.root
        # Traverse to the correct leaf
        while not node.is_leaf:
            i = 0
            while i < len(node.keys) and key >= node.keys[i]:
                i += 1
            node = node.children[i]

        # Now node is the leaf; find and update the key
        for i, k in enumerate(node.keys):
            if k == key:
                node.values[i] = new_value
                return True
        return False


    def range_query(self, start_key, end_key):
        """
        Return all key-value pairs where start_key <= key <= end_key.
        Utilizes the linked list structure of leaf nodes.
        """
        result = []

        # Find the leaf that may contain start_key
        node = self.root
        while not node.is_leaf:
            i = 0
            while i < len(node.keys) and start_key >= node.keys[i]:
                i += 1
            node = node.children[i]

        # Walk the linked list collecting keys in range
        while node is not None:
            for i, k in enumerate(node.keys):
                if k > end_key:
                    return result
                if k >= start_key:
                    result.append((k, node.values[i]))
            node = node.next

        return result

    def get_all(self):
        """Get all key-value pairs in the tree in sorted order"""
        result = []
        self._get_all(self.root, result)
        return result

    def _get_all(self, node, result):
        """Recursive helper function to gather all key-value pairs"""
        if node is None:
            return

        if node.is_leaf:
            for i, k in enumerate(node.keys):
                result.append((k, node.values[i]))
        else:
            # Traverse to the leftmost leaf via the first child, then use the linked list
            # But since _get_all is recursive, we just descend into each child
            for child in node.children:
                self._get_all(child, result)


    def visualize_tree(self, filename=None):
        """
        Visualize the tree using graphviz.
        Optional filename can be provided to save the output.
        """
        dot = Digraph(comment="B+ Tree")
        dot.attr(rankdir="TB")

        if self.root:
            self._add_nodes(dot, self.root)
            self._add_edges(dot, self.root)

        if filename:
            dot.render(filename, view=False, format="png", cleanup=True)

        return dot

    def _add_nodes(self, dot, node):
        """Add graph nodes for visualization"""
        node_id = str(id(node))

        if node.is_leaf:
            # Show key-value pairs in leaf nodes
            label = " | ".join(f"{k}:{v}" for k, v in zip(node.keys, node.values))
            label = f"[{label}]"
            dot.node(node_id, label=label, shape="record", style="filled", fillcolor="lightblue")
        else:
            # Show only keys in internal nodes
            label = " | ".join(str(k) for k in node.keys)
            dot.node(node_id, label=label, shape="record", style="filled", fillcolor="lightyellow")

        # Recurse into children
        if not node.is_leaf:
            for child in node.children:
                self._add_nodes(dot, child)

    def _add_edges(self, dot, node):
        """Add graph edges for visualization"""
        node_id = str(id(node))

        if not node.is_leaf:
            for child in node.children:
                child_id = str(id(child))
                dot.edge(node_id, child_id)
                self._add_edges(dot, child)
        else:
            # Draw dashed edges between adjacent leaf nodes to show the linked list
            if node.next is not None:
                dot.edge(node_id, str(id(node.next)), style="dashed", constraint="false")
