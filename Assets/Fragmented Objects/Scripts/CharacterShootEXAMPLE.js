#pragma strict
private var shoot:boolean;

function Start() {
	InvokeRepeating("Shoot", .05,.05);
}

function Update(){
	if(Input.GetMouseButtonDown(0)){
		shoot = true;
	}else if(Input.GetMouseButtonUp(0)){
		shoot = false;
	}
}

function Shoot(){
	if(shoot){
		var hit: RaycastHit;
		var ray : Ray = Camera.main.ViewportPointToRay (Vector3(0.5,0.5,0));
		if (Physics.Raycast (ray, hit)){
		////	SEND A MESSAGE DAMAGING THE OBJECT HIT
			hit.collider.gameObject.SendMessage("Damage", 1f, SendMessageOptions.DontRequireReceiver);			
		}
	}
}