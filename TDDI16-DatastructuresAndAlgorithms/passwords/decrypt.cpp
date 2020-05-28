#include <iostream>
#include <chrono>
#include <unordered_map>
#include <cmath>
#include <vector>
#include "key.h"

using namespace std;

string generate_step(int l, int i);

struct myHash
{
    std::size_t operator()(Key const& k) const noexcept
    {
		size_t hash = 0;

		// Translates all bits of the key to a number.
		for (int i = 0; i < N; i++)
		{
			hash = hash ^ k.bit(i) << i;
		}
		return hash;
	}
};

int main(int argc, char* argv[]) {
	if (argc != 2) {
		cout << "Usage:" << endl;
		cout << argv[0] << " <hashed password> < rand8.txt" << endl;
		return 1;
	}

	// Hashed password.
	Key hashed{argv[1]};

	// Table.
	Key table[N];


	// Read table.
	for (int i{0}; i < N; i++) {
		char buffer[C + 1];
		if (scanf("%s", buffer) != 1) {
			cerr << "Too short table!" << endl;
			return 1;
		}
		table[i] = Key{buffer};
	}

	auto begin = chrono::high_resolution_clock::now();

	// Find all possible passwords that hash to 'hashed' and print them.
	unordered_map<Key, vector<Key>, myHash> hashMap;

	// Password = xxxxxxxx
	// Brute force first half of password: xxxxaaaa, memorize in map.
	int half = C/2;

	Key candidate{};
	for(int i = 0; i < pow(R, half); i++)
	{
		Key enc = subset_sum(candidate, table);

		if(hashMap.find(hashed-enc) == hashMap.end())
		{
			hashMap[hashed-enc] = vector<Key>();
		}
		hashMap[hashed-enc].push_back(candidate);

		candidate++;
	}

	Key step = candidate; // Becomes aaabaaaa in case of 8-char password.

	for(int i = 0; i < pow(R, C-half); i++)
	{
		Key enc = subset_sum(candidate, table);

		if(hashMap.find(enc) != hashMap.end())
		{
			// Iterate through all collisions
			vector<Key> v = hashMap[enc];
			for(Key k : v)
			{
				// Print matching password
				Key res = candidate + k;
				cout << res << endl;
			}
		}

		candidate+=step;
	}


	auto end = chrono::high_resolution_clock::now();
	cout << "Decryption took "
		<< std::chrono::duration_cast<chrono::seconds>(end - begin).count()
		<< " seconds." << endl;

	return 0;
}
