#pragma strict
#pragma downcast
//C# ADD using System.Linq;
@Header ("Fragments")
public var fragEnabled: boolean = true; 			//Can frags fall off, set to false for floors and walls where the frags only are suppose to rotate
public var forceMax = 250; 							//Maximum force put on fracture fragments when fragged
public var forceMin = 50; 							//Minimun force put on fracture fragments when fragged
public var fragOffScale: float = 1;					//Scales fracture fragments after fragged
public var rotateOnHit: int = 10; 					//Rotates randomly when hit (random degrees * fracture.hitPoints(0-1))
public var fragMass: float = 0.01; 					//Each fracture fragments mass
public var hitPointDecrease: float = .2; 			//Amount decreased from fracture fragment hitPoints(1 =100%) on mouse over or *collide magnitude
public var limitFragmentSpeed:float = 25;			//When using Box Colliders they sometimes overlap when activated and makes fragments fly far far away, this limitation will fix that
public var fragAllOnDamage:boolean;					//Destroys the entire object on any amount of damage.
			

@Header ("Collisions")
public var collidefragMagnitude = 0; 				//Fracture fragments on collision magnitude (0 disabled, 5 good, 25 max)
public var collideMask:LayerMask;					//Colliders in theese layers that can fragment object

@Header ("Particles")
public var fragEmitMinMax: Vector2 = Vector2(2, 4);


@Header ("Connections")
public var stickyTop: int; 							//Everything not connected to the bottom fragments frags off
public var stickyBottom: int; 						//Everything not connected to the top fragments frags off
public var connectedFragments: int = 3; 			//How many fragments needs to be connected before they break appart
public var connectOverlapSphere: float = .5; 		//Size of sphere connecting fragments
public var stickyMask:LayerMask = 1;				//Should contain layer containing fragments

@Header ("After Fragment")
public var disableMask:LayerMask;					//Once hitting a gameobject of this type the collider will be disabled.
public var disableDelay: float = 0; 				//Disables fracture fragments after fragged, 0 never disable. (seconds)
public var combineFrags:boolean = true;
public var combineMeshesDelay: int = 3; 			//Combines all fragments to one mesh after last fragged fragment+delay [seconds/10] (performance+++) (negative/zero=don't merge)

@HideInInspector 
public var startMesh:Transform; 					//Original mesh used when not fragmented
@HideInInspector	
public var fragParticles: ParticleSystem; 			//This will play on every frag
@HideInInspector	
public var dustParticles: ParticleSystem; 			//This will play on every hit
@HideInInspector 
public var reCounter: int = 1; 						//Counter for recombining fragments
@HideInInspector 
public var combinedFrags: GameObject; 				//Stores combined mesh
@HideInInspector 
public var meshFilters: MeshFilter[];
@HideInInspector
public var fragments: Transform;

@Header ("Change Materials")
public var fragMaterials:Material[];	

/// RESET FRAGMENTED OBJECT
function ResetFrags() {
	if (startMesh) this.startMesh.GetComponent.<Renderer>().enabled =true;
	fragParticles.Clear();
	for (var child: Transform in fragments) {
		child.GetComponent(FraggedChild).resetMe();
	}
	if (combinedFrags) {	
		Destroy(combinedFrags);		
	}
	if (!startMesh)
	reCombine();
}

function Start() {
	//// SETUP PARTICLES
	fragParticles = transform.Find("Particles Fragment").GetComponent(ParticleSystem);
	fragParticles.Stop();
	dustParticles = transform.Find("Particles Dust").GetComponent(ParticleSystem);
	dustParticles.Stop();
	startMesh = transform.Find("Original Mesh");
	fragments = transform.Find("Fragments");	
	meshFilters = new MeshFilter[fragments.transform.childCount];
	meshFilters = fragments.transform.GetComponentsInChildren. < MeshFilter > (true);	
	FindSticky();	
	if (!startMesh) CombineFrags();
	InvokeRepeating("reCombine", 1, 1);
	ChangeMaterials();
}

function ChangeMaterials(){
	for (var m:int = 0; m < fragMaterials.length; m++){
		for (var i:int = 0; i < fragments.childCount; i++) {	
			var child: Renderer = fragments.GetChild(i).GetComponent.<Renderer>();
			child.sharedMaterials = fragMaterials;	
		}	
	}
}

function FixedUpdate(){
	if (limitFragmentSpeed > 0 && !combinedFrags && !this.startMesh.GetComponent.<Renderer>().enabled) {
		for (var i:int = fragments.childCount; i > 0; i--) {
			var child: FraggedChild = fragments.GetChild(i - 1).GetComponent(FraggedChild);
				child.SpeedCheck();
		}
	}
}

function Compare(first: float, second: float) {
	return second.CompareTo(first);
}

function FragAll() {
	for (var i:int = fragments.transform.childCount; i > 0; i--) {
		var child: FraggedChild = fragments.GetChild(i - 1).GetComponent(FraggedChild);
			child.fragMe(200);
	}
}

function checkConnections() {
		if (stickyTop > 0 || stickyBottom > 0) {
			//set all connected to false
			var frag: FraggedChild;
			for (var i = stickyTop; i < meshFilters.length; i++) {
				frag = meshFilters[i].GetComponent(FraggedChild);
				frag.connected = false;
			}
			//checks connections upwards
			for (var j = stickyTop; j < meshFilters.length; j++) {
				frag.checkConnections();
				frag = meshFilters[j].GetComponent(FraggedChild);
			}
			// checks connections down
			for (var u = meshFilters.length - stickyBottom - 1; u >= stickyTop; u--) {
				frag = meshFilters[u].GetComponent(FraggedChild);
				if (!frag.fragged) {
					frag.checkConnections();
					if (!frag.connected) frag.fragMe(2);
				}
			}
		}
	}
