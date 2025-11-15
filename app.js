// ------------------------------------------------------
//  EVE v3 — Hybrid Emotion AI Companion (Single-File)
//  12 Emotions • Adaptive Scale • Glow • Pulse • Jitter
//  Wobble • Flash • Particle Aura • Cursor Interaction
// ------------------------------------------------------

let scene, camera, renderer, eve, clock, pixieDust;
let target = new THREE.Vector3(0, 0, 0);
let currentEmotion = "calm";

// ------------------------------------------------------
//  ADAPTIVE BASE SCALE
// ------------------------------------------------------
function getBaseScale() {
    const s = Math.min(window.innerWidth, window.innerHeight);
    return s * 0.00065; // scales for mobile/desktop automatically
}

// ------------------------------------------------------
//  EMOTION DEFINITIONS (Hybrid: pastel + neon)
// ------------------------------------------------------
const emotions = {
    calm: {
        color: new THREE.Color("#7fb8ff"), // pastel sky blue
        glow: 0.4,
        scale: 1.0,
        floatSpeed: 0.4,
        wobble: 0.2,
        jitter: 0,
        pulse: 0.05,
        flash: 0
    },
    happy: {
        color: new THREE.Color("#66ff99"), // mint green
        glow: 0.7,
        scale: 1.15,
        floatSpeed: 0.7,
        wobble: 0.4,
        jitter: 0,
        pulse: 0.1,
        flash: 0
    },
    sad: {
        color: new THREE.Color("#4455ff"), // deep bluish neon
        glow: 0.3,
        scale: 0.92,
        floatSpeed: 0.25,
        wobble: 0.1,
        jitter: 0,
        pulse: 0,
        flash: 0
    },
    excited: {
        color: new THREE.Color("#ffee66"), // neon yellow
        glow: 1.0,
        scale: 1.28,
        floatSpeed: 1.2,
        wobble: 1.0,
        jitter: 0.05,
        pulse: 0.2,
        flash: 0.2
    },
    neutral: {
        color: new THREE.Color("#cccccc"),
        glow: 0.3,
        scale: 1.0,
        floatSpeed: 0.35,
        wobble: 0.1,
        jitter: 0,
        pulse: 0,
        flash: 0
    },
    love: {
        color: new THREE.Color("#ff66cc"), // pastel neon pink
        glow: 1.0,
        scale: 1.3,
        floatSpeed: 0.8,
        wobble: 0.6,
        jitter: 0,
        pulse: 0.3,  // heartbeat
        flash: 0
    },
    angry: {
        color: new THREE.Color("#ff3355"), // neon red
        glow: 1.2,
        scale: 1.18,
        floatSpeed: 1.5,
        wobble: 0.8,
        jitter: 0.15,
        pulse: 0.05,
        flash: 0
    },
    sleepy: {
        color: new THREE.Color("#aa88ff"), // dreamy lavender
        glow: 0.25,
        scale: 0.95,
        floatSpeed: 0.15,
        wobble: 0.05,
        jitter: 0,
        pulse: 0.02,
        flash: 0
    },
    confused: {
        color: new THREE.Color("#33ffee"), // teal neon
        glow: 0.8,
        scale: 1.05,
        floatSpeed: 0.6,
        wobble: 1.4, // head tilt wobble
        jitter: 0,
        pulse: 0,
        flash: 0
    },
    curious: {
        color: new THREE.Color("#66ffe7"), // aqua pastel neon
        glow: 0.7,
        scale: 1.1,
        floatSpeed: 0.7,
        wobble: 0.8,
        jitter: 0,
        pulse: 0.05,
        flash: 0
    },
    fear: {
        color: new THREE.Color("#6688ff"),
        glow: 0.9,
        scale: 0.85,
        floatSpeed: 1.5,
        wobble: 0.4,
        jitter: 0.2,
        pulse: 0.05,
        flash: 0
    },
    surprised: {
        color: new THREE.Color("#ffffff"),
        glow: 1.3,
        scale: 1.4,
        floatSpeed: 1.0,
        wobble: 1.0,
        jitter: 0,
        pulse: 0.1,
        flash: 0.6 // bright flash burst
    }
};

