#include <SFML/Graphics.hpp>
#include <string>
#include <iostream>

#include "tools.h"
#include "mixin.h"
#include "world.h"
#include "enemy.h"
#include "wall.h"
#include "powerup.h"

#include "spawner.h"

Spawner::Spawner(Renderable* obj, World* world, double interval, int chance,
                 float x, float y)
    : Timer(interval), copy{obj}, world{world}, die{chance}, x_pos{x}, y_pos{y}
{}

Spawner::~Spawner()
{
	// Clears the copy
    if (copy != nullptr)
    {
        delete copy;
        copy = nullptr;
    }
}

void Spawner::spawner_tick(double time_delta)
{
    if (tick(time_delta) && die.roll() == 1)
    {
		Renderable* new_object{copy->clone(x_pos, y_pos)};
		world->add_renderable(new_object);
	}
}

void Spawner::set_chance(int chance)
{
	die.set_sides(chance);
}

int Spawner::get_chance() const
{
	return die.get_sides();
}

void Spawner::set_pos(float x, float y)
{
	x_pos = x;
	y_pos = y;
}

