#include <iostream>

using namespace std;

struct Node 
{
    int val;
	Node * next;
	Node(int val, Node * next = nullptr)
		: val{val}, next{next}
	{
	}
};


int main()
{
	// Original node chain
	Node * first {new Node(5)};
	first->next = new Node(9);
	first->next->next = new Node(30);

	// Deep copy, general solution.
	Node * first_copy  {new Node(first->val)};
	Node * first_step  {first->next};
	while(first_step != nullptr)
	{
		// Go down to the end of first_copy
		Node * end_first_copy  {first_copy};
		while(end_first_copy->next != nullptr)
		{
			// One step deeper
			end_first_copy = end_first_copy->next;
		}
		// Make a new node at the end of first_copy.
		end_first_copy->next = new Node(first_step->val);

		// Go one step down
		first_step = first_step->next;
	}

	// Numbers should be the same. Addresses should be different.
	cout << "First:" << endl;
	cout << first->val << endl;
	cout << first->next->val << endl;
	cout << first->next->next->val << endl;
	cout << "First addresses:" << endl;
	cout << first << endl;
	cout << first->next << endl;
	cout << first->next->next << endl;
	cout << first->next->next->next << endl;

	cout << "First copy:" << endl;
	cout << first_copy->val << endl;
	cout << first_copy->next->val << endl;
	cout << first_copy->next->next->val << endl;
	cout << "First copy addresses:" << endl;
	cout << first_copy << endl;
	cout << first_copy->next << endl;
	cout << first_copy->next->next << endl;
	cout << first_copy->next->next->next << endl;

}