// ------------------------------------------------------
//  PARTICLES (Aura)
// ------------------------------------------------------
function createParticles() {
    const count = 9000;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 15;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.011,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    const particles = new THREE.Points(geo, mat);
    return particles;
}

function updateParticles() {
    const t = clock.getElapsedTime();
    const arr = pixieDust.geometry.attributes.position.array;

    const mood = emotions[currentEmotion];
    const speed = 0.0008 + mood.floatSpeed * 0.0005;

    for (let i = 0; i < arr.length; i += 3) {
        arr[i] += Math.sin(t + i * 0.02) * speed;
        arr[i + 1] += Math.cos(t * 0.7 + i * 0.015) * speed;
        arr[i + 2] += Math.sin(t * 0.4 + i * 0.01) * speed;
    }

    pixieDust.geometry.attributes.position.needsUpdate = true;
}

// ------------------------------------------------------
//  EVE MODEL (Sphere + eyes + rim glow shader)
// ------------------------------------------------------
function createEve() {
    const geo = new THREE.SphereGeometry(1, 128, 128);

    const mat = new THREE.MeshStandardMaterial({
        color: emotions.calm.color,
        roughness: 0.3,
        metalness: 0.8,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.6
    });

    // Rim Glow Shader
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
                gl_FragColor.rgb += rim * rimStrength * 0.65;
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
//  APPLY EMOTION
// ------------------------------------------------------
function setEmotion(name) {
    const mood = emotions[name];
    if (!mood || !eve) return;

    currentEmotion = name;

    // Smooth color transition
    eve.material.color.lerp(mood.color, 0.2);

    // Adaptive size
    const base = getBaseScale() * mood.scale;
    eve.scale.lerp(new THREE.Vector3(base, base, base), 0.25);

    // Glow + flash
    eve.material.emissive.set(mood.color.clone().multiplyScalar(0.4 + mood.flash * 0.5));
    eve.material.emissiveIntensity = 0.5 + mood.glow * 0.4;

    if (eve.materialShader) {
        eve.materialShader.uniforms.rimStrength.value = mood.glow;
    }
}

// ------------------------------------------------------
//  INIT
// ------------------------------------------------------
function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const key = new THREE.PointLight(0xffffff, 1.1);
    key.position.set(4, 4, 6);
    scene.add(key);

    const rim = new THREE.PointLight(0xff88aa, 0.5);
    rim.position.set(-4, -3, -6);
    scene.add(rim);

    createEve();
    pixieDust = createParticles();
    scene.add(pixieDust);

    addEvents();
    animate();
}

// ------------------------------------------------------
//  EVENTS
// ------------------------------------------------------
function addEvents() {
    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;

        target.x = x * 1.5;
        target.y = y * 1.5;

        const dist = eve.position.distanceTo(target);

        if (dist < 0.7) setEmotion("love");
        else if (dist < 1.3) setEmotion("excited");
        else if (dist < 2) setEmotion("curious");
        else setEmotion("calm");
    });

    document.addEventListener("click", () => setEmotion("surprised"));

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
    const mood = emotions[currentEmotion];

    // Floating
    const float = mood.floatSpeed * 0.03;
    eve.position.y = Math.sin(t * mood.floatSpeed) * float;

    // Follow cursor
    eve.position.lerp(target, 0.05);

    // Wobble rotation
    eve.rotation.z = Math.sin(t * mood.wobble) * 0.2;

    // Pulse
    const pulseAmount = 1 + mood.pulse * Math.sin(t * 6);
    eve.scale.multiplyScalar(pulseAmount);

    // Jitter (fear/angry)
    if (mood.jitter > 0) {
        eve.position.x += (Math.random() - 0.5) * mood.jitter;
        eve.position.y += (Math.random() - 0.5) * mood.jitter;
    }

    updateParticles();
    renderer.render(scene, camera);
}

// ------------------------------------------------------
init();
