// live2dIntegration.js - Live2D Avatar Integration for Bella
// Lightweight avatar system that works without GPU

class Live2DAvatar {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isInitialized = false;
        
        // Avatar state
        this.state = {
            eyeBlink: 1,
            eyeX: 0,
            eyeY: 0,
            headX: 0,
            headY: 0,
            mouthOpen: 0,
            emotion: 'neutral',
            breathing: 0,
            speaking: false
        };
        
        // Animation timers
        this.blinkTimer = 0;
        this.breathTimer = 0;
        this.speakTimer = 0;
        
        // Setup canvas
        this.setupCanvas();
    }
    
    setupCanvas() {
        // Set canvas size
        this.canvas.width = 400;
        this.canvas.height = 600;
        
        // Start animation loop
        this.animate();
        
        // Track mouse for eye movement
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Smooth eye tracking
            this.state.eyeX = x / rect.width * 30;
            this.state.eyeY = y / rect.height * 20;
            
            // Subtle head movement
            this.state.headX = x / rect.width * 10;
            this.state.headY = y / rect.height * 5;
        });
        
        this.isInitialized = true;
    }
    
    animate = () => {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
    
    update() {
        // Blinking
        this.blinkTimer++;
        if (this.blinkTimer > 200 + Math.random() * 200) {
            this.state.eyeBlink = 0;
            if (this.blinkTimer > 210) {
                this.state.eyeBlink = 1;
                this.blinkTimer = 0;
            }
        }
        
        // Breathing animation
        this.breathTimer += 0.05;
        this.state.breathing = Math.sin(this.breathTimer) * 2;
        
        // Speaking animation
        if (this.state.speaking) {
            this.speakTimer += 0.3;
            this.state.mouthOpen = Math.abs(Math.sin(this.speakTimer)) * 0.6 + 0.2;
        } else {
            this.state.mouthOpen *= 0.8;
        }
    }
    
    draw() {
        const { ctx, canvas } = this;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Save context
        ctx.save();
        
        // Apply head movement
        ctx.translate(centerX + this.state.headX, centerY + this.state.headY);
        
        // Apply breathing
        ctx.scale(1, 1 + this.state.breathing * 0.002);
        
        // Draw hair back
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, -50, 120, 150, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw face
        ctx.fillStyle = '#FDBCB4';
        ctx.beginPath();
        ctx.ellipse(0, 0, 90, 110, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes
        this.drawEyes();
        
        // Draw mouth
        this.drawMouth();
        
        // Draw hair front
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, -80, 100, 80, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        
        // Draw emotion effects
        this.drawEmotionEffects();
        
        ctx.restore();
    }
    
    drawEyes() {
        const { ctx, state } = this;
        const eyeSpacing = 35;
        const eyeY = -20;
        
        // Eye whites
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(-eyeSpacing, eyeY, 25, 30 * state.eyeBlink, 0, 0, Math.PI * 2);
        ctx.ellipse(eyeSpacing, eyeY, 25, 30 * state.eyeBlink, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Irises (following mouse)
        if (state.eyeBlink > 0.3) {
            ctx.fillStyle = '#4A90E2';
            ctx.beginPath();
            const irisX = Math.max(-10, Math.min(10, state.eyeX * 0.3));
            const irisY = Math.max(-10, Math.min(10, state.eyeY * 0.3));
            ctx.arc(-eyeSpacing + irisX, eyeY + irisY, 12, 0, Math.PI * 2);
            ctx.arc(eyeSpacing + irisX, eyeY + irisY, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(-eyeSpacing + irisX, eyeY + irisY, 6, 0, Math.PI * 2);
            ctx.arc(eyeSpacing + irisX, eyeY + irisY, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye sparkle
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(-eyeSpacing + irisX + 3, eyeY + irisY - 3, 2, 0, Math.PI * 2);
            ctx.arc(eyeSpacing + irisX + 3, eyeY + irisY - 3, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Eyelashes
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-eyeSpacing, eyeY, 25, -0.2 * Math.PI, 0.2 * Math.PI);
        ctx.arc(eyeSpacing, eyeY, 25, 0.8 * Math.PI, 1.2 * Math.PI);
        ctx.stroke();
    }
    
    drawMouth() {
        const { ctx, state } = this;
        const mouthY = 40;
        
        ctx.strokeStyle = '#E91E63';
        ctx.fillStyle = '#E91E63';
        ctx.lineWidth = 3;
        
        if (state.mouthOpen > 0.1) {
            // Open mouth (speaking)
            ctx.beginPath();
            ctx.ellipse(0, mouthY, 25, 15 * state.mouthOpen, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Teeth hint
            ctx.fillStyle = '#FFF';
            ctx.fillRect(-15, mouthY - 5 * state.mouthOpen, 30, 3);
        } else {
            // Closed mouth with emotion
            ctx.beginPath();
            switch (state.emotion) {
                case 'happy':
                    ctx.arc(0, mouthY - 5, 20, 0.1 * Math.PI, 0.9 * Math.PI);
                    break;
                case 'sad':
                    ctx.arc(0, mouthY + 15, 20, 1.1 * Math.PI, 1.9 * Math.PI);
                    break;
                case 'angry':
                    ctx.moveTo(-15, mouthY);
                    ctx.lineTo(15, mouthY);
                    break;
                default:
                    ctx.moveTo(-10, mouthY);
                    ctx.quadraticCurveTo(0, mouthY + 3, 10, mouthY);
            }
            ctx.stroke();
        }
    }
    
    drawEmotionEffects() {
        const { ctx, state } = this;
        
        // Blush for happy
        if (state.emotion === 'happy') {
            ctx.fillStyle = 'rgba(255, 182, 193, 0.5)';
            ctx.beginPath();
            ctx.arc(-60, 20, 20, 0, Math.PI * 2);
            ctx.arc(60, 20, 20, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Tears for sad
        if (state.emotion === 'sad') {
            ctx.fillStyle = 'rgba(135, 206, 235, 0.7)';
            ctx.beginPath();
            ctx.arc(-35, 10, 5, 0, Math.PI * 2);
            ctx.arc(35, 10, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Angry marks
        if (state.emotion === 'angry') {
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(70, -30);
            ctx.lineTo(80, -20);
            ctx.moveTo(75, -35);
            ctx.lineTo(85, -25);
            ctx.stroke();
        }
    }
    
    // Public methods
    setEmotion(emotion) {
        this.state.emotion = emotion;
    }
    
    startSpeaking() {
        this.state.speaking = true;
        this.speakTimer = 0;
    }
    
    stopSpeaking() {
        this.state.speaking = false;
    }
    
    playAnimation(animationName) {
        // Trigger specific animations
        switch(animationName) {
            case 'nod':
                // Nodding animation
                break;
            case 'shake':
                // Head shake animation
                break;
            case 'wink':
                this.state.eyeBlink = 0;
                setTimeout(() => this.state.eyeBlink = 1, 200);
                break;
        }
    }
}

// Export for use in main app
export { Live2DAvatar };