using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(AudioSource))]
public class FeedbackManager : MonoBehaviour
{
    public AudioClip clickSound;
    public AudioClip quackSound;
    public AudioClip gainMoneySound;
    public AudioClip buySound;
    public AudioClip collectPowerupSound;
    public AudioClip activatePowerupSound;
    public AudioClip winConditionSound;
    public AudioClip winConditionSound2;

    private ParticleSystem quackParticles;

    private AudioSource audio;

    private ParticleSystem crumbParticles;

    private GameObject normalDuck;
    private GameObject hypeDuck;
    private float hypeCooldown = 0.2f;
    private float hypeTimer = 0f;
    private bool isHype = false;

    private GameObject human;
    public List<Sprite> humanSprites;

    private bool muteQuacks = false;

    private ParticleSystem winParticles;


    void Start()
    {
        audio = GetComponent<AudioSource>();

        crumbParticles = GameObject.Find("CrumbParticles").GetComponent<ParticleSystem>();

        quackParticles = GameObject.Find("QuackParticles").GetComponent<ParticleSystem>();
        normalDuck = GameObject.Find("DuckNormal");
        hypeDuck = GameObject.Find("DuckHype");
        hypeDuck.GetComponent<Renderer>().enabled = false;

        human = GameObject.Find("Human");

        muteQuacks = (PlayerPrefs.GetInt("MuteQuacks") == 1);

        winParticles = GameObject.Find("WinParticles").GetComponent<ParticleSystem>();
    }

    void Update()
    { 
        if(isHype)
        {
            hypeTimer += Time.deltaTime;
            if(hypeTimer >= hypeCooldown)
            {
                isHype = false;
                hypeTimer = 0f;
                hypeDuck.GetComponent<Renderer>().enabled = false;
                normalDuck.GetComponent<Renderer>().enabled = true;
            }
        }
    }

    public void GoodClick()
    {
        audio.PlayOneShot(clickSound);
    }

    public void BadClick()
    {
        //audio.PlayOneShot(badClickSound);
    }

    public void Quack()
    {
        isHype = true;
        hypeDuck.GetComponent<Renderer>().enabled = true;
        normalDuck.GetComponent<Renderer>().enabled = false;

        if(!muteQuacks)
        {
            audio.PlayOneShot(quackSound);
        }

        quackParticles.Play();
    }

    public void GainMoney()
    {
        audio.PlayOneShot(gainMoneySound, 0.5f);
        crumbParticles.Play();
    }
   
    public void Buy()
    {
        audio.PlayOneShot(buySound, 0.4f);
    }

    public void RespawnEnemy()
    {
        int i = Random.Range(0, humanSprites.Count);
        human.GetComponent<SpriteRenderer>().sprite = humanSprites[i];
        human.transform.rotation = Quaternion.Euler(0, 0, 0);
    }
    
    public void KillEnemy()
    {
        human.transform.rotation = Quaternion.Euler(0, 0, 90);
    }

    public void CollectPowerup()
    {
        audio.PlayOneShot(collectPowerupSound, 0.2f);
    }
    public void ActivatePowerup()
    {
        audio.PlayOneShot(activatePowerupSound, 0.2f);
    }

    public void Win()
    {
        winParticles.Play();
        audio.PlayOneShot(winConditionSound, 0.25f);
        audio.PlayOneShot(winConditionSound2, 0.25f);
        // beep
    }
}
