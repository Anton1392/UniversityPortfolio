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

	// While first is not null
	while(first)
	{
		 Node * old {first};
		 first = first->next;
		 delete old;
	}

	// Should print null pointer.
	cout << first << endl;

	return 0;
}
