#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <iterator>

using namespace std;

vector<void*>* myUnion(vector<void*>*rhs, vector<void*>* lhs)
{
	vector<void*>* res = new vector<void*>;
	for (void* x : *rhs)
	{
		bool doIAdd = true;
		vector<void*>* ptr = (vector<void*>*)x;
		for (void* y : *res)
		{
			vector<void*>* comp = (vector<void*>*)y;
			if (*comp == *ptr)
			{
				doIAdd = false;
			}
		}
		if (doIAdd)
		{
			res->push_back(x);
		}
	}
	for (void* x : *lhs)
	{
		bool doIAdd = true;
		vector<void*>* ptr = (vector<void*>*)x;
		for (void* y : *res)
		{
			vector<void*>* comp = (vector<void*>*)y;
			if (*comp == *ptr)
			{
				doIAdd = false;
			}
		}
		if (doIAdd)
		{
			res->push_back(x);
		}
	}

	return res;
}

vector<void*>* myIntersect(vector<void*>*rhs, vector<void*>* lhs)
{
	// ALL ELEMENTS RHS THAT ARE ALSO IN LHS
	vector<void*>* res = new vector<void*>;
	for (void* x : *rhs)
	{
		vector<void*>* ptr = (vector<void*>*)x;

		bool doIAdd = false;
		for (void* y : *lhs)
		{
			vector<void*>* comp = (vector<void*>*)y;
			if (*comp == *ptr)
			{
				doIAdd = true;
			}
		}
		if (doIAdd)
		{
			res->push_back(x);
		}
	}

	return res;
}

int main()
{
	// Amount of test cases
	int t;
	cin >> t;
	for (int i = 0; i < t; i++)
	{
		vector<void*> testCase;

		// Amount of operations per testcase
		int n;
		cin >> n;
		for (int j = 0; j < n; j++)
		{
			string op;
			cin >> op;

			if (op == "PUSH")
			{
				testCase.push_back(new vector<void*>);
			}
			else if (op == "DUP")
			{
				vector<void*>* first = (vector<void*>*)testCase.back(); testCase.pop_back();
				vector<void*>* copy1 = new vector<void*>(*first);
				vector<void*>* copy2 = new vector<void*>(*first);
				testCase.push_back(copy1);
				testCase.push_back(copy2);
			}
			else if (op == "UNION")
			{
				vector<void*>* first = (vector<void*>*)testCase.back(); testCase.pop_back();
				vector<void*>* second = (vector<void*>*)testCase.back(); testCase.pop_back();

				vector<void*>* res = myUnion(first, second);

				testCase.push_back(res);
			}
			else if (op == "INTERSECT")
			{
				vector<void*>* first = (vector<void*>*)testCase.back(); testCase.pop_back();
				vector<void*>* second = (vector<void*>*)testCase.back(); testCase.pop_back();

				vector<void*>* res = myIntersect(first, second);

				testCase.push_back(res);
			}
			else if (op == "ADD")
			{
				vector<void*>* first = (vector<void*>*)testCase.back(); testCase.pop_back();
				vector<void*>* second = (vector<void*>*)testCase.back(); testCase.pop_back();

				bool doIAdd = true;
				for (void* x : *first)
				{
					vector<void*>* ptr = (vector<void*>*)x;
					if (*ptr == *second)
					{
						// Already in vector
						doIAdd = false;
					}
				}
				if (doIAdd)
				{
					first->push_back(second);
				}

				testCase.push_back(first);
			}

			vector<void*>* last = (vector<void*>*)testCase.back();
			cout << last->size() << endl;
		}

		cout << "***" << endl;
	}

	return 0;
}

