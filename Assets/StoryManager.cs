using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StoryManager : MonoBehaviour {
	public bool introDone;
	public string currentStory = "V";
	public AKDScore TotalAKDScore;
	public int maxVague;
	public bool vagueDone;
	public int maxMain;
	public bool mainDone;
	public int maxItems;
	public int totalItemsCount;
	public bool gameDone;
	public bool endingDone;
	// Use this for initialization
	// Update is called once per frame
	void Start () {
		PlayIntro ();
	
	}

	void Update () {

		if (!vagueDone && totalItemsCount >= maxVague) {
			vagueDone = true;
			SetStoryMain ();
		}

		if (!mainDone && totalItemsCount >= (maxVague + maxMain)) {
			mainDone = true;
			SetStoryFinal ();
		}

		if (!gameDone && totalItemsCount >= maxItems) {
			gameDone = true;
			PlayEnding ();
		}
		
	}

	void SetStoryMain () {

		if (TotalAKDScore.A > TotalAKDScore.K) {
			if (TotalAKDScore.K > TotalAKDScore.D) {
				currentStory = "AK";
			} else {
				currentStory = "AD";
			}
		} else {
			if (TotalAKDScore.D > TotalAKDScore.A) {
				currentStory = "KD";
			} else {
				currentStory = "AK";
			}
		}

		//resetting score?
		TotalAKDScore.A = 0;
		TotalAKDScore.K = 0;
		TotalAKDScore.D = 0;

	}

	void SetStoryFinal () {

		if (currentStory == "AK") {
			if (TotalAKDScore.A > TotalAKDScore.K) {
				currentStory = "A";
			} else {
				currentStory = "K";
			}
		}else if(currentStory == "KD"){
			if (TotalAKDScore.K > TotalAKDScore.D) {
				currentStory = "K";
			} else {
				currentStory = "D";
			}
		}else if(currentStory == "AD"){
			if (TotalAKDScore.A > TotalAKDScore.D) {
				currentStory = "A";
			} else {
				currentStory = "D";
			}
		}else{
			Debug.Log("ending error!");
		}
	}

	void PlayEnding () {
		endingDone = true;
		Debug.Log("Ending plays Here");

	}

	void PlayIntro () {
		introDone = true;
		Debug.Log("Intro plays Here");

	}
}

