#ifndef TOOLS_H
#define TOOLS_H

#include <utility>
#include <random>

// Returns a vector with the same angle but with the length of one.
std::pair<double, double> unit_vector(double x, double y);

// Used for counting up to a particular time, then doing something.
class Timer
{
	public:
		Timer(double interval);
		virtual ~Timer() = default;
		Timer(const Timer& obj) = delete;
		Timer(const Timer&& obj) = delete;

		// Counts up, returning true if the time is reached.
		bool tick(double delta_time);

		// Multiplies the interval to make it shorter.
		void speed_up(double interval_multiplier);

	protected:
		double stored_time;
		double interval;
};

// Easy to use class for rolling random numbers.
class Die
{
	public:
		Die(int sides);
		~Die() = default;
		Die(const Die& obj) = delete;
		Die(const Die&& obj) = delete;

		// Rolls a random number from 0 to the amount of sides.
		int roll();

		void set_sides(int sides);
		int get_sides() const;
	private:
		int sides;
		std::random_device rd;
		std::uniform_int_distribution<int> dist;
};

#endif
