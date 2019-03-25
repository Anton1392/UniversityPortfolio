#ifndef AABB_H
#define AABB_H

struct Point
{
	// Default constructor due to SDL compatability.
  	Point() = default;
	Point( int x, int y );
 	int x {};
  	int y {};
};

class AABB
{
	public:
		AABB(int const & _top, int const & _left,
		     int const & _bottom, int const & _right);
		AABB(Point const & top_left, Point const & bottom_right);
		bool contain(int const & x, int const & y) const;
		bool contain(Point const & p) const;
		bool intersect(AABB const & a) const;
		AABB min_bounding_box(AABB a);
		Point get_point() const;
		bool will_not_collide(AABB from, Point const & to);
		void move_box(int const & x, int const & y);
		bool collision_point(AABB const & from, Point const & to, Point & where);

	private:
		int top;
		int left;
		int bottom;
		int right;
};

#endif
