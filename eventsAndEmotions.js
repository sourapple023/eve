// eventsAndEmotions.js

const emotions = {
    calm: {
        color: 0x0077ff, // Soft blue
        scale: 1,
        animation: function(eve) {
            // Normal size
            eve.scale.set(this.scale, this.scale, this.scale);
        }
    },
    happy: {
        color: 0x00ff00, // Bright green
        scale: 1.1,
        animation: function(eve) {
            // Slightly larger
            eve.scale.set(this.scale, this.scale, this.scale);
        }
    },
    sad: {
        color: 0x0000ff, // Dull blue
        scale: 0.9,
        animation: function(eve) {
            // Slightly smaller
            eve.scale.set(this.scale, this.scale, this.scale);
        }
    },
    excited: {
        color: 0xffff00, // Vibrant yellow
        scale: 1.2,
        animation: function(eve) {
            // Larger and pulsing
            const pulse = 1 + 0.1 * Math.sin(Date.now() * 0.01);
            eve.scale.set(this.scale * pulse, this.scale * pulse, this.scale * pulse);
        }
    }
};

export function getEmotion(emotion) {
    return emotions[emotion] || emotions.calm;
}

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
