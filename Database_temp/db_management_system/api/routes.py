# api/routes.py
from flask import Blueprint, request, jsonify, Response
from database.db_manager import DatabaseManager

api = Blueprint('api', __name__)
db_manager = DatabaseManager()

@api.route('/databases', methods=['GET'])
def get_databases():
    databases = db_manager.list_databases()
    return jsonify({"databases": databases, "count": len(databases)})

@api.route('/databases', methods=['POST'])
def create_database():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Database name is required"}), 400
    
    success, message = db_manager.create_database(data['name'])
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400

@api.route('/databases/<db_name>', methods=['DELETE'])
def delete_database(db_name):
    success, message = db_manager.delete_database(db_name)
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 404

@api.route('/databases/<db_name>/tables', methods=['GET'])
def get_tables(db_name):
    tables, message = db_manager.list_tables(db_name)
    if tables is not None:
        return jsonify({"tables": tables, "count": len(tables)})
    else:
        return jsonify({"error": message}), 404

@api.route('/databases/<db_name>/tables', methods=['POST'])
def create_table(db_name):
    data = request.json
    if not data or 'name' not in data or 'schema' not in data:
        return jsonify({"error": "Table name and schema are required"}), 400
    
    success, message = db_manager.create_table(db_name, data['name'], data['schema'])
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400

@api.route('/databases/<db_name>/tables/<table_name>', methods=['DELETE'])
def delete_table(db_name, table_name):
    success, message = db_manager.delete_table(db_name, table_name)
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 404

@api.route('/databases/<db_name>/tables/<table_name>/records', methods=['GET'])
def get_records(db_name, table_name):
    table, message = db_manager.get_table(db_name, table_name)
    if table is None:
        return jsonify({"error": message}), 404
    
    records = table.get_all()
    formatted_records = [{
        "id": record_id,
        "data": record_data
    } for record_id, record_data in records]
    
    return jsonify({"records": formatted_records, "count": len(formatted_records)})

@api.route('/databases/<db_name>/tables/<table_name>/records', methods=['POST'])
def create_record(db_name, table_name):
    data = request.json
    if not data:
        return jsonify({"error": "Record data is required"}), 400
    
    table, message = db_manager.get_table(db_name, table_name)
    if table is None:
        return jsonify({"error": message}), 404
    
    # Check if the data is a list (multiple records) or a dict (single record)
    if isinstance(data, list):
        # Handle multiple records
        results = []
        for record in data:
            success, result = table.insert(record)
            if success:
                results.append({"id": result, "status": "success"})
            else:
                results.append({"error": result, "status": "failed"})
        
        return jsonify({
            "message": f"Processed {len(data)} records",
            "results": results,
            "success_count": sum(1 for r in results if r["status"] == "success")
        }), 201
    else:
        # Handle single record (existing functionality)
        success, result = table.insert(data)
        if success:
            return jsonify({"message": "Record created successfully", "id": result}), 201
        else:
            return jsonify({"error": result}), 400


# @api.route('/databases/<db_name>/tables/<table_name>/records/<record_id>', methods=['GET'])
# def get_record(db_name, table_name, record_id):
#     table, message = db_manager.get_table(db_name, table_name)
#     if table is None:
#         return jsonify({"error": message}), 404
    
#     record = table.get(record_id)
#     if record:
#         return jsonify({"id": record_id, "data": record})
#     else:
#         return jsonify({"error": "Record not found"}), 404

@api.route('/databases/<db_name>/tables/<table_name>/records/<record_id>', methods=['GET'])
def get_record(db_name, table_name, record_id):
    try:
        table, message = db_manager.get_table(db_name, table_name)
        if table is None:
            return jsonify({"error": message}), 404

        record = table.get(record_id)
        if record:
            try:
                return jsonify({"id": record_id, "data": record})
            except Exception as e:
                return jsonify({"error": f"Serialization error: {str(e)}"}), 500
        else:
            return jsonify({"error": "Record not found"}), 404

    except Exception as e:
        # You can also log this error for debugging
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@api.route('/databases/<db_name>/tables/<table_name>/records/<record_id>', methods=['PUT'])
def update_record(db_name, table_name, record_id):
    data = request.json
    if not data:
        return jsonify({"error": "Record data is required"}), 400
    
    table, message = db_manager.get_table(db_name, table_name)
    if table is None:
        return jsonify({"error": message}), 404
    
    success, message = table.update(record_id, data)
    if success:
        return jsonify({"message": message})
    else:
        return jsonify({"error": message}), 404

@api.route('/databases/<db_name>/tables/<table_name>/records/<record_id>', methods=['DELETE'])
def delete_record(db_name, table_name, record_id):
    table, message = db_manager.get_table(db_name, table_name)
    if table is None:
        return jsonify({"error": message}), 404
    
    success, message = table.delete(record_id)
    if success:
        return jsonify({"message": message})
    else:
        return jsonify({"error": message}), 404

@api.route('/databases/<db_name>/tables/<table_name>/search', methods=['POST'])
def search_records(db_name, table_name):
    data = request.json
    if not data or 'constraints' not in data:
        return jsonify({"error": "Search constraints are required"}), 400
    
    table, message = db_manager.get_table(db_name, table_name)
    if table is None:
        return jsonify({"error": message}), 404
    
    results = table.search(data['constraints'])
    formatted_results = [{
        "id": record_id,
        "data": record_data
    } for record_id, record_data in results]
    
    return jsonify({"records": formatted_results, "count": len(formatted_results)})

@api.route('/databases/<db_name>/tables/<table_name>/range', methods=['POST'])
def range_query(db_name, table_name):
    data = request.json
    if not data or 'field' not in data or 'start' not in data or 'end' not in data:
        return jsonify({"error": "Field name, start value, and end value are required"}), 400
    
    table, message = db_manager.get_table(db_name, table_name)
    if table is None:
        return jsonify({"error": message}), 404
    
    results = table.range_query(data['field'], data['start'], data['end'])
    formatted_results = [{
        "id": record_id,
        "data": record_data
    } for record_id, record_data in results]
    
    return jsonify({"records": formatted_results, "count": len(formatted_results)})

@api.route('/databases/<db_name>/tables/<table_name>/visualize', methods=['GET'])
def visualize_tree(db_name, table_name):
    table, message = db_manager.get_table(db_name, table_name)
    if table is None:
        return jsonify({"error": message}), 404

    dot = table.data.visualize_tree()
    svg_data = dot.pipe(format='svg').decode('utf-8')
    # return jsonify({"dot_representation": tree_visualization.source})
    return Response(svg_data, mimetype='image/svg+xml')

 