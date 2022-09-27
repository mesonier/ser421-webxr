// SER 421 - Fall A
// Advanced Project (WebXR)
// Source code by Dominic Barreda
// 2022-09-26

/////////////
// imports //
/////////////

import * as THREE from 'three';
import { BoxLineGeometry } from 'https://unpkg.com/three@0.144.0/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from 'https://unpkg.com/three@0.144.0/examples/jsm/webxr/VRButton.js';
import { TextGeometry } from 'https://unpkg.com/three@0.144.0/examples/jsm/geometries/TextGeometry.js';

// an array of shapes
let shapes = [];
// rotation flag
let rotate = false;
// create a scene from ThreeJS's Scene class.
const scene = new THREE.Scene();
// set the background to hex value #29BA2D
scene.background = new THREE.Color( 0x29BA2D );
// create a new perspective camera. The FOV is 75,
// and the aspect ratio is window width divided by window height.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
// create a new renderer from ThreeJS to render WebGL
// slpha and anti-aliading are set to TRUE, with high precision.
let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, precision: 'highp'});
// enable the shadowmap
renderer.shadowMap.enabled = true;
// Make the shadow map soft.
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// create a new point light source with white color and intensity of 1.
// distance is set to 100 units.
const light = new THREE.PointLight( 0xffffff, 1, 100 );
// set the position of the light to Y coord 5 (above the camera)
light.position.set(0,5,0);
// the light casts a shadow - set to TRUE
light.castShadow = true;
// Create a new plane with 12x12 segments and a width of 12x12 (each seg is 1 unit)
const planeGeometry = new THREE.PlaneGeometry( 12, 12, 12 ,12 );
// create a material for the plane that is gray and double-sided.
const planeMaterial = new THREE.MeshLambertMaterial({color:0x808080, side: THREE.DoubleSide})

// create a new hemisphere light.
let hemiLight = new THREE.HemisphereLight( 0x06FCDC, 0xffffff);
// create a new box made of lines that will become the scene bounds.
let room = new THREE.LineSegments(
    new BoxLineGeometry( 12, 8, 12, 10, 10, 10 ).translate( 0, 3, 0 ),
    new THREE.LineBasicMaterial( { color: 0xffffff } )
);

// create the initial cube when loading.
const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xF74019 } );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
cube.castShadow = true;
// move the cube
cube.position.y = 1.6;
cube.position.x = 0;
cube.position.z = -2.4;

// create the floor mesh using the plane material and geometry
const floor = new THREE.Mesh(planeGeometry, planeMaterial);
// move the floor and allow floor to receive the shadows.
floor.rotation.x = 1.6;
floor.position.y = -.75;
floor.receiveShadow = true;

// set the renderer to the inner window bounds.
renderer.setSize(window.innerWidth, window.innerHeight);
// add the renderer to the DOM
document.body.appendChild(renderer.domElement);
// add a VR button to the DOM
document.body.appendChild( VRButton.createButton( renderer ) );
// enable XR
renderer.xr.enabled = true;


// create a camera helper.
const helper = new THREE.CameraHelper( light.shadow.camera );

//scene.add( helper );
// add the cube to the shapes array
shapes.push(cube);
// add everything else ot the scene object
scene.add(cube);
scene.add(light);
scene.add(room);
scene.add(floor);

// move the camera position back one unit
camera.position.z = 1;
// make the background for the scene whitish.
scene.background = new THREE.Color( 0x85929E );

///////////////
// anim loop //
///////////////

renderer.setAnimationLoop(function () {
	renderer.render(scene, camera);
    // rotate the cube
    cube.rotation.y +=.01;
    cube.rotation.z+=.01;
    // if rotate is set to true, rotate all of the other shapes too.
    if(rotate){
        for(const item in shapes){
            shapes[item].rotation.y +=.01;
            shapes[item].rotation.z+=.01;
        }
    }
});

////////////////////////////////
// event handlers for buttons //
////////////////////////////////

document.getElementById("dim").onclick = dimLights;
document.getElementById("addShape").onclick = addShape;
document.getElementById("clear").onclick = clear;
document.getElementById("dance").onclick = dance;

// dims lights in range 0.1 to 1, step -0.1
function dimLights(){
    light.intensity -=.1;
    if(light.intensity <= .1){
        light.intensity = 1;
    }
}

// toggles rotation of shapes.
function dance(){
    rotate = !rotate;
}

// adds a random shape to the scene
function addShape(){
    // make a random color.
    let shapeMat = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
    // roll a 3-sided die.
    let shapeRoll = boundedRand(3, false);
    // declare shape geometry, which will be
    // defined by shapeRoll as seen below:
    let shapeGeo;
    switch(shapeRoll){
        case 0:
            shapeGeo = new THREE.SphereGeometry(Math.random(), 8, 6);
            break;
        case 1:
            shapeGeo = new THREE.IcosahedronGeometry(Math.random(), 0);
            break;
        case 2:
            shapeGeo = new THREE.OctahedronGeometry(Math.random(), 0);
            break;
    }
    // create a new shape using the new color and geometry
    let shape = new THREE.Mesh(shapeGeo, shapeMat);
    // allow the shape to cast a shadow.
    shape.castShadow = true;
    // add the shape to the shapes array
    shapes.push(shape);
    // set the shape's position to a 3D range [-6,6] by [-3,3] by [-6,6]
    shape.position.set(boundedRand(7, true),boundedRand(4, true), boundedRand(7, true));
    // add this shape to the scene
    scene.add(shape);
}

// clear all shapes
function clear(){
    for(const item in shapes){
        shapes[item].geometry.dispose();
        shapes[item].material.dispose();
        scene.remove(shapes[item]);
    }
}
    
// helper function for rounded random numbers
function boundedRand(maxNonInc, negative){
    let num = Math.floor(Math.random() * maxNonInc);
    if(negative){
        num *= Math.round(Math.random()) ? 1 : -1;
    }
    return num;
}
