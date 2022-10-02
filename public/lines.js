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
let hasWhaleClue = false;
let hasShipClue = false
let hasBookShelfClue = false;
let hasDoorKey = false;
let tvPluggedIn = false;
let closetUnlocked = false;
let safeGuesses = 0;
const bookTitles = ["Of Mice and Men", "Little Women", "Pride and Prejudice", "The Catcher in the Rye", "Animal Farm", "The Great Gatsby", "Lord of the Flies", "Catch-22", "Don Quixote", "Dracula", "The Count of Monte Cristo", "A Tale of Two Cities", "Invisible Man", "Sense and Sensibility", "Persuasion", "The Hobbit","Treasure Island","A Christmas Carol","The Scarlet Letter","Heart of Darkness","The Road","Things Fall Apart", "Crime and Punishment", "War of the Worlds", "Mansfield Park","To Kill a Mockingbird", "Jane Eyre", "The Call of the Wild","Frankenstein","Nineteen Eighty-Four","The Iliad","East of Eden","The Secret Garden","Atlas Shrugged","War and Peace","Peter Pan","Hard Times"]
const randomBookResponse = ["You flip through a few pages, but don't find anything useful","The text is too difficult for you, you give up quickly", "*Yawn... This book is boring, you put it back", "You read a few pages before putting it away", "One of your favorites! You smile fondly before putting it back"]

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1,500)
camera.position.set(0,25,60)
camera.lookAt(0,25,0);
const camDirection = new THREE.Vector3();
const boxMaterial = new THREE.MeshBasicMaterial({color: 'blue'})
const boxGeometry = new THREE.BoxGeometry(10,20,10)

// making camera box to intersect with walls; will see if this works! might not be best practice
const cameraBox = new THREE.Mesh(boxGeometry, boxMaterial)
cameraBox.position.set(0,25,60)
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
const doorMaterial = new THREE.MeshBasicMaterial({color: 'sienna'})
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

const floorMaterial = new THREE.MeshBasicMaterial({color: 'sandybrown'})
const floorGeometry = new THREE.BoxGeometry(300,1,1000);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
const ceilingMaterial = new THREE.MeshBasicMaterial({color: 'gainsboro'})
const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial)
floor.position.set(0,-5,0)
ceiling.position.set(0,80,0)

// bookshelf geometries
const shelfMaterial = new THREE.MeshBasicMaterial({color: 'saddlebrown'})
const shelfBackMaterial = new THREE.MeshBasicMaterial({color: 'maroon'})
const verticalShelfGeometry = new THREE.BoxGeometry(10, 70, 4)
const leftVertShelf = new THREE.Mesh(verticalShelfGeometry,shelfMaterial)
const midVertShelf = new THREE.Mesh(verticalShelfGeometry,shelfMaterial)
const rightVertShelf = new THREE.Mesh(verticalShelfGeometry,shelfMaterial)
const horizontalShelfGeometry = new THREE.BoxGeometry(10,2,64)
const topShelf = new THREE.Mesh(horizontalShelfGeometry, shelfMaterial)
const middleShelf = new THREE.Mesh(horizontalShelfGeometry, shelfMaterial)
const middleShelfTwo = new THREE.Mesh(horizontalShelfGeometry, shelfMaterial)
const middleShelfThree = new THREE.Mesh(horizontalShelfGeometry, shelfMaterial)
const bottomShelf = new THREE.Mesh(horizontalShelfGeometry, shelfMaterial)
const shelfBackGeometry = new THREE.BoxGeometry(.5, 70, 60)
const shelfBackWall = new THREE.Mesh(shelfBackGeometry, shelfBackMaterial)
leftVertShelf.position.set(-140, 25, 30)
midVertShelf.position.set(-140, 25, 0)
rightVertShelf.position.set(-140, 25, -30)
topShelf.position.set(-140,60,0)
middleShelf.position.set(-140,44,0)
middleShelfTwo.position.set(-140,28,0)
middleShelfThree.position.set(-140,12,0)
bottomShelf.position.set(-140,-4,0)
shelfBackWall.position.set(-145,25,0)


//grouping together
const shelfGroup = new THREE.Group().add(leftVertShelf, midVertShelf, rightVertShelf)
const shelfBound = new THREE.Box3().setFromObject(shelfGroup)
scene.add(leftVertShelf)
scene.add(midVertShelf)
scene.add(rightVertShelf)
scene.add(topShelf)
scene.add(middleShelf)
scene.add(middleShelfTwo)
scene.add(middleShelfThree)
scene.add(bottomShelf)
scene.add(shelfBackWall)

//books; very inefficient, brute force method or adding/creating. will try to learn better method after room finished
const bookGeometryOne = new THREE.BoxGeometry(5,10,2)
const bookMaterialOne = new THREE.MeshBasicMaterial({color: 'green'})
const bookGeometryTwo = new THREE.BoxGeometry(6,12,2)
const bookMaterialTwo = new THREE.MeshBasicMaterial({color: 'blue'})
const bookGeometryThree = new THREE.BoxGeometry(7,11,2)
const bookMaterialThree = new THREE.MeshBasicMaterial({color: 'crimson'})
const bookGeometryFour = new THREE.BoxGeometry(4,12,3)
const bookMaterialFour = new THREE.MeshBasicMaterial({color: 'darkviolet'})

