#include <SFML/Graphics.hpp>
#include <cmath>

#include "mixin.h"
#include "wall.h"
#include "bullet.h"
#include "enemy.h"
#include "world.h"

using namespace std;
using namespace sf;

Bullet::Bullet(float pos_x, float pos_y, float target_pos_x, float target_pos_y, int _max_velocity)
	: Collidable(pos_x, pos_y, "Bullet"), Moveable(pos_x, pos_y, "Bullet"), Destructible(1), Renderable(pos_x, pos_y, "Bullet")
{
	resize(20, 20);

	// Sets correct velocity to reach target position.
	max_velocity = _max_velocity;
	velocity_x = target_pos_x - pos_x;
	velocity_y = target_pos_y - pos_y;
	double current_length = sqrt(velocity_x * velocity_x +velocity_y * velocity_y);

	// Sets the total length to 1 unit.
	velocity_x = velocity_x/current_length;
	velocity_y = velocity_y/current_length;

	// Extends the vector to the maximum speed.
	velocity_x *= max_velocity;
	velocity_y *= max_velocity;
}

void Bullet::Move(double time_factor)
{
	Vector2f cur_pos {sprite.getPosition()};
	float cur_x {cur_pos.x};
	float cur_y {cur_pos.y};

	cur_x += velocity_x * time_factor;
	cur_y += velocity_y * time_factor;

	sprite.setPosition(cur_x, cur_y);
	if (cur_x > 3000 || cur_x < -3000 || cur_y > 3000 || cur_y < -3000)
	{
		Destroy();
	}
}

void Bullet::Collide(Collidable* collider)
{
	Enemy* pEn {dynamic_cast<Enemy*>(collider)};
	if(pEn != nullptr)
	{
		pEn->Hurt(1);
		Destroy();
		return;
	}

	WallSectionDestructible* pWSD {dynamic_cast<WallSectionDestructible*>(collider)};
	if(pWSD != nullptr)
	{
		pWSD->Hurt(1);
		Destroy();
		return;
	}

	WallSection* pWS {dynamic_cast<WallSection*>(collider)};
	if(pWS != nullptr)
	{
		Destroy();
		return;
	}
}

void Bullet::Hurt(int damage)
{
	Destroy();
}

void Bullet::Destroy()
{
	World::remove_renderable(this);
}
