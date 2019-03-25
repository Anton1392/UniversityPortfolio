#ifndef SPAWNER_H
#define SPAWNER_H

#include "tools.h"

// Spawns arbitrary Renderable objects through their clone-functions.
// At the end of each interval the object has a chance of spawning.
class Spawner : public Timer
{
    public:
        Spawner(Renderable* obj, World* world, double interval,
				int chance,float x, float y);
		~Spawner();
		Spawner(const Spawner& obj) = delete;
		Spawner(const Spawner&& obj) = delete;
		
		// Reduces interval, and may spawn an object.
        void spawner_tick(double time_delta);

        void set_chance(int chance);
        int get_chance() const;
        void set_pos(float x, float y);

		// The object we want to copy and spawn.
        Renderable* copy;

    private:
        World* world;
        Die die;
        int chance;
        float x_pos;
        float y_pos;
};

#endif
