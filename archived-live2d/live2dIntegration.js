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
        const centerY = canvas.height / 2 - 50;
        
        // Clear canvas with gradient background
        const gradient = ctx.createRadialGradient(centerX, centerY, 100, centerX, centerY, 300);
        gradient.addColorStop(0, 'rgba(255, 182, 193, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 107, 157, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Save context
        ctx.save();
        
        // Apply head movement
        ctx.translate(centerX + this.state.headX, centerY + this.state.headY);
        
        // Apply breathing
        ctx.scale(1, 1 + this.state.breathing * 0.002);
        
        // Draw hair back layer with gradient
        const hairGradient = ctx.createLinearGradient(0, -150, 0, 100);
        hairGradient.addColorStop(0, '#2C1810');
        hairGradient.addColorStop(0.5, '#3E2318');
        hairGradient.addColorStop(1, '#523020');
        ctx.fillStyle = hairGradient;
        
        // Long flowing hair
        ctx.beginPath();
        ctx.moveTo(-100, -60);
        ctx.quadraticCurveTo(-120, 0, -110, 80);
        ctx.quadraticCurveTo(-100, 120, -80, 150);
        ctx.lineTo(-60, 160);
        ctx.quadraticCurveTo(-40, 140, -20, 120);
        ctx.quadraticCurveTo(0, 100, 0, 80);
        ctx.quadraticCurveTo(0, 100, 20, 120);
        ctx.quadraticCurveTo(40, 140, 60, 160);
        ctx.lineTo(80, 150);
        ctx.quadraticCurveTo(100, 120, 110, 80);
        ctx.quadraticCurveTo(120, 0, 100, -60);
        ctx.quadraticCurveTo(80, -100, 0, -110);
        ctx.quadraticCurveTo(-80, -100, -100, -60);
        ctx.closePath();
        ctx.fill();
        
        // Draw neck
        ctx.fillStyle = '#FDBCB4';
        ctx.fillRect(-30, 80, 60, 40);
        
        // Draw face with soft shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;
        
        const faceGradient = ctx.createRadialGradient(0, -10, 10, 0, 0, 90);
        faceGradient.addColorStop(0, '#FFE5D9');
        faceGradient.addColorStop(0.7, '#FDBCB4');
        faceGradient.addColorStop(1, '#FFB5A0');
        ctx.fillStyle = faceGradient;
        
        ctx.beginPath();
        ctx.moveTo(0, -85);
        ctx.quadraticCurveTo(-85, -85, -85, 0);
        ctx.quadraticCurveTo(-85, 40, -60, 70);
        ctx.quadraticCurveTo(-30, 90, 0, 95);
        ctx.quadraticCurveTo(30, 90, 60, 70);
        ctx.quadraticCurveTo(85, 40, 85, 0);
        ctx.quadraticCurveTo(85, -85, 0, -85);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        
        // Draw nose
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.quadraticCurveTo(5, 15, 0, 20);
        ctx.stroke();
        
        // Draw eyes
        this.drawPrettyEyes();
        
        // Draw mouth
        this.drawMouth();
        
        // Draw hair front with side bangs
        ctx.fillStyle = hairGradient;
        
        // Center bangs
        ctx.beginPath();
        ctx.moveTo(-50, -85);
        ctx.quadraticCurveTo(-30, -70, -20, -40);
        ctx.quadraticCurveTo(-10, -50, 0, -45);
        ctx.quadraticCurveTo(10, -50, 20, -40);
        ctx.quadraticCurveTo(30, -70, 50, -85);
        ctx.quadraticCurveTo(30, -95, 0, -95);
        ctx.quadraticCurveTo(-30, -95, -50, -85);
        ctx.closePath();
        ctx.fill();
        
        // Side hair strands
        ctx.beginPath();
        ctx.moveTo(-85, -60);
        ctx.quadraticCurveTo(-90, -20, -85, 20);
        ctx.quadraticCurveTo(-80, 0, -75, -20);
        ctx.quadraticCurveTo(-80, -50, -85, -60);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(85, -60);
        ctx.quadraticCurveTo(90, -20, 85, 20);
        ctx.quadraticCurveTo(80, 0, 75, -20);
        ctx.quadraticCurveTo(80, -50, 85, -60);
        ctx.closePath();
        ctx.fill();
        
        // Draw emotion effects
        this.drawEmotionEffects();
        
        // Add hair highlights
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-60, -70);
        ctx.quadraticCurveTo(-50, -20, -60, 30);
        ctx.moveTo(60, -70);
        ctx.quadraticCurveTo(50, -20, 60, 30);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawPrettyEyes() {
        const { ctx, state } = this;
        const eyeSpacing = 35;
        const eyeY = -20;
        
        // Eye shape (almond)
        ctx.save();
        
        // Left eye
        ctx.beginPath();
        ctx.moveTo(-eyeSpacing - 25, eyeY);
        ctx.quadraticCurveTo(-eyeSpacing, eyeY - 20 * state.eyeBlink, -eyeSpacing + 25, eyeY);
        ctx.quadraticCurveTo(-eyeSpacing, eyeY + 15 * state.eyeBlink, -eyeSpacing - 25, eyeY);
        ctx.closePath();
        
        // Eye gradient
        const eyeGradient = ctx.createRadialGradient(-eyeSpacing, eyeY, 5, -eyeSpacing, eyeY, 25);
        eyeGradient.addColorStop(0, '#FFFFFF');
        eyeGradient.addColorStop(0.9, '#F5F5F5');
        eyeGradient.addColorStop(1, '#E8E8E8');
        ctx.fillStyle = eyeGradient;
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.moveTo(eyeSpacing - 25, eyeY);
        ctx.quadraticCurveTo(eyeSpacing, eyeY - 20 * state.eyeBlink, eyeSpacing + 25, eyeY);
        ctx.quadraticCurveTo(eyeSpacing, eyeY + 15 * state.eyeBlink, eyeSpacing - 25, eyeY);
        ctx.closePath();
        ctx.fill();
        
        // Irises (following mouse) - only if eyes are open
        if (state.eyeBlink > 0.3) {
            const irisX = Math.max(-8, Math.min(8, state.eyeX * 0.25));
            const irisY = Math.max(-5, Math.min(5, state.eyeY * 0.25));
            
            // Iris gradient
            const irisGradient = ctx.createRadialGradient(
                -eyeSpacing + irisX, eyeY + irisY, 2,
                -eyeSpacing + irisX, eyeY + irisY, 15
            );
            irisGradient.addColorStop(0, '#8B4513');
            irisGradient.addColorStop(0.3, '#A0522D');
            irisGradient.addColorStop(0.7, '#CD853F');
            irisGradient.addColorStop(1, '#DEB887');
            
            // Left iris
            ctx.fillStyle = irisGradient;
            ctx.beginPath();
            ctx.arc(-eyeSpacing + irisX, eyeY + irisY, 15 * state.eyeBlink, 0, Math.PI * 2);
            ctx.fill();
            
            // Right iris
            const irisGradient2 = ctx.createRadialGradient(
                eyeSpacing + irisX, eyeY + irisY, 2,
                eyeSpacing + irisX, eyeY + irisY, 15
            );
            irisGradient2.addColorStop(0, '#8B4513');
            irisGradient2.addColorStop(0.3, '#A0522D');
            irisGradient2.addColorStop(0.7, '#CD853F');
            irisGradient2.addColorStop(1, '#DEB887');
            ctx.fillStyle = irisGradient2;
            ctx.beginPath();
            ctx.arc(eyeSpacing + irisX, eyeY + irisY, 15 * state.eyeBlink, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(-eyeSpacing + irisX, eyeY + irisY, 6 * state.eyeBlink, 0, Math.PI * 2);
            ctx.arc(eyeSpacing + irisX, eyeY + irisY, 6 * state.eyeBlink, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye sparkles
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(-eyeSpacing + irisX + 5, eyeY + irisY - 5, 3, 0, Math.PI * 2);
            ctx.arc(eyeSpacing + irisX + 5, eyeY + irisY - 5, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(-eyeSpacing + irisX - 3, eyeY + irisY + 3, 2, 0, Math.PI * 2);
            ctx.arc(eyeSpacing + irisX - 3, eyeY + irisY + 3, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Eyelids and lashes
        ctx.strokeStyle = '#2C1810';
        ctx.lineWidth = 2.5;
        
        // Upper eyelid
        ctx.beginPath();
        ctx.moveTo(-eyeSpacing - 25, eyeY);
        ctx.quadraticCurveTo(-eyeSpacing, eyeY - 20 * state.eyeBlink, -eyeSpacing + 25, eyeY);
        ctx.moveTo(eyeSpacing - 25, eyeY);
        ctx.quadraticCurveTo(eyeSpacing, eyeY - 20 * state.eyeBlink, eyeSpacing + 25, eyeY);
        ctx.stroke();
        
        // Eyelashes
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 5; i++) {
            const angle = -0.3 + i * 0.15;
            ctx.beginPath();
            ctx.moveTo(-eyeSpacing + Math.cos(angle) * 20, eyeY - 10 * state.eyeBlink + Math.sin(angle) * 20);
            ctx.lineTo(-eyeSpacing + Math.cos(angle) * 25, eyeY - 13 * state.eyeBlink + Math.sin(angle) * 25);
            ctx.moveTo(eyeSpacing + Math.cos(Math.PI - angle) * 20, eyeY - 10 * state.eyeBlink + Math.sin(Math.PI - angle) * 20);
            ctx.lineTo(eyeSpacing + Math.cos(Math.PI - angle) * 25, eyeY - 13 * state.eyeBlink + Math.sin(Math.PI - angle) * 25);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    drawMouth() {
        const { ctx, state } = this;
        const mouthY = 50;
        
        // Lips gradient
        const lipGradient = ctx.createLinearGradient(0, mouthY - 10, 0, mouthY + 10);
        lipGradient.addColorStop(0, '#FF6B9D');
        lipGradient.addColorStop(0.5, '#E91E63');
        lipGradient.addColorStop(1, '#C2185B');
        
        ctx.save();
        
        if (state.mouthOpen > 0.1) {
            // Open mouth (speaking)
            // Upper lip
            ctx.fillStyle = lipGradient;
            ctx.beginPath();
            ctx.moveTo(-20, mouthY);
            ctx.quadraticCurveTo(-15, mouthY - 5, 0, mouthY - 3);
            ctx.quadraticCurveTo(15, mouthY - 5, 20, mouthY);
            ctx.quadraticCurveTo(10, mouthY + 2, 0, mouthY + 2);
            ctx.quadraticCurveTo(-10, mouthY + 2, -20, mouthY);
            ctx.closePath();
            ctx.fill();
            
            // Mouth opening
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.ellipse(0, mouthY + 5, 15, 10 * state.mouthOpen, 0, 0, Math.PI);
            ctx.fill();
            
            // Teeth hint
            if (state.mouthOpen > 0.3) {
                ctx.fillStyle = '#FFF';
                ctx.fillRect(-8, mouthY + 2, 16, 2);
            }
            
            // Lower lip
            ctx.fillStyle = lipGradient;
            ctx.beginPath();
            ctx.moveTo(-20, mouthY);
            ctx.quadraticCurveTo(-10, mouthY + 8 + 10 * state.mouthOpen, 0, mouthY + 10 + 10 * state.mouthOpen);
            ctx.quadraticCurveTo(10, mouthY + 8 + 10 * state.mouthOpen, 20, mouthY);
            ctx.closePath();
            ctx.fill();
            
        } else {
            // Closed mouth with emotion
            ctx.fillStyle = lipGradient;
            ctx.strokeStyle = '#C2185B';
            ctx.lineWidth = 1.5;
            
            ctx.beginPath();
            switch (state.emotion) {
                case 'happy':
                    // Smile
                    ctx.moveTo(-20, mouthY);
                    ctx.quadraticCurveTo(-15, mouthY - 3, 0, mouthY - 2);
                    ctx.quadraticCurveTo(15, mouthY - 3, 20, mouthY);
                    ctx.quadraticCurveTo(15, mouthY + 5, 0, mouthY + 7);
                    ctx.quadraticCurveTo(-15, mouthY + 5, -20, mouthY);
                    break;
                case 'sad':
                    // Frown
                    ctx.moveTo(-15, mouthY - 5);
                    ctx.quadraticCurveTo(0, mouthY, 15, mouthY - 5);
                    ctx.quadraticCurveTo(10, mouthY + 2, 0, mouthY + 3);
                    ctx.quadraticCurveTo(-10, mouthY + 2, -15, mouthY - 5);
                    break;
                case 'angry':
                    // Tight lips
                    ctx.moveTo(-15, mouthY);
                    ctx.lineTo(15, mouthY);
                    ctx.lineTo(12, mouthY + 3);
                    ctx.lineTo(-12, mouthY + 3);
                    ctx.closePath();
                    break;
                default:
                    // Neutral
                    ctx.moveTo(-18, mouthY);
                    ctx.quadraticCurveTo(-15, mouthY - 2, 0, mouthY);
                    ctx.quadraticCurveTo(15, mouthY - 2, 18, mouthY);
                    ctx.quadraticCurveTo(15, mouthY + 4, 0, mouthY + 5);
                    ctx.quadraticCurveTo(-15, mouthY + 4, -18, mouthY);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Lip highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.ellipse(0, mouthY - 2, 8, 3, 0, 0, Math.PI);
            ctx.fill();
        }
        
        ctx.restore();
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