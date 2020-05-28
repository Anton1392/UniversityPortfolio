#include <iostream>
#include <string>
#include <vector>
#include <queue>
using namespace std;

class Node
{
public:
	bool isLand = false;
	bool isWater = false;
	bool isSea = false;

	int x;
	int y;

	bool visited = false;
};

void calculateSea(int x, int y, vector<vector<int>>& lvl)
{
	// BFS
	//[x, y, val]
	queue<vector<int>> q{};
	lvl[x][y] = 2;
	// Initiate queue
	try {
		if (lvl.at(x + 1).at(y) == 0) {
			vector<int> nod = {x + 1, y, 0};
			q.push(nod);
		}
	}
	catch (...) {}
	try {
		if (lvl.at(x - 1).at(y) == 0) {
			vector<int> nod = {x - 1, y, 0};
			q.push(nod);
		}
	}
	catch (...) {}
	try {
		// If not visited, aka iswater
		if (lvl.at(x).at(y + 1) == 0) {
			vector<int> nod = {x, y+1, 0};
			q.push(nod);
		}
	}
	catch (...) {}
	try {
		if (lvl.at(x).at(y - 1) == 0) {
			vector<int> nod = {x, y-1, 0};
			q.push(nod);
		}
	}
	catch (...) {}


	while (!q.empty())
	{
		auto n = q.front(); q.pop();
		int x = n[0];
		int y = n[1];
		if (n[2]==0)
		{
			// Add neighbors
			try {
				if (lvl.at(x + 1).at(y) == 0) {
					vector<int> nod = { x+1, y, 0 };
					q.push(nod);
				}
			}
			catch (...) {}
			try {
				if (lvl.at(x - 1).at(y) == 0) {
					vector<int> nod = { x-1, y, 0 };
					q.push(nod);
				}
			}
			catch (...) {}
			try {
				if (lvl.at(x).at(y + 1) == 0) {
					vector<int> nod = { x, y+1, 0 };
					q.push(nod);
				}
			}
			catch (...) {}
			try {
				if (lvl.at(x).at(y - 1) == 0) {
					vector<int> nod = { x, y-1, 0 };
					q.push(nod);
				}
			}
			catch (...) {}

			lvl[x][y] = 2;
		}
	}
}


int main()
{
	int n;
	int m;
	cin >> n;
	cin >> m;

	vector<vector<int>> level;

	// Construct level
	for (int i = 0; i < n; i++)
	{
		vector<int> v;
		level.push_back(v);
		string in;
		cin >> in;
		int j = 0;
		for (char& c : in)
		{
			// 0 is water
			if (c == '0')
			{
				level[i].push_back(0);
			}
			// 1 is land
			else if (c == '1')
			{
				level[i].push_back(1);
			}
			// 2 is sea
		}
	}
	cout << "Initialized level" << endl;


	// Calculate sea
	// Top row
	for (int i = 0; i < level[0].size(); i++)
	{
		if (level[0][i] == 0)
		{
			calculateSea(0, i, level);
		}
	}
	// Bottom row
	for (int i = 0; i < level[n - 1].size(); i++)
	{
		if (level[n - 1][i] == 0)
		{
			calculateSea(n - 1, i, level);
		}
	}
	// Left column
	for (int i = 0; i < level.size(); i++)
	{
		if (level[i][0] == 0)
		{
			calculateSea(i, 0, level);
		}
	}
	// Right column
	for (int i = 0; i < n; i++)
	{
		if (level[i][m - 1] == 0)
		{
			calculateSea(i, m - 1, level);
		}
	}

	int shoreLine = 0;
	// Calculate shoreline, per land tile it's 4 - every non-sea neighbor
	for (int i = 0; i < n; i++)
	{
		for (int j = 0; j < m; j++)
		{
			if (level.at(i).at(j) == 1)
			{
				int thisTile = 4;
				try {
					if (level.at(i + 1).at(j) != 2)
					{
						thisTile--;
					}
				}
				catch (...) {}
				try {
					if (level.at(i - 1).at(j) != 2)
					{
						thisTile--;
					}
				}
				catch (...) {}
				try {
					if (level.at(i).at(j + 1) != 2)
					{
						thisTile--;
					}
				}
				catch (...) {}
				try {
					if (level.at(i).at(j - 1) != 2)
					{
						thisTile--;
					}
				}
				catch (...) {}
				shoreLine += thisTile;
			}
		}
	}

	cout << shoreLine << endl;

	/*
	for (vector<int> v : level)
	{
		for (int i : v)
		{
			cout << i << " ";
		}
		cout << endl;
	}
	*/

	int wait;
	cin >> wait;
	return 0;
}

