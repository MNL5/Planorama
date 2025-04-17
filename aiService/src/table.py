class Table:
    def __init__(self, id, numOfSeats):
        self.id = id
        self.numOfSeats = numOfSeats
    
    @classmethod
    def from_dict(cls, data):
        return cls(data['id'], data['numOfSeats'])