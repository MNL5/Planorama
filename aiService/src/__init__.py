import os
from functools import reduce
from .guest import Guest
from .table import Table
from .relation import Relation
from .algorithm import Algorithm
from concurrent.futures import ThreadPoolExecutor, as_completed
from flask import Flask, request, jsonify

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

    def get_algorithm(data, numOfSeats):
        guests = [Guest.from_dict(guest) for guest in data['guests']]
        tables = [Table.from_dict(table) for table in data['tables']]
        relations = [Relation.from_dict(relation) for relation in data['relations']]

        for i in range(numOfSeats - len(guests)):
            guests.append(Guest(i, "_"))

        return Algorithm(guests, tables, relations)

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
        
        numOfSeats = reduce(lambda acc, table: acc + table['numOfSeats'], data['tables'], 0)

        if numOfSeats < len(data['guests']):
            print("Error: Not enough seats for all guests")
            return jsonify({"error": "Not enough seats for all guests"}), 400

        return callback(data, numOfSeats)
    
    def calculate_algo_helper(data, numOfSeats):
        algorithm = get_algorithm(data, numOfSeats)
        return algorithm.solve(generations=500, pop_size=200, elite_rate=0.05, mutation_rate=0.01)

    def calculate_algo(data, numOfSeats):
        best_result = None

        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = [executor.submit(calculate_algo_helper, data, numOfSeats) for i in range(3)]

            for future in as_completed(futures):
                result, best_fitness = future.result()
                if best_result is None or best_fitness > best_result[1]:
                    best_result = (result, best_fitness)

        response = {
            "guests": [guest.to_dict() for guest in best_result[0] if guest.group != "_"],
            "totalFitness": best_result[1],
        }

        return jsonify(response), 200
    
    def satisfaction_algo(data, numOfSeats):
        algorithm = get_algorithm(data, numOfSeats)
        guests = algorithm.setSatisfactory(algorithm.guests)

        response = {
            "guests": [guest.to_dict() for guest in guests if guest.group != "_"],
        }

        return jsonify(response), 200

    @app.route('/seating', methods = ['POST'])
    def calculate():
        return parse(request, lambda data, numOfSeats: calculate_algo(data, numOfSeats))

    @app.route('/satisfaction', methods = ['POST'])
    def satisfaction():
        return parse(request, lambda data, numOfSeats: satisfaction_algo(data, numOfSeats))

    return app