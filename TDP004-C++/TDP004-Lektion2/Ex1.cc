#include <iostream>

using namespace std;

struct Element
{
	int data;
	Element * next;
};

int main()
{
	Element * first = new Element();
	first->data = 5;
	first->next = first;

	cout << "Data: " << first->data << endl;
	cout << "Next address: " << first->next << endl;
}





