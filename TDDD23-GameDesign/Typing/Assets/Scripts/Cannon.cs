using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Cannon : MonoBehaviour
{

    public float damage = 1;

    public float fireRate = 2; // per second
    private float fireTimer = 0;

    public int maxAmmo; // 50
    public int ammo = 0;
    public float ammoGainMultiplier = 1.0f;

    private EnemyHandler enemy;

    private FeedbackManager fm;

    private void Start()
    {
        enemy = GetComponent<EnemyHandler>();
        fm = GetComponent<FeedbackManager>();
    }

    void Update()
    {
        // Firing countdown
        fireTimer += Time.deltaTime;
        if(fireTimer >= 1/fireRate)
        {
            Fire();
        }
    }

    // Loads more ammo
    public void Load(int count)
    {
        ammo += (int)Mathf.Ceil(count * ammoGainMultiplier);
        if(ammo > maxAmmo)
        {
            ammo = maxAmmo;
        }
    }

    public void Fire()
    {
        fireTimer = 0;
        if(ammo > 0)
        {
            if(enemy.DealDamage((int)Mathf.Round(damage)))
            {
                fm.Quack();
                ammo--;
            }
        }
    }

    public int GetAmmo()
    {
        return ammo;
    }
    public int GetMaxAmmo()
    {
        return maxAmmo;
    }

    public void IncreaseDamage(float multiplier)
    {
        damage *= multiplier;
        Debug.Log("Damage is now: " + damage);
    }

    public void IncreaseFireRate(float multiplier)
    {
        fireRate *= multiplier;
        Debug.Log("Firerate is now: " + fireRate);
    }

    public void IncreaseMaxAmmo(float multiplier)
    {
        maxAmmo = (int)(maxAmmo * multiplier);
    }

    public void IncreaseAmmoGain(float multiplier)
    {
        ammoGainMultiplier *= multiplier;
        Debug.Log("Ammo multiplier is now: " + ammoGainMultiplier);
    }
}
