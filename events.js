// events.js

export function addEventListeners(renderer, camera, eve, target, setEveEmotion) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Set target position for Eve to follow
        target.x = (event.clientX / window.innerWidth) * 2 - 1;
        target.y = -(event.clientY / window.innerHeight) * 2 + 1;
        target.z = 0;

        raycaster.setFromCamera(mouse, camera);

        // Adjust behavior based on proximity to cursor
        const distance = eve.position.distanceTo(target);
        if (distance < 1) {
            setEveEmotion('excited'); // Change emotion if very close
        } else if (distance < 3) {
            setEveEmotion('happy');
        } else {
            setEveEmotion('calm');
        }
    }, false);

    document.addEventListener('click', () => {
        setEveEmotion('happy'); // Change Eve's emotion on click
    }, false);

    window.addEventListener('resize', () => {
        // Adjust camera aspect ratio and update projection matrix
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Update renderer size and pixel ratio
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
}
