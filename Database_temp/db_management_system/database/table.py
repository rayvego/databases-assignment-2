from bplustree import BPlusTree

class Table:
    def __init__(self, name, schema, order=8, search_key=None):
        self.name = name                             # Name of the table
        self.schema = schema                         # Table schema: dict of {column_name: data_type}
        self.order = order                           # Order of the B+ Tree (max number of children)
        self.data = BPlusTree(order=order)           # Underlying B+ Tree to store the data
        self.search_key = search_key                 # Primary or search key used for indexing (must be in schema)

    def validate_record(self, record):
        """
        Validate that the given record matches the table schema:
        - All required columns are present
        - Data types are correct
        """
        pass

    def insert(self, record):
        """
        Insert a new record into the table.
        The record should be a dictionary matching the schema.
        The key used for insertion should be the value of the `search_key` field.
        """
        pass

    def get(self, record_id):
        """
        Retrieve a single record by its ID (i.e., the value of the `search_key`)
        """
        pass

    def get_all(self):
        """
        Retrieve all records stored in the table in sorted order by search key
        """
        pass

    def update(self, record_id, new_record):
        """
        Update a record identified by `record_id` with `new_record` data.
        Usually overwrites the existing entry.
        """
        pass

    def delete(self, record_id):
        """
        Delete the record from the table by its `record_id`
        """
        pass

    def range_query(self, start_value, end_value):
        """
        Perform a range query using the search key.
        Returns records where start_value <= key <= end_value
        """
        pass
