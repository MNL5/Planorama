class Relation:
    def __init__(self, firstGuestId, secondGuestId, type):
        self.firstGuestId = firstGuestId
        self.secondGuestId = secondGuestId
        self.type = type
    
    @classmethod
    def from_dict(cls, data):
        return cls(data['firstGuestId'], data['secondGuestId'], data['type'])