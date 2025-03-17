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

        guests = []
        for key, value in data.items():
            for j in range(value):
                guests.append(Guest(j, key))            

        numOfTables = math.ceil(len(guests) / 10) + 1
        numOfSeats = numOfTables * 10

        for i in range(numOfSeats - len(guests)):
            guests.append(Guest(i, "_"))

        algorithm = Algorithm(guests, numOfTables)

        result = algorithm.solve(guests, generations=500, pop_size=200, elite_size=20)
        fitness = algorithm.fitness(result)
        resultMat = []
        for i in range(numOfTables):
            start = i * 10
            resultMat.append(list(map(lambda guest: str(guest), sorted(result[start:start + 10]))))

        response = {
            "numOfSeats": numOfSeats,
            "result": resultMat,
            "numOfTables": numOfTables,
            "fitness": fitness
        }

        return jsonify(response), 200
    
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

        result = algorithm.solve(guests, generations=500, pop_size=200, elite_size=20)
        fitness = algorithm.fitness(result)
        resultMat = []
        for i in range(numOfTables):
            start = i * 10
            resultMat.append(sorted(result[start:start + 10]))

        return render_template('seating.html', groupToAmount=groupToAmount, numOfSeats=numOfSeats, result=resultMat, numOfTables=numOfTables, fitness=fitness)

    return app