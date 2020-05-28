using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PowerupHandler : MonoBehaviour
{
    // Name and duration (if any)
    public List<KeyValuePair<string, float>>powers = new List<KeyValuePair<string, float>>();

    public bool isPowerupActive = false;
    public string powerupActive = "";

    public string powerupStored = "";
    public float powerupStoredDuration;

    public float powerupTimer = 0;
    public float powerupDuration = 0;

    private Cannon cann;
    private EnemyHandler eh;
    private MoneyHandler mh;
    private FeedbackManager fm;

    // Instakill charges
    public int instakillCharges = 0;

    void Start()
    {
        powers.Add(new KeyValuePair<string, float>("FireRateAmmoGainDamage", 10f));
        powers.Add(new KeyValuePair<string, float>("InfiniteFireRate", 10f));
        powers.Add(new KeyValuePair<string, float>("InstaKill", 0f));
        powers.Add(new KeyValuePair<string, float>("DoubleMoney", 0f));
        powers.Add(new KeyValuePair<string, float>("TripleDamage", 10f));

        cann = GetComponent<Cannon>();
        eh = GetComponent<EnemyHandler>();
        mh = GetComponent<MoneyHandler>();
        fm = GetComponent<FeedbackManager>();
    }

    void Update()
    {
        // Timer stuff
        if(powerupDuration != 0)
        {
            powerupTimer += Time.deltaTime;
            if(powerupTimer >= powerupDuration)
            {
                powerupTimer = 0;
                DisablePowerup();
            }
        }
    }


    public void GrantPowerup()
    {
        if(powerupStored == "")
        {
            int i = Random.Range(0, powers.Count);
            powerupStored = powers[i].Key;
            powerupStoredDuration = powers[i].Value;
            Debug.Log("Granted: " + powerupStored);
            fm.CollectPowerup();
        }
    }

    public void EnablePowerup()
    {
        if(!isPowerupActive && powerupStored != "")
        {
            isPowerupActive = true;

            powerupActive = powerupStored;
            powerupDuration = powerupStoredDuration;


            bool playPowerupSound = true;

            switch (powerupStored)
            {
                // Enable thing
                case "FireRateAmmoGainDamage":
                    cann.IncreaseFireRate(2f);
                    cann.IncreaseAmmoGain(2f);
                    cann.IncreaseDamage(1.3f);
                    break;
                case "InfiniteFireRate":
                    cann.IncreaseFireRate(100f);
                    break;
                case "InstaKill":
                    if(instakillCharges == 0) { instakillCharges = 3; }
                    if(eh.GetHealth() > 0)
                    {
                        eh.DealDamage((int)Mathf.Ceil(eh.GetHealth()));
                        instakillCharges--;
                        if(instakillCharges == 0)
                        {
                            DisablePowerup();
                        }
                    }
                    else { playPowerupSound = false; }
                    isPowerupActive = false;
                    break;
                case "DoubleMoney":
                    mh.GiveMoney(mh.GetCurrentMoney());
                    DisablePowerup();
                    break;
                case "TripleDamage":
                    cann.IncreaseDamage(3f);
                    break;
            }
            if (playPowerupSound) { fm.ActivatePowerup(); }
            Debug.Log("Enabled: " + powerupActive);
        }
    }

    private void DisablePowerup()
    {
        switch(powerupStored)
        {
            case "FireRateAmmoGainDamage":
                cann.IncreaseFireRate(0.5f);
                cann.IncreaseAmmoGain(0.5f);
                cann.IncreaseDamage(1/1.3f);
                break;
            case "InfiniteFireRate":
                cann.IncreaseFireRate(0.01f);
                break;
            case "TripleDamage":
                cann.IncreaseDamage(1/3f);
                break;
        }

        isPowerupActive = false;
        powerupActive = "";
        powerupDuration = 0;
        powerupStored = "";
        powerupStoredDuration = 0;
    }
}
