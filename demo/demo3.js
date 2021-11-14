var scene, camera, renderer, mesh, container, canvas;
var element, controls;
var meshFloor, ambientLight, light;

var defaultPhongMaterial;
var originBox;
var health = [];
var keyboard = {};
var USE_WIREFRAME = false;
var objects = [];
var gltfobject = [];
var fugitiveCube;
var refrigeratordoor;
var rft;
var player = { height: 2.5, speed: 0.2, turnSpeed: Math.PI * 0.005 };
var updateFcts = [];
var lavaMaterial;
var clickRef = false;
var axisWidth = 0.2;
var axisLength = 10;
var alarmWidth = 0.2;
var alarmLength = 10;
var display;
var display2;
var chest;

///////////////////////////////////get shader////////////////////////////////////
getShader = function (shaderStr) {
   return shaderStr.replace(/#include\s+(\S+)/gi, function (match, p1) {
      var chunk = THREE.ShaderChunk[p1];
      return chunk ? chunk : "";
   });
};
/////////////////////////////////////////////////////////////////////////////////


var armLeft, armRight, legLeft, legRight;
let keybindings = {};
const color = 0xFFFFFF;
const WIDTH = window.outerWidth;
const HEIGHT = window.outerHeight;
const ASPECT = WIDTH / HEIGHT;
// An object to hold all the things needed for our loading screen
var loadingManager = null;
var RESOURCES_LOADED = false;
var updateFcts = [];

var degra = (degree) => {
   return degree * (Math.PI / 180);
}

///////////////////////////////////get shader////////////////////////////////////
getShader = function (shaderStr) {
   return shaderStr.replace(/#include\s+(\S+)/gi, function (match, p1) {
      var chunk = THREE.ShaderChunk[p1];
      return chunk ? chunk : "";
   });
};
/////////////////////////////////////////////////////////////////////////////////


