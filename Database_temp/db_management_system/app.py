# app.py
from flask import Flask
from api.routes import api

app = Flask(__name__)
app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def index():
    return {
        "message": "Welcome to the In-Memory Database Management System",
        "version": "1.0.0",
        "endpoints": {
            "GET /api/databases": "List all databases",
            "POST /api/databases": "Create a new database",
            "DELETE /api/databases/<db_name>": "Delete a database",
            "GET /api/databases/<db_name>/tables": "List all tables in a database",
            "POST /api/databases/<db_name>/tables": "Create a new table in a database",
            "DELETE /api/databases/<db_name>/tables/<table_name>": "Delete a table from a database",
            "GET /api/databases/<db_name>/tables/<table_name>/records": "List all records in a table",
            "POST /api/databases/<db_name>/tables/<table_name>/records": "Create a new record in a table",
            "GET /api/databases/<db_name>/tables/<table_name>/records/<record_id>": "Get a specific record from a table",
            "PUT /api/databases/<db_name>/tables/<table_name>/records/<record_id>": "Update a specific record in a table",
            "DELETE /api/databases/<db_name>/tables/<table_name>/records/<record_id>": "Delete a specific record from a table",
            "POST /api/databases/<db_name>/tables/<table_name>/search": "Search records by field constraints",
            "POST /api/databases/<db_name>/tables/<table_name>/range": "Range query on a specific field"
        }
    }

if __name__ == '__main__':
    app.run(debug=True)
