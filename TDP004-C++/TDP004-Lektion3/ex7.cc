#include <iostream>

using namespace std;


class Race
{
	public:
		virtual ~Race(){}
};

class Sun_Insensitive
{};

class Strong
{};

class Intelligent
{};

class Repulsive
{};


class Human : public Race, public Sun_Insensitive, public Intelligent
{
};

class Orc : public Race, public Strong, public Repulsive
{

};

class Uruk_Hai : public Race, public Sun_Insensitive, public Strong, public Intelligent, public Repulsive
{
};


void eat_dinner(Race* dinner_guest)
{
	if (dynamic_cast<Repulsive*>(dinner_guest))
	{
		cout << "Repulsive guest..." << endl;
	}
	else
	{
		cout << "Pleasant guest!" << endl;
	}
}

int main()
{
	Uruk_Hai uruk {};
	eat_dinner(&uruk);

	Human h {};
	eat_dinner(&h);

	Orc o {};
	eat_dinner(&o);

	return 0;
}