window.onload = function init() {
   scene = new THREE.Scene();
   scene.background = 0xffffff;
   camera = new THREE.PerspectiveCamera(90, ASPECT, 0.1, 100);
   renderer = new THREE.WebGLRenderer({ antialias: true });
   renderer.setSize(WIDTH, HEIGHT);
   document.body.appendChild(renderer.domElement);
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.BasicShadowMap;
   display = document.getElementById("time");
   display2 = document.getElementById("result");
   // player!!!!!!!!!
   addPlayer();

   ////////////////////////////SELECT YOUR ENVIRONMENT////////////////////////////////////
   THREE.ImageUtils.crossOrigin = '';
   ///////////////////space//////////////////////


   scene.fog = new THREE.Fog(0x080808, 40, 80);

   var unitCubeGeometry = new THREE.BoxGeometry(1, 1, 1);

   // SCENE AXES:    (x,y,z) drawn in (red,greeen,blue)
   var redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
   var greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
   var blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
   var xAxis = new THREE.Mesh(unitCubeGeometry, redMaterial);
   var yAxis = new THREE.Mesh(unitCubeGeometry, greenMaterial);
   var zAxis = new THREE.Mesh(unitCubeGeometry, blackMaterial);

   originBox = new THREE.Mesh(unitCubeGeometry, blackMaterial);
   originBox.visible = false;
   originBox.position.set(0, 0, 0);
   scene.add(originBox);
   xAxis.parent = yAxis.parent = zAxis.parent = originBox;


   //////////////////////////////////lava texture////////////////////////////////
   var noiseTexture = new THREE.TextureLoader().load("images/noise.jpg");
   noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

   var lavaTexture = new THREE.TextureLoader().load('images/lava1.jpg');
   lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

   this.lavaUniforms =
      ({
         resolution: { type: "v2", value: new THREE.Vector2() },
         baseTexture: { type: "t", value: lavaTexture },
         baseSpeed: { type: "f", value: 0.05 },
         noiseTexture: { type: "t", value: noiseTexture },
         noiseScale: { type: "f", value: 0.5337 },
         alpha: { type: "f", value: 1.0 },
         time: { type: "f", value: 1.0 }
      });

   lavaMaterial = new THREE.ShaderMaterial(
      {
         uniforms: lavaUniforms,
         vertexShader: document.getElementById('vertexShader').textContent,
         fragmentShader: document.getElementById('guardfragmentShader').textContent
      });



   //var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
   var floorTexture = new THREE.TextureLoader().load('images/chessboard.png');
   floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
   floorTexture.repeat.set(2, 2);
   var floorMaterial = new THREE.MeshLambertMaterial({ map: floorTexture, side: THREE.DoubleSide });
   var floorGeometry = new THREE.PlaneGeometry(30, 30);
   var floor = new THREE.Mesh(floorGeometry, floorMaterial);

   floor.position.y = -0.1;

   floor.rotation.x = Math.PI / 2;

   floor.receiveShadow = true;
   scene.add(floor);
   floor.parent = originBox;
   /////////////////플로어끝

   //일단 175~ 미니큐브 생략 그 위에 텍스쳐도 생략


   //191~ 얼스 패스

   this.clock = new THREE.Clock();

   //자 지금부터 플레이어 

   lightColor = new THREE.Color(1, 1, 1);
   ambientColor = new THREE.Color(0.5, 0.5, 0.5);
   lightPosition = new THREE.Vector3(1, 1, 1);
   //Customize fugitive texture
   var textures = [new THREE.TextureLoader().load('images/polishedmarble.jpg'),
   new THREE.TextureLoader().load('images/oldwall.jpg'),
   new THREE.TextureLoader().load('images/metal.jpg'),
   new THREE.TextureLoader().load('images/sweater.jpg'),
   new THREE.TextureLoader().load('images/bark.jpg'),
   new THREE.TextureLoader().load('images/sulley.jpg')
   ]
   //choose your texture;
   this.textureOption = 0;
   var fugitiveTxr = textures[textureOption];



   //FUGITIVE CUBE - player control

   var fugitiveCubeGeometry = new THREE.BoxGeometry(1, 1, 1); //box object

   ///////////////////////////Water Fugitive//////////////////////////////////
   var waterTexture = new THREE.TextureLoader().load('images/water.jpg');
   waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;

   this.waterUniforms = {
      //fogDensity: { type: "f", value: scene.fogDensity },
      //fogColor: { type: "v3", value: scene.fogColor},
      baseTexture: { type: "t", value: waterTexture },
      baseSpeed: { type: "f", value: 1.15 },
      noiseTexture: { type: "t", value: noiseTexture },
      noiseScale: { type: "f", value: 0.2 },
      alpha: { type: "f", value: 0.8 },
      time: { type: "f", value: 1.0 }
   };

   var waterMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      opacity: 0,
      transparent: true,
   });
   waterMaterial.transparent = true;
   fugitiveCube = new THREE.Object3D();

   fugitiveCube = new THREE.Mesh(fugitiveCubeGeometry, waterMaterial); //mesh box and illumination material
   ///////////////////////////Water Fugitive//////////////////////////////////
   scene.add(fugitiveCube); //add to scene
   fugitiveCube.scale.set(0.5, 0.5, 0.5);
   //fugitiveCube.position.set(camera.position.x - 1, camera.position.y + 1, camera.position.z - 4); //reposition
   //fugitiveCube.parent = originBox; // make it a child of the rotating checkerboard


   this.fugitivePlayer = new THREE.Mesh();
   this.waterMode = false;
   if (waterMode) {
      fugitivePlayer = new THREE.Mesh(fugitiveCubeGeometry, waterMaterial); //mesh box and illumination material
   } else {
      fugitivePlayer = new THREE.Mesh(fugitiveCubeGeometry, waterMaterial); //mesh box and illumination material
   }

   fugitiveCube.add(fugitivePlayer);

   //////////////////
   //OBSTACLES - alarms and guards
   var redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 });
   var greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
   var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });

   var alarm1 = new THREE.Mesh(unitCubeGeometry, redMaterial);
   alarm1.scale.set(axisWidth, axisLength, axisWidth);
   alarm1.position.set(9.5, 0.5 * alarmLength, -9.5);
   scene.add(alarm1);
   alarm1.parent = originBox;

   var outlineMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.BackSide });
   var outlineMesh1 = new THREE.Mesh(unitCubeGeometry, outlineMaterial1);
   outlineMesh1.position = alarm1.position;
   outlineMesh1.scale.set(0.5 * axisWidth, 1.0, 0.5 * axisWidth);
   alarm1.add(outlineMesh1);

   loadOBJguard('obj/male02.obj', 0.04, 13, 0, -2, 0, 0, 0);

   // LIGHT
   guardLight1 = new THREE.PointLight(0xFFAB95);
   guardLight1.position.set(13, 0, -2);
   guardLight1.intensity = 0.4;
   scene.add(guardLight1);
   guardLight1.parent = originBox;

   var alarm3 = new THREE.Mesh(unitCubeGeometry, redMaterial);
   scene.add(alarm3);
   alarm3.scale.set(axisWidth, axisLength, axisWidth);
   alarm3.position.set(-5.4, 0.5 * alarmLength, -9.6);
   alarm3.parent = originBox;

   var outlineMesh3 = new THREE.Mesh(unitCubeGeometry, outlineMaterial1);
   outlineMesh3.position = alarm3.position;
   outlineMesh3.scale.set(0.5 * axisWidth, 1.0, 0.5 * axisWidth);
   alarm3.add(outlineMesh3);

   var alarm4 = new THREE.Mesh(unitCubeGeometry, redMaterial);
   scene.add(alarm4);
   alarm4.scale.set(axisWidth, axisLength, axisWidth);
   alarm4.position.set(2, 0.5 * alarmLength, 13);
   alarm4.parent = originBox;

   var outlineMesh4 = new THREE.Mesh(unitCubeGeometry, outlineMaterial1);
   outlineMesh4.position = alarm4.position;
   outlineMesh4.scale.set(0.5 * axisWidth, 1.0, 0.5 * axisWidth);
   alarm4.add(outlineMesh4);

   var alarm5 = new THREE.Mesh(unitCubeGeometry, redMaterial);
   scene.add(alarm5);
   alarm5.scale.set(axisWidth, axisLength, axisWidth);
   alarm5.position.set(-5.6, 0.5 * alarmLength, 2);
   alarm5.parent = originBox;

   var outlineMesh5 = new THREE.Mesh(unitCubeGeometry, outlineMaterial1);
   outlineMesh5.position = alarm5.position;
   outlineMesh5.scale.set(0.5 * axisWidth, 1.0, 0.5 * axisWidth);
   alarm5.add(outlineMesh5);

   var alarm6 = new THREE.Mesh(unitCubeGeometry, redMaterial);
   scene.add(alarm6);
   alarm6.scale.set(axisWidth, axisLength, axisWidth);
   alarm6.position.set(2, 0.5 * alarmLength, -5.4);
   alarm6.parent = originBox;

   var outlineMesh6 = new THREE.Mesh(unitCubeGeometry, outlineMaterial1);
   outlineMesh6.position = alarm6.position;
   outlineMesh6.scale.set(0.5 * axisWidth, 1.0, 0.5 * axisWidth);
   alarm6.add(outlineMesh6);

   var alarm7 = new THREE.Mesh(unitCubeGeometry, redMaterial);
   scene.add(alarm7);
   alarm7.scale.set(axisWidth, axisLength, axisWidth);
   alarm7.position.set(9.4, 0.5 * alarmLength, 2);
   alarm7.parent = originBox;

   var outlineMesh7 = new THREE.Mesh(unitCubeGeometry, outlineMaterial1);
   outlineMesh7.position = alarm7.position;
   outlineMesh7.scale.set(0.5 * axisWidth, 1.0, 0.5 * axisWidth);
   alarm7.add(outlineMesh7);

   var alarm8 = new THREE.Mesh(unitCubeGeometry, redMaterial);
   scene.add(alarm8);
   alarm8.scale.set(axisWidth, axisLength, axisWidth);
   alarm8.position.set(13, 0.5 * alarmLength, 3.5);
   alarm8.parent = originBox;

   var outlineMesh8 = new THREE.Mesh(unitCubeGeometry, outlineMaterial1);
   outlineMesh8.position = alarm8.position;
   outlineMesh8.scale.set(0.5 * axisWidth, 1.0, 0.5 * axisWidth);
   alarm8.add(outlineMesh8);

   createAlarm(24, -3.6);
   createAlarm(29, -1.7);
   createAlarm(19, -8.3);
   createAlarm(23.5, 7.2);
   createAlarm(56, 4.2);
   createAlarm(47, -2.4);
   createAlarm(65, 0);
   createAlarm(24.6, 11);
   createAlarm(53.6, -8.2);
   createAlarm(73, 4.9);
   createAlarm(56, -13);
   createAlarm(48, 13);
   createAlarm(69, -8.2);
   createAlarm(32, 2.1);
   createAlarm(62.5, -3);
   createAlarm(34.7, 7);
   createAlarm(38.2, -6.9);
   createAlarm(41, 6.7);
   createAlarm(53, 7.6);
   createAlarm(28, 13.6);
   createAlarm(77, 6.4);
   createAlarm(67, 8.5);
   createAlarm(52, -6.3);
   createAlarm(71, -4.3);
   createAlarm(75, -7.7);

   loadOBJguard('obj/male02.obj', 0.04, -13, 0, -2, 0, 0, 0);
   // LIGHT
   guardLight2 = new THREE.PointLight(0xFFAB95);
   guardLight2.position.set(-13, 0, -2);
   guardLight2.intensity = 0.5;
   scene.add(guardLight2);
   guardLight2.parent = originBox;


   ///////////////////////////Life Bar///////////////////////////////
   // image material translucence
   var heartGeo = new THREE.PlaneGeometry(1, 1, 1, 1);
   var heartTexture = new THREE.TextureLoader().load('images/life.png');


   function buildHealth() {
      for (var j = 0; j < health.length; j++) {
         scene.remove(health[j]);
      };

      for (var i = 0; i < 4; i++) {
         heart = new THREE.Mesh(heartGeo, new THREE.MeshLambertMaterial({ map: heartTexture, transparent: true, opacity: 0.75 }));
         scene.add(heart);
         heart.material.side = THREE.DoubleSide;
         heart.parent = fugitiveCube;
         heart.scale.set(0.4, 0.4, 0.5);
         heart.translateY(1);
         heart.translateX(-0.4 + (i) / 100);
         heart.translateZ((i) / 2 - 0.7);
         health.push(heart);

      };
      
   };
   buildHealth();




   startTimer(3000, display);
   remainTime(3000, display2)


   /////////////////////////////////////////////////
   loadingManager = new THREE.LoadingManager();

   loadingManager.onProgress = function (item, loaded, total) {
      console.log(item, loaded, total);
   };

   loadingManager.onLoad = function () {
      console.log("loaded all resources");
      RESOURCES_LOADED = true;
   };


   mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0xff4444, wireframe: USE_WIREFRAME })
   );
   mesh.position.y += 1;
   mesh.position.x = -25;
   mesh.receiveShadow = true;
   mesh.castShadow = true;
   scene.add(mesh);


   ambientLight = new THREE.AmbientLight(0xB6B6B6, 0.2);
   scene.add(ambientLight);

   const pointLight = new THREE.PointLight(0xFFDB9C, 1, 2);
   pointLight.position.set(-25, 5, 0);
   pointLight.castShadow = true;
   pointLight.shadow.camera.near = 0.1;
   pointLight.shadow.camera.far = 25;
   scene.add(pointLight);


   const slight = new THREE.SpotLight(0xB6B6B6, 1, 0, Math.PI / 4, 0.7);
   slight.position.set( 135, 5, 0);
   slight.target.position.set( 135, 0, 0);
   scene.add(slight);
   slight.target.updateMatrixWorld();
   scene.add(slight.target);
   slight.shadow.camera.fov = 30;
   slight.castShadow = true;
   slight.shadow.camera.near = 0.1;
   slight.shadow.camera.far = 25;

   //***************************************************
   //Set camera position 
   camera.position.set(-30, player.height, -5);
   camera.lookAt(new THREE.Vector3(0, player.height, 0));


   //***************************************************************
   //object load
   var lamp;
   var desk;
   var computer;
   var mirror;
   var bookcase;
   var chair;
   var shelf;
   var refrigerator;
   var door;
   

   //function gltfLoader(obj, add, scale_x, scale_y, scale_z, posX, posY, posZ, rotX, rotY, rotZ)
   gltfLoader(lamp, './models/lamp.gltf', 20, 20, 20, -33, 2, -10, 'z', Math.PI, false, false);
   gltfLoader(desk, './models/desk.gltf', 3, 3, 3, -25, 1, 8.5, 'z', Math.PI, false, false);
   gltfLoader(computer, './models/computer.gltf', 2, 2, 2, -25, 3.5, 8.5, 'z', Math.PI, false, false);
   gltfLoader(mirror, './models/mirror.gltf', 3, 3, 3, -34.5, 6, 7, 'x', Math.PI, false, false);
   gltfLoader(bookcase, './models/bookcase.gltf', 0.1, 0.1, 0.1, -25, 0, -9, '0', Math.PI, false, false);
   gltfLoader(chair, './models/chair.gltf', 0.3, 0.3, 0.3, -25, 2.5, 3, '0', Math.PI, false, false);
   gltfLoader(shelf, './models/shelf.gltf', 0.03, 0.03, 0.03, -34, 0, -5, 'z', Math.PI / 2, false, false);
   gltfLoader(door, './models/scene.gltf', 0.01, 0.01, 0.01, 80, 0, 0, 'z', Math.PI / 2, false, true);
   gltfLoader(chest, './models/chest.gltf', 2, 2, 2, 135, 1, 0, 'z', Math.PI / 2, false, false);
   gltfLoader(refrigerator, './models/refrigerator.gltf', 0.09, 0.09, 0.09, -17.2, 0, 2, '0', Math.PI, true, false);



   createFloor(100, 0, 0, 300, 30, 0xffffff);
   createCeiling(100, 10, 0, 300, 30, 0xffffff)

   createWall(-25, 10, 5, 20.00, 10, 0, "rgb(130, 157, 180)"); //w1_front
   createWall(-15, 9, 5, 15, 10, Math.PI / 2, "rgb(130, 157, 180)"); //w1_left
   createWall(-15, -10, 5, 15, 10, Math.PI / 2, "rgb(130, 157, 180)"); //w1_left
   createWall(-15, 0, 8.5, 6, 3, Math.PI / 2, "rgb(130, 157, 180)"); //w1_left
   createWall(-35, 0, 5, 20.00, 10, Math.PI / 2, "rgb(130, 157, 180)"); //w1_right
   createWall(-25, -10, 5, 20.00, 10, 0, "rgb(130, 157, 180)"); //w1_back
   createWall(-25, -10, 5, 20.00, 10, 0, "rgb(130, 157, 180)"); //w1_back

   createWall(80, 10, 5, 15, 10, Math.PI / 2, "rgb(130, 157, 180)"); //w2_left
   createWall(80, -10, 5, 15, 10, Math.PI / 2, "rgb(130, 157, 180)"); //w2_left
   createWall(80, 0, 8.5, 6, 3, Math.PI / 2, "rgb(130, 157, 180)"); //w2_left
   newwall(300, 30, 20);


   createproblem(90, -7, 4, 3 * Math.PI / 2, 'images/problem1.png');
   createproblem(90, 7, 4, 3 * Math.PI / 2, 'images/problem2.png');
   createproblem(105, -7, 4, 3 * Math.PI / 2, 'images/problem3.png');
   createproblem(105, 7, 4, 3 * Math.PI / 2, 'images/problem4.png');
   createproblem(120, -7, 4, 3 * Math.PI / 2, 'images/problem5.png');
   createproblem(120, 7, 4, 3 * Math.PI / 2, 'images/problem6.png');

   var randomScale = 1;
   var wallTexture = new THREE.TextureLoader().load("./images/sky.jpg");
   var wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

   var meshFloor = new THREE.Mesh(new THREE.BoxGeometry(30, 12, player.height / 3.5, 8), wallMaterial);
   // Create the meshFloor.
   meshFloor.position.set(140, 5, 0);
   meshFloor.scale.x = meshFloor.scale.y = meshFloor.scale.z = randomScale;
   meshFloor.rotation.y = Math.PI / 2;
   meshFloor.receiveShadow = true;
   meshFloor.castShadow = true;
   scene.add(meshFloor);

   var w1  = new THREE.Mesh(new THREE.BoxGeometry(18, 10, player.height / 3.5, 8), wallMaterial);
   w1.position.set(130, 5, -13);
   w1.scale.x = meshFloor.scale.y = meshFloor.scale.z = randomScale;
   w1.rotation.x = - degra(0)
   w1.receiveShadow = true;
   w1.castShadow = true;
   scene.add(w1);
   var w2  = new THREE.Mesh(new THREE.BoxGeometry(18, 10, player.height / 3.5, 8), wallMaterial);
   w2.position.set(130, 5, 13);
   w2.scale.x = meshFloor.scale.y = meshFloor.scale.z = randomScale;
   w2.rotation.x = - degra(0)
   w2.receiveShadow = true;
   w2.castShadow = true;
   scene.add(w2);
   animate();
}
//*********************************************
//create problem
function createproblem(posX, posZ, posY, rotate, src) {

   var bkrunnerTexture = new THREE.ImageUtils.loadTexture(src);
   //annie = new TextureAnimator( runnerTexture, 1, 1, 1, 1 ); // texture, #horiz, #vert, #total, duration.
   var bkrunnerMaterial = new THREE.MeshBasicMaterial({ map: bkrunnerTexture, side: THREE.DoubleSide });
   var bkrunnerGeometry = new THREE.PlaneGeometry(14, 15, 10);
   bkrunner = new THREE.Mesh(bkrunnerGeometry, bkrunnerMaterial);
   bkrunner.position.set(posX, posY, posZ);
   bkrunner.rotation.y = rotate;
   scene.add(bkrunner);
}
// create wall


