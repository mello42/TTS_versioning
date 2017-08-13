using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class AKDScore {
	//public FMODUnity.StudioEventEmitter item_sound;
	public int A;
	public int K;
	public int D;
}



public class LookAtMe : MonoBehaviour {
	public AKDScore myAKDScore;
	public DialogueHandler myDialogue;
	public bool used;
	public StoryManager myStoryManager;
    public float activateTime = 1.0f;
	public float lookTime = 0.0f;
    bool looking = false;

	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
        if (looking)
        {
            lookTime += Time.deltaTime;
			if (lookTime > activateTime && !used)
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

    void onActivate(){
		used = true;
		playLine (); //play BEFORE setting AKD score
		myStoryManager.totalItemsCount++;
		myStoryManager.TotalAKDScore.A += myAKDScore.A;
		myStoryManager.TotalAKDScore.K += myAKDScore.K;
		myStoryManager.TotalAKDScore.D += myAKDScore.D;
        Debug.Log("I activated " + gameObject.name);
        endLook();
    }

	void playLine(){
		FMODUnity.StudioEventEmitter currentClip = null;

		if(myStoryManager.currentStory == "V"){
			currentClip = myDialogue.ItemAudio.V;
		}
		if(myStoryManager.currentStory == "AK"){
			currentClip = myDialogue.ItemAudio.AK;
		}
		if(myStoryManager.currentStory == "KD"){
			currentClip = myDialogue.ItemAudio.KD;
		}
		if(myStoryManager.currentStory == "AD"){
			currentClip = myDialogue.ItemAudio.AD;
		}
		if(myStoryManager.currentStory == "A"){
			currentClip = myDialogue.ItemAudio.A;
		}
		if(myStoryManager.currentStory == "K"){
			currentClip = myDialogue.ItemAudio.K;
		}
		if(myStoryManager.currentStory == "D"){
			currentClip = myDialogue.ItemAudio.D;
		}
		if (currentClip) {
			currentClip.Play ();
		}
	}
}
