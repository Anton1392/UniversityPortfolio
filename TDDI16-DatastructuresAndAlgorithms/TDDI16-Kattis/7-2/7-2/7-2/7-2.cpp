#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Tree
{
public:
	int index;
	vector<int> neighbors;
	vector<int> possibleMonkeyPlaces;
};

int main()
{
	while (true)
	{
		// Set up input, construct forest.
		int n;
		cin >> n;
		int m;
		cin >> m;

		if (n == 0 && m == 0) { break; }

		vector<Tree> forest;

		for (int i = 0; i < n; i++)
		{
			Tree t{};
			t.index = i;
			forest.push_back(t);
		}


		for (int i = 0; i < m; i++)
		{
			int p1;
			int p2;
			cin >> p1;
			cin >> p2;

			forest.at(p1).neighbors.push_back(p2);
			forest.at(p2).neighbors.push_back(p1);
		}

		// Monkey can start in all places
		for (Tree& t : forest)
		{
			for (Tree& t2 : forest)
			{
				t.possibleMonkeyPlaces.push_back(t2.index);
			}
		}

		vector<vector<Tree>> states;
		states.push_back(forest);
		for (vector<Tree> state : states)
		{
			vector<vector<Tree>> newStates;
			// Shoot at every tree, recalculate where the monkey can be afterwards.
		}
	}

	int wait;
	cin >> wait;
	return 0;
}