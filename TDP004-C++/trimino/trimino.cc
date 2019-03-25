#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

#include "trimino.h"

using namespace std;



Trimino::Trimino(int a, int b, int c)
	:values{a,b,c}
{
    // Komplettering: 7-2,
    // ni bör initiera vektorn med dessa värden direkt
    // istället för att göra 3 st. push_backs
    // då initiering i konstruktorn är något effektivare
    // än push_back.
}

bool Trimino::is_valid()
{
    // Komplettering: Ni behöver inte en vektor för det här!
    // Spara minsta index i en variabel och avbryt sedan om ni hittar
    // samma värde igen. (Vi vet ju att om vi har två likadanna minsta värden
    // så är brickan korrekt).

	long min_index_long{distance(values.begin(), min_element(values.begin(), values.end()))};
	int min_index{0};
	min_index = min_index_long;
	for (int i=0; i < 3; i++)
	{
		if (i != min_index && values[i] == values[min_index])
		return true;
	}

	// Komplettering: Varför inte bara returnera false när den är ogiltig?
	// så ni gör nu är väldigt invecklat, ni borde kunna försimpla det ganska
	// rejält, gör ett försök tll att städa upp det här lite!

	for (int i = 0; i < 2; i++)
	{
		if (vector_next(min_index + i - 1) > vector_next(min_index + i))
		{
			return false;
		}
	}

	return true;
}

void Trimino::print()
{
    // bra!
	string str{""};
	for (int i = 0; i < 3; i++)
	{
		int value = values.at(i);
		str = str + to_string(value) + " ";
	}
	cout << str << endl;
	cout << "-----" << endl;
}



int Trimino::vector_next(int const index) const
{
    // snyggt!
	int size = values.size();
	int next_index {index + 1};
	if (next_index >= size)
	{
		next_index = next_index - size;
	}
	return values.at(next_index);
}
