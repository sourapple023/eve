// particles.js

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
