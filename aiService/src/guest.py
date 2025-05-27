class Guest:
    def __init__(self, id, group, table=None):
        self.group = group
        self.id = id
        self.table = table
        self.satisfaction = None
    
    def __str__(self) -> str:
        return self.group + str(self.id)
    def __repr__(self):
        return self.__str__()
    def __lt__(self, other):
        return self.group < other.group
    def to_json(self):
        return self.to_dict()
    def to_dict(self):
        return {"group": self.group, "id": self.id, "table": self.table, "satisfaction": self.satisfaction}
    
    @classmethod
    def from_dict(cls, data):
        return cls(data['id'], data['group'], table=data.get('table', None))