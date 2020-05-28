using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MasterUI : MonoBehaviour
{
    private Cannon cannon;
    private EnemyHandler eh;
    private WordHandler wh;
    private MoneyHandler mh;
    private PowerupHandler ph;

    private Slider sliderAmmo;
    private Slider sliderEnemyHealth;
    private Text textAmmo;
    private Text textEnemyHealth;
    private Text textCurrentWord;
    private Text textMistakes;
    private Text textMoney;

    private Text textBuyDamage;
    private Text textBuyFireRate;
    private Text textBuyMaxAmmo;
    private Text textBuyAmmo;
    private Text textBuyPowerupChance;
    private Text textBuyWinCondition;

    private Text textWave;

    private Text textPowerup;

    private Text textWinCount;

    private TutorialKeyboard tutorialKeyboard;
    
    // Start is called before the first frame update
    void Start()
    {
        cannon = GetComponent<Cannon>();
        eh = GetComponent<EnemyHandler>();
        wh = GetComponent<WordHandler>();
        mh = GetComponent<MoneyHandler>();
        ph = GetComponent<PowerupHandler>();

        sliderAmmo = GameObject.Find("AmmoSlider").GetComponent<Slider>();
        sliderEnemyHealth = GameObject.Find("EnemyHealthSlider").GetComponent<Slider>();

        textAmmo = GameObject.Find("AmmoText").GetComponent<Text>();
        textEnemyHealth = GameObject.Find("EnemyHealthText").GetComponent<Text>();
        textCurrentWord = GameObject.Find("CurrentWord").GetComponent<Text>();
        textMistakes = GameObject.Find("Mistakes").GetComponent<Text>();
        textMoney = GameObject.Find("Money").GetComponent<Text>();

        textBuyDamage = GameObject.Find("BuyDamageText").GetComponent<Text>();
        textBuyFireRate = GameObject.Find("BuyFireRateText").GetComponent<Text>();
        textBuyMaxAmmo = GameObject.Find("BuyMaxAmmoText").GetComponent<Text>();
        textBuyAmmo = GameObject.Find("BuyAmmoText").GetComponent<Text>();
        textBuyPowerupChance = GameObject.Find("BuyPowerupChanceText").GetComponent<Text>();
        textBuyWinCondition = GameObject.Find("BuyWinConditionText").GetComponent<Text>();

        textWave = GameObject.Find("WaveText").GetComponent<Text>();

        textPowerup = GameObject.Find("PowerupText").GetComponent<Text>();

        textWinCount = GameObject.Find("WinCountText").GetComponent<Text>();

        tutorialKeyboard = GameObject.Find("TutorialKeyboard").GetComponent<TutorialKeyboard>();
    }

    // Update is called once per frame
    void Update()
    {
        // Ammo slider
        sliderAmmo.maxValue = cannon.GetMaxAmmo();
        sliderAmmo.value = cannon.GetAmmo();

        // Enemy health slider
        sliderEnemyHealth.maxValue = eh.GetMaxHealth();
        sliderEnemyHealth.value = eh.GetHealth();

        // Ammo count
        textAmmo.text = string.Format("<color=orange>Ammo: {0}/{1}</color>", cannon.GetAmmo(), cannon.GetMaxAmmo());

        // Enemy health text
        float health = Mathf.Ceil(eh.GetHealth());
        float maxHealth = Mathf.Ceil(eh.GetMaxHealth());
        textEnemyHealth.text = string.Format("<color=#ba2e2b>{0} / {1}</color>", health, maxHealth);

        // Current word
        string word = wh.GetCurrentWord();
        int i = wh.GetCurrentIndex();
        string wordColor = "white";
        if (wh.isPowerup) { wordColor = "yellow"; }
        textCurrentWord.text = "<color=green>" + word.Substring(0, i) + "</color><color=" + wordColor + ">" + word.Substring(i, word.Length-i) + "</color>";

        // Mistake count
        int mistakes = wh.GetCurrentMistakes();
        string res;
        if(mistakes > 0)
        {
            res = "<color=red>" + "Mistakes: <b>" + mistakes + "</b></color>";
        }
        else
        {
            res = "<color=green>" + "Mistakes: <b>" + mistakes + "</b></color>";
        }
        textMistakes.text = res;

        // Money count
        float money = mh.GetCurrentMoney();
        textMoney.text = "Crumbs: <b>" + money + "</b>";

        // Buy buttons
        textBuyDamage.text = mh.damageScaler + "x quack damage: " + Mathf.Floor(mh.damagePrice) + " crumbs";
        textBuyFireRate.text = mh.fireRateScaler + "x quack rate: " + Mathf.Floor(mh.fireRatePrice) + " crumbs";
        textBuyMaxAmmo.text = mh.maxAmmoScaler + "x max ammo: " + Mathf.Floor(mh.maxAmmoPrice) + " crumbs";
        textBuyAmmo.text = mh.ammoGainScaler + "x ammo gained: " + Mathf.Floor(mh.ammoGainPrice) + " crumbs";
        textBuyPowerupChance.text = "+1% powerup chance: " + Mathf.Floor(mh.powerupChancePrice) + " crumbs";
        textBuyWinCondition.text = "Win the game!: " + Mathf.Floor(mh.winConditionPrice) + " crumbs";

        // Wave info
        textWave.text = "<color=silver>Wave: " + eh.GetCurrentWave() + "\n" + "Next wave: " + eh.GetKilledEnemies() + " / " + eh.enemiesPerWave + "</color>";

        // Powerup stuff
        string desc = "";
        switch(ph.powerupStored)
        {
            case "FireRateAmmoGainDamage":
                desc = "2x quack rate, 2x ammo gain, 1.3x damage for 10 seconds";
                break;
            case "InfiniteFireRate":
                desc = "100x quack rate for 10 seconds";
                break;
            case "InstaKill":
                desc = "3 instant human payouts";
                break;
            case "DoubleMoney":
                desc = "Doubles your current crumbs";
                break;
            case "TripleDamage":
                desc = "3x quack damage for 10 seconds";
                break;
        }
        string color = "silver";
        if (ph.isPowerupActive) { color = "yellow"; }
        string powerupText = "<b><color=" + color + ">Powerup: " + desc + "</color></b>\n<color=silver>Press 1 to enable.</color>";
        if(desc == "")
        {
            textPowerup.text = "";
        }
        else
        {
            textPowerup.text = powerupText;
        }

        // Wins
        int wins = mh.winCount;
        res = "<b><color=yellow>You have won " + wins + " time";
        if(wins > 1) { res += "s"; }
        res += "!</color></b>";
        if(wins == 0) { textWinCount.GetComponent<CanvasRenderer>().SetAlpha(0f); }
        else { textWinCount.GetComponent<CanvasRenderer>().SetAlpha(1f); }
        textWinCount.text = res;

        // Tutorial
        if(wh.GetCurrentIndex() == wh.GetCurrentWord().Length-1) { tutorialKeyboard.playTutorial = false; }
    }
}