const dummyFunctionAddBooks = () => {
//all shelves copy/pasted below. disgusting, should have written a function or read up more on groups, but concerned about time
const greenBookOne = new THREE.Mesh(bookGeometryOne,bookMaterialOne)
const greenBookOneCloneOne = greenBookOne.clone()
const greenBookOneCloneTwo = greenBookOne.clone()
const greenBookOneCloneThree = greenBookOne.clone()
const blueBookOne = new THREE.Mesh(bookGeometryTwo, bookMaterialTwo)
const blueBookCloneOne = blueBookOne.clone()
const blueBookCloneTwo = blueBookOne.clone()
const redBookOne = new THREE.Mesh(bookGeometryThree, bookMaterialThree)
const redBookCloneOne = redBookOne.clone()
const redBookCloneTwo = redBookOne.clone()
const yellowBookOne = new THREE.Mesh(bookGeometryFour, bookMaterialFour)
const yellowBookClone = yellowBookOne.clone()

greenBookOne.position.set(-140,33.5,3)
greenBookOneCloneOne.position.set(-140,33.5,11)
greenBookOneCloneTwo.position.set(-140,33.5,24)
greenBookOneCloneThree.position.set(-140,33.5,18)
blueBookOne.position.set(-140,33.5,20)
blueBookCloneOne.position.set(-140,33.5,5)
blueBookCloneTwo.position.set(-140,33.5,9)
redBookOne.position.set(-140,33.5,7)
redBookCloneOne.position.set(-140,33.5,13)
redBookCloneTwo.position.set(-140,33.5,22)
yellowBookOne.position.set(-140,33.5,26.5)
yellowBookClone.position.set(-140,33.5,15.5)

scene.add(greenBookOne)
scene.add(greenBookOneCloneOne)
scene.add(greenBookOneCloneTwo)
scene.add(greenBookOneCloneThree)
scene.add(blueBookOne)
scene.add(blueBookCloneOne)
scene.add(blueBookCloneTwo)
scene.add(redBookOne)
scene.add(redBookCloneOne)
scene.add(redBookCloneTwo)
scene.add(yellowBookClone)
scene.add(yellowBookOne)

const greenBookOne1 = new THREE.Mesh(bookGeometryOne,bookMaterialOne)
const greenBookOneCloneOne1 = greenBookOne.clone()
const greenBookOneCloneTwo1 = greenBookOne.clone()
const greenBookOneCloneThree1 = greenBookOne.clone()
const blueBookOne1 = new THREE.Mesh(bookGeometryTwo, bookMaterialTwo)
const blueBookCloneOne1 = blueBookOne.clone()
const blueBookCloneTwo1 = blueBookOne.clone()
const redBookOne1 = new THREE.Mesh(bookGeometryThree, bookMaterialThree)
const redBookCloneOne1 = redBookOne.clone()
const redBookCloneTwo1 = redBookOne.clone()
const yellowBookOne1 = new THREE.Mesh(bookGeometryFour, bookMaterialFour)
const yellowBookClone1 = yellowBookOne.clone()
greenBookOne1.position.set(-140,17.5,-3)
greenBookOneCloneOne1.position.set(-140,17.5,-11)
greenBookOneCloneTwo1.position.set(-140,17.5,-24)
greenBookOneCloneThree1.position.set(-140,17.5,-18)
blueBookOne1.position.set(-140,17.5,-20)
blueBookCloneOne1.position.set(-140,17.5,-5)
blueBookCloneTwo1.position.set(-140,17.5,-9)
redBookOne1.position.set(-140,17.5,-7)
redBookCloneOne1.position.set(-140,17.5,-13)
redBookCloneTwo1.position.set(-140,17.5,-22)
yellowBookOne1.position.set(-140,17.5,-26.5)
yellowBookClone1.position.set(-140,17.5,-15.5)
scene.add(greenBookOne1)
scene.add(greenBookOneCloneOne1)
scene.add(greenBookOneCloneTwo1)
scene.add(greenBookOneCloneThree1)
scene.add(blueBookOne1)
scene.add(blueBookCloneOne1)
scene.add(blueBookCloneTwo1)
scene.add(redBookOne1)
scene.add(redBookCloneOne1)
scene.add(redBookCloneTwo1)
scene.add(yellowBookClone1)
scene.add(yellowBookOne1)

const greenBookOne2 = new THREE.Mesh(bookGeometryOne,bookMaterialOne)
const greenBookOneCloneOne2 = greenBookOne.clone()
const greenBookOneCloneTwo2 = greenBookOne.clone()
const greenBookOneCloneThree2 = greenBookOne.clone()
const blueBookOne2 = new THREE.Mesh(bookGeometryTwo, bookMaterialTwo)
const blueBookCloneOne2 = blueBookOne.clone()
const blueBookCloneTwo2 = blueBookOne.clone()
const redBookOne2 = new THREE.Mesh(bookGeometryThree, bookMaterialThree)
const redBookCloneOne2 = redBookOne.clone()
const redBookCloneTwo2 = redBookOne.clone()
const yellowBookOne2 = new THREE.Mesh(bookGeometryFour, bookMaterialFour)
const yellowBookClone2 = yellowBookOne.clone()
greenBookOne2.position.set(-140,1.5,3)
greenBookOneCloneOne2.position.set(-140,1.5,11)
greenBookOneCloneTwo2.position.set(-140,1.5,24)
greenBookOneCloneThree2.position.set(-140,1.5,18)
blueBookOne2.position.set(-140,1.5,20)
blueBookCloneOne2.position.set(-140,1.5,5)
blueBookCloneTwo2.position.set(-140,1.5,9)
redBookOne2.position.set(-140,1.5,7)
redBookCloneOne2.position.set(-140,1.5,13)
redBookCloneTwo2.position.set(-140,1.5,22)
yellowBookOne2.position.set(-140,1.5,26.5)
yellowBookClone2.position.set(-140,1.5,15.5)
scene.add(greenBookOne2)
scene.add(greenBookOneCloneOne2)
scene.add(greenBookOneCloneTwo2)
scene.add(greenBookOneCloneThree2)
scene.add(blueBookOne2)
scene.add(blueBookCloneOne2)
scene.add(blueBookCloneTwo2)
scene.add(redBookOne2)
scene.add(redBookCloneOne2)
scene.add(redBookCloneTwo2)
scene.add(yellowBookClone2)
scene.add(yellowBookOne2)

const greenBookOne3 = new THREE.Mesh(bookGeometryOne,bookMaterialOne)
const greenBookOneCloneOne3 = greenBookOne.clone()
const greenBookOneCloneTwo3 = greenBookOne.clone()
const greenBookOneCloneThree3 = greenBookOne.clone()
const blueBookOne3 = new THREE.Mesh(bookGeometryTwo, bookMaterialTwo)
const blueBookCloneOne3 = blueBookOne.clone()
const blueBookCloneTwo3 = blueBookOne.clone()
const redBookOne3 = new THREE.Mesh(bookGeometryThree, bookMaterialThree)
const redBookCloneOne3 = redBookOne.clone()
const redBookCloneTwo3 = redBookOne.clone()
const yellowBookOne3 = new THREE.Mesh(bookGeometryFour, bookMaterialFour)
const yellowBookClone3 = yellowBookOne.clone()
greenBookOne3.position.set(-140,49.5,-3)
greenBookOneCloneOne3.position.set(-140,49.5,-11)
greenBookOneCloneTwo3.position.set(-140,49.5,-24)
greenBookOneCloneThree3.position.set(-140,49.5,-18)
blueBookOne3.position.set(-140,49.5,-20)
blueBookCloneOne3.position.set(-140,49.5,-5)
blueBookCloneTwo3.position.set(-140,49.5,-9)
redBookOne3.position.set(-140,49.5,-7)
redBookCloneOne3.position.set(-140,49.5,-13)
redBookCloneTwo3.position.set(-140,49.5,-22)
yellowBookOne3.position.set(-140,49.5,-26.5)
yellowBookClone3.position.set(-140,49.5,-15.5)
scene.add(greenBookOne3)
scene.add(greenBookOneCloneOne3)
scene.add(greenBookOneCloneTwo3)
scene.add(greenBookOneCloneThree3)
scene.add(blueBookOne3)
scene.add(blueBookCloneOne3)
scene.add(blueBookCloneTwo3)
scene.add(redBookOne3)
scene.add(redBookCloneOne3)
scene.add(redBookCloneTwo3)
scene.add(yellowBookClone3)
scene.add(yellowBookOne3)

const greenBookOne4 = new THREE.Mesh(bookGeometryOne,bookMaterialOne)
const greenBookOneCloneOne4 = greenBookOne.clone()
const greenBookOneCloneTwo4 = greenBookOne.clone()
const greenBookOneCloneThree4 = greenBookOne.clone()
const blueBookOne4 = new THREE.Mesh(bookGeometryTwo, bookMaterialTwo)
const blueBookCloneOne4 = blueBookOne.clone()
const blueBookCloneTwo4 = blueBookOne.clone()
const redBookOne4 = new THREE.Mesh(bookGeometryThree, bookMaterialThree)
const redBookCloneOne4 = redBookOne.clone()
const redBookCloneTwo4 = redBookOne.clone()
const yellowBookOne4 = new THREE.Mesh(bookGeometryFour, bookMaterialFour)
const yellowBookClone4 = yellowBookOne.clone() //
greenBookOne4.position.set(-140,1.5,-5)
greenBookOneCloneOne4.position.set(-140,1.5,-12)
greenBookOneCloneTwo4.position.set(-140,1.5,-27)
greenBookOneCloneThree4.position.set(-140,1.5,-18)
blueBookOne4.position.set(-140,1.5,-20)
blueBookCloneOne4.position.set(-140,1.5,-3)
blueBookCloneTwo4.position.set(-140,1.5,-14)
redBookOne4.position.set(-140,1.5,-7)
redBookCloneOne4.position.set(-140,1.5,-16)
redBookCloneTwo4.position.set(-140,1.5,-25)
yellowBookOne4.position.set(-140,1.5,-22.5)
yellowBookClone4.position.set(-140,1.5,-9.5)
scene.add(greenBookOne4)
scene.add(greenBookOneCloneOne4)
scene.add(greenBookOneCloneTwo4)
scene.add(greenBookOneCloneThree4)
scene.add(blueBookOne4)
scene.add(blueBookCloneOne4)
scene.add(blueBookCloneTwo4)
scene.add(redBookOne4)
scene.add(redBookCloneOne4)
scene.add(redBookCloneTwo4)
scene.add(yellowBookClone4)
scene.add(yellowBookOne4)

const greenBookOne5 = new THREE.Mesh(bookGeometryOne,bookMaterialOne)
const greenBookOneCloneOne5 = greenBookOne.clone()
const greenBookOneCloneTwo5 = greenBookOne.clone()
const greenBookOneCloneThree5 = greenBookOne.clone()
const blueBookOne5 = new THREE.Mesh(bookGeometryTwo, bookMaterialTwo)
const blueBookCloneOne5 = blueBookOne.clone()
const blueBookCloneTwo5 = blueBookOne.clone()
const redBookOne5 = new THREE.Mesh(bookGeometryThree, bookMaterialThree)
const redBookCloneOne5 = redBookOne.clone()
const redBookCloneTwo5 = redBookOne.clone()
const yellowBookOne5 = new THREE.Mesh(bookGeometryFour, bookMaterialFour)
const yellowBookClone5 = yellowBookOne.clone() //
greenBookOne5.position.set(-140,33.5,-5)
greenBookOneCloneOne5.position.set(-140,33.5,-12)
greenBookOneCloneTwo5.position.set(-140,33.5,-27)
greenBookOneCloneThree5.position.set(-140,33.5,-18)
blueBookOne5.position.set(-140,33.5,-20)
blueBookCloneOne5.position.set(-140,33.5,-3)
blueBookCloneTwo5.position.set(-140,33.5,-14)
redBookOne5.position.set(-140,33.5,-7)
redBookCloneOne5.position.set(-140,33.5,-16)
redBookCloneTwo5.position.set(-140,33.5,-25)
yellowBookOne5.position.set(-140,33.5,-22.5)
yellowBookClone5.position.set(-140,33.5,-9.5)
scene.add(greenBookOne5)
scene.add(greenBookOneCloneOne5)
scene.add(greenBookOneCloneTwo5)
scene.add(greenBookOneCloneThree5)
scene.add(blueBookOne5)
scene.add(blueBookCloneOne5)
scene.add(blueBookCloneTwo5)
scene.add(redBookOne5)
scene.add(redBookCloneOne5)
scene.add(redBookCloneTwo5)
scene.add(yellowBookClone5)
scene.add(yellowBookOne5)

const greenBookOne6 = new THREE.Mesh(bookGeometryOne,bookMaterialOne)
const greenBookOneCloneOne6 = greenBookOne.clone()
const greenBookOneCloneTwo6 = greenBookOne.clone()
const greenBookOneCloneThree6 = greenBookOne.clone()
const blueBookOne6 = new THREE.Mesh(bookGeometryTwo, bookMaterialTwo)
const blueBookCloneOne6 = blueBookOne.clone()
const blueBookCloneTwo6 = blueBookOne.clone()
const redBookOne6 = new THREE.Mesh(bookGeometryThree, bookMaterialThree)
const redBookCloneOne6 = redBookOne.clone()
const redBookCloneTwo6 = redBookOne.clone()
const yellowBookOne6 = new THREE.Mesh(bookGeometryFour, bookMaterialFour)
const yellowBookClone6 = yellowBookOne.clone() //
greenBookOne6.position.set(-140,17.5,5)
greenBookOneCloneOne6.position.set(-140,17.5,12)
greenBookOneCloneTwo6.position.set(-140,17.5,27)
greenBookOneCloneThree6.position.set(-140,17.5,18)
blueBookOne6.position.set(-140,17.5,20)
blueBookCloneOne6.position.set(-140,17.5,3)
blueBookCloneTwo6.position.set(-140,17.5,14)
redBookOne6.position.set(-140,17.5,7)
redBookCloneOne6.position.set(-140,17.5,16)
redBookCloneTwo6.position.set(-140,17.5,25)
yellowBookOne6.position.set(-140,17.5,22.5)
yellowBookClone6.position.set(-140,17.5,9.5)
scene.add(greenBookOne6)
scene.add(greenBookOneCloneOne6)
scene.add(greenBookOneCloneTwo6)
scene.add(greenBookOneCloneThree6)
scene.add(blueBookOne6)
scene.add(blueBookCloneOne6)
scene.add(blueBookCloneTwo6)
scene.add(redBookOne6)
scene.add(redBookCloneOne6)
scene.add(redBookCloneTwo6)
scene.add(yellowBookClone6)
scene.add(yellowBookOne6)

const greenBookOne7 = new THREE.Mesh(bookGeometryOne,bookMaterialOne)
const greenBookOneCloneOne7 = greenBookOne.clone()
const greenBookOneCloneTwo7 = greenBookOne.clone()
const greenBookOneCloneThree7 = greenBookOne.clone()
const blueBookOne7 = new THREE.Mesh(bookGeometryTwo, bookMaterialTwo)
const blueBookCloneOne7 = blueBookOne.clone()
const blueBookCloneTwo7 = blueBookOne.clone()
const redBookOne7 = new THREE.Mesh(bookGeometryThree, bookMaterialThree)
const redBookCloneOne7 = redBookOne.clone()
const redBookCloneTwo7 = redBookOne.clone()
const yellowBookOne7 = new THREE.Mesh(bookGeometryFour, bookMaterialFour)
const yellowBookClone7 = yellowBookOne.clone() //
greenBookOne7.position.set(-140,49.5,5)
greenBookOneCloneOne7.position.set(-140,49.5,12)
greenBookOneCloneTwo7.position.set(-140,49.5,27)
greenBookOneCloneThree7.position.set(-140,49.5,18)
blueBookOne7.position.set(-140,49.5,20)
blueBookCloneOne7.position.set(-140,49.5,3)
blueBookCloneTwo7.position.set(-140,49.5,14)
redBookOne7.position.set(-140,49.5,7)
redBookCloneOne7.position.set(-140,49.5,16)
redBookCloneTwo7.position.set(-140,49.5,25)
yellowBookOne7.position.set(-140,49.5,22.5)
yellowBookClone7.position.set(-140,49.5,9.5)
scene.add(greenBookOne7)
scene.add(greenBookOneCloneOne7)
scene.add(greenBookOneCloneTwo7)
scene.add(greenBookOneCloneThree7)
scene.add(blueBookOne7)
scene.add(blueBookCloneOne7)
scene.add(blueBookCloneTwo7)
scene.add(redBookOne7)
scene.add(redBookCloneOne7)
scene.add(redBookCloneTwo7)
scene.add(yellowBookClone7)
scene.add(yellowBookOne7)
//endregion
}
dummyFunctionAddBooks()

