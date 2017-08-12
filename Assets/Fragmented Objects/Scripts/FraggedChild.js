#pragma strict
@script AddComponentMenu("FragChild") 

private var forceMax: int;
private var forceMin: int;
@HideInInspector 
public var fragged: boolean;

//// SAVE TRANSFORM INFO
private var sPos: Vector3;
private var sRot: Quaternion;
private var sScale: Vector3;
//// CONTROLLER

private var fragControl: FraggedController;
@HideInInspector 
public var hitPoints: float = 1;
public var stickyFrag: boolean;
@HideInInspector 
public var connected: boolean = true;
@HideInInspector 
public var released:boolean;

private var checkToggle:boolean = true;

var cacheRB:Rigidbody;

//// USE THIS FUNCTION TO DAMAGE THE FRAGMENTS SO THEY FALL OFF //// gameObject.SendMessage("Damage", 1f, SendMessageOptions.DontRequireReceiver);
function Damage(damage: float) {
		fragMe(fragControl.hitPointDecrease * damage);		
		if(fragControl.fragAllOnDamage){
			fragControl.FragAll();
		}
}

function Start() {
	cacheRB = GetComponent.<Rigidbody>();
	cacheRB.isKinematic = true;
	if (!fragControl) fragControl = transform.parent.parent.GetComponent(FraggedController);
	GetComponent.<Renderer>().enabled = false;
	fragControl = gameObject.transform.parent.parent.GetComponent(FraggedController);
	forceMax = fragControl.forceMax * fragControl.fragMass;
	forceMin = fragControl.forceMin * fragControl.fragMass;
	sRot = transform.rotation;
	sPos = transform.position;
	sScale = transform.localScale;
	cacheRB.mass = fragControl.fragMass;
	
}



function checkConnections() {
		if (!stickyFrag && !this.fragged && !this.connected && (fragControl.stickyTop > 0 || fragControl.stickyBottom > 0)) {
//			Debug.Log("checkConnections");
			var counter: int;
			var colls: Collider[];
			colls = Physics.OverlapSphere(transform.position, fragControl.connectOverlapSphere * fragControl.transform.localScale.x, fragControl.stickyMask);
			for (var i: int = 0; i <= colls.length - 1; i++) {
				var frag: FraggedChild = colls[i].transform.GetComponent(FraggedChild);
				if (frag != null && !frag.fragged && transform.parent == frag.transform.parent) {
					if (frag.stickyFrag || frag.connected) {
						counter++;
					}
				}
			}
			if (counter >= fragControl.connectedFragments) {
				connected = true;
			}
		}
	}
	//frags fracture fragments on Collisions
function OnCollisionEnter(collision: Collision) {
	if((fragControl.collideMask.value & 1<<collision.gameObject.layer) == 1<<collision.gameObject.layer){
		if (this.fragControl.collidefragMagnitude > 0 && collision.relativeVelocity.magnitude > this.fragControl.collidefragMagnitude) {
		fragMe(collision.relativeVelocity.magnitude * .2 * fragControl.hitPointDecrease);
		}
		if (this.fragged && collision.relativeVelocity.magnitude > 1){	
			fragControl.dustParticles.transform.position = this.transform.position;
			fragControl.dustParticles.Emit(1);
			fragControl.fragParticles.transform.position = this.transform.position;
			fragControl.fragParticles.Emit(Random.Range(fragControl.fragEmitMinMax.x*.5, fragControl.fragEmitMinMax.y*.5));
		}
	}
	if(fragControl.disableDelay > 0 && (fragControl.disableMask.value & 1<<collision.gameObject.layer) == 1<<collision.gameObject.layer){
		Invoke("Disable", fragControl.disableDelay);
	}
}



