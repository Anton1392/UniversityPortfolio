#ifndef SOUNDS_H
#define SOUNDS_H

// A class that handles all sounds that are played
// throughout the game.

class SoundManager
{
	public:
		// Loads all sounds into memory. Fills the sounds map.
		static void LoadSounds();

		// Plays a particular sound by name.
		// Up to 30 sounds can be played at once.
		static void PlaySound(std::string name);

	private:
		// Contains sounds accessed by strings.
		static std::map<std::string, sf::SoundBuffer> sounds;

		// All currenly playing sounds. Limit of 30 simultaneously.
		static std::vector<sf::Sound> playing_sounds;
};

#endif
