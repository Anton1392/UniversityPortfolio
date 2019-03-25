#include <iostream>

#include "linked_list.h"

using namespace std;

Sorted_List::Node::Node(int val, Node* next = nullptr)
	: val{val}, next{next}
{

}


Sorted_List::Sorted_List()
{
}

Sorted_List::Sorted_List(Sorted_List const & original)
{
	Node* current = original.first;
	while (current != nullptr)
	{
		insert(current->val);
		current = current->next;
	}
}

Sorted_List& Sorted_List::operator= (Sorted_List const & original)
{
	remove_all();
	first = nullptr;
	Node* current = original.first;
	while (current != nullptr)
	{
		insert(current->val);
		current = current->next;
	}

	return *this;
}

Sorted_List::~Sorted_List()
{
	remove_all();
}

bool Sorted_List::is_empty() const
{
	return first == nullptr;
}

int Sorted_List::size() const
{
	int size {0};

	for(Node* step = first; step != nullptr; step = step->next)
	{
		++size;
	}

	return size;
}

void Sorted_List::insert(int val)
{
	insert(val, first);
}

void Sorted_List::insert(int val, Node*& current)
{
	if (current == nullptr)
	{
		current = new Node(val);
	}

	else if(current->val >= val)
	{
		current = new Node(val, current);
	}

	else
	{
		insert(val, current->next);
	}
}

int Sorted_List::index_value(int index) const
{
	Node* current = first;
	for (int i = 0; i != index; ++i)
	{
		if (current != nullptr)
		{
			current = current->next;
		}
		else
		{
			return -1;
		}
	}
	return current->val;
}

void Sorted_List::remove_index(int index)
{
	if (!is_empty())
	{
		if (index == 0)
		{
			Node* next {first->next};
			delete first;
			first = next;
		}
		else
		{
			Node* pointer {index_node(index-1)};
			if (pointer != nullptr && pointer->next != nullptr)
			{
				Node* next {pointer->next->next};
				delete pointer->next;
				pointer->next = next;
			}
			else
			{
				cerr << "ERROR: Remove index out of range" << endl;
			}
		}
	}
	else
	{
		cerr << "ERROR: Remove called on empty list" << endl;
	}
}

void Sorted_List::remove_all()
{
	while (!is_empty())
	{
		remove_index(0);
	}
}

Sorted_List::Node* Sorted_List::index_node(int index) const
{
	Node* current = first;
	for (int i = 0; i != index; ++i)
	{
		if (current->next != nullptr)
		{
			current = current->next;
		}
		else
		{
			return nullptr;
		}
	}
	return current;
}