function newwall(dimX, dimY, dimZ) {
   var wallTexture = new THREE.TextureLoader().load("./models/textures/wall_baseColor.png");
   wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
   wallTexture.repeat.set(300, 30);
   var wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

   var farWall = new THREE.Mesh(new THREE.BoxGeometry(dimX, dimZ, player.height / 3.5, 8), wallMaterial);
   farWall.side = THREE.DoubleSide;
   farWall.position.y = (dimZ / 2);
   farWall.position.x = 100;
   farWall.position.z = -(dimY / 2);
   farWall.rotation.x = - degra(0);
   farWall.receiveShadow = true;
   farWall.castShadow = true;
   scene.add(farWall);


   var nearWall = new THREE.Mesh(new THREE.BoxGeometry(dimX, dimZ, player.height / 3.5, 8), wallMaterial);
   nearWall.side = THREE.DoubleSide;
   nearWall.position.y = (dimZ / 2);
   nearWall.position.x = 100;
   nearWall.position.z = (dimY / 2);
   nearWall.rotation.x = - degra(0);
   scene.add(nearWall);

}
function createWall(posX, posZ, posY, xlength, zlength, rotate, color) {
   // Set some random values so our trees look different.
   var randomScale = 1;
   var wallTexture = new THREE.TextureLoader().load("./models/textures/wall_baseColor.png");
   wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
   wallTexture.repeat.set(300, 30);
   var wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

   var meshFloor = new THREE.Mesh(new THREE.BoxGeometry(xlength, zlength, player.height / 3.5, 8), wallMaterial);
   // Create the meshFloor.
   meshFloor.position.set(posX, posY, posZ);
   meshFloor.scale.x = meshFloor.scale.y = meshFloor.scale.z = randomScale;
   meshFloor.rotation.y = rotate;
   meshFloor.receiveShadow = true;
   meshFloor.castShadow = true;
   scene.add(meshFloor);

}

