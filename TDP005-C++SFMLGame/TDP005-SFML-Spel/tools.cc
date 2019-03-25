#include <cmath>
#include <iostream>

#include "tools.h"

using namespace std;

pair<double, double> unit_vector(double x, double y)
{
	double hyp {hypot(x,y)};
	double x_result {x/hyp};
	double y_result {y/hyp};
	pair<double, double> unit{make_pair(x_result, y_result)};
	return unit;
}

Timer::Timer(double interval)
	: interval{interval}, stored_time{0}
{}

bool Timer::tick(double delta_time)
{
	stored_time += delta_time;
	if (stored_time >= interval)
	{
		stored_time = 0;
		return true;
	}
	return false;
}

void Timer::speed_up(double interval_multiplier)
{
	if (interval_multiplier >= 0)
	{
		interval *= interval_multiplier;
	}
	else
	{
		cerr << "Timer requires positive interval multiplier." << endl;
	}
}

Die::Die(int sides)
	: sides{sides}
{
	dist = std::uniform_int_distribution<int>(1,sides);
}

int Die::roll()
{
	return dist(rd);
	//random device
	//uniform int distribution
}


void Die::set_sides(int sides)
{
	sides = sides;
}

int Die::get_sides() const
{
	return sides;
}
