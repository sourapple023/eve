// ------------------------------------------------------
//  EVE v2 — Magical Emotion AI Companion (Single-File)
//  Glow, pulse, rim-light, float, emotional colors,
//  particle aura, cursor interaction, + more.
// ------------------------------------------------------

let scene, camera, renderer, eve, clock, pixieDust;
let target = new THREE.Vector3(0, 0, 0);
let currentEmotion = "calm";

// ------------------------------------------------------
//  EMOTION SYSTEM (Color, scale, animation, glow strength)
// ------------------------------------------------------
const emotions = {
    calm: {
        color: new THREE.Color(0x60a6ff),
        scale: 1,
        glow: 0.4,
        floatSpeed: 0.4
    },
    happy: {
        color: new THREE.Color(0x00ff66),
        scale: 1.15,
        glow: 0.7,
        floatSpeed: 0.6
    },
    sad: {
        color: new THREE.Color(0x4466ff),
        scale: 0.92,
        glow: 0.3,
        floatSpeed: 0.25
    },
    excited: {
        color: new THREE.Color(0xffee55),
        scale: 1.25,
        glow: 1.0,
        floatSpeed: 1.2
    }
};

// ------------------------------------------------------
//  PARTICLES (Pixie Dust)
// ------------------------------------------------------
function createParticles() {
    const count = 7000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.012,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    return points;
}

function updateParticles() {
    const t = clock.getElapsedTime();
    const arr = pixieDust.geometry.attributes.position.array;

    for (let i = 0; i < arr.length; i += 3) {
        const speed = 0.0008 + emotions[currentEmotion].floatSpeed * 0.0004;

        arr[i] += Math.sin(t * 0.8 + i * 0.01) * speed;
        arr[i + 1] += Math.cos(t * 0.6 + i * 0.02) * speed;
        arr[i + 2] += Math.sin(t * 0.4 + i * 0.015) * speed;
    }

    pixieDust.geometry.attributes.position.needsUpdate = true;
}

// ------------------------------------------------------
//  EVE MODEL (Sphere + eyes + rim glow shader)
// ------------------------------------------------------
function createEve() {
    const geo = new THREE.SphereGeometry(1, 128, 128);

    // custom glowing material
    const mat = new THREE.MeshStandardMaterial({
        color: emotions.calm.color,
        roughness: 0.3,
        metalness: 0.7,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.6
    });

    // Rim Glow Shader Injection
    mat.onBeforeCompile = (shader) => {
        shader.uniforms.rimStrength = { value: 0.6 };

        shader.fragmentShader =
            `
            uniform float rimStrength;
            ` +
            shader.fragmentShader.replace(
                `#include <dithering_fragment>`,
                `
                float rim = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition)));
                rim = pow(rim, 2.5);
                gl_FragColor.rgb += rim * rimStrength * 0.6;
                #include <dithering_fragment>
                `
            );
        eve.materialShader = shader;
    };

    eve = new THREE.Mesh(geo, mat);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.32, 0.45, 0.92);
    eve.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.32, 0.45, 0.92);
    eve.add(rightEye);

    scene.add(eve);
}

// ------------------------------------------------------
//  EMOTION HANDLER
// ------------------------------------------------------
function setEmotion(name) {
    currentEmotion = name;
    const data = emotions[name];

    // smooth color transition
    eve.material.color.lerp(data.color, 0.25);

    // smooth scaling
    eve.scale.lerp(new THREE.Vector3(data.scale, data.scale, data.scale), 0.2);

    // emissive + glow reacts to emotion
    eve.material.emissive.set(data.color.clone().multiplyScalar(0.4));
    eve.material.emissiveIntensity = 0.5 + data.glow * 0.3;

    if (eve.materialShader) {
        eve.materialShader.uniforms.rimStrength.value = data.glow;
    }
}

// ------------------------------------------------------
//  INIT
// ------------------------------------------------------
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const keyLight = new THREE.PointLight(0xffffff, 1.2);
    keyLight.position.set(4, 4, 6);
    scene.add(keyLight);

    const backLight = new THREE.PointLight(0xff88aa, 0.6);
    backLight.position.set(-4, -3, -6);
    scene.add(backLight);

    // Eve + particles
    createEve();
    pixieDust = createParticles();
    scene.add(pixieDust);

    addEvents();
    animate();
}

// ------------------------------------------------------
//  EVENTS (Mouse tracking + emotional triggers)
// ------------------------------------------------------
function addEvents() {
    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;

        target.x = x * 1.5;
        target.y = y * 1.5;

        const dist = eve.position.distanceTo(target);

        if (dist < 0.8) setEmotion("excited");
        else if (dist < 2) setEmotion("happy");
        else setEmotion("calm");
    });

    document.addEventListener("click", () => setEmotion("excited"));

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ------------------------------------------------------
//  ANIMATION LOOP
// ------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Eve floating motion
    const floatStrength = emotions[currentEmotion].floatSpeed * 0.03;
    eve.position.y = Math.sin(t * emotions[currentEmotion].floatSpeed) * floatStrength;

    // Eve follows the cursor smoothly
    eve.position.lerp(target, 0.03);

    // Turn toward cursor
    eve.lookAt(target.x, target.y, 5);

    updateParticles();
    setEmotion(currentEmotion); // keeps transitions smooth

    renderer.render(scene, camera);
}

// ------------------------------------------------------
init();