//*********************************************
// create ceiling
function createCeiling(posX, posY, posZ, xlength, zlength, color) {
   // Set some random values so our trees look different.d
   var randomScale = 1;
   var wallTexture = new THREE.TextureLoader().load("./models/textures/floortile1_baseColor.png");
   wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
   wallTexture.repeat.set(300, 30);
   var wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
   var ceiling = new THREE.Mesh(new THREE.BoxGeometry(xlength, zlength, player.height / 3.5, 5), wallMaterial);

   ceiling.position.set(posX, posY, posZ);
   ceiling.scale.x = ceiling.scale.y = ceiling.scale.z = randomScale;
   ceiling.rotation.x -= Math.PI / 2;
   ceiling.receiveShadow = true;
   ceiling.castShadow = true;
   refrigeratordoor = ceiling;
   scene.add(ceiling);

}

//***************************************************************
// create floor
function createFloor(posX, posY, posZ, width, height, color) {

   var groundTexture = new THREE.TextureLoader().load("./models/textures/floortile1_baseColor.png");
   groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
   groundTexture.repeat.set(300, 30);
   var groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });

   var meshFloor = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 10, 10), groundMaterial);
   meshFloor.rotation.x -= Math.PI / 2;
   meshFloor.position.set(posX, posY, posZ);
   meshFloor.receiveShadow = true;
   meshFloor.castShadow = true;
   scene.add(meshFloor);

}
//***************************************************************
// load gltf
// direction방향으로 num만큼 회전하는 gltf loader
function gltfLoader(obj, add, scale_x, scale_y, scale_z, posX, posY, posZ, direction, num, isdoor, dooris) {
   const gltf = new THREE.GLTFLoader();
   gltf.load(add, function (gltf) {
      gltf.scene.traverse(function (node) {
         if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
         }
      });
      scene.add(gltf.scene);
      obj = gltf.scene.children[0];
      obj.scale.set(scale_x, scale_y, scale_z);

      if (direction == 'z') {
         obj.rotation.z -= num;
      }
      else if (direction == 'x') {
         obj.rotation.x -= num;
      }
      else if (direction == 'y') {
         obj.rotation.y -= num;
      }
      else {

      }
      obj.position.set(posX, posY, posZ)
      scene.add(obj);
      if (isdoor) {
         rft = obj;
         console.log(obj);
      }
      if (dooris) {
         door = obj;
         console.log(obj);
      }
   });
}

