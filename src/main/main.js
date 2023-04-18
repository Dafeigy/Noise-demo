import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// console.log(THREE);

// 目标：控制3d物体移动

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var offsetX = 0
var offsetY = 0


// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 添加物体
// 创建几何体
const planeGeometry = new THREE.PlaneGeometry(12, 12, 20, 20);


const cubeMaterial = new THREE.MeshBasicMaterial(
    {color: 0xAFEEEE, 
    side: THREE.DoubleSide,
    wireframe:true,
    opacity: 0.5},
    );
// 根据几何体和材质创建物体
const plane = new THREE.Mesh(planeGeometry, cubeMaterial);

plane.rotation.x = - Math.PI / 2.5

// 将几何体添加到场景中
scene.add(plane);

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

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 添加坐标轴辅助器

function updatePlane() {
    let pos = planeGeometry.attributes.position.array
    offsetX += 0.01
    offsetY = 0

    for(let i = 0; i < pos.length; i+=3) {

      pos[i+2] = Math.random() * 0.8

    }
    planeGeometry.attributes.position.needsUpdate = true
  }

var clock = new THREE.Clock();
var FPS = 60
var renderT = 1/FPS;
var timeS = 0;
function render() {
    requestAnimationFrame(render);

    //   渲染下一帧的时候就会调用render函数
    var T = clock.getDelta();
    timeS = timeS + T;
    // requestAnimationFrame默认调用render函数60次，通过时间判断，降低renderer.render执行频率
    if (timeS > renderT) {
      // 控制台查看渲染器渲染方法的调用周期，也就是间隔时间是多少
      renderer.render(scene, camera); //执行渲染操作
      timeS = 0;
      updatePlane()
    }
}

render();