

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js'

var WireFrame = false;
var waveAmplitude = 1;
var xShift = 5;
var yShift = 5;
var xFlow = 3;
var yFlow = 3;

const gui = new GUI()
const myObject = {
    WireFrame: false,
    waveAmplitude: 1,
    xShift: 5,
    yShift: 5,
    xFlow: 3,
    yFlow: 3
};

gui.add( myObject, 'WireFrame' ).onChange(value => {
    planeMaterial.wireframe = value;
});

gui.add( myObject, 'waveAmplitude', 0, 10 ).onChange(value => {
    waveAmplitude = value;
})
gui.add( myObject, 'xShift', 0, 10 ).onChange(value => {
    xShift = value/10;
});
gui.add( myObject, 'yShift', 0, 10 ).onChange(value => {
    yShift = value/10;
});
gui.add( myObject, 'xFlow', 0, 10 ).onChange(value => {
    xFlow = value/10;
});
gui.add( myObject, 'yFlow', 0, 10 ).onChange(value => {
    yFlow = value/10;
});


var simplex = new SimplexNoise()
var offsetX = 0
var offsetY = 0

const planeW = 200
const planeH = 200
const planeSW = 150
const planeSH = 150

var w = window.innerWidth;
var h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 80);
scene.add(camera);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0)

// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(200, 150, 80, 80);
const planeMaterial = new THREE.MeshLambertMaterial(
    {color: 0xAFEEEE, 
    side: THREE.DoubleSide,
    wireframe:false,
},
    );
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2.5
scene.add(plane);
var clock = new THREE.Clock();
var FPS = 60
var renderT = 1/FPS;
var timeS = 0;

const r = 90
const y = 10
const lightDistance = 1000

let conf = {
lightIntensity: 0.9,
light1Color: 0x0E09DC,
light2Color: 0x1CD1E1,
light3Color: 0x18C02C,
light4Color: 0xee3bcf
}

let light1 = new THREE.PointLight(conf.light1Color, conf.lightIntensity, lightDistance)
light1.position.set(0, y, r)
scene.add(light1)

let light2 = new THREE.PointLight(conf.light2Color, conf.lightIntensity, lightDistance)
light2.position.set(0, -y, -r)
scene.add(light2)

let light3 = new THREE.PointLight(conf.light3Color, conf.lightIntensity, lightDistance)
light3.position.set(r, y, 0)
scene.add(light3)

let light4 = new THREE.PointLight(conf.light4Color, conf.lightIntensity, lightDistance)
light4.position.set(-r, y, 0)
scene.add(light4)
// scene.fog = new THREE.FogExp2('rgb(78, 216, 195)', 0.006)

//update light
function updateLights(){
    const time = Date.now() * 0.001
    const d = 10
    light1.position.x = Math.sin(time * 0.1) * d
    light1.position.z = Math.cos(time * 0.2) * d
    light2.position.x = Math.cos(time * 0.3) * d
    light2.position.z = Math.sin(time * 0.4) * d
    light3.position.x = Math.sin(time * 0.5) * d
    light3.position.z = Math.sin(time * 0.6) * d
    light4.position.x = Math.sin(time * 0.7) * d
    light4.position.z = Math.cos(time * 0.8) * d
}

// Update
function update(){
    updatePlane()
    updateLights()
}

// Update
function updatePlane() {
    let pos = planeGeometry.attributes.position.array
    offsetX += 0.01
    offsetY = 0

    for(let i = 0; i < pos.length; i+=3) {
        let x = pos[i]
        let y = pos[i+1]

        let dx = planeW / planeSW;
        let dy = planeH / planeSH;

        let row = Math.floor((y+10) / dy)
        let col = Math.floor((x+10) / dx)

        let tx = offsetX
        let ty = offsetY

        tx += row * 0.05
        ty += col * 0.05

        pos[i+2] = simplex.noise2D( xShift * x+ xFlow * tx, yShift * y + yFlow * ty) * waveAmplitude

    }
    planeGeometry.attributes.position.needsUpdate = true
}

function resizeWindow(){
    w = window.innerWidth
    h = window.innerHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
}

function render() {
    requestAnimationFrame(render);
    var T = clock.getDelta();
    timeS = timeS + T;
    // requestAnimationFrame默认调用render函数60次，通过时间判断，降低renderer.render执行频率
    if (timeS > renderT) {
    // 控制台查看渲染器渲染方法的调用周期，也就是间隔时间是多少
    renderer.render(scene, camera); //执行渲染操作
    timeS = 0;
    update()
    resizeWindow()
    }
}
render()
