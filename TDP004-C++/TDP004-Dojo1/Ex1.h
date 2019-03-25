#ifndef EX1_H
#define EX1_H

struct Node 
{
    int val;
	Node * next;
	Node(int val, Node * next = nullptr);
};

struct Stack
{
	Node * head;
	void Append_Top(int val); // Creates a new Node at the end of chain.
	int Remove_Top(int val); // Removes the end Node and returns the val of it.
	void Delete_Stack(); // Deletes all allocated children in the stack, preventing leaks.
	Stack(int first_val); // Initiates a Stack with the value of the intial node.
};

#endif 
