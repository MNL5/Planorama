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
    def to_json(self):
        return {"group": self.group, "id": self.id}
    def to_dict(self):
        return {"group": self.group, "id": self.id}