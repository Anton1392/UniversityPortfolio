#include <SFML/Graphics.hpp>
#include <vector>
#include <cmath>
#include <string>

#include "mixin.h"

#include <iostream>

using namespace std;
using namespace sf;

std::map<string, Texture> Renderable::texture_list;

Renderable::Renderable(float pos_x, float pos_y, string texture_name)
{
	sprite.setPosition(pos_x, pos_y);
	sprite.setTexture(texture_list[texture_name]);
}

sf::Sprite Renderable::get_sprite() const
{
	return sprite;
}

pair<double, double> Renderable::get_pos() const
{
	double x {Renderable::get_sprite().getPosition().x};
	double y {Renderable::get_sprite().getPosition().y};
	return make_pair(x,y);
}

void Renderable::load_textures()
{
	sf::Texture t;
	t.loadFromFile("Textures/player.png");
	texture_list["Player"] = t;

	t.loadFromFile("Textures/background.png");
	texture_list["Background"] = t;

	t.loadFromFile("Textures/enemy1.png");
	texture_list["Enemy1"] = t;

	t.loadFromFile("Textures/bullet.png");
	texture_list["Bullet"] = t;

	t.loadFromFile("Textures/wallsection.png");
	texture_list["WallSection"] = t;

	t.loadFromFile("Textures/wallsectiondestructible.png");
	texture_list["WallSectionDestructible"] = t;

	t.loadFromFile("Textures/poweruphealth.png");
	texture_list["PowerupHealth"] = t;

	t.loadFromFile("Textures/heart.png");
	texture_list["Heart"] = t;
}

void Renderable::resize(float target_x, float target_y)
{
	// Sets the correct sprite size.
	float cur_x {sprite.getLocalBounds().width};
	float cur_y {sprite.getLocalBounds().height};

	double width_scale = target_x/cur_x;
	double height_scale = target_y/cur_y;

	width = width_scale * cur_x;
	height = height_scale * cur_y;

	sprite.setScale(width_scale, height_scale);
}

void Renderable::rotate(double rotation)
{
	sprite.setRotation(rotation);
}

void Renderable::set_position(float pos_x, float pos_y)
{
	sprite.setPosition(pos_x, pos_y);
}

Renderable* Renderable::clone(float pos_x, float pos_y) const
{
	return new Renderable(pos_x, pos_y, "");
}

Moveable::Moveable(float pos_x, float pos_y, string texture_name)
	:Renderable(pos_x, pos_y, texture_name)
{
}

void Moveable::set_limits(int x, int y)
{
	x_limit = x;
	y_limit = y;
}

void Moveable::Normalize()
{
	double current_length = sqrt(velocity_x * velocity_x +velocity_y * velocity_y);

	// If the speed limit is broken.
	if (current_length > max_velocity)
	{
		// Sets the total length to 1 unit.
		velocity_x = velocity_x/current_length;
		velocity_y = velocity_y/current_length;

		// Extends the vector to the maximum speed.
		velocity_x *= max_velocity;
		velocity_y *= max_velocity;
	}
}

Controllable::Controllable(float pos_x, float pos_y, string texture_name)
	:Moveable(pos_x, pos_y, texture_name), Renderable(pos_x, pos_y, texture_name)
{
}

Collidable::Collidable(float pos_x, float pos_y, string texture_name)
	:Renderable(pos_x, pos_y, texture_name)
{
}

bool Collidable::IsCollidingWith(Collidable& collider) const
{
	Sprite original {get_sprite()};
	Sprite other {collider.get_sprite()};

	// If one sprite is on the left side of the other, there is no overlap.
	if(original.getPosition().x >
			(other.getPosition().x + other.getGlobalBounds().width))
	{
		return false;
	}
	if(other.getPosition().x >
			(original.getPosition().x + original.getGlobalBounds().width))
	{
		return false;
	}

	// If one sprite is above the other, there is no overlap.
	if(original.getPosition().y >
			(other.getPosition().y + other.getGlobalBounds().height))
	{
		return false;
	}
	if(other.getPosition().y >
			(original.getPosition().y + original.getGlobalBounds().height))
	{
		return false;
	}

	// Otherwise they overlap
	return true;
}

Destructible::Destructible(int _health)
{
	health = _health;
}

void Destructible::Hurt(int damage)
{
	if(invincibility_time <= 0)
	{
		health -= damage;
		if(health <= 0)
		{
			health = 0;
			Destroy();
		}
	}
}

void Destructible::ReduceInvincibilityTime(double reduction)
{
	invincibility_time -= reduction;
	if(invincibility_time < 0)
	{
		invincibility_time = 0;
	}
}

int Destructible::GetHealth() const
{
	return health;
}
