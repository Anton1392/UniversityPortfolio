#include <vector>
#include <string>
#include <fstream>
#include <iostream>
#include <iomanip>
#include <sstream>
#include <algorithm>
#include <cctype>
#include <unordered_map>
#include <map>

using namespace std;

string clean_word(string str)
{
	string new_str {str};
	size_t slice_front {new_str.find_first_not_of("\"'(")};
	if (slice_front != string::npos)
	{
		new_str = new_str.substr(slice_front);
	}

	size_t slice_back {new_str.find_last_not_of("!?;,:.\"')")};
	if (slice_back != string::npos)
	{
		new_str = new_str.substr(0, slice_back+1);
	}

	if (new_str.substr(new_str.size()-2, 2) == "'s")
	{
		new_str = new_str.substr(0, new_str.size()-2);
	}

	return new_str;
}

bool valid_word(string str)
{
	if (str.size() < 3)
	{
		return false;
	}

	if(str[0] == '-' || str[str.size()-1] == '-')
	{
		return false;
	}

	// Finds any '--' pattern.
	string target  {"--"};
	if (search(begin(str), end(str), begin(target), end(target)) != end(str))
	{
		return false;
	}

	// Checks alphabetical characters
	if (any_of(begin(str), end(str), [](char c){return !isalpha(c);}))
	{
		return false;
	}


	return true;
}

bool compare_pair_flag(pair<string, int> first, pair<string, int> second)
{
	return second.second < first.second;
}

void flag_a(unordered_map<string, int>& dict, size_t longest_word_size,
			size_t highest_freq_length)
{
	map<string, int> ordered_map(dict.begin(), dict.end());

	for_each(ordered_map.begin(), ordered_map.end(),
	[highest_freq_length, longest_word_size](pair<string, int> current_pair)
	{
		string word {current_pair.first};
		int freq {current_pair.second};

		cout << setw(longest_word_size) << left << word
			 << "  " << setw(highest_freq_length)
			 << right << freq << endl;
	});
}

void flag_f(unordered_map<string, int>& dict, size_t longest_word_size,
			size_t highest_freq_length)
{
	vector<pair<string, int>> ordered_vector {};
	copy(dict.begin(), dict.end(), back_inserter(ordered_vector));
	sort(ordered_vector.begin(), ordered_vector.end(), compare_pair_flag);

	for_each(ordered_vector.begin(), ordered_vector.end(),
	[highest_freq_length, longest_word_size](pair<string, int> current_pair)
	{
		string word {current_pair.first};
		int freq {current_pair.second};

		cout << setw(longest_word_size) << right << word
			<< "  " << setw(highest_freq_length)
			<< freq << endl;
	});
}

void flag_o(vector<string>& raw_words, int width)
{
	int current_line_width {0};
	for_each(raw_words.begin(), raw_words.end(),
			[width, &current_line_width](string str)
			{
			current_line_width += str.size() + 1;
			if(current_line_width > width)
			{
			cout << endl;
			cout << str + " ";
			current_line_width = str.size()+1;
			}
			else
			{
			cout << str + " ";
			}
			});
	cout << endl;
}

int main(int argc, char* argv[])
{
	string prog_name{argv[0]};

	if (argc == 1)
	{
		cerr << "Error: No arguments given.\n"
			<< "Usage: " << prog_name
			<< " FILE [-a] [-f] [-o N]" << endl;
		return 1;
	}
	string file_name {argv[1]};

	if (argc == 2)
	{
		cerr << "Error: Second argument missing or invalid.\n"
			<< "Usage: " << prog_name << " " << file_name
			<< " [-a] [-f] [-o N]" << endl;
		return 1;
	}
	string flag {argv[2]};

	ifstream file {file_name};
	if (!file)
	{
		cerr << "Error: Unable to read file '"
			 << file_name << "'." << endl;
		return 1;
	}

	vector<string> raw_words {};
	unordered_map<string, int> dict {};

	size_t longest_word_size {0};
	size_t highest_freq_length {0};

	string word{};
	while(file >> word)
	{
		string cleaned_word {clean_word(word)};
		if (valid_word(cleaned_word))
		{
			transform(begin(cleaned_word), end(cleaned_word),
					begin(cleaned_word), ::tolower);

			if (flag == "-o")
			{
				raw_words.push_back(cleaned_word);
			}
			else
			{
				dict[cleaned_word]++;
			}

			if(cleaned_word.size() > longest_word_size)
			{
				longest_word_size = cleaned_word.size();
			}

			if(to_string(dict[cleaned_word]).size() > highest_freq_length)
			{
				highest_freq_length = to_string(dict[cleaned_word]).size();
			}
		}
	}

	if(flag == "-a")
	{
		flag_a(dict, longest_word_size, highest_freq_length);
	}
	else if (flag == "-f")
	{
		flag_f(dict, longest_word_size, highest_freq_length);
	}
	else if (flag == "-o")
	{
		if(argc == 3)
		{
			cerr << "Error: Missing width.\n"
				 << "Usage: " << prog_name << " "
				 << file_name << "-o N" << endl;
			return 1;
		}

		string input_width {argv[3]};
		int width{};
		if(argc == 4)
		{
			try
			{
				width = stoi(input_width);
			}
			catch(...)
			{
				cerr << "Error: Invalid width.\n"
					 << "Usage: " << prog_name << " "
					 << file_name << " -o N" << endl;
				return 1;
			}
		}

		flag_o(raw_words, width);
	}
	else
	{
		cerr << "Error: Second argument invalid.\n"
			 << "Usage: " << prog_name << " " << file_name
			 << " [-a] [-f] [-o N]" << endl;
	}

	return 0;
}
