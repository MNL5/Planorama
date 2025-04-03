import math
import random
from functools import reduce
import numpy as np

class Algorithm:
    def __init__(self, guests, tables, relations):
        self.guests = guests
        self.tables = tables
        sortedTables = sorted(tables, key=lambda x: x.numOfSeats)
        
        self.seatToTable = []
        for table in sortedTables:
            for i in range(table.numOfSeats):
                self.seatToTable.append(table.id)
        self.numOfTables = len(sortedTables)

        self.relations = {}
        for relation in relations:
            if relation.firstGuestId not in self.relations:
                self.relations[relation.firstGuestId] = {}
            if relation.secondGuestId not in self.relations:
                self.relations[relation.secondGuestId] = {}
            
            if relation.type not in self.relations[relation.firstGuestId]:
                self.relations[relation.firstGuestId][relation.type] = []
            if relation.type not in self.relations[relation.secondGuestId]:
                self.relations[relation.secondGuestId][relation.type] = []
            
            self.relations[relation.firstGuestId][relation.type].append(relation.secondGuestId)
            self.relations[relation.secondGuestId][relation.type].append(relation.firstGuestId)

    def happinesFunc(self, guest, i, groupToAmountPerTable, guestToTable):
        table = self.seatToTable[i]
        score = groupToAmountPerTable[table][guest.group] - 1

        if guest.name in self.relations:
            if 'loving' in self.relations[guest.name]:
                score += reduce(lambda acc, guestId: acc + (1 if guestToTable[guestId] == table else 0), self.relations[guest.name].loving, 0) * 0.5
            if 'hating' in self.relations[guest.name]:
                score -= reduce(lambda acc, guestId: acc + (1 if guestToTable[guestId] == table else 0), self.relations[guest.name].hating, 0) * 1.2

        return math.exp(score) - 1
    
    def calcHelpers(self, guests):
        groupToAmountPerTable = {}
        guestToTable = {}

        for i, guest in enumerate(guests):
            table = self.seatToTable[i]
            guestToTable[guest.name] = table

            if table not in groupToAmountPerTable:
                groupToAmountPerTable[table] = {}
            
            if guest.group not in groupToAmountPerTable[table]:
                groupToAmountPerTable[table][guest.group] = 0
            groupToAmountPerTable[table][guest.group] += 1

        return groupToAmountPerTable, guestToTable

    def fitness(self, guests):
        groupToAmountPerTable, guestToTable = self.calcHelpers(guests)
        return sum([self.happinesFunc(guest, i, groupToAmountPerTable, guestToTable) for i, guest in enumerate(guests) if guests[i].group != "_"])

    def sortGuests(self, guests):
        numOfPrevSeats = 0
        result = []
        for table in self.tables:
            tableList = sorted(guests[numOfPrevSeats:numOfPrevSeats + table.numOfSeats], key=lambda x: x.group)
            numOfPrevSeats += table.numOfSeats
            for guest in tableList:
                result.append(guest)

        return result

    def create_population(self, guests, pop_size):
        population = []
        for i in range(pop_size):
            individual = guests.copy()
            random.shuffle(individual)
            population.append(individual)
        return population

    def crossover(self, parent1, parent2):
        child = [None] * len(parent1)
        chlidSet = set()
        start = random.randint(0, len(parent1) - 1)
        end = random.randint(start, len(parent1) - 1)
        for i in range(start, end + 1):
            child[i] = parent1[i]
            chlidSet.add(parent1[i])
        idx = 0
        for i in range(len(parent2)):
            if parent2[i] not in chlidSet:
                while child[idx] is not None:
                    idx += 1
                child[idx] = parent2[i]
                chlidSet.add(parent2[i])
        return child

    def mutate(self, individual, mutation_rate):
        for i in range(len(individual)):
            if random.random() < mutation_rate:
                j = random.randint(0, len(individual) - 1)
                individual[i], individual[j] = individual[j], individual[i]

    def select_parents(self, population, selection_probs):
        parent1_idx = np.random.choice(len(population), p=selection_probs)
        parent2_idx = np.random.choice(len(population), p=selection_probs)
        while parent2_idx == parent1_idx:
            parent2_idx = np.random.choice(len(population), p=selection_probs)
        return population[parent1_idx], population[parent2_idx]
    
    def solve(self, guests, pop_size=100, elite_size=10, mutation_rate=0.01, generations=100):
        population = self.create_population(guests, pop_size)
        best_fitness = 0
        best_individual = None

        for generation in range(generations):
            fitnesses = [self.fitness(individual) for individual in population]
            fitnessSortedIndexes = np.argsort(fitnesses)
            elites = [population[idx] for idx in fitnessSortedIndexes[-elite_size:]]

            currBest = fitnesses[fitnessSortedIndexes[-1]]
            currBestIndividual = population[fitnessSortedIndexes[-1]]

            if currBest > best_fitness:
                best_fitness = currBest
                best_individual = currBestIndividual

            if generations - 1 == generation:
                break

            next_gen = elites.copy()
            total_fitness = sum(fitnesses)
            selection_probs = [f / total_fitness for f in fitnesses]
            for _ in range(len(population) - elite_size):
                parent1, parent2 = self.select_parents(population, selection_probs)
                child = self.crossover(parent1, parent2)
                self.mutate(child, mutation_rate)
                next_gen.append(child)

            population = next_gen

        for i, guest in enumerate(best_individual):
            guest.table = self.seatToTable[i]

        return best_individual