// FIND STICKY FRAGMENTS
function FindSticky() {
		if (stickyTop > 0 || stickyBottom > 0) {
			//JS
			meshFilters.Sort(meshFilters, function(g1, g2) Compare(g1.transform.position.y, g2.transform.position.y));	
			//C# ADD using System.Linq;
			//meshFilters = meshFilters.OrderByDescending( x => x.transform.position.y).ToArray(); 
			for (var j:int = 0; j < stickyTop; j++) {
				var g: FraggedChild = meshFilters[j].GetComponent(FraggedChild);
				g.stickyFrag = true;
			}
			for (var i:int = meshFilters.Length - stickyBottom; i < meshFilters.Length; i++) {
				var k: FraggedChild = meshFilters[i].GetComponent(FraggedChild);
				k.stickyFrag = true;
			}
		}
	}

function Contains(l: ArrayList, n: String) {
	for (var i: int = 0; i < l.Count; i++) {
		if ((l[i] as Material).name == n) {
			return i;
		}
	}
	return -1;
}

function EnableRenderers() {
	for (var child: Transform in fragments) {
		child.GetComponent.<Renderer>().enabled = true;
	}
}

//// COMBINE FRAGMENTS TO A SINGLE MESH
function CombineFrags() {
	if (!combinedFrags && !this.startMesh.GetComponent.<Renderer>().enabled) {
		combinedFrags = new GameObject();
		combinedFrags.name = "Combined Fragments";
		combinedFrags.gameObject.AddComponent(MeshFilter);
		combinedFrags.gameObject.AddComponent(MeshRenderer);
		if (meshFilters.Length == 0) {
			meshFilters = new MeshFilter[fragments.transform.childCount];
			meshFilters = fragments.transform.GetComponentsInChildren. < MeshFilter > (true);
		}
		var materials: ArrayList = new ArrayList();
		var combineInstanceArrays: ArrayList = new ArrayList();
		for (var i = 0; i < meshFilters.length; i++) {
			var meshFilterss: MeshFilter[] = meshFilters[i].GetComponentsInChildren. < MeshFilter > ();
			for (var meshFilter: MeshFilter in meshFilterss) {
				var meshRenderer: MeshRenderer = meshFilter.GetComponent(MeshRenderer);
				var c: FraggedChild = meshFilter.transform.GetComponent(FraggedChild);
				if (c && c.fragged == false || c && combineFrags) { //&& c.fragged == false) {
					c.fragged = false;
					c.hitPoints = 1;
					
					meshFilters[i].transform.gameObject.GetComponent(Renderer).enabled = false;
					meshFilters[i].GetComponent.<Rigidbody>().isKinematic = true;
					for (var o: int = 0; o < meshFilter.sharedMesh.subMeshCount; o++) {
						var materialArrayIndex: int = Contains(materials, meshRenderer.sharedMaterials[o].name);
						if (materialArrayIndex == -1) {
							materials.Add(meshRenderer.sharedMaterials[o]);
							materialArrayIndex = materials.Count - 1;
						}
						combineInstanceArrays.Add(new ArrayList());
						var combineInstance: CombineInstance = new CombineInstance();
						combineInstance.transform = meshRenderer.transform.localToWorldMatrix;
						combineInstance.subMeshIndex = o;
						combineInstance.mesh = meshFilter.sharedMesh;
						(combineInstanceArrays[materialArrayIndex] as ArrayList).Add(combineInstance);
					}
				}
			}
		}	
		var meshes: Mesh[] = new Mesh[materials.Count];
		var combineInstances: CombineInstance[] = new CombineInstance[materials.Count];
		for (var m: int = 0; m < materials.Count; m++) {
			var combineInstanceArray: CombineInstance[] = (combineInstanceArrays[m] as ArrayList).ToArray(typeof(CombineInstance)) as CombineInstance[];
			meshes[m] = new Mesh();
			meshes[m].CombineMeshes(combineInstanceArray, true, true);
			combineInstances[m] = new CombineInstance();
			combineInstances[m].mesh = meshes[m];
			combineInstances[m].subMeshIndex = 0;
		}		
		combinedFrags.GetComponent(MeshFilter).sharedMesh = new Mesh();
		combinedFrags.GetComponent(MeshFilter).sharedMesh.CombineMeshes(combineInstances, false, false);
		for (var mesh: Mesh in meshes) {
			mesh.Clear();
			DestroyImmediate(mesh);
		}
		var meshRendererCombine: MeshRenderer = combinedFrags.GetComponent(MeshFilter).GetComponent(MeshRenderer);
		if (!meshRendererCombine) meshRendererCombine = gameObject.AddComponent(MeshRenderer);
		var materialsArray: Material[] = materials.ToArray(typeof(Material)) as Material[];
		meshRendererCombine.materials = materialsArray;	
		if (Application.isEditor && !Application.isPlaying && combinedFrags.transform.parent != transform) combinedFrags.transform.parent = transform;
	}
}

function ReleaseFrags(editor: boolean) {
	if (combinedFrags != null) {
		for (var i = 0; i < meshFilters.length; i++) {
			meshFilters[i].transform.gameObject.GetComponent(Renderer).enabled = true;
		}		
		Destroy(combinedFrags);		
	}
}

function reCombine() {
	if (!startMesh || !startMesh.GetComponent.<Renderer>().enabled) {
		if (combineMeshesDelay >= 0 && combinedFrags == null && reCounter > combineMeshesDelay) {
			CombineFrags();			
		} else if (reCounter <= combineMeshesDelay) {
			reCounter++;
		}
	}
}