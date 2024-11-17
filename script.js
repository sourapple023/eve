let scene, camera, renderer, eve, clock, pixieDust;
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const target = new THREE.Vector3(); // For mouse tracking
let eveFollow = true; // Initialize follow state

function init() {
    // Create scene
    scene = new THREE.Scene();
    clock = new THREE.Clock();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Improve rendering on high-DPI screens
    document.body.appendChild(renderer.domElement);

    // Create Eve with higher resolution geometry and advanced material
    const geometry = new THREE.SphereGeometry(1, 128, 128); // Higher resolution geometry
    const material = new THREE.MeshStandardMaterial({
        color: 0x0077ff,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0x072534,
        emissiveIntensity: 0.5
    });
    eve = new THREE.Mesh(geometry, material);
    scene.add(eve);

    // Add dynamic sparkly particle dust
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.01, // Smaller size for particle dust effect
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 5000; // Increase the number of particles for more detail
    const particlesPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlesPositions[i * 3] = (Math.random() - 0.5) * 10;
        particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    pixieDust = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(pixieDust);

    // Create lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(2, 3, 4);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-3, -3, -5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add event listeners
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false); // Handle window resize events

    // Start animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Add smooth rotation for a dynamic effect
    eve.rotation.x += 0.005;
    eve.rotation.y += 0.005;

    // Make Eve follow the mouse dynamically
    if (eveFollow) {
        eve.position.lerp(target, 0.05); // Faster, more dynamic movement
    }

    // Update particles (pixie dust)
    const positions = pixieDust.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(clock.getElapsedTime() + positions[i] + positions[i + 2]) * 0.02; // More dynamic movement
        positions[i] += Math.cos(clock.getElapsedTime() + positions[i + 1] + positions[i + 2]) * 0.02; // More dynamic movement
    }
    pixieDust.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Set target position for Eve to follow
    target.x = (event.clientX / window.innerWidth) * 2 - 1;
    target.y = -(event.clientY / window.innerHeight) * 2 + 1;
    target.z = 0;

    raycaster.setFromCamera(mouse, camera);
}

function onWindowResize() {
    // Adjust camera aspect ratio and update projection matrix
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size and pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
