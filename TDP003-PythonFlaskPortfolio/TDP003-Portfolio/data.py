import json
from pprint import pprint  # Pretty print. Displays things ... prettily.



def load(filename):
    """
    Loads JSON formatted project data from a file and returns a list of all projects, sorted after number.
    :param filename: Name of the JSON-file to load data from.
    """
    project_list = []

    # On errors, return None.
    try:
        # Loads the data from the specified file into a variable.
        json_data = ""
        with open(filename) as data_file:
            json_data = json.load(data_file)

        # Fills the list with all projects in the json file. The projects are dictionaries of values.
        for project in json_data:
            project_list.append(project)

        # Sorts the list of dicts by each dicts project_id-value.
        project_list = sorted(project_list, key=lambda x: x["project_id"])
    except:
        project_list = None

    return project_list


# Retrieves the number of projects in a project list.
def get_project_count(db):
    """
    Retrieves the number of projects in a project list.
    :param db: The database/loaded JSON-file to work with.
    """
    return len(db)


# Fetches the project with the specified id from the specified list.
def get_project(db, id):
    """
    Fetches the project with the specified id from the specified database.
    :param db: The database/loaded JSON-file to work with.
    :param id: The id to search for.
    """
    # Variable that stores the found project.
    found_project = {}

    # Loops through all projects in the list and compares the ID to find the specified project.
    for i in db:
        if i["project_id"] == id:
            found_project = i
            break

    # If no project was found, return None.
    if found_project == {}:
        return None
    else:
        return found_project


# Fetches and sorts projects matching criteria from the specified list.
def search(db, sort_by=u'start_date', sort_order=u'desc', techniques=None, search=None, search_fields=None):
    """
    Fetches and sorts projects matching critera from the specified list.
    :param db: The database/loaded JSON-file to work with.
    :param sort_by: The datafield to sort by
    :param sort_order: The sorting order. "asc"/"desc".
    :param techniques: The list of techniques the search results need to match.
    :param search: The string to search for. None returns all projects, empty string returns no projects.
    :param search_fields: The fields to search the "search"-variable in. None searches all fields.
    """

    # Lists of all projects to filter through, and the found search results.
    projects_to_search = []
    search_results = []

    # Fills the projects to search list, after used techniques.
    if techniques is None or len(techniques) is 0:
        # If no techniques are specified, search all projects.
        projects_to_search = db
    else:
        # Loops through all projects in the data-list.
        for project in db:
            adding = True

            # Loops through all required specified techniques.
            for tech in techniques:
                # If the technique does not exist in the current project, don't add it.
                if tech not in project["techniques_used"]:
                    adding = False

            # Add it to the search list if adding is True.
            if adding:
                projects_to_search.append(project)

    # If no search is specified, do not filter the projects.
    if search is None:
        search_results = projects_to_search

    # If the length of the search is 0, do nothing.
    elif len(search) is 0:
        pass

    # Searches after the "search"-parameter in the specified fields.
    else:
        # If no fields are specified, search all fields.
        if search_fields is None:
            for project in projects_to_search:
                adding = False

                # Searches all fields in the current project.
                for field in project.values():
                    # Matching projects are returned.Adds the project if a matching field is found. -1 means that none has been found.
                    if str(field).upper().find(search.upper()) is not -1:
                        adding = True

                # If the project matches, add it to the search results.
                if adding is True:
                    search_results.append(project)

        # If the search_fields parameter has no content, return no results.
        elif len(search_fields) is 0:
            pass

        # Else take into account the search variable in only the specified fields.
        else:
            # Loops through all projects that we want to search in.
            for project in projects_to_search:
                adding = False
                # Loops through all fields in the project.
                for field in search_fields:
                    if str(project[field]).upper().find(search.upper()) is not -1:
                        adding = True
                if adding is True:
                    search_results.append(project)


    # The sorting flag. Default order is ascending.
    rev = False
    if sort_order is 'desc':
        rev = True

    # Sorts the results based on the sort_by parameter and ascending/descending.
    search_results = sorted(search_results, key=lambda x: x[sort_by], reverse=rev)
    return search_results


# Fetches a list of all the techniques from the specified project list in alphabetical order.
def get_techniques(db):
    """
    Fetches a list of all the techniques from the specified project list in alphabetical order.
    :param db: The database/loaded JSON-file to work with.
    """

    techniques_found = []

    # Loops through all projects in the list
    for proj in db:
        # Loops through all techniques in the projects and appends them if they don't exist already.
        for tech in proj["techniques_used"]:
            if tech not in techniques_found:
                techniques_found.append(tech)

    # Sorts the list in alphabetical order, ignoring capital letters.
    techniques_found = sorted(techniques_found, key=str.lower)

    return techniques_found


# Collects and returns statistics for all techniques in the specified project list.
def get_technique_stats(db):
    """
    Collects and returns statistics for all techniques in the specified project list.
    :param db: The database/loaded JSON-file to work with.
    """
    stats = {}
    techniques = get_techniques(db)

    for proj in db:
        for tech in proj["techniques_used"]:
            if not tech in stats.keys():
                stats[tech] = []
            stats[tech].append({'id': proj['project_id'], 'name': proj['project_name']})

    return stats

# DEBUGGING SCENARIOS

#data = load("data.json")
#print(search(data, techniques=["Python"]))  # Should return project 1, 4.
#print(search(data, techniques=["Python", "Bar2"]))  # Should return project 4.
#print(search(data, techniques=["Python", "Bar2", "CSS"]))  # Should return no project.

#print(search(data, search="ipsum"))  # Should return projects 4, 2, 3.
#print(search(data, search="ipsum", techniques=["Foo", "Bar2"]))  # Should return project 4 only.

#print(search(data, search="Denna", search_fields=["description"]))  # Should return project 1 only.
#print(search(data))  # Should return projects 1, 3, 2, 4.
#print(search(data, sort_order="desc"))  # Should return projects 4, 2, 3, 1
#print(search(data, sort_by="project_id"))  # Should return projects 1, 2, 3, 4.
#print(search(data, sort_by="project_id", sort_order="desc"))  # Should return projects 4, 3, 2, 1.

#data = get_technique_stats(load("data.json"))
#pprint(data)
