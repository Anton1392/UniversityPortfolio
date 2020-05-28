// PrimeSieve.cpp : Defines the entry point for the console application.
//

#include <list>
#include <vector>
#include <iostream>
#include <math.h>

using namespace std;

int isPrime(int n);

int main()
{
	list<int> indPrimes;

	int n;
	int q;
	cin >> n;
	cin >> q;
	for (int i = 0; i < q; i++)
	{
		int j;
		cin >> j;
		indPrimes.push_back(j);
	}

	vector<bool> sieve(n-1, false);
	int size = sieve.size();
	int biggestSqrt = sqrt(size + 2);

	int sieve_idx = 0;
	for (bool s : sieve)
	{
		if (s == false)
		{
			int p = sieve_idx + 2;
			
			if (p > biggestSqrt)
			{
				break;
			}

			for (int i = sieve_idx+p; i < size; i+=p)
			{
				sieve[i] = true;
			}
		}
		sieve_idx++;
	}

	int count = 0;
	for (bool b : sieve)
	{
		if (b == false)
		{
			count++;
		}
	}

	cout << count << endl;

	for (int p : indPrimes)
	{
		cout << isPrime(p) << endl;
	}

	return 0;
}

int isPrime(int n)
{
	if (n == 1) { return 0; }
	if (n == 2) { return 1; }
	int lim = ceil(sqrt(n));

	for (int x = 2; x <= lim; x++)
	{
		if (n%x == 0)
		{
			return 0;
		}
	}

	return 1;
}