//***************************************************************
// animation
function animate() {

   // This block runs while resources are loading.

   requestAnimationFrame(animate);
   requestAnimationFrame(rotateHeart);
   mesh.rotation.x += 0.01;
   mesh.rotation.y += 0.02;

   //inputHandler();
   fugitiveCube.position.set(camera.position.x - Math.sin(camera.rotation.y) * 1, camera.position.y - 1, camera.position.z + Math.cos(camera.rotation.y) * 1); //reposition
   //move();
   //updateLimbs();
   resize();

   renderer.render(scene, camera);
}

function addPlayer() {
   armRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 1.2),
      new THREE.MeshPhongMaterial({
         color,
         opacity: 0,
         transparent: true,
      })
   );
   armRight.position.set(
      camera.position.x - 1, camera.position.y + 1, camera.position.z - 4
   );
   armRight.receiveShadow = true;
   armRight.castShadowd = true;

   armLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 1.2),
      new THREE.MeshPhongMaterial({
         color,
         opacity: 0,
         transparent: true,
      })
   );
   armLeft.position.set(
      camera.position.x + 1, camera.position.y + 1, camera.position.z - 4
   );
   armLeft.receiveShadow = true;
   armLeft.castShadow = true;

   scene.add(armRight);
   scene.add(armLeft);
}
function updateLimbs() {

   armLeft.position.set(
      camera.position.x - 0.5, camera.position.y - 0.5, camera.position.z + 0.5
   );
   //armLeft.position.set(
   //    camera.position.x + 0.5, camera.position.y - 0.5, camera.position.z + 0.5
   // );

}
// Key Eventlisteners
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('keyup', function (event) {
   keybindings[event.keyCode] = false;
});
window.addEventListener('keydown', function (event) {
   keybindings[event.keyCode] = true;
   if (keybindings[87]) {  // W key
      camera.position.x -= (Math.sin(camera.rotation.y) * player.speed) * 2;
      camera.position.z -= (-Math.cos(camera.rotation.y) * player.speed) * 2;
      move();
      collision();
   }
   if (keybindings[83]) {  // S key
      camera.position.x += (Math.sin(camera.rotation.y) * player.speed) * 2;
      camera.position.z += (-Math.cos(camera.rotation.y) * player.speed) * 2;
      move();
      collision();
   }
   if (keybindings[65]) {  // A key
      camera.position.x += (Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) * 2;
      camera.position.z += (-Math.cos(camera.rotation.y + Math.PI / 2) * player.speed) * 2;
      move();
      collision();
   }
   if (keybindings[68]) {  // D key
      camera.position.x += (Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) * 2;
      camera.position.z += (-Math.cos(camera.rotation.y - Math.PI / 2) * player.speed) * 2;
      move();
      collision();
   }

   if (keybindings[37]) {  // left arrow key
      camera.rotation.y -= Math.PI * player.turnSpeed;
      fugitiveCube.rotation.y += Math.PI * player.turnSpeed;
      //fugitiveCube.position.set(camera.position.x - Math.sin(camera.rotation.y) * 1, camera.position.y - 1, camera.position.z + Math.cos(camera.rotation.y) * 1); //reposition
      move();
   }
   if (keybindings[39]) {  // right arrow key
      camera.rotation.y += Math.PI * player.turnSpeed;
      fugitiveCube.rotation.y -= Math.PI * player.turnSpeed;
      //fugitiveCube.position.set(camera.position.x - Math.sin(camera.rotation.y) * 1, camera.position.y - 1, camera.position.z + Math.cos(camera.rotation.y) * 1); //reposition
      move();
   }


});