//posters or paintings here 
const paintingGeometry = new THREE.BoxGeometry(2,30,20)
const paintingMaterial = new THREE.MeshBasicMaterial({color: 'tan'})
const paintingOne = new THREE.Mesh(paintingGeometry,paintingMaterial)
const paintingTwo = paintingOne.clone()
const paintingThree = paintingOne.clone()
const paintingFour = paintingOne.clone()

paintingOne.position.set(140,35,30)
paintingTwo.position.set(140,35,-85)
paintingThree.position.set(140,35,-30)
paintingFour.position.set(140, 35, 85)

// if time, could try to add some basic shapes on the canvases; like circle, triangle, etc.

const paintingOneBound = new THREE.Box3().setFromObject(paintingOne)
const paintingTwoBound = new THREE.Box3().setFromObject(paintingTwo)
const paintingThreeBound = new THREE.Box3().setFromObject(paintingThree)
const paintingFourBound = new THREE.Box3().setFromObject(paintingFour)

scene.add(paintingOne)
scene.add(paintingTwo)
scene.add(paintingThree)
scene.add(paintingFour)

const safeGeometry = new THREE.BoxGeometry(14,14,10)
const safeMaterial = new THREE.MeshBasicMaterial({color: 'darkslategray'})
const safe = new THREE.Mesh(safeGeometry, safeMaterial)
const safeDialGeometry = new THREE.CylinderGeometry(1,1,3,8)
const safeDialMaterial = new THREE.MeshBasicMaterial({color: 'gray'})
const safeDial = new THREE.Mesh(safeDialGeometry, safeDialMaterial)
safe.rotateY(Math.PI/4)
safe.position.set(-136,3,-136)
safeDial.rotateX(Math.PI/2)
safeDial.rotateZ(3*Math.PI/4)
safeDial.position.set(-130,3,-135)
const safeBound = new THREE.Box3().setFromObject(safe)
scene.add(safe)
scene.add(safeDial)
// could make a basic armchair, a desk, a tv, and a lamp as fake objects

