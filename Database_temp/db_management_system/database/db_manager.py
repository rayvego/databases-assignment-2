from table import Table

class DatabaseManager:
    def __init__(self):
        self.databases = {}  # Dictionary to store databases as {db_name: {table_name: Table instance}}

    def create_database(self, db_name):
        """
        Create a new database with the given name.
        Initializes an empty dictionary for tables within this database.
        """
        pass

    def delete_database(self, db_name):
        """
        Delete an existing database and all its tables.
        """
        pass

    def list_databases(self):
        """
        Return a list of all database names currently managed.
        """
        pass

    def create_table(self, db_name, table_name, schema, order=8, search_key=None):
        """
        Create a new table within a specified database.
        - schema: dictionary of column names and data types
        - order: B+ tree order for indexing
        - search_key: field name to use as the key in the B+ Tree
        """
        pass

    def delete_table(self, db_name, table_name):
        """
        Delete a table from the specified database.
        """
        pass

    def list_tables(self, db_name):
        """
        List all tables within a given database.
        """
        pass

    def get_table(self, db_name, table_name):
        """
        Retrieve a Table instance from a given database.
        Useful for performing operations like insert, update, delete on that table.
        """
        pass
