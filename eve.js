// eve.js
import { getEmotion } from './emotions.js';

export function createEve() {
    const geometry = new THREE.SphereGeometry(1, 128, 128); // Higher resolution geometry
    const material = new THREE.MeshStandardMaterial({
        color: getEmotionColor('calm'),
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0x072534,
        emissiveIntensity: 0.5
    });
    const eve = new THREE.Mesh(geometry, material);
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
