// import { handleKeyDown, handleKeyUp } from "./cameraControls";
// import { GLTFLoader } from './../node_modules/three/addons/loaders/GLTFLoader.js';
// need to refactor this file later to be able to properly import outside objects...

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.style.position = 'relative'
document.body.appendChild(renderer.domElement)

// bools for puzzles to be solved/added later;
let firstDoorUnlocked = false; 
let firstDoorClosed = true;
let firstDoorInteractionInProgress = false;
let hasSafeCombo = false;
let hasBookShelfClue = false; // maybe each render, could reset this bool; composed of 2-3 separate ones?
let hasDoorKey = false;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1,500)
camera.position.set(0,25,100)
camera.lookAt(0,25,0);
const camDirection = new THREE.Vector3();
const boxMaterial = new THREE.MeshBasicMaterial({color: 'blue'})
const boxGeometry = new THREE.BoxGeometry(10,15,10)

// making camera box to intersect with walls; will see if this works! might not be best practice
const cameraBox = new THREE.Mesh(boxGeometry, boxMaterial)
cameraBox.position.set(0,25,100)
const cameraBoundingBox = new THREE.Box3().setFromObject(cameraBox)

const scene = new THREE.Scene()
scene.add(cameraBox)

// basic walls
const materialWall = new THREE.MeshBasicMaterial({color: 'gray'})
const frontWallGeometry = new THREE.BoxGeometry(300,100,10);
// const frontWall = new THREE.Mesh(frontWallGeometry, materialWall)
const backWall = new THREE.Mesh(frontWallGeometry, materialWall)
// frontWall.position.set(0,30,-150)
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
const firstDoorGeometry = new THREE.BoxGeometry(30,60,4)
const doorMaterial = new THREE.MeshBasicMaterial({color: 'brown'})
const firstDoor = new THREE.Mesh(firstDoorGeometry, doorMaterial);
firstDoor.position.set(0,20,-150);
firstDoor.geometry.computeBoundingBox();
// const firstDoorBound = new THREE.Box3().setFromObject(firstDoor)
const firstDoorBound = new THREE.Box3();

const doorKnobGeometry = new THREE.BoxGeometry(2,2,8)
const doorKnobMaterial = new THREE.MeshBasicMaterial({color: 'yellow'})
const doorKnob = new THREE.Mesh(doorKnobGeometry, doorKnobMaterial);
doorKnob.position.set(-10,20,-150);

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

// bookshelf geometries
const shelfMaterial = new THREE.MeshBasicMaterial({color: 'saddlebrown'})
const verticalShelfGeometry = new THREE.BoxGeometry(10, 70, 4)
const leftVertShelf = new THREE.Mesh(verticalShelfGeometry,shelfMaterial)
const midVertShelf = new THREE.Mesh(verticalShelfGeometry,shelfMaterial)
const rightVertShelf = new THREE.Mesh(verticalShelfGeometry,shelfMaterial)
const horizontalShelfGeometry = new THREE.BoxGeometry(10,4,64)
const topShelf = new THREE.Mesh(horizontalShelfGeometry, shelfMaterial)
leftVertShelf.position.set(-140, 25, 30)
midVertShelf.position.set(-140, 25, 0)
rightVertShelf.position.set(-140, 25, -30)
topShelf.position.set(-140,60,0)

//might be a good time to figure out how to group multiple meshes together; otherwise, bounding box pieces will become unwieldy
scene.add(leftVertShelf)
scene.add(midVertShelf)
scene.add(rightVertShelf)
scene.add(topShelf)


scene.add(firstDoor)
scene.add(doorKnob)
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

