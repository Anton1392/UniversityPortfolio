using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VisibilityScript : MonoBehaviour
{
    private void Start()
    {
        TurnChildrenInvisible();
    }

    public void TurnChildrenInvisible()
    {
        foreach(Transform child in transform)
        {
            child.GetComponent<Transform>().localScale = new Vector3(0, 0, 0);
        }
    }
    public void TurnChildrenVisible()
    {
        foreach(Transform child in transform)
        {
            child.GetComponent<Transform>().localScale = new Vector3(1, 1, 1);
        }
    }
}
