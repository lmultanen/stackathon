// import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1000);

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement)

const geometry = new THREE.TorusGeometry(10,2,5,4,5);
const material = new THREE.MeshBasicMaterial({color: 'red'});
const shape = new THREE.Mesh(geometry, material)
scene.add(shape)

camera.position.z = 50;

function animate() {
    requestAnimationFrame(animate);

    shape.rotation.x += 0.01;
	shape.rotation.y += 0.01;
    renderer.render(scene, camera)
}
animate()