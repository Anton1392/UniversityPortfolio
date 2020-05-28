using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;
using UnityEngine.UI;
using UnityEditor;

public class SettingsMenu : MonoBehaviour
{
    public AudioMixer am;
    public Toggle quackToggle;
    public Slider volumeSlider;

    public void Start()
    {
        quackToggle = GameObject.Find("MuteQuackToggle").GetComponent<Toggle>();
        quackToggle.isOn = (PlayerPrefs.GetInt("MuteQuacks") == 1);

        volumeSlider = GameObject.Find("VolumeSlider").GetComponent<Slider>();

        float vol = PlayerPrefs.GetFloat("volume");
        am.SetFloat("volume", vol);
        volumeSlider.value = vol;
    }

    public void SetVolume(float volume)
    {
        PlayerPrefs.SetFloat("volume", volume);
        am.SetFloat("volume", volume);
    }

    public void SetMuteQuacks(bool toggle)
    {
        // Converts bool to int and saves it.
        PlayerPrefs.SetInt("MuteQuacks", toggle ? 1 : 0);
    }
    public void ResetSave()
    {
        SaveSystem.ResetSave();
    }
}
