using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class SaveHandler : MonoBehaviour
{
    public bool doLoad; // For developing.

    public float saveInterval = 5f; // seconds
    private float saveTimer = 0f;

    private Cannon cn;
    private EnemyHandler eh;
    private MoneyHandler mh;
    private PowerupHandler ph;
    private WordHandler wh;
    private TutorialKeyboard tk;

    // Start is called before the first frame update
    void Start()
    {
        cn = GetComponent<Cannon>();
        eh = GetComponent<EnemyHandler>();
        mh = GetComponent<MoneyHandler>();
        ph = GetComponent<PowerupHandler>();
        wh = GetComponent<WordHandler>();
        tk = GameObject.Find("TutorialKeyboard").GetComponent<TutorialKeyboard>();

        LoadGame();
    }

    // Update is called once per frame
    void Update()
    {
        saveTimer += Time.deltaTime;
        if(saveTimer >= saveInterval)
        {
            Debug.Log("Saving game.");
            SaveSystem.SaveGameState(cn, eh, mh, ph, wh, tk);
            saveTimer = 0;
        }
    }

    void LoadGame()
    {
        Debug.Log("Beep");
        SaveState state = SaveSystem.LoadGameState();
        if(state != null && doLoad)
        {
            Debug.Log("Loading game.");
            // Cannon
            cn.damage = state.damage;
            cn.fireRate = state.fireRate;
            cn.maxAmmo = state.maxAmmo;
            cn.ammo = state.ammo;
            cn.ammoGainMultiplier = state.ammoGainMultiplier;

            // EnemyHandler
            eh.baseHealth = state.baseHealth;
            eh.enemiesKilled = state.enemiesKilled;
            eh.currentWave = state.currentWave;
            eh.highestWaveReached = state.highestWaveReached;

            // MoneyHandler
            mh.money = state.money;
            mh.damagePrice = state.damagePrice;
            mh.fireRatePrice = state.fireRatePrice;
            mh.maxAmmoPrice = state.maxAmmoPrice;
            mh.ammoGainPrice = state.ammoGainPrice;
            mh.powerupChancePrice = state.powerupChancePrice;
            mh.winConditionPrice = state.winConditionPrice;
            mh.winCount = state.winCount;

            // PowerupHandler
            ph.isPowerupActive = state.isPowerupActive;
            ph.powerupActive = state.powerupActive;
            ph.powerupStored = state.powerupStored;
            ph.powerupStoredDuration = state.powerupStoredDuration;
            ph.powerupTimer = state.powerupTimer;
            ph.powerupDuration = state.powerupDuration;
            ph.instakillCharges = state.instakillCharges;

            // WordHandler
            wh.powerupChance = state.powerupChance;

            // Tutorial
            tk.playTutorial = state.playTutorial;
        }
    }
}
