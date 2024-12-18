let scene, camera, renderer, eve, clock, pixieDust;

function init() {
    console.log("Initializing scene...");

    try {
        // Create scene
        scene = new THREE.Scene();
        console.log("Scene created:", scene);

        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        console.log("Camera created:", camera);

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Improve rendering on high-DPI screens
        renderer.setClearColor(0x000000, 0); // Set background to transparent
        document.body.appendChild(renderer.domElement);
        console.log("Renderer created and added to DOM:", renderer);

        // Initialize clock
        clock = new THREE.Clock();
        console.log("Clock initialized:", clock);

        // Create Eve (basic sphere for now)
        const geometry = new THREE.SphereGeometry(1, 32, 32); // Basic geometry
        const material = new THREE.MeshStandardMaterial({
            color: 0x0077ff,
            roughness: 0.3,
            metalness: 0.7,
            emissive: 0x072534,
            emissiveIntensity: 0.5
        });
        eve = new THREE.Mesh(geometry, material);
        scene.add(eve);
        console.log("Eve created and added to scene:", eve);

        // Create particles
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.005, // Smaller size for particle dust effect
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });

        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 7000; // Number of particles
        const particlesPositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            particlesPositions[i * 3] = (Math.random() - 0.5) * 10;
            particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
        pixieDust = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(pixieDust);
        console.log("Pixie dust created and added to scene:", pixieDust);

        // Create lights
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
        scene.add(ambientLight);
        console.log("Ambient light created and added to scene:", ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(2, 3, 4);
        pointLight.castShadow = true;
        scene.add(pointLight);
        console.log("Point light created and added to scene:", pointLight);

        // Start animation loop
        console.log("Starting animation loop...");
        animate();
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

function animate() {
    try {
        requestAnimationFrame(animate);

        // Rotate Eve for visual feedback
        eve.rotation.x += 0.01;
        eve.rotation.y += 0.01;

        // Update particles
        const positions = pixieDust.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(clock.getElapsedTime() + positions[i] + positions[i + 2]) * 0.002; // Slow movement
            positions[i] += Math.cos(clock.getElapsedTime() + positions[i + 1] + positions[i + 2]) * 0.002; // Slow movement
        }
        pixieDust.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        console.log("Rendered frame");
    } catch (error) {
        console.error("Animation error:", error);
    }
}

function onWindowResize() {
    try {
        // Adjust camera aspect ratio and update projection matrix
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        console.log("Camera aspect ratio and projection matrix updated");

        // Update renderer size and pixel ratio
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log("Renderer size and pixel ratio updated");
    } catch (error) {
        console.error("Resize error:", error);
    }
}

// Handle window resize events
window.addEventListener('resize', onWindowResize, false);

init();
