from enum import Enum

class Relation:
    def __init__(self, firstGuestId, secondGuestId, type):
        self.firstGuestId = firstGuestId
        self.secondGuestId = secondGuestId
        self.type = type
    
    @classmethod
    def from_dict(cls, data):
        return cls(data['firstGuestId'], data['secondGuestId'], data['type'])
    
class RelationType(Enum):
    MUST = 'MUST'
    LIKE = 'LIKE'
    HATE = 'HATE'
    MUST_NOT = 'MUST_NOT'