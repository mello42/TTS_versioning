using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class AudioCollection {
	public FMOD_StudioEventEmitter item_sound;
	public FMOD_StudioEventEmitter V;
	public FMOD_StudioEventEmitter AK;
	public FMOD_StudioEventEmitter KD;
	public FMOD_StudioEventEmitter AD;
	public FMOD_StudioEventEmitter A;
	public FMOD_StudioEventEmitter K;
	public FMOD_StudioEventEmitter D;
}

public class DialogueHandler : MonoBehaviour {
	


	public AudioCollection ItemAudio;

	void Update () {
		
	}
}
