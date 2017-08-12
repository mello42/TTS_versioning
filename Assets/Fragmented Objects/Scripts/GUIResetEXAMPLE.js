#pragma strict
function OnGUI () {
	GUI.Label(Rect(20,20,350,18),"Use WASD and mouse to move and shoot");
	if(GUI.Button(Rect(20,40,125,18),"Reset All"))
		ResetAll();	
}

function ResetAll () {
	var frags : FraggedController[] = FindObjectsOfType(FraggedController) as FraggedController[];
	for (var frag : FraggedController in frags) {
		frag.ResetFrags();
	}
}