#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <sstream>

using namespace std;

int main()
{
	int m;
	cin >> m;

	int n;
	cin >> n;

	map<string, int> salaries;

	vector<string> descriptions;

	for (int i = 0; i < m; i++)
	{
		string word;
		int dollar;
		cin >> word;
		cin >> dollar;

		salaries[word] = dollar;
	}
	for (int i = 0; i < n; i++)
	{
		string desc;

		string in;
		cin >> in;
		while(in != ".")
		{
			desc.append(" ");
			desc.append(in);
			in = "";
			cin >> in;
		}

		descriptions.push_back(desc);
	}

	// Calculate salaries.
	for (string& x : descriptions)
	{
		int sum = 0;
		// Split into words, space delimiter.
		stringstream ss(x);
		string substr;
		vector<string> words;
		while (getline(ss, substr, ' '))
		{
			words.push_back(substr);
		}
		for (string s : words)
		{
			sum += salaries[s];
		}
		cout << sum << endl;
	}



	/*
	cout << "ALL SALARIES:" << endl;
	for (auto& x : salaries)
	{
		cout << x.first << " " << x.second << endl;
	}
	cout << "ALL DESCRIPTIONS:" << endl;
	for (string& x : descriptions)
	{
		cout << x << endl;
	}

	int wait;
	cin >> wait;
	*/

	return 0;
}