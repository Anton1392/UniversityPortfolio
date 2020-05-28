using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class HotKeys : MonoBehaviour
{
    public bool enableCheats;

    private MoneyHandler mh;
    private PowerupHandler ph;

    private void Start()
    {
        mh = GetComponent<MoneyHandler>();
        ph = GetComponent<PowerupHandler>();

    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            SceneManager.LoadScene("Menu");
        }
        else if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            ph.EnablePowerup();
        }
        else if (Input.GetKeyDown(KeyCode.F1))
        {
            mh.BuyDamage();
        }
        else if (Input.GetKeyDown(KeyCode.F2))
        {
            mh.BuyFireRate();
        }
        else if (Input.GetKeyDown(KeyCode.F3))
        {
            mh.BuyAmmoGain();
        }
        else if (Input.GetKeyDown(KeyCode.F4))
        {
            mh.BuyMaxAmmo();
        }
        else if (Input.GetKeyDown(KeyCode.F5))
        {
            mh.BuyPowerupChance();
        }
        else if (Input.GetKeyDown(KeyCode.F12) && enableCheats)
        {
            mh.GiveMoney(Mathf.Pow(10, 6));
            Debug.Log(mh.money);
        }
    }
}
