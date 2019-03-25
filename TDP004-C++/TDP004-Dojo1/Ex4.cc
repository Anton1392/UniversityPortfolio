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

void deallocate_nodes(Node *& first)
{
	// If first is not null, delete it and move first one step down the chain.
	if(first)
	{
		 Node * old {first};
		 first = first->next;
		 delete old;
		 deallocate_nodes(first);
	}
}

int main()
{
	// Original node chain
	Node * first {new Node(5)};
	first->next = new Node(9);
	first->next->next = new Node(30);

	deallocate_nodes(first);

	// Should print null pointer.
	cout << first << endl;

	return 0;
}
