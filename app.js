import * as THREE from 'three';
import { BoxLineGeometry } from 'https://unpkg.com/three@0.144.0/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from 'https://unpkg.com/three@0.144.0/examples/jsm/webxr/VRButton.js';
import { TextGeometry } from 'https://unpkg.com/three@0.144.0/examples/jsm/geometries/TextGeometry.js';

let shapes = [];
let rotate = false;
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x29BA2D );
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, precision: 'highp'});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set(0,5,0);
light.castShadow = true;
const planeGeometry = new THREE.PlaneGeometry( 12, 12, 12 ,12 );
const planeMaterial = new THREE.MeshLambertMaterial({color:0x808080, side: THREE.DoubleSide})


let hemiLight = new THREE.HemisphereLight( 0x06FCDC, 0xffffff);
let room = new THREE.LineSegments(
    new BoxLineGeometry( 12, 8, 12, 10, 10, 10 ).translate( 0, 3, 0 ),
    new THREE.LineBasicMaterial( { color: 0xffffff } )
);

const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xF74019 } );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
cube.castShadow = true;

const floor = new THREE.Mesh(planeGeometry, planeMaterial);

floor.rotation.x = 1.6;
floor.position.y = -.75;
floor.receiveShadow = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

cube.position.y = 1.6;
cube.position.x = 0;
cube.position.z = -2.4;

const helper = new THREE.CameraHelper( light.shadow.camera );
//scene.add( helper );
shapes.push(cube);
scene.add(cube);
scene.add(light);
scene.add(room);
scene.add(floor);
camera.position.z = 1;
scene.background = new THREE.Color( 0x85929E );


renderer.setAnimationLoop(function () {
	renderer.render(scene, camera);
    cube.rotation.y +=.01;
    cube.rotation.z+=.01;
    if(rotate){
        for(const item in shapes){
            shapes[item].rotation.y +=.01;
            shapes[item].rotation.z+=.01;
        }
    }
});

document.getElementById("dim").onclick = dimLights;
document.getElementById("addShape").onclick = addShape;
document.getElementById("clear").onclick = clear;
document.getElementById("dance").onclick = dance;

function dimLights(){
    light.intensity -=.1;
    if(light.intensity <= .1){
        light.intensity = 1;
    }
}

function dance(){
    rotate = !rotate;
}

function addShape(){
    let shapeMat = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
    let shapeRoll = boundedRand(3, false);
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
    let shape = new THREE.Mesh(shapeGeo, shapeMat);
    shape.castShadow = true;
    shapes.push(shape);
    shape.position.set(boundedRand(7, true),boundedRand(4, true), boundedRand(7, true));
    scene.add(shape);
   
    
}

function clear(){
    for(const item in shapes){
        shapes[item].geometry.dispose();
        shapes[item].material.dispose();
        scene.remove(shapes[item]);
    }
}
    

function boundedRand(maxNonInc, negative){
    let num = Math.floor(Math.random() * maxNonInc);
    if(negative){
        num *= Math.round(Math.random()) ? 1 : -1;
    }
    return num;
}