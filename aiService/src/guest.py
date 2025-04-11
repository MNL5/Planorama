class Guest:
    def __init__(self, name, group, table=None):
        self.group = group
        self.name = name
        self.table = table
    
    def __str__(self) -> str:
        return self.group + str(self.name)
    def __repr__(self):
        return self.__str__()
    def __lt__(self, other):
        return self.group < other.group
    def to_json(self):
        return {"group": self.group, "name": self.name, "table": self.table}
    def to_dict(self):
        return {"group": self.group, "name": self.name, "table": self.table}
    
    @classmethod
    def from_dict(cls, data):
        return cls(data['name'], data['group'], table=data.get('table', None))