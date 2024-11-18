// visualEffects.js

export function createLights(scene) {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // softer ambient light
    scene.add(ambientLight);
    console.log("Ambient light created:", ambientLight);

    // Point light
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100); // reduced intensity
    pointLight.position.set(2, 3, 4);
    pointLight.castShadow = true;
    scene.add(pointLight);
    console.log("Point light created:", pointLight);

    // Spotlight
    const spotLight = new THREE.SpotLight(0xffffff, 0.5); // reduced intensity
    spotLight.position.set(-5, 5, 5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    scene.add(spotLight);
    console.log("Spotlight created:", spotLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xff8c00, 0.5); // reduced intensity and warmer color
    directionalLight.position.set(-10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    console.log("Directional light created:", directionalLight);
}

export function createParticles() {
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.005, // Smaller size for particle dust effect
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 7000; // Increase the number of particles for more detail
    const particlesPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlesPositions[i * 3] = (Math.random() - 0.5) * 10;
        particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    const pixieDust = new THREE.Points(particleGeometry, particleMaterial);
    return pixieDust;
}

export function updateParticles(pixieDust, clock) {
    const positions = pixieDust.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(clock.getElapsedTime() + positions[i] + positions[i + 2]) * 0.002; // Slower movement
        positions[i] += Math.cos(clock.getElapsedTime() + positions[i + 1] + positions[i + 2]) * 0.002; // Slower movement
    }
    pixieDust.geometry.attributes.position.needsUpdate = true;
}
