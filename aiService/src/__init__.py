import os
from functools import reduce
from .guest import Guest
from .table import Table
from .relation import Relation
from .algorithm import Algorithm

from flask import Flask, request, jsonify, render_template

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/seating', methods = ['POST'])
    def calculate():
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        if not isinstance(data, dict):
            return jsonify({"error": "Invalid data format"}), 400

        if 'guests' not in data or 'tables' not in data or 'relations' not in data:
            return jsonify({"error": "Missing required keys"}), 400
        
        guests = [Guest.from_dict(guest) for guest in data['guests']]         
        tables = [Table.from_dict(table) for table in data['tables']]     
        relations = [Relation.from_dict(relation) for relation in data['relations']]     

        numOfSeats = reduce(lambda acc, table: acc + table.numOfSeats, tables, 0)

        if numOfSeats < len(guests):
            return jsonify({"error": "Not enough seats for all guests"}), 400

        for i in range(numOfSeats - len(guests)):
            guests.append(Guest(i, "_"))

        algorithm = Algorithm(guests, tables, relations)
        result = algorithm.solve(guests, generations=500, pop_size=200, elite_size=20)

        response = {
            "guests": [guest.to_dict() for guest in result if guest.group != "_"]
        }

        return jsonify(response), 200

    return app