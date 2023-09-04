//RENDERER INIT
var WIDTH = $(window).width() - 20;
var HEIGHT = $(window).height() - 20;
var fieldWidth = HEIGHT / 2;
var fieldHeight = (WIDTH / 6);
var fieldDepth = 10;



/**
 * Detector.js
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

Detector = {

  canvas : !! window.CanvasRenderingContext2D,
  webgl : ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
  workers : !! window.Worker,
  fileapi : window.File && window.FileReader && window.FileList && window.Blob,

  getWebGLErrorMessage : function () {

    var domElement = document.createElement( 'div' );

    domElement.style.fontFamily = 'monospace';
    domElement.style.fontSize = '13px';
    domElement.style.textAlign = 'center';
    domElement.style.background = '#eee';
    domElement.style.color = '#000';
    domElement.style.padding = '1em';
    domElement.style.width = '475px';
    domElement.style.margin = '5em auto 0';

    if ( ! this.webgl ) {

      domElement.innerHTML = window.WebGLRenderingContext ? [
        'Sorry, your graphics card doesn\'t support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>'
      ].join( '\n' ) : [
        'Sorry, your browser doesn\'t support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a><br/>',
        'Please try with',
        '<a href="http://www.google.com/chrome">Chrome</a>, ',
        '<a href="http://www.mozilla.com/en-US/firefox/new/">Firefox 4</a> or',
        '<a href="http://nightly.webkit.org/">Webkit Nightly (Mac)</a>'
      ].join( '\n' );

    }

    return domElement;

  },

  addGetWebGLMessage : function ( parameters ) {

    var parent, id, domElement;

    parameters = parameters || {};

    parent = parameters.parent !== undefined ? parameters.parent : document.body;
    id = parameters.id !== undefined ? parameters.id : 'oldie';

    domElement = Detector.getWebGLErrorMessage();
    domElement.id = id;

    parent.appendChild( domElement );

  }

};

if(Detector.webgl){
  renderer = new THREE.WebGLRenderer({antialias:false});
} else {
  renderer = new THREE.CanvasRenderer();
}

renderer.setSize(WIDTH,HEIGHT);

var c = document.getElementById("gameCanvas");
c.appendChild(renderer.domElement);

//CAMERA & SCENE INIT
var VIEW_ANGLE = 40;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 0.1;
var FAR = 10000;

camera = new THREE.PerspectiveCamera(
	VIEW_ANGLE,
	ASPECT,
	NEAR,
	FAR);

scene = new THREE.Scene();
scene.add(camera);
camera.position.z = 200;

//GAME VAR INIT

var shipDirY = 0, shipDirZ = 0.2, shipSpeed = 3;
var shots = [];
var stars = [];
var enemies = [];
var stopExecution = false;
//object definitions



//SHIP
var shipRadiusTop = 0;
var shipWidth = 3;
var shipHeight = 30;
var shipDepth = 10;
var shipRadiusSegments = 4;
var shipQuality = 1;

var shipMaterial = new THREE.MeshLambertMaterial({
	color: 0xFF0000,
});

ship = new THREE.Mesh(
	new THREE.CylinderGeometry(
		shipRadiusTop,
		shipWidth,
		shipHeight,
		shipRadiusSegments,
		1,
		true),
	shipMaterial);


var crosshairsWidth = 10;
var crosshairsHeight = 10;
var crosshairsMaterial = new THREE.MeshPhongMaterial({
	//color: 0xFFFFFF,
	map: THREE.ImageUtils.loadTexture('ch2.png'),
	transparent: true,
	opacity: 0.8
	});

crosshairs = new THREE.Mesh(
	new THREE.PlaneGeometry(
		crosshairsWidth,
		crosshairsHeight),
	crosshairsMaterial);

	

//LIGHT
pointLight = new THREE.PointLight(0xF8D898);
pointLight.position.x = -1000;
pointLight.position.y = -1000;
pointLight.position.z = 2000;
pointLight.intensity = 2.9;
pointLight.distance = 10000;


function setup(){
	scene.add(ship);
	ship.rotation.z = -90 * Math.PI/180;
	scene.add(pointLight);
	scene.add(crosshairs);
	crosshairs.rotation.y = -90 * Math.PI/180;
	crosshairs.position.x = 250;
	ship.position.x = -fieldWidth/2 + shipWidth;

	for(i=0; i<=50; i++){
		stars.push(new Star)
		stars[stars.length - 1].create(ship.position.x + 10, ship.position.y, ship.position.z);
	}

	enemies.push(new Enemy('github.png','https://www.zombo.com/'));
	enemies.push(new Enemy('ig.png', 'https://www.instagram.com/asteriskinesis'));
	enemies.push(new Enemy('bandcamp.jpeg','https://thesunneversets.bandcamp.com'));
	enemies.push(new Enemy('rubygems.jpeg','https://www.zombo.com/'));
	

	for (i = 0; i < enemies.length; i++){
		enemies[i].create(300 + Math.floor(Math.random()*100) , (i * WIDTH / 30) - 150, Math.floor(Math.random()*50)-25);
	}

	camera.position.x = ship.position.x - 200;
	camera.position.z = ship.position.z + 200;
	camera.rotation.z = -90 * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	draw();
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

function Enemy(texture, href){
	var href = href;
	var texture = THREE.ImageUtils.loadTexture(texture);
	var width = WIDTH / 60;
	var height = WIDTH / 60;
	var depth = WIDTH / 60;
	var quality = 1;
	var selfDestructing = false;
	var r = 0, g = 0, b = 0;
	var speed = (Math.random()*0.03) + 0.01;
	var angle = ((Math.random()*6)-0);
	var material = new THREE.MeshPhongMaterial({
		map: texture, 
		//color: 0xFF0000
	});

	var mesh = new THREE.Mesh(
		new THREE.CubeGeometry(
			width,
			height,
			depth,
			quality,
			quality,
			quality),
		material);

	mesh.rotation.x = Math.PI * 90 / 180;
	mesh.rotation.y = Math.PI * (Math.random()*40) / 180;

	this.animate = function(){
		angle += speed
		mesh.position.z = (Math.sin(angle))*20;
		mesh.rotation.x += Math.PI * 0.2 / 180;
		mesh.rotation.y += Math.PI * 0.2 / 180;
		mesh.rotation.z += Math.PI * 0.2 / 180;

		if (selfDestructing){
			r += 0.02;
			g += 0.02;
			b += 0.02;
			material.color.setRGB(r,g,b);
		}

		if(r > 1 & g > 1 & b > 1){
			selfDestructing = false;
			window.location = href;
			stopExecution = true;
		}
	}

	this.create = function(x, y, z){
		scene.add(mesh);
		mesh.position.y = y;
		mesh.position.x = x;
		mesh.position.z = z;
	}

	this.selfDestruct = function(){
		selfDestructing = true;
	}

	this.xPos = function(){
		return mesh.position.x;
	}

	this.yPos = function(){
		return mesh.position.y;
	}

	this.zPos = function(){
		return mesh.position.z;
	}
}

function Shot(){
	var width = 200;
	var height = 2; 
	var depth = 2;
	var quality = 1;
	var shotDirX = 1;
	var shotSpeed = 40;
	var material = new THREE.MeshPhongMaterial({
		color: 0xFFFFFF,
		transparent: true,
		opacity: 0.8
	});

	var mesh = new THREE.Mesh(
		new THREE.CubeGeometry(
			width,
			height,
			depth,
			quality,
			quality,
			quality),
		material);

	this.animate = function(){
		mesh.position.x += shotDirX * shotSpeed;
	}

	this.create = function(x, y, z){
		scene.add(mesh);
		mesh.position.y = y;
		mesh.position.x = x + width/2;
		mesh.position.z = z;
	}


	this.destroy = function(){
		scene.remove(mesh);
	}

	this.xPos = function(){
		return mesh.position.x;
	}

	this.yPos = function(){
		return mesh.position.y;
	}
	this.zPos = function(){
		return mesh.position.z;
	}
}

function Star(){
	var speed = ((Math.random()*70)-68);
	var width = speed * -5;
	var height = 3;
	var depth = 3;
	var quality = 1;
	

	var material = new THREE.MeshLambertMaterial({
		color: getRandomColor()
	});

	var mesh = new THREE.Mesh(
	new THREE.CubeGeometry(
		width,
		height,
		depth,
		quality,
		quality,
		quality),
	material);

	this.animate = function(){
		mesh.position.x += speed;
	}

	this.setNewPosition = function(){
		var y = Math.floor((Math.random()*2000)-1000);
		var x = Math.floor((Math.random()*3000)+2000);
		var z = Math.floor((Math.random()*1000)-1200);
		mesh.position.y = y;
		mesh.position.x = x;
		mesh.position.z = z;
	}

	this.create = function(x, y, z){
		scene.add(mesh);
		this.setNewPosition();
	}

	this.destroy = function(){
		scene.remove(mesh);
	}

	this.xPos = function(){
		return mesh.position.x;
	}
}

function shipControls(){

	if (Key.isDown(Key.A)){
		if (ship.position.y <fieldHeight * 0.5){
			shipDirY = shipSpeed * 0.5;
		} else {
			shipDirY = 0
		}
	} else if (Key.isDown(Key.D)){
		if (ship.position.y > -fieldHeight * 0.5){
			shipDirY = shipSpeed * -0.5;
		} else {
			shipDirY = 0
		}
	} else {
		shipDirY = 0
	}

	if (Key.isDown(Key.W)){
		if (ship.position.x <fieldWidth * 0.5){
			shipDirX = shipSpeed * 0.5;
		} else {
			shipDirX = 0
		}
	} else if (Key.isDown(Key.S)){
		if (ship.position.x > -fieldWidth * 0.5){
			shipDirX = shipSpeed * -0.5;
		} else {
			shipDirX = 0
		}
	} else {
		shipDirX = 0
	}

	if (Key.isDown(Key.SPACE) & shots.length < 1){
		shots.push(new Shot);
		shots[shots.length - 1].create(ship.position.x + 10, ship.position.y, ship.position.z);
		//append new shot to shots arraya
	}
	if (ship.position.z > fieldDepth){
		shipDirZ = -0.2;
	} else if (ship.position.z < 0){
		shipDirZ = 0.2;
	}

	ship.position.y += shipDirY;
	crosshairs.position.y += shipDirY;
	camera.position.y += shipDirY / 2;
	ship.position.x += shipDirX;
	camera.position.x += shipDirX / 2;
	crosshairs.rotation.z += 3 * Math.PI / 180;
	ship.rotation.x += 3 * Math.PI / 180;
}

function collision(objA,objB){
	if (objA.yPos() < objB.yPos() + 20 & objA.yPos() > objB.yPos() - 20){
		//console.log("Y collision!"+ objA.yPos() + " " + objB.yPos());
		if (objA.xPos() > objB.xPos()){
			//console.log("X collision!"+ objA.xPos() + " " + objB.xPos());
			if (objA.zPos() < objB.zPos() + 20 & objA.zPos() > objB.zPos() - 20){
				//console.log("Z Collision!" + objA.zPos() + " " + objB.zPos());
				return true;
			}
		}
	}
	return false;
}

function draw(){
	renderer.render(scene,camera);
	if (stopExecution === false){
		requestAnimationFrame(draw)
	}
	for (i = 0; i < shots.length; i++){
		shots[i].animate();
		for (j = 0; j < enemies.length; j++){
			if (collision(shots[i],enemies[j])){
				shots[i].destroy();
				shots.splice(i,1);  
				enemies[j].selfDestruct();
			} 
		}
		if (shots[i].xPos() > 1000){
			shots[i].destroy();
			shots.splice(i,1);
		}  
	}

	for (i = 0; i < stars.length; i++){
		stars[i].animate();
		if (stars[i].xPos() < 200){
			stars[i].setNewPosition();
		}
	}

	for (i = 0; i < enemies.length; i++){
		enemies[i].animate();
	}
	shipControls();
}
