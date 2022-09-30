export const handleKeyDown = (event) => {
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
    if (event.key === 'q') {
        window.isQDown = true;
    }
    if (event.key === 'e') {
        window.isEDown = true;
    }
}
export const handleKeyUp = (event) => {
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
    if (event.key === 'q') {
        window.isQDown = false;
    }
    if (event.key === 'e') {
        window.isEDown = false;
    }
}
