using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WhatAmILookingAt : MonoBehaviour {
    public LookAtMe whatImLookingAt = null;
	public StoryManager myStoryManager;
    // Use this for initialization
    void Start () {
	}
	
	// Update is called once per frame
	void Update () {
		if (myStoryManager.introDone) {
			RaycastHit hit;
			Ray ray = new Ray (Camera.main.transform.position, Camera.main.transform.forward);

			if (Physics.Raycast (ray, out hit)) {
				Transform objectHit = hit.transform;

				LookAtMe whatImLookingAtNow = hit.collider.transform.parent.gameObject.GetComponent<LookAtMe> ();
				if (whatImLookingAt != whatImLookingAtNow) {
					if (whatImLookingAt != null) {
						//Debug.Log("Looking away from " + whatImLookingAt.name);
						whatImLookingAt.endLook ();
					}
					whatImLookingAt = whatImLookingAtNow;
					if (whatImLookingAtNow != null) {
						Debug.Log ("Changing look to " + whatImLookingAtNow.name);
						whatImLookingAtNow.beginLook ();
					}
				}
			}
		}
    }
}