function addForce(fMin: int, fMax: int) {
	
	if(!cacheRB.isKinematic && this.cacheRB.velocity.magnitude < 1){
	var forceX: float = Random.Range(fMin, fMax);
	if (Random.value > 0.5) {
		forceX *= -1;
	}
	var forceY: float = Random.Range(fMin, fMax);
	if (Random.value > 0.5) {
		forceY *= -1;
	}
	
	//cacheRB.AddForce(forceX, Random.Range(fMin, fMax), forceY);
	cacheRB.velocity = Vector3(forceX, Random.Range(fMin, fMax), forceY)*.05;
	}
}

function fragMe(hitFor: float) {
	if (fragControl.startMesh && fragControl.startMesh.GetComponent.<Renderer>().enabled ) {
		fragControl.startMesh.GetComponent.<Renderer>().enabled = false;
		fragControl.EnableRenderers();
	}
	fragControl.ReleaseFrags(false);
	fragControl.reCounter = 0;
	
	if (this.connected ) {		
		addForce(forceMin, forceMax);
		if(fragged && checkToggle){
			checkToggle = !checkToggle;
			fragControl.checkConnections();
			this.connected = false;
		}
	} else if(hitFor < 200) {
			addForce(forceMin * .5, forceMax * .5);
	}
	
	if (!fragged) {
		hitPoints -= hitFor;
		if (fragControl.fragEnabled && hitPoints < 0) {
			//Hitpoints lower than 0, fragment is now fragged
			var meshCollider:MeshCollider = gameObject.GetComponent(MeshCollider);
			if(meshCollider) meshCollider.convex = true;
			fragged = true;
			if (fragControl.fragParticles) {
				fragControl.fragParticles.transform.position = this.transform.position;
				if (this.connected) fragControl.fragParticles.Emit(Random.Range(fragControl.fragEmitMinMax.x, fragControl.fragEmitMinMax.y));
				else fragControl.fragParticles.Emit(Random.Range(fragControl.fragEmitMinMax.x, fragControl.fragEmitMinMax.y) * .5);
			}		
		//Set fragment scale
		transform.localScale = sScale * fragControl.fragOffScale;
		cacheRB.isKinematic = false;
		released = true;
		} else if (hitFor < 1 && hitPoints > 0) {
			if(!this.released){
				var rotateMultiplier: float = 1 - hitPoints;
				gameObject.transform.Rotate(Random.Range(-fragControl.rotateOnHit, fragControl.rotateOnHit + 1) * rotateMultiplier, 0, Random.Range(-fragControl.rotateOnHit, fragControl.rotateOnHit + 1) * rotateMultiplier);
				transform.localEulerAngles = new Vector3(Mathf.Clamp(transform.localEulerAngles.x, -10, 10), Mathf.Clamp(transform.localEulerAngles.y, -10, 10), Mathf.Clamp(transform.localEulerAngles.z, -10, 10));
			}
			if (fragControl.dustParticles) {
				fragControl.dustParticles.transform.position = this.transform.position;
				fragControl.dustParticles.Emit(Random.Range(3, 8));
			}
		} else {
			gameObject.transform.Rotate(Random.Range(-fragControl.rotateOnHit, fragControl.rotateOnHit + 1), 0, 0);
		}
	}
}

function SpeedCheck(){
	if(fragged && cacheRB.velocity.sqrMagnitude > fragControl.limitFragmentSpeed){
		cacheRB.velocity = Vector3.zero;
	}
}

function Disable() {
	gameObject.GetComponent(Collider).enabled = false;
	var MC:MeshCollider = GetComponent(MeshCollider);
	if(MC){
		MC.enabled = false;
	}
	cacheRB.isKinematic = true;
}

function resetMe() {
	transform.gameObject.SetActive(true);
	transform.GetComponent.<Renderer>().enabled = false;
	var MC:MeshCollider = GetComponent(MeshCollider);
	if(MC){
		MC.convex = false;
		MC.enabled = true;
	}
	//Resets transforms
	transform.position = sPos;
	transform.rotation = sRot;
	transform.localScale = sScale;
	fragged = false;
	hitPoints = 1;
	cacheRB.isKinematic = true;
	connected = true;
	released = false;
}