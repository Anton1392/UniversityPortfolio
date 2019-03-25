#include <algorithm>
#include <cmath>

#include "aabb.h"

//Komplettering: Ta bort era kommentarer som inte behövs.
//Ni har kommentarer innan en funktion vars namn beskriver
//vad den utför, detta behövs inte, det är därför vi har namn. Kolla igenom detta.
// FIXED

using namespace std;

Point::Point(int x, int y)
	: x {x}, y {y}
{
}


AABB::AABB(int const & _top, int const & _left, int const & _bottom, int const & _right)
	: top{_top}, left{_left}, bottom{_bottom}, right{_right}
{
	//Komplettering: 4-8. Ni ska korrigera det här felet
	//inte kasta ett undantag.
	// FIXED
	if (top >= bottom)
	{
		int temp = top;
		top = bottom;
		bottom = temp;
	}
	if(left >= right)
	{
		int temp = left;
		left = right;
		right = temp;
	}
}

//Komplettering: Använd er av konstruktorn över. Då slipper ni
//göra top>=bottom kollen också.
// FIXED

AABB::AABB(Point const & top_left, Point const & bottom_right)
	: AABB(top_left.y, top_left.x, bottom_right.y, bottom_right.x)
{
}

bool AABB::contain(int const & x, int const & y) const
{
	return (x >= left && x <= right) && (y >= top && y <= bottom);
}

bool AABB::contain(Point const & p) const
{
	return AABB::contain( p.x, p.y );
}

bool AABB::intersect(AABB const & a) const
{
	// If one rectangle is on the left side of the other, they do not overlap.
	if (left > a.right || a.left > right)
	{
		return false;
	}

	// If one rectangle is above the other, they do not overlap.
	if (top > a.bottom || a.top > bottom)
	{
		return false;
	}

	// Else they somehow overlap
	return true;
}

AABB AABB::min_bounding_box(AABB a)
{
	int min_top = min(top, a.top);
	int min_left = min(left, a.left);
	int max_bottom = max(bottom, a.bottom);
	int max_right = max(right, a.right);

	return AABB {min_top, min_left, max_bottom, max_right};
}

//Komplettering: 3-3. Om koden fungerar
//ska det inte finnas några debug utskrifter.
// FIXED

Point AABB::get_point() const
{
	return Point{left, top};
}

bool AABB::will_not_collide(AABB from, Point const & to)
{
	int height = from.bottom - from.top;
	int width = from.right - from.left;

	int end_bottom = to.y + height;
	int end_right = to.x + width;

	AABB end_box{to.y, to.x, end_bottom, end_right};

	AABB min_bound_box = from.min_bounding_box(end_box);

	return !intersect(min_bound_box);
}

void AABB::move_box(int const & x, int const & y)
{
	int width = right - left;
	int height = bottom - top;

	// New coordinates
	left   = x;
	right  = x + width;
	top    = y;
	bottom = y + height;
}

//Komplettering: Använd double. double > float. Double är alltid bättre.
//Double
// FIXED
bool AABB::collision_point(AABB const & from, Point const & to, Point & where)
{
	int dx {to.x - from.left};
	int dy {to.y - from.top};

	// Keeping the original box intact.
	AABB current_step_box = from;

	// Where is reset if no collision occurs.
	Point where_clone = where;

	double step_x;
	double step_y;

	// Saves direction (because size is absolute).
	int step_x_multiplier {1};
	int step_y_multiplier {1};
	if (dx < 0)
		step_x_multiplier = -1;
	if (dy < 0)
		step_y_multiplier = -1;

	if (abs(dx) > abs(dy))
	{
		step_x = 1 * step_x_multiplier;
		step_y = abs((double(dy)) / (double(dx))) * step_y_multiplier;
	}
	else
	{
		step_y = 1 * step_y_multiplier;
		step_x = abs((double(dx)) / (double(dy))) * step_x_multiplier;
	}

	double current_x{double(from.left)};
	double current_y{double(from.top)};

	while(current_step_box.get_point().x != to.x && current_step_box.get_point().y != to.y)
	{
		current_step_box.move_box(round(current_x), round(current_y));

		if (intersect(current_step_box))
		{
			return true;
		}

		where = current_step_box.get_point();

		current_x += step_x;
		current_y += step_y;
	}

	// If nothing is found, reset where to its original value.
	where = where_clone;
	return false;
}
