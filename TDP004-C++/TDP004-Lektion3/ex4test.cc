#include <iostream>
#include <vector>

using namespace std;

class Binary_Operator

{
	public:
		virtual double evaluate(double a, double b) const = 0;
};

class Multiply : public Binary_Operator
{
	public:
		double evaluate(double a, double b) const override { return a * b; }  
};

class Add : public Binary_Operator
{
	public:
		double evaluate(double a, double b) const override { return a + b; }  
};

int main()
{
	vector<Binary_Operator &> v{ Multiply{}, Add{} };

	for ( Binary_Operator o : v )
	{
		cout << o.evaluate(5.0, 3.0) << endl;
	}

	return 0;
}
