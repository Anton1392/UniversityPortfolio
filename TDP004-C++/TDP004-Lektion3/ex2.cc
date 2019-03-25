#include <iostream>

using namespace std;

class Vehicle
{
	public:
		Vehicle(int wc, double ms)
		{
			wheel_count = wc;
			if (wheel_count < 0)
			{
				wheel_count = 0;
			}

			max_speed = ms;
			if (wheel_count >= 6 && max_speed > 100)
			{
				max_speed = 100;
			}
		}
		void Drive(int A, int B){}

		int wheel_count;
		double max_speed;
};

class PassengerVehicle : public Vehicle
{
	public:
		PassengerVehicle(int wheel_count, double max_speed, int seat_count)
			: Vehicle{wheel_count, max_speed}, seat_count{seat_count}
		{}


	private:
		int seat_count;
		void Escape(){}
};

class FreightVehicle : public Vehicle
{
	public:
		FreightVehicle(int wheel_count, double max_speed, int max_load)
			: Vehicle{wheel_count, max_speed}, max_load{max_load}
		{}

	private:
		int max_load;
		void Load(){}
		void Unload(){}
};

int main()
{
	Vehicle v {6, 150};
	cout << v.max_speed << endl;
}
