using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class SaveState
{
    // Cannon
    public float damage;
    public float fireRate;
    public int maxAmmo;
    public int ammo;
    public float ammoGainMultiplier;

    // EnemyHandler
    public float baseHealth;
    public int enemiesKilled;
    public int currentWave;
    public int highestWaveReached;

    // MoneyHandler
    public float money;
    public float damagePrice;
    public float fireRatePrice;
    public float maxAmmoPrice;
    public float ammoGainPrice;
    public float powerupChancePrice;
    public float winConditionPrice;
    public int winCount;

    // PowerupHandler
    public bool isPowerupActive;
    public string powerupActive;
    public string powerupStored;
    public float powerupStoredDuration;
    public float powerupTimer;
    public float powerupDuration;
    public int instakillCharges;

    // WordHandler
    public int powerupChance;

    // Tutorial
    public bool playTutorial;

    public SaveState(Cannon cn, EnemyHandler eh, MoneyHandler mh, PowerupHandler ph, WordHandler wh, TutorialKeyboard tk)
    {
        // Cannon
        damage = cn.damage;
        fireRate = cn.fireRate;
        maxAmmo = cn.maxAmmo;
        ammo = cn.ammo;
        ammoGainMultiplier = cn.ammoGainMultiplier;

        // EnemyHandler
        baseHealth = eh.baseHealth;
        enemiesKilled = eh.enemiesKilled;
        currentWave = eh.currentWave;
        highestWaveReached = eh.highestWaveReached;

        // MoneyHandler
        money = mh.money;
        damagePrice = mh.damagePrice;
        fireRatePrice = mh.fireRatePrice;
        maxAmmoPrice = mh.maxAmmoPrice;
        ammoGainPrice = mh.ammoGainPrice;
        powerupChancePrice = mh.powerupChancePrice;
        winConditionPrice = mh.winConditionPrice;
        winCount = mh.winCount;

        // PowerupHandler
        isPowerupActive = ph.isPowerupActive;
        powerupActive = ph.powerupActive;
        powerupStored = ph.powerupStored;
        powerupStoredDuration = ph.powerupStoredDuration;
        powerupTimer = ph.powerupTimer;
        powerupDuration = ph.powerupDuration;
        instakillCharges = ph.instakillCharges;

        // WordHandler
        powerupChance = wh.powerupChance;

        // Tutorial
        playTutorial = tk.playTutorial;
    }
}
