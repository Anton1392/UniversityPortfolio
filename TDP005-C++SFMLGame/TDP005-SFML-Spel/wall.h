#ifndef WALL_H
#define WALL_H

// A piece of wall traveling across the screen.
// It can move and collide with objects.
class WallSection: public Moveable, public Collidable			  
{
	public:
		WallSection(float pos_x, float pos_y, std::string texture_name);
		virtual ~WallSection() = default;
		WallSection(const WallSection& obj) = delete;
		WallSection(const WallSection&& obj) = delete;

		void Move(double time_factor) override;
		void Collide(Collidable* collider) override;
		Renderable* clone(float pos_x, float pos_y) const;
};

// A different piece of wall.
// This can also be destroyed.
class WallSectionDestructible: public WallSection, public Destructible
{
	public:
		WallSectionDestructible(float pos_x, float pos_y, std::string texture_name);
		~WallSectionDestructible() = default;
		WallSectionDestructible(const WallSectionDestructible& obj) = delete;
		WallSectionDestructible(const WallSectionDestructible&& obj) = delete;

		void Hurt(int damage) override;
		void Destroy() override;
		Renderable* clone(float pos_x, float pos_y) const;
};

#endif
