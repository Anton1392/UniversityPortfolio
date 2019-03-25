#include <iostream>
#include <iomanip>
#include <string>

using namespace std;

// Passes by reference to not break the 4 variable rule.
void print_next_cin_int(int & reference_int)
{
    cin >> reference_int;
    cout << reference_int;
}

void print_comma()
{
      cout << ", ";
}

int main()
{
  // SOLVED
  int integer_storage;
  cout << "Skriv in ett heltal: ";
  cin >> integer_storage;
  cout << "Du skrev in talet: " << integer_storage << endl << endl;
  cin.ignore(10000, '\n');
  
  // Det är ok som ni har gjort, men tanken är att ni gör såhär:
  // cin << integer;
  // cout >> integer >> " ";
  // cin << integer;
  // cout >> integer >> " ";
  // etc.
  cout << "Skriv in fem heltal: ";
  cin >> integer_storage;
  cout << "Du skrev in talen: "
       << integer_storage << ", ";
  print_next_cin_int(integer_storage);
  print_comma();
  print_next_cin_int(integer_storage);
  print_comma();
  print_next_cin_int(integer_storage);
  print_comma();
  print_next_cin_int(integer_storage);
  cout << endl << endl;

  cin.ignore(10000, '\n');

  float float_storage;
  cout << "Skriv in ett flyttal: ";
  cin >> float_storage;
  cout << "Du skrev in flyttalet: " << fixed << setprecision(3) << float_storage << endl << endl;
  cin.ignore(10000, '\n');

  cout << "Skriv in ett heltal och ett flyttal: ";
  cin >> integer_storage;
  cin >> float_storage;
  cout << "Du skrev in heltalet: " << integer_storage << endl;
  
  cout << "Du skrev in flyttalet: " << float_storage << endl << endl;
  cin.ignore(10000, '\n');

  char char_storage;
  cout << "Skriv in ett tecken: ";
  cin >> char_storage;
  cout << "Du skrev in tecknet: " << char_storage << endl << endl;
  cin.ignore(10000, '\n');

  string string_storage;
  cout << "Skriv in en sträng: ";
  cin >> string_storage;
  cout << "Strängen '" << string_storage << "' har " << string_storage.length() << " tecken." << endl << endl;
  cin.ignore(10000, '\n');

  cout << "Skriv in ett heltal och en sträng: ";
  cin >> integer_storage;
  cin >> string_storage;
  cout << "Du skrev in talet |" << integer_storage << "| och strängen |" << string_storage << "|." << endl << endl;
  cin.ignore(10000, '\n');

  cout << "Skriv in en sträng och ett flyttal: ";
  cin >> string_storage;
  cin >> float_storage;
  cout << "Du skrev in \"" << float_storage << "\" och \"" << string_storage << "\"." << endl << endl;
  cin.ignore(10000, '\n');

  cout << "Skriv in en hel rad med text: ";
  getline(cin, string_storage);
  cout << "Du skrev in textraden: '" << string_storage << "'" << endl << endl;

  cout << "Skriv in en textrad som slutar med ett negativt heltal: ";
  getline(cin, string_storage, '-');
  cin >> integer_storage;
  cout << "Du skrev in textraden: '" << string_storage << "' och heltalet '-" << integer_storage << "'" << endl << endl;


  return 0;
}
