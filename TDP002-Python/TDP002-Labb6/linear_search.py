def linear_search(db, val, func = lambda e: e["title"]):
    search_results = []
    for e in db:
        if func(e) == val:
            search_results.append(e)
    return search_results

imdb = [{'title': 'Raise your voice', 'actress': 'Hilary Duff', 'score': 10},
        {'title': 'Movie 2', 'actress': 'XX XX', 'score': 5},
        {'title': 'Movie 3', 'actress': 'XY XY', 'score': 1}]
print(linear_search(imdb, "Raise your voice"))
