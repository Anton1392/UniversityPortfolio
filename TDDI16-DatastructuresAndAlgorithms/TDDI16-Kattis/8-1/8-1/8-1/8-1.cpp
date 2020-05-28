#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator>

using namespace std;

int main()
{
	while (true)
	{
		int n, m;
		cin >> n;
		cin >> m;

		if (n == 0 && m == 0) { break; }

		vector<int> jack;
		for (int i = 0; i < n; i++)
		{
			int x;
			cin >> x;
			jack.push_back(x);
		}

		vector<int> jill;
		for (int i = 0; i < m; i++)
		{
			int x;
			cin >> x;
			jill.push_back(x);
		}

		vector<int> intersection;
		set_intersection(jack.begin(), jack.end(), jill.begin(), jill.end(), back_inserter(intersection));

		cout << intersection.size() << endl;
	}

	return 0;
}