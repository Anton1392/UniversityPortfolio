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
	first->next = new Element(nullptr, 9);

	cout << "Data: " << first->data << endl;
	cout << "Next address: " << first->next << endl;
}

