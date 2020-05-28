#include <iostream>
#include <vector>
#include <map>
#include <algorithm>

using namespace std;

class Node
{
public:
	Node();
	Node(int m, vector<int> c);
	int m;
	vector<int> c;
	bool visited;
	int parent;
};

Node::Node()
{

}

Node::Node(int _m, vector<int> _c)
	:m{_m}, c{_c}, visited{false}
{}

int main()
{
	vector<map<int, Node>> nodeSets;

	// Each case starts with n followed by n lines
	int n;
	while (true)
	{
		map<int, Node> currentSet;
		cin >> n;
		if (n == 0)
		{
			break;
		}
		for (int i = 0; i < n; i++)
		{
			int v;
			int m;
			int d;
			cin >> v;
			cin >> m;
			cin >> d;
			vector<int> children;
			for (int j = 0; j < d; j++)
			{
				int temp;
				cin >> temp;
				children.push_back(temp);
			}
			Node node{ m, children };

			currentSet[v] = node;
		}

		// Set parent
		for (auto& pair : currentSet)
		{
			for (int child : pair.second.c)
			{
				currentSet[child].parent = pair.first;
			}
		}

		nodeSets.push_back(currentSet);
	}

	// Per set
	for (map<int, Node> set : nodeSets)
	{
		int moves = 0;
		// Do until all is visisted
		while (true)
		{
			// Check if everything is visited, if so break
			bool toBreak = true;
			for (auto& pair : set)
			{
				if (pair.second.visited != true && pair.first != 0)
				{
					toBreak = false;
				}
			}
			if(toBreak)
			{
				break;
			}

			// Iterate through leafs
			for (auto& pair : set)
			{
				if (pair.second.c.size() == 0 && !pair.second.visited)
				{
					// Move m-1 marbles to parent, set visited, remove self from parents child list, up move count by m-1
					set[pair.second.parent].m += (pair.second.m - 1);
					pair.second.visited = true;

					auto tempc = set[pair.second.parent].c;
					tempc.erase(remove(tempc.begin(), tempc.end(), pair.first), tempc.end());
					set[pair.second.parent].c = tempc;

					moves += abs(pair.second.m - 1);
				}
			}

		}
		cout << moves << endl;
	}

	int wait;
	cin >> wait;
	return 0;
}