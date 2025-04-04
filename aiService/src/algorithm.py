import math
import random
from functools import reduce
import numpy as np

class Algorithm:
    def __init__(self, guests, tables, relations):
        self.guests = guests
        self.tables = sorted(tables, key=lambda x: x.numOfSeats)
        
        self.seatToTable = []
        for table in self.tables:
            for _ in range(table.numOfSeats):
                self.seatToTable.append(table.id)
        self.numOfTables = len(self.tables)

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

        self.groupToAmount = {}
        for guest in guests:
            if guest.group not in self.groupToAmount:
                self.groupToAmount[guest.group] = 0
            self.groupToAmount[guest.group] += 1
        self.maxGroupSize = max(self.groupToAmount.values())

    def happinesFunc(self, guest, i, groupToAmountPerTable, guestToTable):
        table = self.seatToTable[i]
        seatWithMe = groupToAmountPerTable[table][guest.group] - 1
        score = seatWithMe

        def getNumOf(type):
            return reduce(lambda acc, guestId: acc + (1 if guestToTable[guestId] == table else 0), self.relations[guest.id][type], 0)

        if guest.id in self.relations:
            if 'must' in self.relations[guest.id]:
                withMust = getNumOf('must')
                withoutMust = len(self.relations[guest.id]['must']) - withMust
                score += withMust * 1.5
                score -= withoutMust * 5
            if 'like' in self.relations[guest.id]:
                score += getNumOf('like')
            if 'hate' in self.relations[guest.id]:
                score -= getNumOf('hate') * 1.2
            if 'must not' in self.relations[guest.id]:
                withMustNot = getNumOf('must not')
                score -= withMustNot * 5

        notSeatingWithPrecent = ((self.groupToAmount[guest.group] - 1) - seatWithMe) / (self.groupToAmount[guest.group] - 1)
        groupSizeFactor = self.maxGroupSize / self.groupToAmount[guest.group]
        score -= notSeatingWithPrecent * groupSizeFactor * 5

        if '_' in groupToAmountPerTable[table] and groupToAmountPerTable[table]['_'] > groupToAmountPerTable[table][guest.group]:
            score -= groupToAmountPerTable[table]['_'] * 0.3

        if groupToAmountPerTable[table][guest.group] == 1:
            score -= 5

        return score
    
    def calcHelpers(self, guests):
        groupToAmountPerTable = {}
        guestToTable = {}

        for i, guest in enumerate(guests):
            table = self.seatToTable[i]
            guestToTable[guest.id] = table

            if table not in groupToAmountPerTable:
                groupToAmountPerTable[table] = {}
            
            if guest.group not in groupToAmountPerTable[table]:
                groupToAmountPerTable[table][guest.group] = 0
            groupToAmountPerTable[table][guest.group] += 1

        return groupToAmountPerTable, guestToTable

    def fitness(self, guests):
        groupToAmountPerTable, guestToTable = self.calcHelpers(guests)
        return sum([self.happinesFunc(guest, i, groupToAmountPerTable, guestToTable) for i, guest in enumerate(guests) if guests[i].group != "_"])

    def sortGuests(self, guests, isReverse = False):
        numOfPrevSeats = 0
        result = []
        for table in self.tables:
            tableList = sorted(guests[numOfPrevSeats:numOfPrevSeats + table.numOfSeats], key=lambda x: x.group)
            if isReverse: tableList.reverse()
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
        child1 = [None] * len(parent1)
        child2 = [None] * len(parent1)
        chlid1Set = set()
        chlid2Set = set()
        start = random.randint(0, len(parent1) - 1)
        end = random.randint(start, len(parent1) - 1)
        for i in range(len(parent1)):
            if start <= i <= end:
                child1[i] = parent1[i]
                chlid1Set.add(parent1[i])
            else:
                child2[i] = parent2[i]
                chlid2Set.add(parent2[i])
        idx1 = 0
        idx2 = 0
        for i in range(len(parent2)):
            if parent2[i] not in chlid1Set:
                while child1[idx1] is not None:
                    idx1 += 1
                child1[idx1] = parent2[i]
                chlid1Set.add(parent2[i])
            if parent2[i] not in chlid2Set:
                while child2[idx2] is not None:
                    idx2 += 1
                child2[idx2] = parent2[i]
                chlid2Set.add(parent2[i])
        return child1, child2

    def mutate(self, individual, mutation_rate):
        for i in range(len(individual)):
            if random.random() < mutation_rate:
                j = random.randint(0, len(individual) - 1)
                individual[i], individual[j] = individual[j], individual[i]
        return individual
    
    def selection(self, population, fitnesses, elite_size, tournament_size=3):
        selected = []
        for _ in range(len(population) - elite_size):
            tournament = random.sample(list(zip(population, fitnesses)), tournament_size)
            winner = max(tournament, key=lambda x: x[1])[0]
            selected.append(winner)
        return selected
    
    def solve(self, guests, pop_size=100, elite_size=10, mutation_rate=0.01, generations=100):
        population = self.create_population(guests, pop_size)
        best_fitness = 0
        best_individual = None

        for generation in range(generations):
            fitnesses = [self.fitness(individual) for individual in population]
            minFitness = min(fitnesses)
            if minFitness < 0:
                fitnesses = [f - minFitness for f in fitnesses]

            fitnessSortedIndexes = np.argsort(fitnesses)
            elites = [population[idx] for idx in fitnessSortedIndexes[-elite_size:]]

            currBest = fitnesses[fitnessSortedIndexes[-1]]
            currBestIndividual = population[fitnessSortedIndexes[-1]]

            if currBest > best_fitness:
                best_fitness = currBest
                best_individual = currBestIndividual

            if generations - 1 == generation:
                break

            population = self.selection(population, fitnesses, elite_size, tournament_size=10)

            next_gen = elites.copy()
            for i in range(0, len(population), 2):
                parent1 = population[i]
                parent2 = population[i + 1]

                child1, child2 = self.crossover(parent1, parent2)

                next_gen.append(self.mutate(child1, mutation_rate))
                next_gen.append(self.mutate(child2, mutation_rate))

            population = next_gen

        for i, guest in enumerate(best_individual):
            guest.table = self.seatToTable[i]

        return best_individual