// import { handleKeyDown, handleKeyUp } from "./cameraControls";

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.style.position = 'relative'
document.body.appendChild(renderer.domElement)

// bools for puzzles to be solved/added later;
let firstDoorUnlocked = false;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1,500)
camera.position.set(0,25,100)
camera.lookAt(0,25,0);
const camDirection = new THREE.Vector3();
const boxMaterial = new THREE.MeshBasicMaterial({color: 'blue'})
const boxGeometry = new THREE.BoxGeometry(15,10,15)

// making camera box to intersect with walls; will see if this works! might not be best practice
const cameraBox = new THREE.Mesh(boxGeometry, boxMaterial)
cameraBox.position.set(0,25,100)
const cameraBoundingBox = new THREE.Box3().setFromObject(cameraBox)

const scene = new THREE.Scene()
scene.add(cameraBox)

//console logs
console.log(camera.position)
console.log(cameraBox.position)

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


// basic walls
const materialWall = new THREE.MeshBasicMaterial({color: 'gray'})
const frontWallGeometry = new THREE.BoxGeometry(300,100,10);
const frontWall = new THREE.Mesh(frontWallGeometry, materialWall)
const backWall = new THREE.Mesh(frontWallGeometry, materialWall)
frontWall.position.set(0,30,-150)
backWall.position.set(0,30,150)

// splitting front wall into segments so can put door in middle
const frontWallGeometrySide = new THREE.BoxGeometry(135,100,10)
const frontWallGeometryTop = new THREE.BoxGeometry(30, 30, 10)
const frontWallLeft = new THREE.Mesh(frontWallGeometrySide, materialWall);
const frontWallRight = new THREE.Mesh(frontWallGeometrySide, materialWall);
const frontWallTop = new THREE.Mesh(frontWallGeometryTop, materialWall)
frontWallLeft.position.set(-82.5,30,-150)
frontWallRight.position.set(82.5,30,-150)
frontWallTop.position.set(0,65,-150)
const frontWallLeftBound = new THREE.Box3().setFromObject(frontWallLeft);
const frontWallRightBound = new THREE.Box3().setFromObject(frontWallRight);

//first door
const firstDoorGeometry = new THREE.BoxGeometry(30,70,4)
const doorMaterial = new THREE.MeshBasicMaterial({color: 'brown'})
const firstDoor = new THREE.Mesh(firstDoorGeometry, doorMaterial);
firstDoor.position.set(0,30,-150);
const firstDoorBound = new THREE.Box3().setFromObject(firstDoor)

// const frontWallBound = new THREE.Box3().setFromObject(frontWall)
const backWallBound = new THREE.Box3().setFromObject(backWall)

const sideWallMaterial = new THREE.MeshBasicMaterial({color: 'darkGray'})
const sideWallGeometry = new THREE.BoxGeometry(10,100,300);
const leftWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
const rightWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial)
leftWall.position.set(-150,30,0)
rightWall.position.set(150,30,0)

const leftWallBound = new THREE.Box3().setFromObject(leftWall)
const rightWallBound = new THREE.Box3().setFromObject(rightWall)

const floorMaterial = new THREE.MeshBasicMaterial({color: 'green'})
const floorGeometry = new THREE.BoxGeometry(300,1,1000);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0,-5,0)


// scene.add(frontWall)
scene.add(firstDoor)
scene.add(frontWallLeft)
scene.add(frontWallRight)
scene.add(frontWallTop)
scene.add(backWall)
scene.add(leftWall)
scene.add(rightWall)
scene.add(floor)
renderer.render(scene,camera)

//array of objects I want to create collision with so far
const boundaryObjects = [backWallBound,leftWallBound,rightWallBound, frontWallLeftBound, frontWallRightBound, firstDoorBound]
const interactiveObjects = [firstDoorBound]

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
    if (event.key === 'i') {
        window.isIDown = true;
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
    if (event.key === 'i') {
        window.isIDown = false;
    }
}

window.addEventListener('keydown', handleKeyDown, false)
window.addEventListener('keyup', handleKeyUp, false)

const collisionCheck = () => {
    boundaryObjects.forEach(bound => {
        if (cameraBoundingBox.intersectsBox(bound)) {
            camera.position.add(camDirection.multiplyScalar(-2))
            cameraBox.position.add(camDirection)
            cameraBoundingBox.translate(camDirection)
        }
    })
}