const collisionCheck = (moveVector) => {
    boundaryObjects.forEach(bound => {
        if (cameraBoundingBox.intersectsBox(bound)) {
            camera.position.add(moveVector.multiplyScalar(-2))
            cameraBox.position.add(moveVector)
            cameraBoundingBox.translate(moveVector)
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

const openCloseFirstDoor = () => {
    console.log('inside open close function')
    firstDoorInteractionInProgress = true
    if (firstDoorClosed) {
        console.log('opening door')
        let translation = new THREE.Vector3(-1,0,-1).normalize()
        firstDoor.rotateY(Math.PI/2);
        // guess and check work on translation distance; could have calculated more precisely
        firstDoor.translateOnAxis(translation,-18)
        doorKnob.rotateY(Math.PI/2);
        doorKnob.translateOnAxis(translation,-32)
        firstDoorClosed = false;
        document.getElementById('response-text').innerHTML = "Door swings open"
        setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
    }
    else {
        console.log('closing door')
        let translation = new THREE.Vector3(1,0,-1).normalize()
        firstDoor.rotateY(Math.PI/2);
        firstDoor.translateOnAxis(translation,18)
        doorKnob.rotateY(Math.PI/2);
        doorKnob.translateOnAxis(translation,32)
        // have to rotate each 180 degrees to get back to initial orientation
        firstDoor.rotateY(Math.PI)
        doorKnob.rotateY(Math.PI)
        firstDoorClosed = true;
        document.getElementById('response-text').innerHTML = "Door slams shut"
        setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
    }
    setTimeout(() => firstDoorInteractionInProgress = false, 2000)
}

const interact = () => {
    let checkInteract = document.getElementById('interact-text').innerHTML;
    if (checkInteract.length) {
        let closestObj = closestInteractiveObject();
        if (closestObj === firstDoorBound) {
            console.log('interacting with the door! next have a check, if fails say door is locked')
            if (firstDoorUnlocked) {
                if (!firstDoorInteractionInProgress) {
                    openCloseFirstDoor()
                }
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
    const moveVector = new THREE.Vector3(0,0,0)
    if (window.isADown) {
        camera.getWorldDirection(camDirection)
        camDirection.cross(new THREE.Vector3(0,-1,0))
        camera.position.add(camDirection.multiplyScalar(.75))
        cameraBox.position.add(camDirection)
        cameraBoundingBox.translate(camDirection)
        camera.updateProjectionMatrix()
        moveVector.addVectors(moveVector,camDirection)
    }
    if (window.isDDown) {
        camera.getWorldDirection(camDirection)
        camDirection.cross(new THREE.Vector3(0,1,0))
        camera.position.add(camDirection.multiplyScalar(.75))
        cameraBox.position.add(camDirection)
        cameraBoundingBox.translate(camDirection)
        camera.updateProjectionMatrix()
        moveVector.addVectors(moveVector,camDirection)
    }
    if (window.isWDown) {
        camera.getWorldDirection(camDirection)       
        camDirection.setComponent(1,0)
        camera.position.add(camDirection.multiplyScalar(.75))
        cameraBox.position.add(camDirection)
        cameraBoundingBox.translate(camDirection)
        camera.updateProjectionMatrix()
        moveVector.addVectors(moveVector,camDirection)
    }
    if (window.isSDown) {
        camera.getWorldDirection(camDirection)
        camDirection.setComponent(1,0)
        camera.position.add(camDirection.multiplyScalar(-.75))
        cameraBox.position.add(camDirection)
        cameraBoundingBox.translate(camDirection)
        camera.updateProjectionMatrix()
        moveVector.addVectors(moveVector,camDirection)
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
    // console.log('move vector', moveVector)
    // seems like need to re-render bounding boxes whenever they are changed... pretty cool
    firstDoorBound.copy(firstDoor.geometry.boundingBox).applyMatrix4(firstDoor.matrixWorld)
    collisionCheck(moveVector);
    proximityCheck();

    renderer.render(scene, camera)
}

// next steps:
// things to add:
// -- safe, bookshelf, maybe some posters/paintings
// ---- could add a basic chair or something; if interact, could sit down
// ---- sitting would move camera view down some; not allow movement until standing back up

// order of operations to unlock door:
// 1: interact with specific paintings/posters: one could have title clue, one author clue, one page num
// 2: interact with bookshelf: if got all painting clues, would grab specific book and go to page
// --- once on page, would see number sequence "9-17-32"
// --- if not all clues, would grab a random book? or just display a message with "You see dozens of classic books; nothing stands out"
// --- if random book, could have a check to see if you get lucky and get the correct book/page; might be complicated
// 3: once have clue, can unlock and open safe. inside safe, they will be a key that you grab
// --- if you interact with safe without code, can randomly guess numbers; can have very slim chance of guessing correctly
// ----- would want to limit incorrect guesses though; if 4 incorrect guesses, display message like "You hear a robotic voice 'safe will shutdown after 1 more incorrect guess'"
// 4: with key in hand, if you interact with door, will display "You unlock the door" and set unlocked bool to true

// paintings: 
// maybe interacting with one says 'you see a picture of a large, white whale'
// -- if you look at that one, could single out "Moby Dick" from shelf
// another could have something else, like

// after that, could leave room freely
// at that point, could look into importing other objects or textures; get basic functionality done first with ugly style, try to spice up later
// also look into adding some sound effects
// -- walking sound effect
// -- door open/closing sound effect
// -- keypad sound effect for safe
// -- locked door handle sound effect
// -- unlocking door sound effect

// -- could see if could import sort of these objects, or just spend time making them
// -- could always talk about during science fair that I want to continue to learn about three js
// ---- goal here was to build something with minimal guidance/tutorial help
// ---- now that I know some basics and figured some things out on my own, feel comfortable diving in deeper and learning some cool techniques


// - look into adding other objects as mentioned below, or learn more about textures; could make the walls/floor look better
// - could also add a ceiling

// also could look into a jump mechanic? but then would need some sort of physics
// after that, maybe look into making or importing other objects; could try to start adding things to the room
// if objects added to room, could work on figuring out how to interact with them
// -- could try to add a small cross hair/cursor to show where camera is focused for when objects come into play
// add a small legend or something that tells what the controls are

animate()