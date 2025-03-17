import os
import random
import math
from .guest import Guest
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

        # Example of accessing data
        name = data.get("name")
        age = data.get("age")

        # You can process data here as needed
        if not name or not age:
            return jsonify({"error": "Name and age are required"}), 400

        # Example response
        response = {
            "message": f"Hello {name}, you are {age} years old!"
        }

        return jsonify(response), 200
    
    # a simple page that says hello
    @app.route('/seating')
    def seating():
        guests = []
        for i in range(10):
            amount = random.randint(3, 10)
            for j in range(amount):
                guests.append(Guest(j, chr(i+65)))

        numOfTables = math.ceil(len(guests) / 10) + 1
        numOfSeats = numOfTables * 10

        for i in range(numOfSeats - len(guests)):
            guests.append(Guest(i, "_"))

        groupToAmount = {}
        for guest in guests:
            if guest.group not in groupToAmount:
                groupToAmount[guest.group] = 0
            groupToAmount[guest.group] += 1

        algorithm = Algorithm(guests, numOfTables)

        print(groupToAmount)
        print(numOfSeats)
        result = algorithm.solve(guests, generations=500, pop_size=200, elite_size=20)
        print(algorithm.fitness(result))
        resultMat = []
        for i in range(numOfTables):
            start = i * 10
            sortedTable = sorted(result[start:start + 10])
            print(sortedTable)
            resultMat.append(sortedTable)

        return render_template('seating.html', groupToAmount=groupToAmount, numOfSeats=numOfSeats, result=resultMat, numOfTables=numOfTables)

    return app