#include <iostream>

using namespace std;

class Vehicle
{
	public:
		int wheel_count;
		double max_speed;
		void Drive();
};

class PassengerVehicle : public Vehicle
{
	public:
		int seat_count;
		void Escape();
};

class FreightVehicle : public Vehicle
{
	public:
		int max_load;
		void Load();
		void Unload();
};

int main()
{
}
