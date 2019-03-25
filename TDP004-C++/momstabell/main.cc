#include <iostream>
#include <iomanip>
using namespace std;

//Komplettering: 1-4
//Komplettering: Steglängd måste vara minst 0.01, men eran lösning
//tillåter inte att användaren matar in 0.01.
// SOLVED

float vat_calc(float price, float vat_percent);
float including_vat(float price, float vat_percent);

/*
Steg större än 0.01
Sista pris större än första
Alla priser positiva, samt momsprocent
Första över 0
*/

int main()
{
    cout << "INMATNINGSDEL\n============" << endl;
    //Komplettering: 7-1
    //Komplettering: 1-9
    //Kommentar: Bra variabelnamn!
	// SOLVED

	float first_price {};
	bool loop_again { true };
    while(loop_again)
    {
      cout << "Mata in första pris: ";
      cin >> first_price;

      if (first_price < 0)
      {
        loop_again = true;
        cout << "FEL: Första pris måste vara minst 0 (noll) kronor" << endl;
      }
      else
      {
        loop_again = false;
      }
    }

	float last_price {};
    loop_again = true;
    while(loop_again)
    {
      cout << "Mata in sista pris : ";
      cin >> last_price;

      if (last_price <= first_price)
      {
        cout << "FEL: Sista pris måste vara större än första pris." << endl;
      }
      else
      {
        loop_again = false;
      }
    }

	float step_length {};
    loop_again = true;
    while(loop_again)
    {
      cout << "Mata in steglängd  : ";
      cin >> step_length;
      if (step_length < 0.01f)
      {
        cout << "FEL: Steglängden måste vara minst 0.01" << endl;
      }
      else
      {
        loop_again = false;
      }
    }

    float vat_percent {};
    loop_again = true;
    while(loop_again)
    {
      cout << "Mata in momsprocent: ";
      cin >> vat_percent;

      if (vat_percent <= 0)
      {
        cout << "FEL: Momsprocent måste vara över 0 (noll)" << endl;
      }
      else
      {
        loop_again = false;
      }
    }

    //Kommentar: Bra radbrytning. Applicera den vid utskriften av tabellen.
	// Är detta komplettering eller en komplimang? :)
    cout << "\nMOMSTABELLEN\n============\n"
         << setw(12) << "Pris"
         << setw(17) << "Moms"
         << setw(20) << "Pris med moms\n"
         << setw(12+17+20) << setfill('-') << "\n";

    while (first_price <= last_price)
    {
      //Komplettering: 4-9
	  // SOLVED

      cout << fixed << setprecision(2) << setw(12) << setfill(' ') << first_price;
      cout << setw(17) << vat_calc(first_price, vat_percent);
      cout << setw(19) << including_vat(first_price, vat_percent) << "\n";

      first_price += step_length;
    }

    return 0;
}

float vat_calc(float price, float vat_percent)
{
  return price * (vat_percent/100);
}

float including_vat(float price, float vat_percent)
{
  return price * (1 + (vat_percent/100));
}
