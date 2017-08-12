using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WhatAmILookingAt : MonoBehaviour {
    LookAtMe whatImLookingAt = null;

    // Use this for initialization
    void Start () {
	}
	
	// Update is called once per frame
	void Update () {
        RaycastHit hit;
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);

        if (Physics.Raycast(ray, out hit))
        {
            Transform objectHit = hit.transform;

            LookAtMe whatImLookingAtNow = hit.collider.gameObject.GetComponent<LookAtMe>();
            if (whatImLookingAt != whatImLookingAtNow)
            {
                if (whatImLookingAt != null)
                {
                    //Debug.Log("Looking away from " + whatImLookingAt.name);
                    whatImLookingAt.endLook();
                }
                whatImLookingAt = whatImLookingAtNow;
                if (whatImLookingAtNow != null)
                {
                    //Debug.Log("Changing look to " + whatImLookingAtNow.name);
                    whatImLookingAtNow.beginLook();
                }
            }
        }
    }
}
