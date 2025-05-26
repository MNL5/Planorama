from .relation import RelationType
import random
from functools import reduce
import numpy as np

class Algorithm:
    def __init__(self, guests, tables, relations):
        self.guests = guests
        self.tables = tables
        
        self.tableToNumOfSeats = {}
        self.seatToTable = []
        for table in self.tables:
            self.tableToNumOfSeats[table.id] = table.numOfSeats
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

        self.isGroupMustSplit = {}
        for group, amount in self.groupToAmount.items():
            self.isGroupMustSplit[group] = all(amount > table.numOfSeats for table in self.tables)

    def maxHappinesFunc(self, guest):
        score = self.groupToAmount[guest.group] - 1

        if guest.id in self.relations:
            if RelationType.MUST in self.relations[guest.id]:
                score += len(self.relations[guest.id][RelationType.MUST]) * 1.5
            if RelationType.LIKE in self.relations[guest.id]:
                score += len(self.relations[guest.id][RelationType.LIKE])

        return score

    def happinesFunc(self, guest, table, groupToAmountPerTable, guestToTable):
        score = groupToAmountPerTable[table][guest.group] - 1

        def getNumOf(type):
            return reduce(lambda acc, guestId: acc + (1 if guestToTable[guestId] == table else 0), self.relations[guest.id][type], 0)

        if guest.id in self.relations:
            if RelationType.MUST in self.relations[guest.id]:
                withMust = getNumOf(RelationType.MUST)
                withoutMust = len(self.relations[guest.id][RelationType.MUST]) - withMust
                score += withMust * 1.5
                score -= withoutMust * 5
            if RelationType.LIKE in self.relations[guest.id]:
                score += getNumOf(RelationType.LIKE)
            if RelationType.HATE in self.relations[guest.id]:
                score -= getNumOf(RelationType.HATE) * 1.2
            if RelationType.MUST_NOT in self.relations[guest.id]:
                withMustNot = getNumOf(RelationType.MUST_NOT)
                score -= withMustNot * 5

        return score
    
    def calcHelpers(self, guests, seatToTable):
        groupToAmountPerTable = {}
        guestToTable = {}
        amountPerTable = {}

        for i, guest in enumerate(guests):
            if guest.group == "_":
                continue

            table = seatToTable(i, guest)
            guestToTable[guest.id] = table

            if table not in groupToAmountPerTable:
                groupToAmountPerTable[table] = {}
            
            if guest.group not in groupToAmountPerTable[table]:
                groupToAmountPerTable[table][guest.group] = 0
            groupToAmountPerTable[table][guest.group] += 1

            if table not in amountPerTable:
                amountPerTable[table] = 0
            amountPerTable[table] += 1
        
        return groupToAmountPerTable, guestToTable, amountPerTable

    def fitness(self, guests):
        groupToAmountPerTable, guestToTable, amountPerTable = self.calcHelpers(guests, lambda i, guest: self.seatToTable[i])
        score = sum([self.happinesFunc(guest, self.seatToTable[i], groupToAmountPerTable, guestToTable) for i, guest in enumerate(guests) if guest.group != "_"])

        std_dev = np.std([amount / self.tableToNumOfSeats[table] for table, amount in amountPerTable.items()])
        score -= std_dev

        return  score

    def create_population(self, pop_size):
        population = []
        for i in range(pop_size):
            individual = self.guests.copy()
            random.shuffle(individual)
            population.append(individual)
        return population
    
    def splitToTables(self, guests):
        tables = {}
        for guest in guests:
            table = guest.table
            if table is None:
                continue
            if table not in tables:
                tables[table] = set()
            tables[table].add(guest)
        return tables
    
    def getTablesSwitch(self, oldGuestsPerTable, newGuestsPerTable):
        tablesSwitch = {}
        for table in oldGuestsPerTable:
            for newTable in newGuestsPerTable:
                if table != newTable and self.tableToNumOfSeats[table] == self.tableToNumOfSeats[newTable] and len(oldGuestsPerTable[table] & newGuestsPerTable[newTable]) >= self.tableToNumOfSeats[table] / 2:
                    tablesSwitch[tablesSwitch[table] if table in tablesSwitch else table] = newTable
                    tablesSwitch[newTable] = table
                    break
        return tablesSwitch
    
    def setTables(self, guests):
        oldGuestsPerTable = self.splitToTables(guests)

        for i, guest in enumerate(guests):
            guest.table = self.seatToTable[i]

        newGuestsPerTable = self.splitToTables(guests)

        tablesSwitch = self.getTablesSwitch(oldGuestsPerTable, newGuestsPerTable)
        for table in tablesSwitch:
            for guest in newGuestsPerTable[table]:
                guest.table = tablesSwitch[table]
    
        return guests

    def crossover(self, parent1, parent2, crossover_rate=1):
        if random.random() >= crossover_rate:
            return parent1, parent2

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
    
    def selection(self, population, fitnesses, tournament_size=3):
        contestants = random.sample(list(zip(population, fitnesses)), tournament_size)
        return max(contestants, key=lambda x: x[1])[0]
    
    def calcGroupTables(self, guests):
        groupTables = {}
        isGroupSplitHelper = {}

        for i, guest in enumerate(guests):
            if guest.group == "_":
                continue

            table = self.seatToTable[i]

            if guest.group not in isGroupSplitHelper:
                isGroupSplitHelper[guest.group] = set()
            isGroupSplitHelper[guest.group].add(table)

        for group, tables in isGroupSplitHelper.items():
            groupTables[group] = len(tables)

        return groupTables
    
    def setSatisfactory(self, guests):
        groupToAmountPerTable, guestToTable, amountPerTable = self.calcHelpers(guests, lambda i, guest: guest.table)
        for guest in guests:
            if guest.group == "_" or guest.table == None: continue
            guest.satisfaction = self.happinesFunc(guest, guest.table, groupToAmountPerTable, guestToTable) / self.maxHappinesFunc(guest)
        return guests
    
    def solve(self, pop_size=100, elite_rate=0.1, mutation_rate=0.01, generations=100):
        population = self.create_population(pop_size)
        elite_size = round(pop_size * elite_rate)
        best_fitness = 0
        best_individual = None

        for generation in range(generations):
            fitnesses = [self.fitness(individual) for individual in population]
            fitnessSortedIndexes = np.argsort(fitnesses)

            currBest = fitnesses[fitnessSortedIndexes[-1]]
            currBestIndividual = population[fitnessSortedIndexes[-1]]

            if currBest > best_fitness:
                best_fitness = currBest
                best_individual = currBestIndividual
                
                groupTables = self.calcGroupTables(best_individual)
                if all(tables == 1 or self.isGroupMustSplit[group] for group, tables in groupTables.items()):
                    break

            if generations - 1 == generation:
                break

            elites = [population[idx] for idx in fitnessSortedIndexes[-elite_size:]]
            next_gen = elites.copy()
            while len(next_gen) < pop_size:
                parent1 = self.selection(population, fitnesses)
                parent2 = self.selection(population, fitnesses)
                
                child1, child2 = self.crossover(parent1, parent2)

                next_gen.append(self.mutate(child1, mutation_rate))

            population = next_gen

        return self.setSatisfactory(self.setTables(best_individual)), best_fitness