#ifndef MIXIN_H
#define MIXIN_H

////////////////////////////////////////////////
// A collection of base classes.
// Inherit from these to get certain properties.
////////////////////////////////////////////////


// Renderables can be shown on screen.
class Renderable
{
	public:
		Renderable(float pos_x, float pos_y, std::string texture_name);
		virtual ~Renderable() = default;
		Renderable(const Renderable& obj) = delete;
		Renderable(const Renderable&& obj) = delete;

		sf::Sprite get_sprite() const;

		// Loads all textures into memory.
		// It fills the private texture_list map.
		static void load_textures(); 

		std::pair<double, double> get_pos() const;
		void resize(float target_x, float target_y);
		void rotate(double rotation);
		void set_position(float pos_x, float pos_y);

		// Clones a renderable object
		virtual Renderable* clone(float pos_x, float pos_y) const;

	protected:
		sf::Sprite sprite;
		static std::map<std::string, sf::Texture> texture_list;
		int width;
		int height;
};

// Moveable objects can move using velocities.
// Every movable is a renderable.
class Moveable : public virtual Renderable
{
	public:
		Moveable(float pos_x, float pos_y, std::string texture_name);
		virtual ~Moveable() = default;
		Moveable(const Moveable& obj) = delete;
		Moveable(const Moveable&& obj) = delete;
		virtual void Move(double time_factor) = 0;

		// Limits how far the object can move in window coordinates.
		void set_limits(int x, int y);

	protected:
		// Sets the velocity vector to a length of the maximum speed.
		void Normalize();
		double max_velocity;
		double velocity_x;
		double velocity_y;
		int x_limit;
		int y_limit;
};

// Controllable objects are modified in some way through
// keyboard/mouse input. The player changes velocity
// depending on which keys are pressed.
class Controllable : public Moveable
{
	public:
		Controllable(float pos_x, float pos_y, std::string texture_name);
		virtual ~Controllable() = default;
		Controllable(const Controllable& obj) = delete;
		Controllable(const Controllable&& obj) = delete;

		virtual void Control(double time_factor) = 0;
};

// All collidable objects can collide with every other
// collidable object.
// The Collide function contains what happens on collision.
class Collidable : public virtual Renderable
{
	public:
		Collidable(float pos_x, float pos_y, std::string texture_name);
		virtual ~Collidable() = default;
		Collidable(const Collidable& obj) = delete;
		Collidable(const Collidable&& obj) = delete;

		virtual void Collide(Collidable* collider) = 0;
		bool IsCollidingWith(Collidable& collider) const;
};

// All destructible objects can be damaged and destroyed.
class Destructible
{
	public:
		Destructible(int health);
		virtual ~Destructible() = default;
		Destructible(const Destructible& obj) = delete;
		Destructible(const Destructible&& obj) = delete;

		virtual void Hurt(int damage);
		virtual void Destroy() = 0;

		// Some destructibles(the player mainly) become
		// invincible upon taking damage.
		void ReduceInvincibilityTime(double reduction);

		int GetHealth() const;

	protected:
		int health;
		double invincibility_time;
};

#endif
