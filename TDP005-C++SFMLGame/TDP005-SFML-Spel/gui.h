#ifndef GUI_H
#define GUI_H

#include "mixin.h"

// This class handles GUI visuals that need logic, such as how much health the player has.
class GUI
{
	public:
		// The vector that stores all items the gui handles.
		static std::vector<Renderable*> GUIitems;

		// Remakes all GUI items to be up to date.
		static void UpdateGUI();

		// Clears all GUI items.
		static void RemoveAll();
};

#endif