// Set Input functions
function keyDown(event) {
   keybindings[event.keyCode] = true;
}
function keyUp(event) {
   keybindings[event.keyCode] = false;
}
// Window function
function resize() {
   renderer.setSize(WIDTH, HEIGHT);
   camera.aspect = ASPECT;

   camera.updateProjectionMatrix();
}


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var runner, frrunner, bkrunner;
var clicked1 = false;
var clicked2 = false;
var clicked3 = false;
var mclear = true;
var bclear = false;
var fclear = false;


// See https://stackoverflow.com/questions/12800150/catch-the-click-event-on-a-specific-mesh-in-the-renderer
// Handle all clicks to determine of a three.js object was clicked and trigger its callback
function onDocumentMouseDown(event) {

   event.preventDefault();

   mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
   mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

   raycaster.setFromCamera(mouse, camera);


   // three.js objects with click handlers we are interested in
   // three.js objects with click handlers we are interested in
   var intersects = raycaster.intersectObjects(scene.children, true);


   if (intersects.length > 0) {
      console.log("intersects[meshObjects]:", intersects[0].object);

      if (intersects[0].object == refrigeratordoor) {
         if (mclear == true) {
            console.log("refrigerator");
            rftAnimate();
            console.log(refrigeratordoor);
         }
      }
      if (intersects[0].object == mesh) {
         const light = new THREE.SpotLight(0xB6B6B6, 1, 0, Math.PI / 4, 0.7);
         light.position.set(-25, 7, 0);
         light.target.position.set(-25, 0, 0);
         scene.add(light);
         light.target.updateMatrixWorld();
         scene.add(light.target);
         light.shadow.camera.fov = 30;
         light.castShadow = true;
         light.shadow.camera.near = 0.1;
         light.shadow.camera.far = 25;
         ambientLight = new THREE.AmbientLight(0xB6B6B6, 0.5);
         scene.add(ambientLight);

      }
      if (intersects[0].object.name == 'defaultMaterial_4') {
         if (bclear == true) {
            if (clicked1 == false) {
               var runnerTexture = new THREE.ImageUtils.loadTexture('images/motest.png');
               //annie = new TextureAnimator( runnerTexture, 1, 1, 1, 1 ); // texture, #horiz, #vert, #total, duration.
               var runnerMaterial = new THREE.MeshBasicMaterial({ map: runnerTexture, side: THREE.DoubleSide });
               var runnerGeometry = new THREE.PlaneGeometry(5, 5, 2);
               runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
               runner.position.set(-25, 5, 17 - 6 * (Math.pow(2, 1 / 2)));
               runner.rotation.y = Math.PI;
               scene.add(runner);
               clicked1 = true;
               mclear = true;
            } else if (clicked1 == true) {
               scene.remove(runner);
               clicked1 = false;
            }
         }
      }

      if (intersects[0].object.name == 'mesh_0') {
         if (clicked2 == false) {
            var frrunnerTexture = new THREE.ImageUtils.loadTexture('images/mirrortest.png');
            //annie = new TextureAnimator( runnerTexture, 1, 1, 1, 1 ); // texture, #horiz, #vert, #total, duration.
            var frrunnerMaterial = new THREE.MeshBasicMaterial({ map: frrunnerTexture, side: THREE.DoubleSide });
            var frrunnerGeometry = new THREE.PlaneGeometry(3, 2, 3);
            frrunner = new THREE.Mesh(frrunnerGeometry, frrunnerMaterial);
            frrunner.position.set(-34.5, 6, 7);
            frrunner.rotation.y = Math.PI / 2;
            scene.add(frrunner);
            clicked2 = true;
            fclear = true;
         } else if (clicked2 == true) {
            scene.remove(frrunner);
            clicked2 = false;
         }
      }

      if (intersects[0].object.name == 'Shkaf_Shkaf_mtl_0') {
         if (fclear == true) {
            if (clicked3 == false) {
               var bkrunnerTexture = new THREE.ImageUtils.loadTexture('images/bktest.png');
               //annie = new TextureAnimator( runnerTexture, 1, 1, 1, 1 ); // texture, #horiz, #vert, #total, duration.
               var bkrunnerMaterial = new THREE.MeshBasicMaterial({ map: bkrunnerTexture, side: THREE.DoubleSide });
               var bkrunnerGeometry = new THREE.PlaneGeometry(5, 6, 3);
               bkrunner = new THREE.Mesh(bkrunnerGeometry, bkrunnerMaterial);
               bkrunner.position.set(-25, 3, -7.5);
               scene.add(bkrunner);
               clicked3 = true;
               bclear = true;
            } else if (clicked3 == true) {
               scene.remove(bkrunner);
               clicked3 = false;
            }
         }
      }
      if (intersects[0].object.name == 'Cube004__0') {
         if (clicked3 == false) {
            doorAnimate();
            clicked3 = true;

         } else if (clicked3 == true) {
            scene.remove(bkrunner);
            clicked3 = false;
         }
      }
      if (intersects[0].object.name == 'defaultMaterial') {
     
         var link = 'clear.html';
         location.replace(link);
      }
   }

}

