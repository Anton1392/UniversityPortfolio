#ifndef PLAYER_H
#define PLAYER_H

#include "mixin.h"
#include <SFML/Audio.hpp>

// The player is an object that can be controlled, collided with, and destroyed.
class Player : public Controllable, public Collidable, public Destructible
{
	public:
		Player(float pos_x, float pos_y, std::string name);
		~Player() = default;
		Player(const Player& obj) = delete;
		Player(const Player&& obj) = delete;

		void Move(double time_factor) override;
		void Control(double time_factor) override;
		void Collide(Collidable* collider) override;
		void Hurt(int damage) override;
		void Destroy() override;
		void IncreaseScore(double d);
		double GetScore() const;

	protected:
		std::string name;
		double score;

		// The player has a limited bullet firing rate. 
		double shoot_cooldown{};
};


#endif
