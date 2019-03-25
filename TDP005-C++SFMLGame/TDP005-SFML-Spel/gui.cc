#include <SFML/Graphics.hpp>
#include <vector>
#include <string>
#include <sstream>
#include <cmath>
//#include <Text.hpp>

#include "gui.h"
#include "world.h"

using namespace std;
using namespace sf;

vector<Renderable*> GUI::GUIitems{};

void GUI::UpdateGUI()
{
	RemoveAll();

	// Update health values
	if (World::player != nullptr)
	{
		for (int i = 0; i < World::player->GetHealth() ; i++)
		{
			size_t pos_x {World::win->getSize().x - 50 - 50*i};
			size_t pos_y {World::win->getSize().y - 50};
			Renderable* heart {new Renderable(pos_x, pos_y, "Heart")};
			heart->resize(50, 50);
			GUIitems.push_back(heart);
		}
	}


	if(!World::is_game_over)
	{
		ostringstream strs;
		strs << round(World::player->GetScore());
		string score {strs.str()};
		string score_text {"Score: " + score};

		Font font;
		font.loadFromFile("Consolas.ttf");

		Text score_object {score_text, font};
		score_object.setString(score_text);
		score_object.setPosition(0,0);
		score_object.setCharacterSize(30);
		score_object.setColor(sf::Color::White);

		World::win->draw(score_object);
	}
}

void GUI::RemoveAll()
{
	for (Renderable* item : GUIitems)
	{
		if (item != nullptr)
		{
			delete item;
			item = nullptr;
		}
	}
	GUIitems.clear();
}
