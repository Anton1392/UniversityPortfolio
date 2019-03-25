#include <vector>
#include <iostream>
#include <iomanip>

#include "components.h"

using namespace std;

void simulate(vector<Component*> net, int iterations, int rows, double time_step)
{
	for(Component* o : net)
	{
		cout << setfill(' ') << right << setw(11) << o->get_name() << " ";
	}
	cout << endl;

	for(int i{0}; i < net.size(); i++)
	{
		cout << setw(5) << "Volt" << " "
			 << setw(5) << "Curr" << " ";
	}
	cout << endl;

	int iterations_until_print = iterations/rows;
	int print_iterator {0};
	for(int i = 0; i < iterations; i++)
	{
		for(Component* o : net)
		{
			o->do_work(time_step);
		}

		print_iterator++;
		if (print_iterator == iterations_until_print)
		{
			for(Component* o : net)
			{
				cout << fixed << setprecision(2)
					 << setw(5) << o->get_voltage() << " "
					 << setw(5) << o->get_current() << " ";
			}
			cout << endl;
			print_iterator = 0;
		}
	}

}

int main(int argc, char* argv[])
{
	if (argc == 5)
	{
		int iterations{};
		int print_frequency{};
		double time_step{};
		double battery_voltage{};
                // Komplettering: Ta emot ert specifika exception
                //                (och använd const&)
                //                Undvik ...
				// FIXAT
                // Komplettering: Menade    const invalid_argument &e
                //                eller     const exception &e
                
		try
		{
			iterations = stoi(argv[1]);
		}
		catch(invalid_argument)
		{
			cerr << "ERROR: iterations expected integer" << endl;
			return 1;
		}

		try
		{
			print_frequency = stoi(argv[2]);
		}
		catch(invalid_argument)
		{
			cerr << "ERROR: print_frequency expected integer" << endl;
			return 1;
		}

		try
		{
			time_step = stod(argv[3]);
		}
		catch(invalid_argument)
		{
			cerr << "ERROR: time_step expected double" << endl;
			return 1;
		}

		try
		{
			battery_voltage = stod(argv[4]);
		}
		catch(invalid_argument)
		{
			cerr << "ERROR: battery_voltage expected double" << endl;
			return 1;
		}

		if (battery_voltage <= 0 || time_step <= 0 || print_frequency <= 0 || iterations <= 0)
		{
			cerr << "ERROR: Expected positive numbers" << endl;
			return 2;
		}
// Fin uppdelning med {} 
		{ // Case #1
			vector<Component*> net;

			Connection P, N, C124, C23;
			  net.push_back(new Battery(P, N, "Bat", battery_voltage));
			  net.push_back(new Resistor(P, C124, "R1", 6.0));
			  net.push_back(new Resistor(C124, C23, "R2", 4.0));
			  net.push_back(new Resistor(C23, N, "R3", 8.0));
			  net.push_back(new Resistor(C124, N, "R4", 12.0));

			simulate(net, iterations, print_frequency, time_step);
			for(Component* o : net)
			{
				delete o;
			}
			net.clear();
		}
		cout << endl;
		{ // Case #2
			vector<Component*> net;

			Connection P{0}, N{0}, L{0}, R{0};
			  net.push_back(new Battery(P, N, "Bat", battery_voltage));
			  net.push_back(new Resistor(P, L, "R1", 150.0));
			  net.push_back(new Resistor(P, R, "R2", 50.0));
			  net.push_back(new Resistor(L, R, "R3", 100.0));
			  net.push_back(new Resistor(L, N, "R4", 300.0));
			  net.push_back(new Resistor(R, N, "R5", 250.0));

			simulate(net, iterations, print_frequency, time_step);
			for(Component* o : net)
			{
				delete o;
			}
			net.clear();
		}
		cout << endl;
		{  // Case #3
			vector<Component*> net;

			Connection P{0}, N{0}, R{0}, L{0};
			net.push_back(new Battery(P, N, "Bat", battery_voltage));
			net.push_back(new Resistor(P, L, "R1", 150.0));
			net.push_back(new Resistor(P, R, "R2", 50.0));
			net.push_back(new Capacitor(L, R, "C3", 1.0));
			net.push_back(new Resistor(L, N, "R4", 300.0));
			net.push_back(new Capacitor(R, N, "C5", 0.75));

			simulate(net, iterations, print_frequency, time_step);
			for(Component* o : net)
			{
				delete o;
			}
			net.clear();
		}
	}
	else
	{
		cerr << "ERROR: Incorrect number of arguments" << endl;
		cout << "Expected arguments: " << argv[0]
			 << " [iterations]" << " [print_frequency]"
			 << " [time_step]" << " [battery_voltage]" << endl;
		return 3;
	}
	
	return 0;
}
