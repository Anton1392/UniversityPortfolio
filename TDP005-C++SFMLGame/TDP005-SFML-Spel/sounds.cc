#include <SFML/Audio.hpp>
#include <map>
#include <queue>
#include <vector>
#include <string>

#include "sounds.h"

using namespace std;
using namespace sf;

std::map<std::string, sf::SoundBuffer> SoundManager::sounds;

std::vector<sf::Sound> SoundManager::playing_sounds;

void SoundManager::LoadSounds()
{
	// Fills with empty sounds
	for (int i {0}; i < 30; i++)
	{
		Sound s;
		playing_sounds.push_back(s);
	}

	SoundBuffer bf;
	bf.loadFromFile("Sounds/bullet.wav");
	sounds["Bullet"] = bf;

	bf.loadFromFile("Sounds/hitmarker.wav");
	sounds["Hitmarker"] = bf;

	bf.loadFromFile("Sounds/hurt.wav");
	sounds["Hurt"] = bf;

	bf.loadFromFile("Sounds/health.wav");
	sounds["Health"] = bf;
}

void SoundManager::PlaySound(std::string name)
{
	// Finds available sound slot
	for (int i {0}; i < playing_sounds.size(); i++)
	{
		if(playing_sounds[i].getStatus() != SoundSource::Status::Playing)
		{
			// Fills the sound slot
			playing_sounds[i].setBuffer(sounds[name]);
			playing_sounds[i].play();
			break;
		}
	}
}

