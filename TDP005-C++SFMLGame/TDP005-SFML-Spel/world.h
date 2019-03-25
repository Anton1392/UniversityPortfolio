#ifndef WORLD_H
#define WORLD_H

#include "player.h"

// The class responsible for running the game.
class World
{
	public:
		World();
		~World();
		World(const World& obj) = delete;
		World(const World&& obj) = delete;

		// Most important method.
		// Starts the game!
		void run_game();

		// Handles the list of renderable objects in the world.
		static void add_renderable(Renderable*);
		static void remove_renderable(Renderable*);
		static void remove_all();

		// Draws every renderable object.
		void render();

		// Applies game logic to every object in the world.
		void tick(double time_factor);

		// Handles the player reference.
		void add_player(Player* p);
		static Player* player;

		// The window everything is drawn in.
		static sf::RenderWindow* win;

		// Functions for when the game is over.
		static void game_over();
		static bool is_game_over;

	private:
		// Stores all game-objects in the world.
		static std::vector<Renderable*> renderables;
};

#endif
