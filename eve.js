// eve.js
import { getEmotion } from './emotions.js';

export function createEve() {
    const bodyGeometry = new THREE.SphereGeometry(1, 128, 128); // Higher resolution geometry
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: getEmotionColor('calm'),
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0x072534,
        emissiveIntensity: 0.5
    });
    const eve = new THREE.Mesh(bodyGeometry, bodyMaterial);

    // Add eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeLeft.position.set(-0.3, 0.5, 0.9);
    eyeRight.position.set(0.3, 0.5, 0.9);
    eve.add(eyeLeft);
    eve.add(eyeRight);

    // Add wings
    const wingGeometry = new THREE.BoxGeometry(0.1, 2, 1);
    const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    const wingLeft = new THREE.Mesh(wingGeometry, wingMaterial);
    const wingRight = new THREE.Mesh(wingGeometry, wingMaterial);
    wingLeft.position.set(-1.5, 0, 0);
    wingRight.position.set(1.5, 0, 0);
    wingLeft.rotation.z = Math.PI / 4;
    wingRight.rotation.z = -Math.PI / 4;
    eve.add(wingLeft);
    eve.add(wingRight);

    return eve;
}

export function applyEmotionEffects(eve, emotion) {
    const emotionData = getEmotion(emotion);
    eve.material.color.set(emotionData.color);
    emotionData.animation(eve);
}

function getEmotionColor(emotion) {
    const emotionData = getEmotion(emotion);
    return emotionData.color;
}
