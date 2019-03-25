#include <string>
#include <SFML/Graphics.hpp>
#include <SFML/Audio.hpp>

#include "mixin.h"
#include "wall.h"
#include "enemy.h"
#include "player.h"
#include "bullet.h"
#include "world.h"
#include "sounds.h"

#include <iostream>

using namespace std;
using namespace sf;

Player::Player(float pos_x, float pos_y, string name)
	: Controllable(pos_x, pos_y, "Player"), Collidable(pos_x, pos_y, "Player"),
	Renderable(pos_x, pos_y, "Player"), Destructible(3)
{
	score = 0;
	resize(100, 100);
}

void Player::Move(double time_factor)
{
	Normalize();

	Vector2f cur_pos = sprite.getPosition();
	cur_pos.x += velocity_x * time_factor;
	cur_pos.y += velocity_y * time_factor;

	if(cur_pos.x < 0)
	{
		cur_pos.x = 0;
	}
	else if(cur_pos.x > x_limit - width)
	{
		cur_pos.x = x_limit - width;
	}

	if(cur_pos.y < 0)
	{
		cur_pos.y = 0;
	}
	else if(cur_pos.y > y_limit - height)
	{
		cur_pos.y = y_limit - height;
	}

	sprite.setPosition(cur_pos);
}

void Player::Control(double time_factor)
{
	double velocity = 500;
	max_velocity = velocity;
	velocity_x = 0;
	velocity_y = 0;

	if (shoot_cooldown > 0)
	{
		shoot_cooldown -= time_factor;
	}

	// WASD
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::W))
	{
		velocity_y = -velocity;
	}
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::A))
	{
		velocity_x = -velocity;
	}
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::S))
	{
		velocity_y = velocity;
	}
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::D))
	{
		velocity_x = velocity;
	}
	if (sf::Mouse::isButtonPressed(sf::Mouse::Left))
	{
		if (shoot_cooldown <= 0)
		{
			Vector2f cur_pos = sprite.getPosition();
			Vector2i mouse_pos = sf::Mouse::getPosition(*World::win);

			Bullet* b {new Bullet(cur_pos.x + width/2 - 10, cur_pos.y + height/2 - 10, mouse_pos.x - 10, mouse_pos.y - 10, 1500)};

			World::add_renderable(b);

			shoot_cooldown = 1.0/8.0;

			SoundManager::PlaySound("Bullet");
		}
	}
}

void Player::Collide(Collidable* collider)
{
	Enemy* pEn {dynamic_cast<Enemy*>(collider)};
	if(pEn != nullptr){
		Hurt(1);
	}

	WallSection* pWS {dynamic_cast<WallSection*>(collider)};
	if(pWS != nullptr)
	{
		Hurt(1);
	}
}

void Player::Hurt(int damage)
{
	if (invincibility_time <= 0)
	{
		SoundManager::PlaySound("Hurt");
		health -= damage;
		invincibility_time = 1;
	}

	if (health == 0)
	{
		Destroy();
	}
}

void Player::Destroy()
{
	World::game_over();
}

void Player::IncreaseScore(double inc)
{
	score += inc;
}

double Player::GetScore() const
{
	return score;
}