var isRft = false;
function rftAnimate() {
   if (rft.position.z > -4.3) {
      rft.position.z -= 0.1;
   }
   isRft = true;
   requestAnimationFrame(rftAnimate);
}
function doorAnimate() {
   if (door.position.x < 82) {
      door.rotation.z += 0.015;
      door.position.x += 0.015;
      door.position.z -= 0.02;
   }
   requestAnimationFrame(doorAnimate);
}
function loadOBJguard(file, scaleFactor, xOff, yOff, zOff, xRot, yRot, zRot) {
   var manager = new THREE.LoadingManager();
   manager.onProgress = function (item, loaded, total) {
      console.log(item, loaded, total);
   };
   var onProgress = function (xhr) {
      if (xhr.lengthComputable) {
         var percentComplete = xhr.loaded / xhr.total * 100;
         console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
   };

   var onError = function (xhr) {
   };
   var loader = new THREE.OBJLoader(manager);
   //            loader.load( '/Users/van/threejs-all/three.js/examples/obj/male02/minicooper.obj', function ( object ) {
   loader.load(file, function (object) {
      //            loader.load( '/Users/van/threejs-all/three.js/examples/obj/male02/male02.obj', function ( object ) {
      //            loader.load( 'obj/male02/bunnyLowRes.obj', function ( object ) {
      object.traverse(function (child) {
         if (child instanceof THREE.Mesh) {
            child.material = lavaMaterial;
            //                                    child.material.map = new THREE.ImageUtils.loadTexture( 'images/lava.jpg');

         }
      });
      //               object.scale.set(0.05,0.05,0.05);
      object.position.set(xOff, yOff, zOff);
      object.rotation.x = xRot;
      object.rotation.y = yRot;
      object.rotation.z = zRot;
      object.scale.set(scaleFactor, scaleFactor, scaleFactor);
      scene.add(object);
      object.parent = originBox;
      object.material = lavaMaterial;
   }, onProgress, onError);
}

function loadOBJ(file, scaleFactor, xOff, yOff, zOff, xRot, yRot, zRot) {
   var manager = new THREE.LoadingManager();
   manager.onProgress = function (item, loaded, total) {
      console.log(item, loaded, total);
   };
   var onProgress = function (xhr) {
      if (xhr.lengthComputable) {
         var percentComplete = xhr.loaded / xhr.total * 100;
         console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
   };

   var onError = function (xhr) {
   };
   var loader = new THREE.OBJLoader(manager);
   //            loader.load( '/Users/van/threejs-all/three.js/examples/obj/male02/minicooper.obj', function ( object ) {
   loader.load(file, function (object) {
      //            loader.load( '/Users/van/threejs-all/three.js/examples/obj/male02/male02.obj', function ( object ) {
      //            loader.load( 'obj/male02/bunnyLowRes.obj', function ( object ) {
      object.traverse(function (child) {
         if (child instanceof THREE.Mesh) {
            //                     child.material.map = texture;
            child.material = defaultPhongMaterial;
         }
      });
      //               object.scale.set(0.05,0.05,0.05);
      object.position.set(xOff, yOff, zOff);
      object.rotation.x = xRot;
      object.rotation.y = yRot;
      object.rotation.z = zRot;
      object.scale.set(scaleFactor, scaleFactor, scaleFactor);
      scene.add(object);
      object.parent = originBox;
      object.material = defaultPhongMaterial;
   }, onProgress, onError);
}



function loseHealth() {
   scene.remove(health[health.length - 1]);
   health.pop();

   if (health.length <= 0) {
      // window.alert("GAME OVER!");
      location.reload();
      camera.position.set(0, 0, 0);
   }
}


function move() {

   //gameover
   if (
      //((fugitiveCube.position.z < -1)&&(fugitiveCube.position.z > -2)&&(fugitiveCube.position.x == 13))||  //guard c0l3
      //((fugitiveCube.position.z < -1)&&(fugitiveCube.position.z > -2)&&(fugitiveCube.position.x < -12.8))|| //guard c7l3
      ((fugitiveCube.position.x > 19.0) && (fugitiveCube.position.x < 10)) && ((fugitiveCube.position.z < -9) && (fugitiveCube.position.z > -10)) //c1l1
      || ((fugitiveCube.position.x > 9.0) && (fugitiveCube.position.x < 10)) && ((fugitiveCube.position.z < 2) && (fugitiveCube.position.z > 1)) //c1l4
      || ((fugitiveCube.position.x < -4.0) && (fugitiveCube.position.x > -6)) && ((fugitiveCube.position.z < -9) && (fugitiveCube.position.z > -10)) //c5l1
      || ((fugitiveCube.position.x < -4.0) && (fugitiveCube.position.x > -6)) && ((fugitiveCube.position.z < 2) && (fugitiveCube.position.z > 1)) //c5l4
      || ((fugitiveCube.position.z < -5) && (fugitiveCube.position.z > -6)) && ((fugitiveCube.position.x > 1) && (fugitiveCube.position.x < 2)) //c3l2
      || ((fugitiveCube.position.z > 12)) && ((fugitiveCube.position.x > 1) && (fugitiveCube.position.x < 2)) //c3l7
   ) {

      if (waterMode) {
         if (fugitivePlayer.position.y < -0.3) {
            window.alert("YOU'VE EVAPORATED");
            loseHealth();
            //check if STILL in water mode after return
            if (waterMode) {
               fugitiveCube.remove(fugitivePlayer);
               fugitivePlayer = new THREE.Mesh(fugitiveCubeGeometry, waterMaterial); //mesh box and illumination material
               fugitiveCube.position.set(13, 3, -13);
               fugitiveCube.add(fugitivePlayer);
            }
         } else {
            fugitivePlayer.scale.y -= .3; // lose water
            fugitivePlayer.position.y -= 0.15; //move down
         }
      } else {
         camera.position.set(camera.position.x - 5, player.height, camera.position.z);
         //camera.position.set(-30, player.height, -5);
         //camera.lookAt(new THREE.Vector3(0, player.height, 0));
         window.alert("COLLISION!");
         loseHealth();
      }
   }

}
function rotateHeart() {
   health[0].rotation.y += 0.1;
   health[1].rotation.y += 0.1;
   health[2].rotation.y += 0.1;
   health[3].rotation.y += 0.1;
}

function collision() {
   if (fugitiveCube.position.z > 9)
   {
    camera.position.set(camera.position.x, player.height, 5);
    //camera.lookAt(new THREE.Vector3(0, player.height, 0));
  }
   if (fugitiveCube.position.z < -9)
   {
     camera.position.set(camera.position.x, player.height, -5);
    //camera.lookAt(new THREE.Vector3(0, player.height, 0));
  }
  if (fugitiveCube.position.x > -22)
   {
    if(isRft == false)
    {camera.position.set(-25, player.height, camera.position.z);}

  }
  //첫번째 문제
   if ((fugitiveCube.position.x < 92)&&(fugitiveCube.position.x > 90)&&(fugitiveCube.position.z < 0))
   {
     camera.position.set(82, player.height, camera.position.z);
    //camera.lookAt(new THREE.Vector3(0, player.height, 0));
   loseHealth();
  }
  //두번째 문제
  if ((fugitiveCube.position.x < 107)&&(fugitiveCube.position.x > 105)&&(fugitiveCube.position.z < 0))
   {
     camera.position.set(97, player.height, camera.position.z);
    //camera.lookAt(new THREE.Vector3(0, player.height, 0));
   loseHealth();
  }
  //세번째 문제
  if ((fugitiveCube.position.x < 122)&&(fugitiveCube.position.x > 120)&&(fugitiveCube.position.z > 0))
   {
     camera.position.set(112, player.height, camera.position.z);
    //camera.lookAt(new THREE.Vector3(0, player.height, 0));
   loseHealth();
  }
}
function createAlarm(x, z) {
   var unitCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
   var redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 });
   var outlineMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.BackSide });

   var pillar = new THREE.Mesh(unitCubeGeometry, redMaterial);
   scene.add(pillar);
   pillar.scale.set(axisWidth, axisLength, axisWidth);
   pillar.position.set(x, 0.5 * alarmLength, z);
   pillar.parent = originBox;

   var outlineMesh = new THREE.Mesh(unitCubeGeometry, outlineMaterial1);
   outlineMesh.position = pillar.position;
   outlineMesh.scale.set(0.5 * axisWidth, 1.0, 0.5 * axisWidth);
   pillar.add(outlineMesh);
}
//gamrestarted 필요하면 변수로 쓰면됨
var gameStarted = false;
var gameTimer;
var gameTimer2;
function startTimer(duration, display) {
   gameStarted = true;
   var timer = duration, minutes, seconds;
   gameTimer = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;
      // remainTime(minutes + ":" + seconds)
      //이게 끝났을때!
      done(timer);
      if (--timer < 0) {
         timer = 0;
      }
   }, 1000);
}
function remainTime(duration, display2)
{
   var timer = duration, minutes, seconds;
   gameTimer2 = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display2.textContent = minutes + ":" + seconds;
      //이게 끝났을때!
      done(timer);
      if (--timer < 0) {
         timer = 0;
      }
   }, 1000);
}
function done(timer) {
   if (timer != 0) {
      //시간 계속 흘러갈때 
   }
   else {
      //시간 다됐을때
      display.textContent = "done~"
      var link = 'fail.html';
      location.replace(link);

   }
}
document.addEventListener('mousedown', onDocumentMouseDown, false);