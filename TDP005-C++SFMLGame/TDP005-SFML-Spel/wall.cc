#include <SFML/Graphics.hpp>

#include "mixin.h"
#include "world.h"
#include "wall.h"
#include "sounds.h"

using namespace std;
using namespace sf;

WallSection::WallSection(float pos_x, float pos_y, std::string texture_name):
	Moveable(pos_x, pos_y, texture_name), Collidable(pos_x, pos_y, texture_name),
	Renderable(pos_x, pos_y, texture_name)
{
	resize(200, 200);
	velocity_x = -150;
}

void WallSection::Move(double time_factor)
{
	Vector2f cur_pos = get_sprite().getPosition();
	double new_x {cur_pos.x + velocity_x * time_factor};
	double new_y {cur_pos.y};

	sprite.setPosition(new_x, new_y);
	if (new_x > 2000 || new_x < -2000 || new_y > 2000 || new_y < -2000)
	{
		World::remove_renderable(this);
	}
}

void WallSection::Collide(Collidable* collider)
{
}

Renderable* WallSection::clone(float pos_x, float pos_y) const
{
	return new WallSection(pos_x, pos_y, "WallSection");
}


WallSectionDestructible::WallSectionDestructible(float pos_x, float pos_y, std::string texture_name):
	WallSection(pos_x, pos_y, texture_name), Renderable(pos_x, pos_y, texture_name), Destructible(1)
{

}

void WallSectionDestructible::Hurt(int damage)
{
	SoundManager::PlaySound("Hitmarker");
	health -= damage;
	if (health <= 0)
	{
		Destroy();
	}
}

void WallSectionDestructible::Destroy()
{
	World::remove_renderable(this);
}

Renderable* WallSectionDestructible::clone(float pos_x, float pos_y) const
{
	return new WallSectionDestructible(pos_x, pos_y, "WallSectionDestructible");
}