//desk; doesn't do anything
const deskGeometry = new THREE.BoxGeometry(40,4,15)
const deskMaterial = new THREE.MeshBasicMaterial({color: 'chocolate'})
const desk = new THREE.Mesh(deskGeometry, deskMaterial);
desk.position.set(50,15,135)
const deskBound = new THREE.Box3().setFromObject(desk)
const deskLegGeometry = new THREE.BoxGeometry(1,20,1)
const deskLegOne = new THREE.Mesh(deskLegGeometry, deskMaterial);
const deskLegTwo = deskLegOne.clone()
const deskLegThree = deskLegOne.clone()
const deskLegFour = deskLegOne.clone()
deskLegOne.position.set(31,5,129)
deskLegTwo.position.set(69,5,141)
deskLegThree.position.set(69,5,129)
deskLegFour.position.set(31,5,141)

scene.add(desk)
scene.add(deskLegOne,deskLegTwo,deskLegThree,deskLegFour)
//armchair; doesn't do anything yet, could try to make user sit in it
const chairSeatGeometry = new THREE.BoxGeometry(20,5,20)
const chairBackGeometry = new THREE.BoxGeometry(20,20,3)
const chairSeatMaterial = new THREE.MeshBasicMaterial({color: 'mediumpurple'})
const chairArmGeometry = new THREE.CylinderGeometry(3,3,20,8)
const chairArmMaterial = new THREE.MeshBasicMaterial({color: 'mediumorchid'})
const chairSeat = new THREE.Mesh(chairSeatGeometry,chairSeatMaterial)
const chairBack = new THREE.Mesh(chairBackGeometry, chairSeatMaterial)
chairSeat.rotateY(Math.PI/4)
chairSeat.position.set(-130,3,130)
chairBack.rotateY(3*Math.PI/4)
chairBack.position.set(-137,10.5,137)
const chairArm = new THREE.Mesh(chairArmGeometry, chairArmMaterial)
chairArm.rotateX(Math.PI/2)
chairArm.rotateZ(Math.PI/4)
const chairArmClone = chairArm.clone()
chairArm.position.set(-137.5,8,125)
chairArmClone.position.set(-125,8,137.5)

