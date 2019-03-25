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

	Element * last_element = first;
	while(last_element->next != nullptr)
	{
		last_element = last_element->next;
	}

	cout << "Data: " << last_element->data << endl;
	cout << "Next: " << last_element->next << endl;
	
	return 0;
}

