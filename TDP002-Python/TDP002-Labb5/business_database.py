db = [
{'name': 'Jakob', 'position': 'assistant'},
{'name': 'Åke', 'position': 'assistant'},
{'name': 'Ola', 'position': 'examiner'},
{'name': 'Henrik', 'position': 'assistant'}
]


# Searches the specified database, in the specified field, for the specified value.
def dbsearch(data, field, value):
    # Adds all persons in the db if the field matches the value.
    search_results = [person for person in data if person[field] == value]
    return search_results

print(dbsearch(db, 'position', 'examiner'))
print(dbsearch(db, 'name', 'Jakob'))
