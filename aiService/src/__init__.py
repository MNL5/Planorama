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

    def parse(request, callback):
        data = request.get_json()
        if not data:
            print("Error: No data provided")
            return jsonify({"error": "No data provided"}), 400
        
        if not isinstance(data, dict):
            print("Error: Invalid data format")
            return jsonify({"error": "Invalid data format"}), 400

        if 'guests' not in data or 'tables' not in data or 'relations' not in data:
            print("Error: Missing required keys in data")
            return jsonify({"error": "Missing required keys"}), 400
        
        guests = [Guest.from_dict(guest) for guest in data['guests']]
        tables = [Table.from_dict(table) for table in data['tables']]
        relations = [Relation.from_dict(relation) for relation in data['relations']]

        numOfSeats = reduce(lambda acc, table: acc + table.numOfSeats, tables, 0)

        if numOfSeats < len(guests):
            print("Error: Not enough seats for all guests")
            return jsonify({"error": "Not enough seats for all guests"}), 400

        for i in range(numOfSeats - len(guests)):
            guests.append(Guest(i, "_"))

        return callback(Algorithm(guests, tables, relations))
    
    def calculate_algo(algorithm):
        result, best_fitness = algorithm.solve(generations=1000, pop_size=200, elite_rate=0.05, mutation_rate=0.01)

        response = {
            "guests": [guest.to_dict() for guest in result if guest.group != "_"],
            "totalFitness": best_fitness,
        }

        return jsonify(response), 200
    
    def satisfaction_algo(algorithm):
        guests = algorithm.setSatisfactory(algorithm.guests)

        response = {
            "guests": [guest.to_dict() for guest in guests if guest.group != "_"],
        }

        return jsonify(response), 200

    @app.route('/seating', methods = ['POST'])
    def calculate():
        return parse(request, lambda algorithm: calculate_algo(algorithm))
    
    @app.route('/satisfaction', methods = ['POST'])
    def satisfaction():
        return parse(request, lambda algorithm: satisfaction_algo(algorithm))

    return app