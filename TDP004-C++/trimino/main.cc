#include <iostream>
#include <fstream>
#include <sstream>
#include <limits>
#include <string>

#include "trimino.h"

using namespace std;

int main(int argc, char* argv[])
{
	// If true, use arguments, else use standard input (cin)
	bool use_arg {true};
	if (use_arg)
	{
		string file_name {};
		int interval_min {};
		int interval_max {};

		if(argc == 4)
		{
			try
			{
				interval_min = stoi(argv[2]);
				interval_max = stoi(argv[3]);
			}
			// Komplettering: Fånga specifika exceptions
			catch (invalid_argument)
			{
				cerr << "ERROR: Invalid interval argument." << endl;
				return 2;
			}

			file_name = argv[1];
		}
		else if (argc == 1)
		{
			bool valid_file{false};
			while(!valid_file)
			{
				cout << "Enter filename (relative path to program): ";
				cin >> file_name;
				ifstream test_file {file_name};
				if (!test_file)
				{
					cerr << "ERROR: Invalid file, could not open" << endl;
				}
				else
				{
					valid_file = true;
				}
			}

			cout <<	"Enter an integer as the interval minimum: ";
			cin >> interval_min;
			while (!cin)
			{
				cerr << "ERROR: Invalid number" << endl;
				cout << "Enter an integer as the interval minimum: ";
				cin.clear();
				cin.ignore(numeric_limits<streamsize>::max(), '\n');
				cin >> interval_min;
			}

			cout <<	"Enter an integer as the interval maximum: ";
			cin >> interval_max;
			while (!cin)
			{
				cerr << "ERROR: Invalid number" << endl;
				cout << "Enter an integer as the interval maximum: ";
				cin.clear();
				cin.ignore(numeric_limits<streamsize>::max(), '\n');
				cin >> interval_max;
			}
			cin.ignore(numeric_limits<streamsize>::max(), '\n');

		}
		else
		{
			cerr << "ERROR: Usage: " << argv[0] << " filename interval_min interval_max" << endl;
			return 1;
		}

		ifstream in_file {file_name};
		if(!in_file)
		{
			cerr << "ERROR: Couldn't open input file '"<< file_name << "'." << endl;
			return 2;
		}
		int line_number {1};
		for (string line; getline(in_file, line); line_number++) // snyggt!
		{
			stringstream strs;
			strs << line;

			// Extract characters and stuffs.
			int side_a {};
			int side_b {};
			int side_c {};
			string link;
			strs >> side_a;
			strs >> side_b;
			strs >> side_c;
			strs >> link;

			// If one of the values are missing.
			if (!side_a || !side_b || !side_c)
			{
				cerr << "ERROR: Missing data at line " << line_number << ". Three numbers required, followed by an optional image link." << endl;
			}

			// Interval check
			else if (side_a < interval_min || side_a > interval_max)
			{
				cerr << "ERROR: First number at line " << line_number << " is outside the interval. (" << interval_min << "-" << interval_max << ")." << endl;
			}
			else if (side_b < interval_min || side_b > interval_max)
			{
				cerr << "ERROR: Second number at line " << line_number << " is outside the interval. (" << interval_min << "-" << interval_max << ")." << endl;
			}
			else if (side_c < interval_min || side_c > interval_max)
			{
				cerr << "ERROR: Third number at line " << line_number << " is outside the interval. (" << interval_min << "-" << interval_max << ")." << endl;
			}
			else
			{
				Trimino t {side_a, side_b, side_c};
				if (!t.is_valid())
				{
					cerr << "ERROR: Trimino brick at line " << line_number << " with sides " << side_a << ", " << side_b << ", " << side_c
						<< " is not valid. Values need to be increasing or equal, clockwise (left->right with a wraparound at the end)."
						<< endl;
					continue;
				}
				else
				{
					cout << "Trimino at line " << line_number << " is valid." << endl;
				}
			}
		}
		in_file.close();
	}

	else
	{

		int interval_min{};
		cout <<	"Enter an integer as the interval minimum: ";
		cin >> interval_min;
		while (!cin)
		{
			cerr << "ERROR: Invalid number" << endl;
			cout << "Enter an integer as the interval minimum: ";
			cin.clear();
			cin.ignore(numeric_limits<streamsize>::max(), '\n');
			cin >> interval_min;
		}

		int interval_max{};
		cout <<	"Enter an integer as the interval maximum: ";
		cin >> interval_max;
		while (!cin)
		{
			cerr << "ERROR: Invalid number" << endl;
			cout << "Enter an integer as the interval maximum: ";
			cin.clear();
			cin.ignore(numeric_limits<streamsize>::max(), '\n');
			cin >> interval_max;
		}
		cin.ignore(numeric_limits<streamsize>::max(), '\n');


		cout << "Enter values for your Trimino bricks in the format: side_a side_b side_c filename[optional]:" << endl;

		for (string line; getline(cin, line);)
		{

			stringstream strs;
			strs << line;

			// Extract characters and stuffs.
			int side_a {};
			int side_b {};
			int side_c {};
			string link;
			strs >> side_a;
			strs >> side_b;
			strs >> side_c;
			strs >> link;

			// Kommentar: Samma som ovan då... men vi låter det gå
			// If one of the values are missing.
			if ((!side_a) || (!side_b) || (!side_c))
			{
				cerr << "ERROR: Missing data." << ". Three numbers required, followed by an optional image link." << endl;
				continue;
			}

			// Interval check
			if (side_a < interval_min || side_a > interval_max)
			{
				cerr << "ERROR: First number " << " is outside the interval. (" << interval_min << "-" << interval_max << ")." << endl;
				continue;
			}

			if (side_b < interval_min || side_b > interval_max)
			{
				cerr << "ERROR: Second number " << " is outside the interval. (" << interval_min << "-" << interval_max << ")." << endl;
				continue;
			}

			if (side_c < interval_min || side_c > interval_max)
			{
				cerr << "ERROR: Third number " << " is outside the interval. (" << interval_min << "-" << interval_max << ")." << endl;
				continue;
			}

			Trimino t{side_a, side_b, side_c};
			if (!t.is_valid())
			{
				cerr << "ERROR: Trimino brick with sides " << side_a << ", " << side_b << ", " << side_c
					<< " is not valid. Values need to be increasing or equal, clockwise (left->right with a wraparound at the end)."
					<< endl;
			}
			else
			{
				cout << "The brick is valid!" << endl;
			}
		}
	}
}
