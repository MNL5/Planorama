import math
import random
import numpy as np

class Guest:
    def __init__(self, id, group):
        self.group = group
        self.id = id
    def __str__(self) -> str:
        return self.group + str(self.id)
    def __repr__(self):
        return self.__str__()
    def __lt__(self, other):
        return self.group < other.group

def sig(x):
 return 1/(1 + math.exp(-x))

def happinesFunc(guest, i, groupToAmountPerTable):
    return math.exp(groupToAmountPerTable[math.floor(i / 10)][guest.group] - 1) - 1

def happines(guests):
    groupToAmountPerTable = [{} for i in range(numOfTables)]

    for i in range(len(guests)):
        table = math.floor(i / 10)
        guest = guests[i]
        if guest.group not in groupToAmountPerTable[table]:
            groupToAmountPerTable[table][guest.group] = 0
        groupToAmountPerTable[table][guest.group] += 1

    return [happinesFunc(guests[i], i, groupToAmountPerTable) for i in range(len(guests)) if guests[i].group != "_"]

def fitness(guests):
    return sum(happines(guests))

def sortGuests(guests, isReverse = False):
    mat = []
    for tableNum in range(numOfTables):
        start = tableNum * 10
        table = sorted(guests[start:start + 10])
        if isReverse: table.reverse()
        mat.append(table)
    return [item for row in mat for item in row]

def create_population(guests, pop_size):
    population = []
    for i in range(pop_size):
        individual = guests.copy()
        random.shuffle(individual)
        population.append(sortGuests(individual))
    return population

def crossover(parent1, parent2):
    child = [None] * len(parent1)
    start = random.randint(0, len(parent1) - 1)
    end = random.randint(start, len(parent1) - 1)
    for i in range(start, end + 1):
        child[i] = parent1[i]
    idx = 0
    for i in range(len(parent2)):
        if parent2[i] not in child:
            while child[idx] is not None:
                idx += 1
            child[idx] = parent2[i]
    return child


def mutate(individual, mutation_rate):
    for i in range(len(individual)):
        if random.random() < mutation_rate:
            j = random.randint(0, len(individual) - 1)
            individual[i], individual[j] = individual[j], individual[i]


def select_parents(population, fitnesses):
    # Perform roulette wheel selection
    total_fitness = sum(fitnesses)
    selection_probs = [f / total_fitness for f in fitnesses]
    parent1_idx = np.random.choice(len(population), p=selection_probs)
    parent2_idx = np.random.choice(len(population), p=selection_probs)
    while parent2_idx == parent1_idx:
        parent2_idx = np.random.choice(len(population), p=selection_probs)
    return population[parent1_idx], population[parent2_idx]


def solve(guests, pop_size=100, elite_size=10, mutation_rate=0.01, generations=100):
    population = create_population(guests, pop_size)
    best_distance = 0
    best_individual = None

    for generation in range(generations):
        fitnesses = [fitness(individual) for individual in population]
        fitnessSortedIndexes = np.argsort(fitnesses)
        elites = [population[idx] for idx in fitnessSortedIndexes[-elite_size:]]

        currBest = fitnesses[fitnessSortedIndexes[-1]]
        currBestIndividual = population[fitnessSortedIndexes[-1]]

        if currBest > best_distance:
            best_distance = currBest
            best_individual = currBestIndividual

        next_gen = elites.copy()
        while len(next_gen) < pop_size:
            parent1, parent2 = select_parents(population, fitnesses)
            child = crossover(parent1, parent2)
            mutate(child, mutation_rate)
            next_gen.append(child)

        population = next_gen

    return best_individual


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

print(groupToAmount)
print(numOfSeats)
result = solve(guests, generations=500, pop_size=200, elite_size=20)
print(fitness(result))
for i in range(numOfTables):
    start = i * 10
    print(sorted(result[start:start + 10]))