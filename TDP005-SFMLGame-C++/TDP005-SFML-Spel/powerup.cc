#include <SFML/Graphics.hpp>
#include <string>

#include "world.h"
#include "player.h"
#include "mixin.h"
#include "powerup.h"
#include "sounds.h"
#include "tools.h"

using namespace std;
using namespace sf;

Powerup::Powerup(float pos_x, float pos_y, string texture_name)
	: Collidable(pos_x, pos_y, texture_name), Renderable(pos_x, pos_y, texture_name)
{
	resize(50, 50);
}


PowerupHealth::PowerupHealth(float pos_x, float pos_y)
	: Powerup(pos_x, pos_y, "PowerupHealth"), Renderable(pos_x, pos_y, "PowerupHealth")
{
}

void PowerupHealth::Collide(Collidable* collider)
{
	Player* pPl {dynamic_cast<Player*>(collider)};
	if(pPl != nullptr)
	{
		SoundManager::PlaySound("Health");
		pPl->Hurt(-1);
		World::remove_renderable(this);
	}
}

Renderable* PowerupHealth::clone(float pos_x, float pos_y) const
{
	Die dieX{World::win->getSize().x};
	Die dieY{World::win->getSize().y};

	return new PowerupHealth(dieX.roll(), dieY.roll());
}
