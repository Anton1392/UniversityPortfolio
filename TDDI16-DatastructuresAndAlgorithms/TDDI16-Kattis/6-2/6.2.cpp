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

void calculateSea(Node n, vector<vector<Node>>& lvl)
{
	// BFS
	queue<Node> q{};
	lvl[n.x][n.y].visited = true;
	lvl[n.x][n.y].isSea = true;
	// Initiate queue
	try {
		if (!lvl.at(n.x + 1).at(n.y).visited) {
			lvl.at(n.x + 1).at(n.y).visited = true;
			q.push(lvl.at(n.x + 1).at(n.y));
		}
	}
	catch (...) {}
	try {
		if (!lvl.at(n.x - 1).at(n.y).visited) {
			lvl.at(n.x - 1).at(n.y).visited = true;
			q.push(lvl.at(n.x - 1).at(n.y));
		}
	}
	catch (...) {}
	try {
		if (!lvl.at(n.x).at(n.y + 1).visited) {
			lvl.at(n.x).at(n.y+1).visited = true;
			q.push(lvl.at(n.x).at(n.y + 1));
		}
	}
	catch (...) {}
	try {
		if (!lvl.at(n.x).at(n.y - 1).visited) {
			lvl.at(n.x).at(n.y-1).visited = true;
			q.push(lvl.at(n.x).at(n.y - 1));
		}
	}
	catch (...) {}


	while (!q.empty())
	{
		Node nod = q.front(); q.pop();
		if (nod.isWater)
		{
			// Add neighbors
			try {
				if (!lvl.at(nod.x + 1).at(nod.y).visited) {
					lvl.at(nod.x + 1).at(nod.y).visited = true;
					q.push(lvl.at(nod.x + 1).at(nod.y));
				}
			}
			catch (...) {}
			try {
				if (!lvl.at(nod.x - 1).at(nod.y).visited) {
					lvl.at(nod.x - 1).at(nod.y).visited = true;
					q.push(lvl.at(nod.x - 1).at(nod.y));
				}
			}
			catch (...) {}
			try {
				if (!lvl.at(nod.x).at(nod.y + 1).visited) {
					lvl.at(nod.x).at(nod.y+1).visited = true;
					q.push(lvl.at(nod.x).at(nod.y + 1));
				}
			}
			catch (...) {}
			try {
				if (!lvl.at(nod.x).at(nod.y - 1).visited) {
					lvl.at(nod.x).at(nod.y-1).visited = true;
					q.push(lvl.at(nod.x).at(nod.y - 1));
				}
			}
			catch (...) {}

			lvl[nod.x][nod.y].isSea = true;
			lvl[nod.x][nod.y].visited = true;
		}
	}
}


int main()
{
	int n;
	int m;
	cin >> n;
	cin >> m;

	vector<vector<Node>> level;

	// Construct level
	for (int i = 0; i < n; i++)
	{
		vector<Node> v;
		level.push_back(v);
		string in;
		cin >> in;
		int j = 0;
		for (char& c : in)
		{
			Node node{};
			node.x = i;
			node.y = j;
			if (c == '0')
			{
				node.isWater = true;
			}
			else if (c == '1')
			{
				node.isLand = true;
			}
			j++;
			level[i].push_back(node);
		}
	}

	// Calculate sea
	// Top row
	for (int i = 0; i < level[0].size(); i++)
	{
		if (level[0][i].isWater && !level[0][i].visited)
		{
			calculateSea(level[0][i], level);
		}
	}
	// Bottom row
	for (int i = 0; i < level[n - 1].size(); i++)
	{
		if (level[n - 1][i].isWater && !level[n - 1][i].visited)
		{
			calculateSea(level[n - 1][i], level);
		}
	}
	// Left column
	for (int i = 0; i < level.size(); i++)
	{
		if (level[i][0].isWater && !level[i][0].visited)
		{
			calculateSea(level[i][0], level);
		}
	}
	// Right column
	for (int i = 0; i < n; i++)
	{
		if (level[i][m - 1].isWater && !level[i][m - 1].visited)
		{
			calculateSea(level[i][m - 1], level);
		}
	}

	int shoreLine = 0;
	// Calculate shoreline, per land tile it's 4 - every non-sea neighbor
	for (int i = 0; i < n; i++)
	{
		for (int j = 0; j < m; j++)
		{
			if (level.at(i).at(j).isLand)
			{
				int thisTile = 4;
				try {
					if (!level.at(i + 1).at(j).isSea)
					{
						thisTile--;
					}
				}
				catch (...) {}
				try {
					if (!level.at(i - 1).at(j).isSea)
					{
						thisTile--;
					}
				}
				catch (...) {}
				try {
					if (!level.at(i).at(j + 1).isSea)
					{
						thisTile--;
					}
				}
				catch (...) {}
				try {
					if (!level.at(i).at(j - 1).isSea)
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

	int wait;
	cin >> wait;
	return 0;
}

