// emotions.js

const emotions = {
    calm: {
        color: 0x0077ff, // Soft blue
        scale: 1,
        animation: function(eve) {
            // Normal size
            eve.scale.set(this.scale, this.scale, this.scale);
        }
    },
    happy: {
        color: 0x00ff00, // Bright green
        scale: 1.1,
        animation: function(eve) {
            // Slightly larger
            eve.scale.set(this.scale, this.scale, this.scale);
        }
    },
    sad: {
        color: 0x0000ff, // Dull blue
        scale: 0.9,
        animation: function(eve) {
            // Slightly smaller
            eve.scale.set(this.scale, this.scale, this.scale);
        }
    },
    excited: {
        color: 0xffff00, // Vibrant yellow
        scale: 1.2,
        animation: function(eve) {
            // Larger and pulsing
            const pulse = 1 + 0.1 * Math.sin(Date.now() * 0.01);
            eve.scale.set(this.scale * pulse, this.scale * pulse, this.scale * pulse);
        }
    }
};

export function getEmotion(emotion) {
    return emotions[emotion] || emotions.calm;
}
