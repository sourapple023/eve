let scene, camera, renderer, eve, clock, pixieDust;
const particles = [];
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

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
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container').appendChild(renderer.domElement);

    // Load high-resolution texture
    const textureLoader = new THREE.TextureLoader();
    const highResTexture = textureLoader.load('textures/your-high-res-texture.jpg');

    // Advanced shader material
    const vertexShader = `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec3 vNormal;
        void main() {
            float intensity = pow(0.9 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
            gl_FragColor = vec4(0.0, 0.5, 1.0, 1.0) * intensity;
        }
    `;

    const material = new THREE.MeshStandardMaterial({
        map: highResTexture,
        roughness: 0.5,
        metalness: 1.0
    });

    // Create Eve with higher-detail geometry and advanced material
    const geometry = new THREE.SphereGeometry(1, 128, 128); // Higher detail
    eve = new THREE.Mesh(geometry, material);
    scene.add(eve);

    // Create lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-3, -3, -5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add sparkly pixie dust particles
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        map: new THREE.TextureLoader().load('textures/sparkle.png'), // Add a sparkle texture
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const particlesPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlesPositions[i * 3] = (Math.random() - 0.5) * 10;
        particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    pixieDust = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(pixieDust);

    // Add event listeners
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onClick, false);

    // Start animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Add rotation for a dynamic effect
    eve.rotation.x += 0.01;
    eve.rotation.y += 0.01;

    // Update particles (pixie dust)
    const positions = pixieDust.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(clock.getElapsedTime() + positions[i] + positions[i + 2]) * 0.005;
        positions[i] += Math.cos(clock.getElapsedTime() + positions[i + 1] + positions[i + 2]) * 0.005;
    }
    pixieDust.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(eve);

    if (intersects.length > 0) {
        eve.material.color.set(0xff0000);
    } else {
        eve.material.color.set(0x0077ff);
    }
}

function onClick() {
    eve.material.color.set(Math.random() * 0xffffff);
}

function onWindowResize() {
    // Adjust camera aspect ratio and update projection matrix
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size and pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

// Listen for window resize events
window.addEventListener('resize', onWindowResize, false);

init();
