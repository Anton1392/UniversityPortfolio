#include <iostream>

using namespace std;

struct Element
{
	int data;
	Element * next;
	Element(Element * next, int data)
		: data{data}, next{next}
	{
	}
};

int main()
{
	Element * first = new Element(nullptr, 5);
	first->next = new Element(nullptr, 8);
	first->next->next = new Element(nullptr, 9);

	cout << "Data: " << first->next->next->data << endl;
	cout << "Address: " << first->next->next->next << endl;

	return 0;
}