const chairLegMaterial = new THREE.MeshBasicMaterial({color: 'saddlebrown'})
const chairLegGeometry = new THREE.BoxGeometry(1,7.5,1)
const chairLegOne = new THREE.Mesh(chairLegGeometry, chairLegMaterial)
chairLegOne.rotateY(Math.PI/4)
chairLegOne.position.set(-130,-2.5,117.5)
const chairLegTwo = chairLegOne.clone()
chairLegTwo.position.set(-117.5,-2.5,130)
const chairLegThree = chairLegOne.clone()
const chairLegFour = chairLegOne.clone()
chairLegThree.position.set(-130,-2.5,142.5)
chairLegFour.position.set(-142.5,-2.5,130)

const chairGroup = new THREE.Group().add(chairSeat, chairBack, chairArm, chairArmClone)
const chairBound = new THREE.Box3().setFromObject(chairGroup)
scene.add(chairSeat, chairBack, chairArm, chairArmClone, chairLegOne, chairLegTwo, chairLegThree,chairLegFour)

// lamp
const lampShadeGeometry = new THREE.CylinderGeometry(3,6,8,8)
const lampShadeMaterial = new THREE.MeshBasicMaterial({color: 'darkgreen'})
const lampShade = new THREE.Mesh(lampShadeGeometry, lampShadeMaterial)
const lampPoleGeometry = new THREE.CylinderGeometry(.5,.5,40,10)
const lampPoleMaterial = new THREE.MeshBasicMaterial({color: 'gold'})
const lampPole = new THREE.Mesh(lampPoleGeometry, lampPoleMaterial)
const lampBaseGeometry = new THREE.BoxGeometry(8,.5,8)
const lampBaseMaterial = new THREE.MeshBasicMaterial({color: 'darkgoldenrod'})
const lampBase = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial)
lampShade.position.set(-100,27,135)
lampPole.position.set(-100,10, 135)
lampBase.position.set(-100,-4,135)