const proximityCheck = () => {
    let count = 0;
    interactiveObjects.forEach(object => {
        if (object.distanceToPoint(camera.position) < 50) {
            document.getElementById('interact-text').innerHTML = "Press 'i' to interact"
            count++;
            interact.innerHTML = "Press 'i' to interact"
        }
    })
    if (!count) {
        document.getElementById('interact-text').innerHTML = ""
        interact.innerHTML = ""
    }
}
const closestInteractiveObject = () => {
    let distances = interactiveObjects.map(object => object.distanceToPoint(camera.position));
    let min = Math.min(...distances)
    let index = distances.indexOf(min)
    return interactiveObjects[index]
}

const interact = () => {
    let checkInteract = document.getElementById('interact-text').innerHTML;
    if (checkInteract.length) {
        let closestObj = closestInteractiveObject();
        if (closestObj === firstDoorBound) {
            console.log('interacting with the door! next have a check, if fails say door is locked')
            if (firstDoorUnlocked) {
                // here, rotate the door or something to access next room/area
                // could even just delete the door and bound if easier
            } else {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "Door is locked"
                    // probably not the best way to do this; could just clear out when far enough away?
                    setTimeout(() => document.getElementById('response-text').innerHTML="",3000)
                }
            }
        }
        // more object cases
    } else {
        console.log('nothing to interact with')
    }
}

function animate() {
    requestAnimationFrame(animate)
    if (window.isADown) {
        camera.getWorldDirection(camDirection)
        camDirection.cross(new THREE.Vector3(0,-1,0))
        camera.position.add(camDirection.multiplyScalar(.75))
        cameraBox.position.add(camDirection)
        cameraBoundingBox.translate(camDirection)
        camera.updateProjectionMatrix()
    }
    if (window.isDDown) {
        camera.getWorldDirection(camDirection)
        camDirection.cross(new THREE.Vector3(0,1,0))
        camera.position.add(camDirection.multiplyScalar(.75))
        cameraBox.position.add(camDirection)
        cameraBoundingBox.translate(camDirection)
        camera.updateProjectionMatrix()
    }
    if (window.isWDown) {
        camera.getWorldDirection(camDirection)       
        camDirection.setComponent(1,0)
        camera.position.add(camDirection.multiplyScalar(.75))
        cameraBox.position.add(camDirection)
        cameraBoundingBox.translate(camDirection)
        camera.updateProjectionMatrix()
    }
    if (window.isSDown) {
        camera.getWorldDirection(camDirection)
        camDirection.setComponent(1,0)
        camera.position.add(camDirection.multiplyScalar(-.75))
        cameraBox.position.add(camDirection)
        cameraBoundingBox.translate(camDirection)
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
        camera.getWorldDirection(camDirection)
        if (camDirection.y > -.9 ) {
            camera.rotateOnAxis(new THREE.Vector3(1,0,0), -0.02)
        }
    }
    if (window.isUpArrowDown) {
        camera.getWorldDirection(camDirection)
        if (camDirection.y < .5) {
            camera.rotateOnAxis(new THREE.Vector3(1,0,0), 0.02)
        }
    }
    if (window.isIDown) {
        interact()
    }
    collisionCheck();
    proximityCheck();

    renderer.render(scene, camera)
}

// next steps:
// - look into adding other objects as mentioned below, or learn more about textures; could make the walls/floor look better
// - could also add a ceiling
// - maybe also try to add a door to one of the walls; could be for below;
// --- would likely need to reconstruct one of the walls
// ---- clunky way: rebuild pieces of wall to have a door hole; then, add a door there
// ---- but before that point, maybe work on first adding a basic door object and being able to go up and interact with it
// ------ to do that, look into object to camera proximity detection or something; if object within x distance, show message maybe

// also could look into a jump mechanic? but then would need some sort of physics
// after that, maybe look into making or importing other objects; could try to start adding things to the room
// if objects added to room, could work on figuring out how to interact with them
// -- could try to add a small cross hair/cursor to show where camera is focused for when objects come into play
// add a small legend or something that tells what the controls are

animate()