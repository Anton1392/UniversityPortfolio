#include <iostream>
#include <vector>
#include <cmath>

using namespace std;

class Country
{
public:
	bool left = false;
	vector<Country*> partners;
	int leftPartners = 0;

	void calcLeaving()
	{
		if (leftPartners >= ceil((partners.size()) / 2.0))
		{
			left = true;
			updateNeighbors();
		}
	}

	void updateNeighbors()
	{
		for (Country* partner : partners)
		{
			if (partner->left == false)
			{
				partner->leftPartners++;
				partner->calcLeaving();
			}
		}
	}
};

int main()
{
	int c, p, x, l;
	cin >> c;
	cin >> p;
	cin >> x;
	cin >> l;

	// Countries
	vector<Country*> countries;
	for (int i = 0; i < c; i++)
	{
		countries.push_back(new Country());
	}

	// Partnerships
	for (int i = 0; i < p; i++)
	{
		int c1, c2;
		cin >> c1;
		cin >> c2;
		countries[c1 - 1]->partners.push_back(countries[c2 - 1]);
		countries[c2 - 1]->partners.push_back(countries[c1 - 1]);
	}

	countries[l - 1]->left = true;
	countries[l - 1]->updateNeighbors();

	if (countries[x - 1]->left)
	{
		cout << "leave" << endl;
	}
	else
	{
		cout << "stay" << endl;
	}

	int wait;
	cin >> wait;
	return 0;
}