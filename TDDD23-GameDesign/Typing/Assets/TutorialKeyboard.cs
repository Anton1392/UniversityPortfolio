using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TutorialKeyboard : MonoBehaviour
{
    public bool playTutorial = true;

    public float bobSpeed;
    public float bobMultiplier;
    private float baseY;
    private float counter = 0;

    private void Start()
    {
        baseY = transform.position.y;
    }

    // Update is called once per frame
    void Update()
    {
        counter += Time.deltaTime;
        float movement = Mathf.Sin(counter * bobSpeed) * bobMultiplier;
        transform.position = new Vector2(transform.position.x, baseY + movement);
        if(!playTutorial)
        {
            GetComponent<Renderer>().enabled = false;
        }
    }
}
