/****************************************
	Copyright Unluck Software	
 	www.chemicalbliss.com																															
*****************************************/
@CustomEditor (FraggedController)

class FraggedControllerEditor extends Editor {
    function OnInspectorGUI () {
    	DrawDefaultInspector();
		
			if(GUILayout.Button("Change Fragment Materials")) {
				target.fragments = target.transform.FindChild("Fragments");	
			 	target.ChangeMaterials();
			 	target.fragMaterials = null;
			}
		
		if (GUI.changed)	EditorUtility.SetDirty (target);
    }
}