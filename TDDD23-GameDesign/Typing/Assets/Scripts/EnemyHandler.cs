using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyHandler : MonoBehaviour
{
    public float respawnDelay = 2; // in seconds, limits lowlvl farming.
    private float respawnTimer = 0;

    public float baseHealth; // Base amount
    private float maxHealth; // 50% to 150% health, random.
    private float currentHealth;

    public float lifeRegen; // 0.05

    public float healthToMoneyFactor;
    private MoneyHandler moneyHandler;

    public float waveHealthMultiplier;
    public int enemiesPerWave;
    public int enemiesKilled = 0;
    public int currentWave = 1;
    public int highestWaveReached = 0;

    private FeedbackManager fm;

    void Start()
    {
        moneyHandler = GetComponent<MoneyHandler>();
        fm = GetComponent<FeedbackManager>();
        Respawn();
    }

    void Update()
    {
        // Timer to respawn enemy, if dead.
        if(currentHealth == 0)
        {
            respawnTimer += Time.deltaTime;
            if(respawnTimer >= respawnDelay)
            {
                Respawn();
            }
        }
        // Life regen
        if(currentHealth > 0 && currentHealth < maxHealth)
        {
            currentHealth += maxHealth *  lifeRegen * Time.deltaTime;
            if(currentHealth > maxHealth) { currentHealth = maxHealth; }
        }
    }

    // Returns whether damage was dealt.
    public bool DealDamage(int damage)
    {
        if(currentHealth > 0)
        {
            currentHealth -= damage;
            if(currentHealth <= 0)
            {
                currentHealth = 0;
                Die();
            }
            return true;
        }
        return false;
    }

    public void Die()
    {
        // Give player money, or something.
        moneyHandler.GiveMoney(maxHealth * healthToMoneyFactor);
        // Unlock waves
        if (++enemiesKilled > enemiesPerWave) { enemiesKilled = enemiesPerWave; } ;
        fm.KillEnemy();
        if(enemiesKilled == enemiesPerWave && currentWave == highestWaveReached+1)
        {
            highestWaveReached++;
            NextWave();
        }
    }

    void Respawn()
    {
        maxHealth = (int)Random.Range(baseHealth * 0.5f, baseHealth * 1.5f);
        currentHealth = maxHealth;
        respawnTimer = 0;
        fm.RespawnEnemy();
    }

    public void NextWave()
    {
        if(currentWave <= highestWaveReached)
        {
            currentWave++;
            if(currentWave <= highestWaveReached)
            {
                enemiesKilled = enemiesPerWave;
            }
            else
            {
                enemiesKilled = 0;
            }
            baseHealth = (int)Mathf.Floor(baseHealth * waveHealthMultiplier);
            Respawn();
        }
    }

    public void PreviousWave()
    {
        if(currentWave > 1)
        {
            currentWave--;
            enemiesKilled = enemiesPerWave;
            baseHealth = (int)Mathf.Ceil(baseHealth / waveHealthMultiplier);
            Respawn();
        }
    }

    public float GetMaxHealth()
    {
        return maxHealth;
    }
    public float GetHealth()
    {
        return currentHealth;
    }
    public int GetKilledEnemies()
    {
        return enemiesKilled;
    }
    public int GetCurrentWave()
    {
        return currentWave;
    }
    public int GetHighestWave()
    {
        return highestWaveReached;
    }
}
