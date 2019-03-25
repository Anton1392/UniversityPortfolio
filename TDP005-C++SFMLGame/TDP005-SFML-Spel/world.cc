#include <SFML/Graphics.hpp>
#include <iostream>
#include <string>
#include <sstream>
#include <cmath>

#include "tools.h"
#include "mixin.h"
#include "player.h"
#include "enemy.h"
#include "world.h"
#include "wall.h"
#include "powerup.h"
#include "spawner.h"
#include "sounds.h"
#include "gui.h"

#include <iostream> //debug

using namespace std;
using namespace sf;


sf::RenderWindow* World::win;
std::vector<Renderable*> World::renderables{};
Player* World::player{};
bool World::is_game_over {false};

World::World()
{
	Renderable::load_textures();
	SoundManager::LoadSounds();

	int win_size_x {1200};
	int win_size_y {800};
	sf::RenderWindow* _win = new sf::RenderWindow(sf::VideoMode(win_size_x, win_size_y), "Generic Space Shooter");
	_win->setVerticalSyncEnabled(true);

	World::win = _win;

	World::add_renderable(new Renderable(0, 0, "Background"));

	Player* p = new Player {200, 200, "George"};
	p->set_limits(1200, win_size_y);
	World::add_renderable(p);
	World::add_player(p);
}

World::~World()
{
	remove_all();
}

void World::run_game()
{
	Clock frame_timer;

	double elapsed_time {0};
	double speed_up_timer {0};
	double speed_up_interval {4};
	double speed_up_multiplier {0.95};
	int speed_ups {0};
	int speed_ups_upgrade {5};

	Vector2u win_size{win->getSize()};
	int win_size_x {win_size.x};
	int win_size_y {win_size.y};

	vector<Spawner*> spawns{};
	// Enemy spawners
	int s_amount{5};
	for (int i{0}; i < s_amount; i++)
	{
		int chance {8};
		double interval {3};

		float x1{(float)win_size_x/s_amount * i};
		float y1{(float)win_size_y};
		Spawner* s1 = new Spawner{new Enemy{0, 0}, this, interval, chance, x1, y1};
		spawns.push_back(s1);

		float x2{x1};
		float y2{-150};
		Spawner* s2 = new Spawner{new Enemy{0, 0}, this, interval, chance, x2, y2};
		spawns.push_back(s2);
	}

	// Wall spawners
	for (int i{0}; i < 5; i++)
	{
		int chance {15};
		double interval {3};
		float x{(float)win_size_x};
		float y{(float)win_size_y/5 + 200*i};
		Spawner* ws {new Spawner{new WallSection{0, 0, "WallSection"}, this, interval, chance, x, y}};;
		spawns.push_back(ws);

		// More destructibles than regular walls
		chance = 15;
		interval = 2;
		Spawner* wsd {new Spawner{new WallSectionDestructible{0, 0, "WallSectionDestructible"}, this, interval, chance, x, y}};;
		spawns.push_back(wsd);
	}

	// Powerup spawner
	{
		// x and y constructor values don't matter as they spawn randomly within arena, check spawner.cc for implementation.
		// Health spawns every 30s at the moment.
		Spawner* phs {new Spawner{new PowerupHealth{0, 0}, this, 30, 1, 0, 0}};
		spawns.push_back(phs);
	}


	//const double PI {3.14159265}; // For rotation
	bool game_over {false};
	while (win->isOpen())
	{
		sf::Event event;
		while (win->pollEvent(event))
		{
			switch (event.type)
			{
				case sf::Event::Closed:
					{
						game_over = true;
					}
			}
		}
		if (game_over || is_game_over)
		{
			for (Spawner* s : spawns)
			{
				delete s;
			}
			World::game_over();
			game_over = true;
			break;
		}
		else
		{

			Time delta_time {frame_timer.getElapsedTime()};
			frame_timer.restart();

			double dt {delta_time.asMicroseconds()/1000000.0f};

			elapsed_time += dt;
			speed_up_timer += dt;

			World::player->IncreaseScore(dt*10);

			// Ticks, then checks for speed ups.
			for (Spawner* s : spawns)
			{
				s->spawner_tick(dt);
			}
			if (speed_up_timer > speed_up_interval) 
			{
				speed_up_timer = 0;
				speed_ups++;
				for (Spawner* s : spawns)
				{
					// Exclude powerup speedup
					Powerup* pptr {dynamic_cast<Powerup*>(s->copy)};
					if(pptr == nullptr)
					{
						if (speed_ups%speed_ups_upgrade == 0)
						{
							int chance {s->get_chance()};
							if (chance > 2)
							{
								s->set_chance(chance-1);
							}
						}
						s->speed_up(speed_up_multiplier);
					}
				}
			}

			render();
			tick(dt);
		}
	}
}

void World::add_renderable(Renderable* obj)
{
	renderables.push_back(obj);
}

void World::remove_renderable(Renderable* obj)
{
	for (int i = 0; i < renderables.size(); i++)
	{
		if (renderables[i] == obj)
		{
			renderables.erase(renderables.begin()+i);
			delete obj;
		}
	}
}

void World::remove_all()
{
	for ( Renderable* obj : renderables)
	{
		delete obj;
	}
	renderables.clear();
}

void World::render()
{
	win->clear();

	for(Renderable* r : renderables)
	{
		win->draw(r->get_sprite());
	}

	GUI::UpdateGUI();
	for(Renderable* g : GUI::GUIitems)
	{
		win->draw(g->get_sprite());
	}

	win->display();
}

void World::tick(double time_factor)
{
	for (Renderable* obj : renderables)
	{
		if(is_game_over) // Prevents a segmentation fault.
		{
			break;
		}

		//Controls every controllable thing
		Controllable* pCon {dynamic_cast<Controllable*>(obj)};
		if(pCon != nullptr)
		{
			pCon->Control(time_factor);
		}

		// Moves every moveable thing
		Moveable* pMov {dynamic_cast<Moveable*>(obj)};
		if(pMov != nullptr)
		{
			pMov->Move(time_factor);
		}

		// Reduced invincibility time on all destructible objects.
		Destructible* pDest {dynamic_cast<Destructible*>(obj)};
		if(pDest != nullptr)
		{
			pDest->ReduceInvincibilityTime(time_factor);
		}

		// Collides every collidable thing
		Collidable* pCol {dynamic_cast<Collidable*>(obj)};
		if(pCol != nullptr)
		{
			for (Renderable* r : renderables)
			{
				Collidable* pCol2 {dynamic_cast<Collidable*>(r)};
				if(pCol2 != nullptr && pCol != pCol2)
				{
					if(pCol->IsCollidingWith(*pCol2))
					{
						pCol->Collide(pCol2);
						break;
					}
				}
			}
		}

	}
}

void World::add_player(Player* p)
{
	World::player = p;
}

void World::game_over()
{
	if (!World::is_game_over)
	{
		World::is_game_over = true;
		stringstream strs{};
		strs << round(player->GetScore());
		cout << "Final score: " + strs.str() << endl;
		GUI::RemoveAll();
		World::remove_all();
	}
}
