using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoneyHandler : MonoBehaviour
{
    public float money = 0;

    private Cannon cannon;

    public float damageScaler; // 1,10
    public float damagePrice; // 10
    public float damagePriceScaler; // 1,15

    public float fireRateScaler; // 1,15
    public float fireRatePrice; // 10
    public float fireRatePriceScaler; // 1,10

    public float maxAmmoScaler; // 1,30
    public float maxAmmoPrice; // 10
    public float maxAmmoPriceScaler; // 1,20

    public float ammoGainScaler; // 1,15
    public float ammoGainPrice; // 10
    public float ammoGainPriceScaler; // 1,20

    public float powerupChancePrice; // 50
    public float powerupChancePriceScaler; // 1,20

    public float winConditionPrice; // 1mil
    public float winConditionPriceScaler; // 2

    [HideInInspector]
    public int winCount = 0;

    private FeedbackManager fm;
    private WordHandler wh;

    public void Start()
    {
        cannon = GetComponent<Cannon>();
        fm = GetComponent<FeedbackManager>();
        wh = GetComponent<WordHandler>();
    }

    public void GiveMoney(float amount)
    {
        money += amount;
        fm.GainMoney();
    }
    
    public float GetCurrentMoney()
    {
        return Mathf.Floor(money);
    }

    public void BuyDamage()
    {
        if(GetCurrentMoney() >= Mathf.Floor(damagePrice))
        {
            money -= Mathf.Floor(damagePrice);
            damagePrice *= damagePriceScaler;
            cannon.IncreaseDamage(damageScaler);
            fm.Buy();
        }
    }

    public void BuyFireRate()
    {
        if(GetCurrentMoney() >= Mathf.Floor(fireRatePrice))
        {
            money -= Mathf.Floor(fireRatePrice);
            fireRatePrice *= fireRatePriceScaler;
            cannon.IncreaseFireRate(fireRateScaler);
            fm.Buy();
        }
    }
    public void BuyMaxAmmo()
    {
        if(GetCurrentMoney() >= Mathf.Floor(maxAmmoPrice))
        {
            money -= Mathf.Floor(maxAmmoPrice);
            maxAmmoPrice *= maxAmmoPriceScaler;
            cannon.IncreaseMaxAmmo(maxAmmoScaler);
            fm.Buy();
        }
    }
    public void BuyAmmoGain()
    {
        if(GetCurrentMoney() >= Mathf.Floor(ammoGainPrice))
        {
            money -= Mathf.Floor(ammoGainPrice);
            ammoGainPrice *= ammoGainPriceScaler;
            cannon.IncreaseAmmoGain(ammoGainScaler);
            fm.Buy();
        }
    }

    public void BuyPowerupChance()
    {
        if(GetCurrentMoney() >= Mathf.Floor(powerupChancePrice))
        {
            money -= Mathf.Floor(powerupChancePrice);
            powerupChancePrice *= powerupChancePriceScaler;
            wh.powerupChance += 1;
            fm.Buy();
        }
    }

    public void BuyWinCondition()
    {
        if(GetCurrentMoney() >= Mathf.Floor(winConditionPrice))
        {
            money -= Mathf.Floor(winConditionPrice);
            winConditionPrice *= winConditionPriceScaler;
            winCount++;
            fm.Win();
        }
    }
}
