#include <vector>
#include <iostream>
#include <algorithm>
#include <string>
#include <stack>
#include <queue>

using namespace std;

int main()
{
	vector<string> answers;

	int n;
	while(std::cin >> n)
	{
		stack<int> myStack;
		queue<int> myQueue;
		priority_queue<int> myPQueue;

		bool canBeStack = true;
		bool canBeQueue = true;
		bool canBePQueue = true;


		for (int i = 0; i < n; i++)
		{
			int type;
			std::cin >> type;
			if (type == 1)
			{
				int v;
				std::cin >> v;
				myStack.push(v);
				myQueue.push(v);
				myPQueue.push(v);
			}
			else if (type == 2)
			{
				int v;
				std::cin >> v;
				// Check if stack logic breaks, if element is not the back element.
				if (canBeStack)
				{
					if (myStack.empty() || myStack.top() != v)
					{
						canBeStack = false;
					}
					else
					{
						myStack.pop();
					}
				}
				// Check if queue logic breaks, if element is not the first element.
				if (canBeQueue)
				{
					if (myQueue.empty() || myQueue.front() != v)
					{
						canBeQueue = false;
					}
					else
					{
						myQueue.pop();
					}
				}
				// Check if prio-queue logic breaks, if element is not the highest element.
				if (canBePQueue)
				{
					if (myPQueue.empty() || myPQueue.top() != v)
					{
						canBePQueue = false;
					}
					else
					{
						myPQueue.pop();
					}
				}
			}
		}

		if (int(canBeStack) + int(canBeQueue) + int(canBePQueue) >= 2)
		{
			answers.push_back("not sure");
		}
		else if (int(canBeStack) + int(canBeQueue) + int(canBePQueue) == 0)
		{
			answers.push_back("impossible");
		}
		else if (canBeStack)
		{
			answers.push_back("stack");
		}
		else if (canBeQueue)
		{
			answers.push_back("queue");
		}
		else if (canBePQueue)
		{
			answers.push_back("priority queue");
		}
	}

	for (string s : answers)
	{
		cout << s << endl;
	}

	return 0;
}