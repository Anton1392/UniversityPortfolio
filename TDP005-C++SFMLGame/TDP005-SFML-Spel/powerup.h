#ifndef POWERUP_H
#define POWERUP_H

// Powerups can be collided with.
// Upon collision their effects are applied.
class Powerup : public Collidable
{
	public:
		Powerup(float pos_x, float pos_y, std::string texture_name);
		virtual ~Powerup() = default;
		Powerup(const Powerup& obj) = delete;
		Powerup(const Powerup&& obj) = delete;
};


// This powerup heals the player.
class PowerupHealth : public Powerup
{
	public:
		PowerupHealth(float pos_x, float pos_y);
		~PowerupHealth() = default;
		PowerupHealth(const PowerupHealth& obj) = delete;
		PowerupHealth(const PowerupHealth&& obj) = delete;

		void Collide(Collidable* collider) override;
		Renderable* clone(float pos_x, float pos_y) const;
};

#endif
