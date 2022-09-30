// import { handleKeyDown, handleKeyUp } from "./cameraControls";

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1,500)
camera.position.set(0,25,100)
camera.lookAt(0,25,0);

const scene = new THREE.Scene()

// test code making a 2D triangle
const material = new THREE.LineBasicMaterial({color: 'red'})

const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );
points.push( new THREE.Vector3(-10,0,0))

const geometry = new THREE.BufferGeometry().setFromPoints(points)

const triangle = new THREE.Line(geometry, material)
triangle.position.set(0,3,0)
scene.add(triangle)


// trying to make a wall or something
const materialWall = new THREE.MeshBasicMaterial({color: 'gray'})
const frontWallGeometry = new THREE.BoxGeometry(300,100,5);
const frontWall = new THREE.Mesh(frontWallGeometry, materialWall)
const backWall = new THREE.Mesh(frontWallGeometry, materialWall)
frontWall.position.set(0,30,-150)
backWall.position.set(0,30,150)

const sideWallMaterial = new THREE.MeshBasicMaterial({color: 'brown'})
const sideWallGeometry = new THREE.BoxGeometry(5,100,300);
const leftWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
const rightWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial)
leftWall.position.set(-150,30,0)
rightWall.position.set(150,30,0)

const floorMaterial = new THREE.MeshBasicMaterial({color: 'green'})
const floorGeometry = new THREE.BoxGeometry(300,1,300);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0,-5,0)


scene.add(frontWall)
scene.add(backWall)
scene.add(leftWall)
scene.add(rightWall)
scene.add(floor)
renderer.render(scene,camera)

// key down event handlers
function handleKeyDown(event) {
    if (event.key === 'a') {
        window.isADown = true;
    }
    if (event.key === 'w') {
        window.isWDown = true;
    }
    if (event.key === 's') {
        window.isSDown = true;
    }
    if (event.key === 'd') {
        window.isDDown = true;
    }
    if ((event.key === 'q') || (event.key === 'ArrowLeft')) {
        window.isQDown = true;
    }
    if ((event.key === 'e') || (event.key === 'ArrowRight')) {
        window.isEDown = true;
    }
    if (event.key === 'ArrowDown') {
        window.isDownArrowDown = true;
    }
    if (event.key === 'ArrowUp') {
        window.isUpArrowDown = true;
    }
}
function handleKeyUp(event) {
    if (event.key === 'a') {
        window.isADown = false;
    }
    if (event.key === 'w') {
        window.isWDown = false;
    }
    if (event.key === 's') {
        window.isSDown = false;
    }
    if (event.key === 'd') {
        window.isDDown = false;
    }
    if ((event.key === 'q') || (event.key === 'ArrowLeft')) {
        window.isQDown = false;
    }
    if ((event.key === 'e') || (event.key === 'ArrowRight')) {
        window.isEDown = false;
    }
    if (event.key === 'ArrowDown') {
        window.isDownArrowDown = false;
    }
    if (event.key === 'ArrowUp') {
        window.isUpArrowDown = false;
    }
}

window.addEventListener('keydown', handleKeyDown, false)
window.addEventListener('keyup', handleKeyUp, false)



function animate() {
    requestAnimationFrame(animate)
    if (window.isADown) {
        let direction = new THREE.Vector3();
        camera.getWorldDirection(direction)
        direction.cross(new THREE.Vector3(0,-1,0))
        camera.position.add(direction.multiplyScalar(.75))
        camera.updateProjectionMatrix()
    }
    if (window.isDDown) {
        let direction = new THREE.Vector3();
        camera.getWorldDirection(direction)
        direction.cross(new THREE.Vector3(0,1,0))
        camera.position.add(direction.multiplyScalar(.75))
        camera.updateProjectionMatrix()
    }
    if (window.isWDown) {
        let direction = new THREE.Vector3();
        camera.getWorldDirection(direction)
        direction.setComponent(1,0)
        camera.position.add(direction.multiplyScalar(.75))
        camera.updateProjectionMatrix()
    }
    if (window.isSDown) {
        let direction = new THREE.Vector3();
        camera.getWorldDirection(direction)
        direction.setComponent(1,0)
        camera.position.add(direction.multiplyScalar(-.75))
        camera.updateProjectionMatrix()
    }
    if (window.isQDown) {
        camera.rotateOnWorldAxis(new THREE.Vector3(0,1,0), 0.02)
        camera.updateProjectionMatrix()
    }
    if (window.isEDown) {
        camera.rotateOnWorldAxis(new THREE.Vector3(0,1,0), -0.02)
        camera.updateProjectionMatrix()
    }
    if (window.isDownArrowDown) {
        let direction = new THREE.Vector3()
        camera.getWorldDirection(direction)
        console.log(direction)
        if (direction.y > -.5 ) {
            camera.rotateOnAxis(new THREE.Vector3(1,0,0), -0.02)
        }
    }

    if (window.isUpArrowDown) {
        let direction = new THREE.Vector3()
        camera.getWorldDirection(direction)
        console.log(direction)
        if (direction.y < .5) {
            camera.rotateOnAxis(new THREE.Vector3(1,0,0), 0.02)
        }
    }
    // also could look into a jump mechanic? but then would need some sort of physics

    renderer.render(scene, camera)
}

// next steps:
// - look into adding some sort of collision detection

// after that, maybe look into making or importing other objects; could try to start adding things to the room
// if objects added to room, could work on figuring out how to interact with them
// -- could try to add a small cross hair/cursor to show where camera is focused for when objects come into play
// add a small legend or something that tells what the controls are

animate()