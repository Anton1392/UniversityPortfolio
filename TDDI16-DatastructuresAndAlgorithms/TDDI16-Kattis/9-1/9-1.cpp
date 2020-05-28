#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main()
{
	// true = bird, false = no bird
	int l, d, n;
	cin >> l;
	cin >> d;
	cin >> n;

	vector<int> birds;
	birds.push_back(-d + 6);
	birds.push_back(l + d - 6);
	for (int i = 0; i < n; i++)
	{
		int bird;
		cin >> bird;
		birds.push_back(bird);
	}

	sort(birds.begin(), birds.end());

	int extraBirds = 0;
	for (int i = 0; i < birds.size() - 1; i++)
	{
		int bird1 = birds[i];
		int bird2 = birds[i+1];
		int distance = bird2 - bird1;
		extraBirds += (distance / d - 1);
	}

	cout << extraBirds << endl;

	int wait;
	cin >> wait;
	return 0;
}