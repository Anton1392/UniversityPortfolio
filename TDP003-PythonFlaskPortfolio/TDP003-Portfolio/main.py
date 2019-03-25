from flask import Flask, render_template, request
import data


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/list/", methods=["POST", "GET"])
def search():

    if request.method == "POST":
        form = request.form
        loaded_data = data.load("data.json")

        # Search string
        search_string = request.form['text_search']
        if len(search_string) == 0:
            search_string = None

        # Search specific fields
        fields = []
        if form.get('chck_proj_name'):
            fields.append('project_name')
        if form.get('chck_course_name'):
            fields.append('course_name')
        if form.get('chck_course_id'):
            fields.append('course_id')
        if len(fields) == 0:
            fields = None

        # Sort order. Defaults to ascending.
        order = "asc"
        if form.get('sort_order') == "Descending":
            order = "desc"

        # Sort by date/name
        sort_by = "project_name"
        if form.get('sort_by') == "End date":
            sort_by = "end_date"

        # Gets all techniques available. This creates checkboxes later.
        techs = data.get_techniques(loaded_data)

        # Finds all toggled checkboxes.
        techs_to_search = []
        for tech in techs:
            checkbox = form.get('check_tech_'+tech)
            if checkbox:
                techs_to_search.append(tech)

        if len(techs_to_search) == 0:
            techs_to_search = None

        search_results = data.search(loaded_data, search=search_string, search_fields=fields, sort_order=order, sort_by=sort_by, techniques=techs_to_search)
        return render_template("search.html", results=search_results, techniques=techs)

    else:
        # Loads data
        loaded_data = data.load("data.json")

        # Gets all techniques available. This creates checkboxes later.
        techs = data.get_techniques(loaded_data)

        # Displays every project in the database by default.
        results = data.search(loaded_data)

        return render_template("search.html", results=results, techniques=techs)


@app.route("/techniques")
def techniques():

    # Loads data, fetches all techniques used.
    loaded_data = data.load("data.json")
    techs = data.get_techniques(loaded_data)

    # Dict that store techniques and associated projects.
    # key = technique, value = list(projects)
    technique_project_dict = {}
    for tech in techs:
        tech_projects = data.search(loaded_data, techniques=[tech])
        technique_project_dict[tech] = tech_projects

    return render_template("techniques.html", technique_projects=technique_project_dict)


@app.route("/project/<id>")
def project(id):

    loaded_data = data.load("data.json")
    selected_project = None
    try:
        selected_project = data.get_project(loaded_data, int(id))
    except:
        pass

    if selected_project is None:
        # Error 404
        return render_template( "404.html")
    else:
        return render_template("project.html", proj=selected_project)


@app.errorhandler(404)
def page_not_found(e):

    return render_template("404.html")


if __name__ == "__main__":
    app.run(debug=True)
