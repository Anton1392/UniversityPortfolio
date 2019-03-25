#include <SFML/Graphics.hpp>
#include <string>

#include "enemy.h"
#include "player.h"
#include "world.h"
#include "tools.h"
#include "sounds.h"

using namespace std;
using namespace sf;

Enemy::Enemy(float pos_x, float pos_y)
	:Moveable(pos_x, pos_y, "Enemy1"), Collidable(pos_x, pos_y, "Enemy1"),
	Renderable(pos_x, pos_y, "Enemy1"), Destructible(1)
{
	resize(150, 150);
}

void Enemy::Move(double time_factor)
{
	if(World::player != nullptr)
	{
		max_velocity = 120;

		pair<double, double> pos{World::player->get_pos()};
		double player_x{pos.first};
		double player_y{pos.second};

		Vector2f cur_pos = sprite.getPosition();

		double x{player_x - cur_pos.x};
		double y{player_y - cur_pos.y};

		pair<double, double> unit{unit_vector(x,y)};
		double velocity_x {unit.first};
		double velocity_y {unit.second};

		cur_pos.x += velocity_x * max_velocity * time_factor;
		cur_pos.y += velocity_y * max_velocity * time_factor;

		sprite.setPosition(cur_pos);
	}
}

void Enemy::Collide(Collidable* collider)
{
}

void Enemy::Hurt(int damage)
{
	SoundManager::PlaySound("Hitmarker");
	health -= damage;
	if(health <= 0)
	{
		Destroy();
	}
}

void Enemy::Destroy()
{
	World::remove_renderable(this);
}

Renderable* Enemy::clone(float pos_x, float pos_y) const
{
	return new Enemy(pos_x, pos_y);
}
