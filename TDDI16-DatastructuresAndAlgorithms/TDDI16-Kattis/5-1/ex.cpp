#include <iostream>
#include <string>
#include <set>
#include <vector>

using namespace std;

int main()
{
	set<string> compounds;
	vector<string> words;

	string word;
	while (cin >> word)
	{
		words.push_back(word);
	}

	for (string one : words)
	{
		for (string two : words)
		{
			if (one != two)
			{
				compounds.insert(one + two);
			}
		}
	}

	for (string compound : compounds)
	{
		cout << compound << endl;
	}

	return 0;
}