# TDP015 Programming Assignment 5
# Graphs
# Skeleton Code

# In one of my current research projects, I am developing algorithms
# for the parsing of natural language to meaning representations in
# the form of directed graphs:
#
# http://www.ida.liu.se/~marku61/ceniit.shtml
#
# A desirable property of these graphs is that they should be acyclic,
# that is, should not contain any (directed) cycles. Your task in this
# assignment is to implement a Python function that tests this
# property, and to apply your function to compute the number of cyclic
# graphs in one of the datasets that I am using in my research.
#
# Your final script should be callable from the command line as follows:
#
# python3 p5.py ccg.train.json
#
# This should print out the IDs of the cyclic graphs in the specified
# file, in the same order in which these graph appear in the file:
#
# $ python3 p5.py foo.json
# 22172056
# 22153010
# 22106047
#
# The graphs are stored in a JSON file containing a single dictionary
# mapping graph ids (8-digit integers starting with 22) to graphs, where
# each graph is represented as a dictionary mapping vertices (or rather
# their ids) to lists of neighbouring vertices.

import json
import sys

def cyclic(graph):
    """Test whether the directed graph `graph` has a (directed) cycle.

    The input graph needs to be represented as a dictionary mapping vertex
    ids to iterables of ids of neighboring vertices. Example:

    {"1": ["2"], "2": ["3"], "3": ["1"]}

    Args:
        graph: A directed graph.

    Returns:
        `True` iff the directed graph `graph` has a (directed) cycle.
    """
    
    # Recursively go down the tree, building a list of predecessors to nodes
    # If any back edges are found (neighbors leading back to predecessors), its a cyclic graph.
    # We need to use all nodes as root because the graphs are directed, routes may be unchecked otherwise.
    for node, neighbors in graph.items():
        if find_back_edge(graph, neighbors, [node]):
            return True

    return False

def find_back_edge(graph, init_neighbors, predecessors = []):
    for neighbor in init_neighbors:
        # This checks for back edges.
        if neighbor in predecessors:
            return True

        # Progress down the tree, if there are more children.
        if graph[neighbor] != []:
            return find_back_edge(graph, graph[neighbor], predecessors + [neighbor])

    # No back edges found.
    return False
    

if __name__ == "__main__":
    # TODO: Replace the following line with your own code.
    data = {}
    try:
        with open(sys.argv[1]) as f:
            data = json.load(f)
    except:
        print("Invalid arguments. Usage: 'python p5.py ccg.train.json' (or your preferred dataset)")

    # Checks each graph.
    for key, value in data.items():
        if cyclic(value):
            print(key)
