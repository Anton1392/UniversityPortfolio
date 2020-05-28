#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
#include <iterator>
#include <stack>

#include "kattis.h"

using namespace std;

#define INFINITY 999999

typedef vector<string> Dictionary;

class Node
{
	public:
		string word;
		string kattis_word;
		vector<Node*> nbrs;
		bool visited = false;
		int distance;
};

int char_difference(string& lhs, string& rhs)
{
	int diff = 0;
	int len = lhs.length();
	for(int i = 0; i < len; i++)
	{
		if(lhs[i] != rhs[i])
		{
			diff++;
		}
	}
	return diff;
}

bool graph_generated = false;
vector <Node*> graph{};
vector <Node*> generate_graph(const Dictionary &dict)
{
	if (graph_generated)
	{
		for (Node* n : graph)
		{
			n->visited = false;
		}
		return graph;
	}

	for(string sd : dict)
	{
		Node* x = new Node();
		x->word = sd;
		string kattis_word = from_utf8(sd);
		for(Node* n : graph)
		{
			string kattis_word_comparable = from_utf8(n->word);
			if(char_difference(kattis_word, kattis_word_comparable) == 1)
			{
				x->nbrs.push_back(n);
				n->nbrs.push_back(x);
			}
		}
		graph.push_back(x);
	}
	graph_generated = true;
	return graph;
}

vector<string> find_shortest(const Dictionary &dict, const string &from, const string &to)
{

	vector<Node*> graph = generate_graph(dict);

	// Use dijkstra to find shortest path between two strings.
	Node* current{};
	// Key = neighbor, value = the one before it in the path
	map<Node*, Node*> prev_nodes{};
	// Initialize distances
	int size = graph.size();
	for(int i = 0; i < size; i++)
	{
		if(graph[i]->word == from)
		{
			graph[i]->distance = 0;
			current = graph[i];
		}
		else
		{
			graph[i]->distance = INFINITY;
		}
	}

	bool failed = false;
	while(true)
	{
		for(Node* nbr : current->nbrs)
		{
			if(!nbr->visited)
			{
				int new_dist = current->distance + 1;
				if(new_dist < nbr->distance)
				{
					nbr->distance = new_dist;
					prev_nodes[nbr] = current;
				}

			}
		}
		current->visited = true;

		if(current->word == to)
		{
			// Break algorithm, found target.
			break;
		}

		// Find the unvisited node with the smallest distance, set as current.
		Node* curr_smallest{};
		int curr_smallest_distance = INFINITY;
		for(Node* n : graph)
		{
			if(!n->visited && n->distance < curr_smallest_distance)
			{
				curr_smallest = n;
				curr_smallest_distance = n->distance;
			}
		}
		if(curr_smallest_distance == INFINITY)
		{
			failed = true;
			break;
		}
		current = curr_smallest;
	}

	// Construct result, path backwards from current
	vector<string> result;

	if(!failed)
	{
		while(current->word != from)
		{
			result.push_back(current->word);
			current = prev_nodes[current];
		}
		result.push_back(current->word);

		reverse(begin(result), end(result));
	}

	return result;
}

vector<string> find_longest(const Dictionary &dict, const string &word) {

	vector<Node*> graph = generate_graph(dict);

	Node* start{};
	int size = graph.size();
	for(int i = 0; i < size; i++)
	{
		if(graph[i]->word == word)
		{
			graph[i]->distance = 0;
			start = graph[i];
		}
		else
		{
			graph[i]->distance = INFINITY;
		}
	}

	vector<Node*> path{};
	int path_distance = 0;
	stack<Node*> visits{};

	start->visited = true;
	visits.push(start);
	while (!visits.empty())
	{
		Node* top = visits.top();
		vector<Node*> nbrs = top->nbrs;
		for (Node* n : nbrs)
		{
			if (not n->visited)
			{
				n->distance = top->distance + 1;
				n->visited = true;
				visits.push(n);
				break;
			}
		}
		if (visits.top() == top)
		//dead end
		{
			if (path_distance < top->distance)
			{
				//new path found
				path_distance = top->distance;
				path = {};
			}
			//on current path
			if (path.empty() or path.back()->distance == top->distance + 1)
			{
				path.push_back(top);
			}
			visits.pop();
		}
	}

	vector<string> result{};
	for (Node* n : path)
	{
		result.push_back(n->word);
	}

	return result;
}

vector<string> read_dictionary() {
	string line;
	vector<string> result;
	while (std::getline(std::cin, line)) {
		if (line == "#")
			break;

		result.push_back(line);
	}

	return result;
}

/**
 * Skriv ut en ordkedja på en rad.
 */
void print_chain(const vector<string> &chain) {
	if (chain.empty())
		return;

	vector<string>::const_iterator i = chain.begin();
	cout << *i;

	for (++i; i != chain.end(); ++i)
		cout << " -> " << *i;

	cout << endl;
}


/**
 * Läs in alla frågor. Anropar funktionerna "find_shortest" eller "find_longest" ovan när en fråga hittas.
 */
void read_questions(const Dictionary &dict) {
	string line;
	while (std::getline(std::cin, line)) {
		size_t space = line.find(' ');
		if (space != string::npos) {
			string first = line.substr(0, space);
			string second = line.substr(space + 1);
			vector<string> chain = find_shortest(dict, first, second);

			cout << first << " " << second << ": ";
			if (chain.empty()) {
				cout << "ingen lösning" << endl;
			} else {
				cout << chain.size() << " ord" << endl;
				print_chain(chain);
			}
		} else {
			vector<string> chain = find_longest(dict, line);

			cout << line << ": " << chain.size() << " ord" << endl;
			print_chain(chain);
		}
	}
}

int main() {
	vector<string> dict = read_dictionary();
	read_questions(dict);

	return 0;
}
