// lighting.js

export function createLights(scene) {
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
}
