#ifndef BULLET_H
#define BULLET_H

#include "mixin.h"

// A bullet object. The player shoots these.
// It can move, collide, and be destroyed.
class Bullet : public Moveable, public Collidable, public Destructible
{
	public:
		Bullet(float pos_x, float pos_y, float target_pos_x, float target_pos_y, int max_velocity);
		~Bullet() = default;
		Bullet(const Bullet& obj) = delete;
		Bullet(const Bullet&& obj) = delete;

		void Move(double time_factor) override;
		void Collide(Collidable* collider) override;
		void Hurt(int damage) override;
		void Destroy() override;

	private:
		int width;
		int height;
};

#endif
