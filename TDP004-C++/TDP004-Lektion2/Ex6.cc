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

Element * last_box(Element * address)
{
	if (address->next == nullptr)
	{
		return address;
	}
	else
	{
		return last_box(address->next);
	}
}

int main()
{
	Element * first = new Element(nullptr, 5);
	first->next = new Element(nullptr, 8);
	first->next->next = new Element(nullptr, 9);

	Element * last_address = last_box(first);

	// Should return data = 9 and a non-zero address.
	cout << "Data: " << last_address->data << endl;
	cout << "Address: " << last_address << endl;

	return 0;
}

