#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <iterator>
#include <stack>
#include <chrono>
#include <queue>
#include <utility>
//#include <stdexcept>
#include "kattis.h"

using std::vector;
using std::string;
using std::cout;
using std::endl;

using namespace std;

#define INFINITY 999999
unsigned long shortest_time = 0;
unsigned long longest_time = 0;

// Typ som används för ordlistan. Den definieras med en typedef här så att du enkelt kan ändra
// representationen av en ordlista utefter vad din implementation behöver. Funktionen
// "read_questions" skickar ordlistan till "find_shortest" och "find_longest" med hjälp av denna
// typen.

//typedef vector<string> Dictionary;
class Dictionary
{
	public:
		Dictionary(){
			dict = {};
			nbrs = {};
		}

		vector<string> find_neighbours(string word)
		{
			try
			{
				vector<string> r = nbrs.at(word);
				return r;
			}
			catch(const out_of_range& e)
			{
				vector<string> r = find_neighbours_private(word);
				nbrs[word] = r;
				return r;
			}
		}

		void calculate_neighbours()
		{
			for (auto const & el : dict)
			{
				nbrs[el.first] = find_neighbours_private(el.first);
			}
		}

		void add_word(string word)
		{
			dict[word] = true;
		}

		bool valid_word(string word)
		{
			try
			{
				if (dict.at(word) == true)
				{
					return true;
				}
			}
			catch(const out_of_range& e)
			{
				return false;
			}
			return false;
		}

	private:
		unordered_map<string, bool> dict;
		unordered_map<string, vector<string>> nbrs;

		vector<string> find_neighbours_private(string word)
		{
			vector<string> nbrs{};
			int length (word.length());
			for (int i=0; i < length; i++)
			{
				string cand = word;
				for (char c : alphabet)
				{
					cand[i] = c;
					if (cand != word and valid_word(cand) == true)
					{
						nbrs.push_back(cand);
					}
				}
			}
			return nbrs;
		}
};


struct node {
	bool visited = false;
	int distance = INFINITY;
};

/**
 * Hitta den kortaste ordkedjan från 'first' till 'second' givet de ord som finns i
 * 'dhttps://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/ict'. Returvärdet är den ordkedja som hittats, första elementet ska vara 'from' och sista
 * 'to'. Om ingen ordkedja hittas kan en tom vector returneras.
 */


vector<string> find_shortest (Dictionary &dict, const string &from, const string &to)
{
	// Use dijkstra to find shortest path between two strings.
	string current{from};
	// Key = neighbor, value = the one before it in the path
	unordered_map<string, string> prev_nodes{};
	unordered_map<string, node> nodes{}; // visited, distance

	bool failed = false;
	nodes[current].distance = 0;

	// Priority queue, distance:word
	priority_queue<pair<int, string>, vector<pair<int, string>>, std::greater<pair<int, string>> > smallest_q;
	smallest_q.push(pair<int, string>{5, "hej"});
	while(true)
	{

		vector<string> nbrs = dict.find_neighbours(current);
		for(string nbr : nbrs)
		{
			if(!nodes[nbr].visited)
			{
				int new_dist = nodes[current].distance + 1;
				if(new_dist < nodes[nbr].distance)
				{
					nodes[nbr].distance = new_dist;
					prev_nodes[nbr] = current;

					// Insert node into our priority queue.
					// We only need to insert when the distance has been updated
					pair<int, string> p{nodes[nbr].distance, nbr};
					smallest_q.push(p);
				}
			}
		}
		nodes[current].visited = true;

		if(current == to)
		{
			// Break algorithm, found target.
			break;
		}

		// No nodes left to process, algorithm failed.
		if(smallest_q.empty())
		{
			failed = true;
			break;
		}

		// Find the unvisited node with the smallest distance, set as current.
		while(!smallest_q.empty())
		{
			pair<int, string> p = smallest_q.top(); smallest_q.pop();
			if(p.first == INFINITY)
			{
				failed = true;
				break;
			}
			if(!nodes[p.second].visited)
			{
				current = p.second;
				break;
			}
		}
		if(failed)
		{
			break;
		}
	}

	// Construct result, path backwards from current
	vector<string> result;

	if(!failed)
	{
		while(current != from)
		{
			result.push_back(current);
			current = prev_nodes[current];
		}
		result.push_back(current);

		reverse(begin(result), end(result));
	}

	return result;
}


// Hitta den längsta kortaste ordkedjan som slutar i 'word' i ordlistan 'dict'. Returvärdet är den
// ordkedja som hittats. Det sista elementet ska vara 'word'.

vector<string> find_longest(Dictionary &dict, const string &word) {

	string start{word};

	unordered_map<string, node> nodes{}; // visited, distance
	nodes[start].distance = 0;

	string longest_distance_node = start;
	// Finds how far everything is from word through a Breadth-first search.
	queue<string> q{};
	queue<int> q_distances{}; // Keeps track of which neighbors have which depth.

	q.push(start);
	q_distances.push(0);
	while(!q.empty())
	{

		string e = q.front(); q.pop();
		int d = q_distances.front(); q_distances.pop();

		nodes[e].distance = d;
		if(nodes[e].distance > nodes[longest_distance_node].distance)
		{
			longest_distance_node = e;
		}
		// For every neighbor
		vector<string> nbrs = dict.find_neighbours(e);
		for(string nbr : nbrs)
		{
			if(nodes[nbr].visited == false)
			{
				//cout << "Pushed a neighbor" << endl;
				nodes[nbr].visited = true;
				// Push the neighbor
				q.push(nbr);
				// Push your distance+1
				q_distances.push(nodes[e].distance + 1);
			}
		}

	}

	// Return the chain between the furthest node and the word.

	vector<string> r = find_shortest(dict, longest_distance_node, word);

	return r;
}



// Läs in ordlistan och returnera den som en vector av orden. Funktionen läser även bort raden med
// #-tecknet så att resterande kod inte behöver hantera det.

Dictionary read_dictionary() {
	string line;
	Dictionary dict{};
	while (std::getline(std::cin, line)) {
		if (line == "#")
			break;
		dict.add_word(line);
	}
	//dict.calculate_neighbours();
	return dict;
}


//Skriv ut en ordkedja på en rad.

void print_chain(const vector<string> &chain) {
	if (chain.empty())
		return;

	vector<string>::const_iterator i = chain.begin();
	cout << *i;

	for (++i; i != chain.end(); ++i)
		cout << " -> " << *i;

	cout << endl;
}


//Läs in alla frågor. Anropar funktionerna "find_shortest" eller "find_longest" ovan när en fråga hittas.


void read_questions(Dictionary &dict) {
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
	auto begin = chrono::high_resolution_clock::now();

	Dictionary dict = read_dictionary();
	read_questions(dict);

	auto end = chrono::high_resolution_clock::now();
	cout << "Processing took: "
		<< std::chrono::duration_cast<chrono::seconds>(end - begin).count()
		<< " seconds." << endl;

	return 0;
}