const lampGroup = new THREE.Group().add(lampShade, lampPole, lampBase)
const lampBound = new THREE.Box3().setFromObject(lampGroup)
scene.add(lampShade, lampPole, lampBase)

// tv stuff
const tvVertGeometry = new THREE.BoxGeometry(1,14,8)
const tvHorGeometry = new THREE.BoxGeometry(20,1,8)
const tvOuterMaterial = new THREE.MeshBasicMaterial({color: 'black'})
const tvLeftVert = new THREE.Mesh(tvVertGeometry, tvOuterMaterial)
const tvRightVert = tvLeftVert.clone()
const tvBottom = new THREE.Mesh(tvHorGeometry, tvOuterMaterial)
const tvTop = tvBottom.clone()
tvLeftVert.position.set(93.5,10,-140)
tvRightVert.position.set(112.5,10,-140)
tvBottom.position.set(103,3.5,-140)
tvTop.position.set(103,16.5,-140)
const tvScreenGeometry = new THREE.BoxGeometry(19,13,6)
const tvScreenMaterial = new THREE.MeshBasicMaterial({color: 'silver'})
const tvScreen = new THREE.Mesh(tvScreenGeometry, tvScreenMaterial)
tvScreen.position.set(103,10,-140)
const tvStandGeometry = new THREE.BoxGeometry(30,8,12)
const tvStand = new THREE.Mesh(tvStandGeometry, shelfMaterial)
tvStand.position.set(103,-1,-142)

const tvGroup = new THREE.Group().add(tvStand,tvScreen)
const tvBound = new THREE.Box3().setFromObject(tvGroup)

const tvCordGeometry = new THREE.BoxGeometry(40,.5,.5)
const tvCord = new THREE.Mesh(tvCordGeometry, tvOuterMaterial)
tvCord.position.set(85,-4,-145)
const outletGeometry = new THREE.BoxGeometry(2,4,.5)
const outlet = new THREE.Mesh(outletGeometry,ceilingMaterial)
outlet.position.set(65,5,-145)
const outletBound = new THREE.Box3().setFromObject(outlet)

scene.add(tvLeftVert,tvRightVert,tvBottom,tvTop,tvScreen, tvStand, tvCord, outlet)

scene.add(firstDoor)
scene.add(doorKnob)
scene.add(frontWallLeft)
scene.add(frontWallRight)
scene.add(frontWallTop)
scene.add(backWall)
scene.add(leftWall)
scene.add(rightWall)
scene.add(floor, ceiling)
renderer.render(scene,camera)

const closetFrontWallGeometry = new THREE.BoxGeometry(65,100,5)
const closetFrontWall = new THREE.Mesh(closetFrontWallGeometry, materialWall)
closetFrontWall.position.set(-125,30,-95)
const closetSideWallGeometry = new THREE.BoxGeometry(5,100,20)
const closetSideWall = new THREE.Mesh(closetSideWallGeometry, materialWall)
closetSideWall.position.set(-95,30,-105)
const closetSideTopGeometry = new THREE.BoxGeometry(5,30,40)
const closetSideTop = new THREE.Mesh(closetSideTopGeometry, materialWall)
closetSideTop.position.set(-95,65,-125)
const closetWallGroup = new THREE.Group().add(closetFrontWall,closetSideWall)
const closetFrontWallBound = new THREE.Box3().setFromObject(closetWallGroup)

const closetDoorGeomtery = new THREE.BoxGeometry(30,60,2)
const closetDoor = new THREE.Mesh(closetDoorGeomtery, doorMaterial)
closetDoor.rotateY(Math.PI/2)
closetDoor.position.set(-95,20,-130)
closetDoor.geometry.computeBoundingBox()
const closetDoorBound = new THREE.Box3()


scene.add(closetFrontWall, closetSideWall, closetSideTop, closetDoor)

