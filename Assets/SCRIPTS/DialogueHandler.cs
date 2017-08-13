using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class AudioCollection {
	//public FMODUnity.StudioEventEmitter item_sound;
	public FMODUnity.StudioEventEmitter V;
	public FMODUnity.StudioEventEmitter AK;
	public FMODUnity.StudioEventEmitter KD;
	public FMODUnity.StudioEventEmitter AD;
	public FMODUnity.StudioEventEmitter A;
	public FMODUnity.StudioEventEmitter K;
	public FMODUnity.StudioEventEmitter D;
}

public class DialogueHandler : MonoBehaviour {

	public AudioCollection ItemAudio;

}
