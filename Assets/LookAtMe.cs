using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LookAtMe : MonoBehaviour {

    public float activateTime = 1.0f;
    float lookTime = 0.0f;
    bool looking = false;

	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
        if (looking)
        {
            lookTime += Time.deltaTime;
            if (lookTime > activateTime)
            {
                onActivate();
            }
        }
    }

    public void beginLook()
    {
        //Debug.Log("Started looking at " + gameObject.name);
        looking = true;
    }

    public void endLook()
    {
        //Debug.Log("No longer looking at " + gameObject.name);
        lookTime = 0.0f;
        looking = false;
    }

    void onActivate()
    {
        Debug.Log("I'm looking at " + gameObject.name);
        endLook();
    }
}
