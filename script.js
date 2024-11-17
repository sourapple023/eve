let scene, camera, renderer, eve, clock, aura;
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const target = new THREE.Vector3(); // For mouse tracking
let eveFollow = true; // Initialize follow state
let auraEnabled = true;

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
    const geometry = new THREE.SphereGeometry(1, 256, 256); // Higher resolution geometry
    const material = new THREE.MeshStandardMaterial({
        color: 0x0077ff,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x072534,
        emissiveIntensity: 0.3
    });
    eve = new THREE.Mesh(geometry, material);
    scene.add(eve);

    // Create aura effect
    const auraGeometry = new THREE.SphereGeometry(1.2, 256, 256);
    const auraMaterial = new THREE.MeshBasicMaterial({
        color: 0x0077ff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    aura = new THREE.Mesh(auraGeometry, auraMaterial);
    aura.visible = true;
    scene.add(aura);

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

    // Start animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Add smooth rotation for a dynamic effect
    eve.rotation.x += 0.005;
    eve.rotation.y += 0.005;

    // Make Eve follow the mouse slightly if enabled
    if (eveFollow) {
        eve.position.lerp(target, 0.03); // Slower, smoother movement
    }

    // Update aura to match Eve's color and position
    if (auraEnabled) {
        aura.material.color.copy(eve.material.color);
        aura.position.copy(eve.position);
        aura.visible = true;
    } else {
        aura.visible = false;
    }

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

    const intersects = raycaster.intersectObject(eve);

    if (intersects.length > 0) {
        eve.material.color.lerp(new THREE.Color(0xff0000), 0.1); // Smooth color change
    } else {
        eve.material.color.lerp(new THREE.Color(0x0077ff), 0.1); // Smooth color change
    }
}

function onWindowResize() {
    // Adjust camera aspect ratio and update projection matrix
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size and pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