//array of objects I want to create collision with so far
const boundaryObjects = [backWallBound,leftWallBound,rightWallBound, frontWallLeftBound, frontWallRightBound, firstDoorBound, shelfBound, paintingOneBound, paintingTwoBound, paintingThreeBound, paintingFourBound, safeBound, deskBound, chairBound, lampBound, tvBound, closetFrontWallBound, closetDoorBound]
const interactiveObjects = [firstDoorBound, shelfBound, paintingOneBound, paintingTwoBound, paintingThreeBound, paintingFourBound, safeBound, deskBound, chairBound,lampBound, tvBound, outletBound, closetDoorBound]

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
    if (event.key === 'g') {
        window.isGDown = true;
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
    if (event.key === 'g') {
        window.isGDown = false;
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
        if (object.distanceToPoint(camera.position) < 40) {
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
    firstDoorInteractionInProgress = true
    if (firstDoorClosed) {
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

const guess = () => {
    let checkInteract = document.getElementById('interact-text').innerHTML;
    if (checkInteract.length) {
        let closestObj = closestInteractiveObject();
        if (closestObj === safeBound) {
            if (safeGuesses < 4) {
                if (!document.getElementById('response-text').innerHTML.length) {
                    let numOne = Math.floor(Math.random()*50);
                    let numTwo = Math.floor(Math.random()*50);
                    let numThree = Math.floor(Math.random()*50)
                    document.getElementById('response-text').innerHTML = `Guessing combination ${numOne}-${numTwo}-${numThree}...`
                    setTimeout(() => {
                        if ((numOne === 9) && (numTwo === 17) && (numThree === 32)) {
                            document.getElementById('response-text').innerHTML="That actually worked! You grab a key from inside the safe"
                        }
                        else {
                            document.getElementById('response-text').innerHTML="Darn! That didn't open it..."
                        }
                        setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
                    },2000)
                    safeGuesses++;
                }
            }
            else {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "I'd better be sure about my next guess..."
                    setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
                }
            }
        }
        else if (closestObj === shelfBound) {
            let chance = Math.floor(Math.random()*100)
            if (chance > 98) {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = `You pick out "Moby Dick"`
                    setTimeout(() => {  
                        document.getElementById('response-text').innerHTML="A piece of paper falls out when you pull out the book... It has '9-17-32' scrawled on it..."
                        setTimeout(() => {
                            document.getElementById('response-text').innerHTML="Hmm... is that a date...? or maybe a code...?"
                            setTimeout(() => document.getElementById('response-text').innerHTML= "",3000)
                        },5000)
                    },2000)
                }
                hasSafeCombo = true
            } 
            else {
                let titleIndex = Math.floor(Math.random()*bookTitles.length)
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = `You pick out "${bookTitles[titleIndex]}"`
                    setTimeout(() => {  
                        let responseIndex = Math.floor(Math.random()*randomBookResponse.length)
                        document.getElementById('response-text').innerHTML= randomBookResponse[responseIndex]
                        setTimeout(() => document.getElementById('response-text').innerHTML= "",3000)
                    },2000)
                }
            }
        }
    }
}

const openClosetDoor = () => {
    closetUnlocked = true;
    let index = interactiveObjects.indexOf(closetDoorBound);
    interactiveObjects.splice(index,1)
    closetDoor.rotateY(Math.PI/2)
    let translation = new THREE.Vector3(1,0,1).normalize()
    closetDoor.translateOnAxis(translation,-20)
    // need to rotate door, then also update the bound with the matrix thing
} 

const interact = () => {
    let checkInteract = document.getElementById('interact-text').innerHTML;
    if (checkInteract.length) {
        let closestObj = closestInteractiveObject();
        if (closestObj === firstDoorBound) {
            if (firstDoorUnlocked) {
                if (!firstDoorInteractionInProgress) {
                    openCloseFirstDoor()
                }
            } else if (hasDoorKey) {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "Door unlocked"
                    // probably not the best way to do this; could just clear out when far enough away?
                    setTimeout(() => {
                        firstDoorUnlocked = true;
                        document.getElementById('response-text').innerHTML=""
                    },1000)
                }
            } 
            else {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "Door is locked"
                    setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
                }
            }
        }
        else if (closestObj === shelfBound) {
            if (hasBookShelfClue) {
                if (!hasSafeCombo){
                    if (!document.getElementById('response-text').innerHTML.length) {
                        document.getElementById('response-text').innerHTML = "You scan the titles for Moby Dick..."
                        setTimeout(() => {  
                            document.getElementById('response-text').innerHTML="A piece of paper falls out when you pull out the book... It has '9-17-32' scrawled on it..."
                            setTimeout(() => {
                                document.getElementById('response-text').innerHTML="Hmm... is that a date...? or maybe a code...?"
                                setTimeout(() => document.getElementById('response-text').innerHTML= "",3000)
                            },5000)
                        },3000)
                    }
                    hasSafeCombo = true
                }
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "There are dozens of classics. Press 'g' to open random book"
                    setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
                }
            } else {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "There are dozens of classics. Press 'g' to open random book"
                    setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
                }
            }
        }
        else if (closestObj === paintingOneBound) {
            if (!document.getElementById('response-text').innerHTML.length) {
                document.getElementById('response-text').innerHTML = "Looks like a replica of the Starry Night"
                setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
            }
        }
        else if (closestObj === paintingTwoBound) {
            if (!document.getElementById('response-text').innerHTML.length) {
                document.getElementById('response-text').innerHTML = "Looks like a picture of the Virgin Mary"
                setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
            }
        }
        else if (closestObj === paintingThreeBound) {
            hasShipClue = true;
            hasBookShelfClue = (hasShipClue && hasWhaleClue)
            if (!document.getElementById('response-text').innerHTML.length) {
                document.getElementById('response-text').innerHTML = "Looks like a picture of a captain on a boat"
                setTimeout(() => {  
                    document.getElementById('response-text').innerHTML=""
                    if (hasBookShelfClue) {
                        document.getElementById('response-text').innerHTML = "Hmm...a captain and a white whale..."
                        setTimeout(() => document.getElementById('response-text').innerHTML="",3000)
                    }
                },2000)
            }
        }
        else if (closestObj === paintingFourBound) {
            hasWhaleClue = true;
            hasBookShelfClue = (hasShipClue && hasWhaleClue)
            if (!document.getElementById('response-text').innerHTML.length) {
                document.getElementById('response-text').innerHTML = "Looks like a picture of a white whale"
                setTimeout(() => {  
                    document.getElementById('response-text').innerHTML=""
                    if (hasBookShelfClue) {
                        document.getElementById('response-text').innerHTML = "Hmm...a captain and a white whale..."
                        setTimeout(() => document.getElementById('response-text').innerHTML="",3000)
                    }
                },2000)
            }
        }
        else if (closestObj === safeBound) {
            if (hasSafeCombo) {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "You enter the combination '9-17-32' and the safe opens. Inside you find a key, which you take."
                    setTimeout(() => document.getElementById('response-text').innerHTML="",3000)
                }
                hasDoorKey = true;
            } else {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "Safe is locked. Press 'g' to guess combination?"
                    setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
                }
            }
        }
        else if (closestObj === deskBound) {
            if (!document.getElementById('response-text').innerHTML.length) {
                document.getElementById('response-text').innerHTML = "Looks like a standard wooden desk, appears to be empty"
                setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
            }
        }
        else if (closestObj === chairBound) {
            if (!document.getElementById('response-text').innerHTML.length) {
                document.getElementById('response-text').innerHTML = "An old armchair. Still seems comfy though"
                setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
            }
        }
        else if (closestObj === lampBound) {
            if (!document.getElementById('response-text').innerHTML.length) {
                document.getElementById('response-text').innerHTML = "You pull the lamp cord, nothing seems to happen"
                setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
            }
        }
        else if (closestObj === tvBound) {
            // maybe can try to plug the tv in somehow; then, if plugged in and interact, will unlock safe access
            if (tvPluggedIn) {
                if (!closetUnlocked) {
                    if (!document.getElementById('response-text').innerHTML.length) {
                        document.getElementById('response-text').innerHTML = "TV won't turn on, but something else happened..."
                        setTimeout(() => document.getElementById('response-text').innerHTML="",3000)
                        openClosetDoor()
                    }
                } else {
                    if (!document.getElementById('response-text').innerHTML.length) {
                        document.getElementById('response-text').innerHTML = "TV won't turn on..."
                        setTimeout(() => document.getElementById('response-text').innerHTML="",3000)
                    }
                }
            }
            else {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "An old TV, doesn't seem to be plugged in..."
                    setTimeout(() => document.getElementById('response-text').innerHTML="",3000)
                }
            }
        }
        else if (closestObj === outletBound) {
            if (!tvPluggedIn) {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "Plugged cord into outlet"
                    tvCord.position.set(85,5,-145)
                    let index = interactiveObjects.indexOf(outletBound)
                    interactiveObjects.splice(index,1)
                    tvPluggedIn = true;
                    setTimeout(() => document.getElementById('response-text').innerHTML="",2000)
                }
            }
        }
        else if (closestObj === closetDoorBound) {
            if (!closetUnlocked) {
                if (!document.getElementById('response-text').innerHTML.length) {
                    document.getElementById('response-text').innerHTML = "This door won't budge, it also doesn't have a knob..."
                    setTimeout(() => document.getElementById('response-text').innerHTML="",3000)
                }
            }
        }
        // more object cases
    } else {
        // nothing happens
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
    if (window.isGDown) {
        guess()
    }
    // seems like need to re-render bounding boxes whenever they are changed... pretty cool
    firstDoorBound.copy(firstDoor.geometry.boundingBox).applyMatrix4(firstDoor.matrixWorld)
    closetDoorBound.copy(closetDoor.geometry.boundingBox).applyMatrix4(closetDoor.matrixWorld)
    collisionCheck(moveVector);
    proximityCheck();

    renderer.render(scene, camera)
}

// next steps:

// other potential interactables: lamp, chair, tv? nothing would have for those

// after that, could leave room freely
// at that point, could look into importing other objects or textures; get basic functionality done first with ugly style, try to spice up later
// also look into adding some sound effects
// -- walking sound effect
// -- door open/closing sound effect
// -- keypad sound effect for safe
// -- locked door handle sound effect
// -- unlocking door sound effect

// -- could always talk about during science fair that I want to continue to learn about three js
// ---- goal here was to build something with minimal guidance/tutorial help
// ---- now that I know some basics and figured some things out on my own, feel comfortable diving in deeper and learning some cool techniques


// - learn more about textures and shading; could make the walls/floor look better
// - could also add a ceiling

// also could look into a jump mechanic? but then would need some sort of physics

animate()