//RENDERER INIT
var WIDTH = $(window).width() - 20;
var HEIGHT = $(window).height() - 20;
var fieldWidth = HEIGHT / 20;
var fieldHeight = WIDTH / 10;
var fieldDepth = 10;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH,HEIGHT);

var c = document.getElementById("gameCanvas");
c.appendChild(renderer.domElement);

//CAMERA & SCENE INIT
var VIEW_ANGLE = 50;
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
//object definitions



//SHIP
var shipWidth = 10;
var shipHeight = 30;
var shipDepth = 10;
var shipQuality = 1;

var shipMaterial = new THREE.MeshPhongMaterial({
	color: 0xFF0000
})

ship = new THREE.Mesh(
	new THREE.CubeGeometry(
		shipWidth,
		shipHeight,
		shipDepth,
		shipQuality,
		shipQuality,
		shipQuality),
	shipMaterial);

//LIGHT
pointLight = new THREE.PointLight(0xF8D898);
pointLight.position.x = -1000;
pointLight.position.y = 2000;
pointLight.position.z = 2000;
pointLight.intensity = 2.9;
pointLight.distance = 10000;


function setup(){
	scene.add(ship);
	scene.add(pointLight);
	ship.position.x = -fieldWidth/2 + shipWidth;
	ship.position.z = shipDepth;

	for(i=0; i<=50; i++){
		stars.push(new Star)
		stars[stars.length - 1].create(ship.position.x + 10, ship.position.y, ship.position.z);
	}

	enemies.push(new Enemy('twitter.jpg','http://www.twitter.com/make_ready'))
	//enemies.push(new Enemy('twitter.jpg','http://www.twitter.com/make_ready'))
	//enemies.push(new Enemy('twitter.jpg','http://www.twitter.com/make_ready'))
	//enemies.push(new Enemy('twitter.jpg','http://www.twitter.com/make_ready'))
	//enemies.push(new Enemy('twitter.jpg','http://www.twitter.com/make_ready'))

	for (i = 0; i < enemies.length; i++){

		enemies[i].create(1000, 0, 0);
	}

	camera.position.x = ship.position.x - 100;
	camera.position.z = ship.position.z + 100;
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
	var width = 100;
	var height = 100;
	var depth = 100;
	var quality = 1;
	var material = new THREE.MeshPhongMaterial({
		map: texture
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
		mesh.position.x += dirX * speed;
		mesh.position.y += dirY * speed;
		mesh.position.z += dirZ * speed;
	}

	this.create = function(x, y, z){
		scene.add(mesh);
		mesh.position.y = y;
		mesh.position.x = x;
		mesh.position.z = z;
	}

	this.destroy = function(){
		scene.remove(mesh);
	}

	this.xPos = function(){
		return mesh.position.x;
	}
}

function Shot(){
	var width = 20;
	var height = 3; 
	var depth = 3;
	var quality = 1;
	var shotDirX = 1;
	var shotSpeed = 10;
	var material = new THREE.MeshPhongMaterial({
		color: 0x00FBFF
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
		mesh.position.x = x;
		mesh.position.z = z;
	}


	this.destroy = function(){
		scene.remove(mesh);
	}

	this.xPos = function(){
		return mesh.position.x;
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

	if (Key.isDown(Key.SPACE) & shots.length < 10){
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
	ship.position.x += shipDirX;
	ship.position.z += shipDirZ;
}


function draw(){
	renderer.render(scene,camera);
	requestAnimationFrame(draw);
	for (i = 0; i < shots.length; i++){
		shots[i].animate();
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
	shipControls();
}