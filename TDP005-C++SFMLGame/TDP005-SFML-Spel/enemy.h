#ifndef ENEMY_H
#define ENEMY_H

#include "mixin.h"

// An enemy. On collision with the player, the player takes damage.
// On collision with bullets, enemies take damage.
class Enemy : public Moveable, public Collidable, public Destructible
{
	public:
		Enemy(float pos_x, float pos_y);
		~Enemy() = default;
		Enemy(const Enemy& obj) = delete;
		Enemy(const Enemy&& obj) = delete;

		void Move(double time_factor) override;
		void Collide(Collidable* collider) override;
		void Hurt(int damage) override;
		void Destroy() override;
		Renderable* clone(float pos_x, float pos_y) const;

	private:
		// Properties of the enemy.
		int width;
		int height;
		double speed;
};

#endif
