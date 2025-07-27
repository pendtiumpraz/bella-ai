// Voice UI Module with Audio Spectrum Visualization
export class VoiceUI {
    constructor() {
        this.panel = null;
        this.micButton = null;
        this.isListening = false;
        this.isSpeaking = false;
        this.isCollapsed = false;
        
        // Audio context for spectrum analysis
        this.audioContext = null;
        this.inputAnalyser = null;
        this.outputAnalyser = null;
        this.inputSource = null;
        this.outputSource = null;
        
        // Spectrum visualization
        this.inputBars = [];
        this.outputBars = [];
        this.animationId = null;
        
        // Callbacks
        this.onMicClick = null;
        this.onVolumeChange = null;
        
        this.createUI();
        this.initAudioContext();
    }
    
    createUI() {
        // Create main panel
        this.panel = document.createElement('div');
        this.panel.className = 'voice-ui-panel';
        this.panel.innerHTML = `
            <div class="voice-ui-header">
                <h3 class="voice-ui-title">Voice Control</h3>
                <button class="voice-ui-toggle" title="Toggle panel">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>
            
            <div class="voice-mic-section">
                <button class="voice-mic-button" id="voice-mic-btn">
                    <i class="fas fa-microphone"></i>
                </button>
                <div class="voice-status">Ready</div>
            </div>
            
            <div class="audio-spectrum-container">
                <div class="spectrum-label">Input (Your Voice)</div>
                <div class="audio-spectrum spectrum-input">
                    <div class="spectrum-bars" id="input-spectrum"></div>
                </div>
                
                <div class="spectrum-label">Output (AI Voice)</div>
                <div class="audio-spectrum spectrum-output">
                    <div class="spectrum-bars" id="output-spectrum"></div>
                </div>
            </div>
            
            <div class="voice-controls">
                <div class="voice-control-item">
                    <span class="voice-control-label">Input Volume</span>
                    <div class="voice-control-value">
                        <input type="range" class="volume-slider" id="input-volume" 
                               min="0" max="100" value="70">
                        <span class="volume-value">70%</span>
                    </div>
                </div>
                
                <div class="voice-control-item">
                    <span class="voice-control-label">Output Volume</span>
                    <div class="voice-control-value">
                        <input type="range" class="volume-slider" id="output-volume" 
                               min="0" max="100" value="80">
                        <span class="volume-value">80%</span>
                    </div>
                </div>
            </div>
            
            <div class="voice-transcript">
                <div class="transcript-label">Transcript</div>
                <div class="transcript-text" id="voice-transcript">
                    Click the microphone to start...
                </div>
            </div>
        `;
        
        document.body.appendChild(this.panel);
        
        // Get references
        this.micButton = this.panel.querySelector('#voice-mic-btn');
        this.statusElement = this.panel.querySelector('.voice-status');
        this.transcriptElement = this.panel.querySelector('#voice-transcript');
        
        // Create spectrum bars
        this.createSpectrumBars();
        
        // Bind events
        this.bindEvents();
    }
    
    createSpectrumBars() {
        const inputSpectrum = this.panel.querySelector('#input-spectrum');
        const outputSpectrum = this.panel.querySelector('#output-spectrum');
        
        // Create 32 bars for each spectrum
        for (let i = 0; i < 32; i++) {
            // Input bars
            const inputBar = document.createElement('div');
            inputBar.className = 'spectrum-bar';
            inputBar.style.height = '2px';
            inputSpectrum.appendChild(inputBar);
            this.inputBars.push(inputBar);
            
            // Output bars
            const outputBar = document.createElement('div');
            outputBar.className = 'spectrum-bar';
            outputBar.style.height = '2px';
            outputSpectrum.appendChild(outputBar);
            this.outputBars.push(outputBar);
        }
    }
    
    initAudioContext() {
        // Initialize Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create analysers
        this.inputAnalyser = this.audioContext.createAnalyser();
        this.inputAnalyser.fftSize = 64; // 32 frequency bins
        this.inputAnalyser.smoothingTimeConstant = 0.8;
        
        this.outputAnalyser = this.audioContext.createAnalyser();
        this.outputAnalyser.fftSize = 64;
        this.outputAnalyser.smoothingTimeConstant = 0.8;
    }
    
    bindEvents() {
        // Toggle panel
        const toggleBtn = this.panel.querySelector('.voice-ui-toggle');
        toggleBtn.addEventListener('click', () => {
            this.togglePanel();
        });
        
        // Mic button
        this.micButton.addEventListener('click', () => {
            if (this.onMicClick) {
                this.onMicClick();
            }
            this.toggleListening();
        });
        
        // Volume controls
        const inputVolume = this.panel.querySelector('#input-volume');
        const outputVolume = this.panel.querySelector('#output-volume');
        
        inputVolume.addEventListener('input', (e) => {
            const value = e.target.value;
            this.panel.querySelector('.voice-control-item:nth-child(1) .volume-value').textContent = `${value}%`;
            if (this.onVolumeChange) {
                this.onVolumeChange('input', value / 100);
            }
        });
        
        outputVolume.addEventListener('input', (e) => {
            const value = e.target.value;
            this.panel.querySelector('.voice-control-item:nth-child(2) .volume-value').textContent = `${value}%`;
            if (this.onVolumeChange) {
                this.onVolumeChange('output', value / 100);
            }
        });
    }
    
    togglePanel() {
        this.isCollapsed = !this.isCollapsed;
        const toggleIcon = this.panel.querySelector('.voice-ui-toggle i');
        
        if (this.isCollapsed) {
            this.panel.classList.add('collapsed');
            toggleIcon.className = 'fas fa-chevron-right';
        } else {
            this.panel.classList.remove('collapsed');
            toggleIcon.className = 'fas fa-chevron-left';
        }
    }
    
    toggleListening() {
        this.isListening = !this.isListening;
        
        if (this.isListening) {
            this.startListening();
        } else {
            this.stopListening();
        }
    }
    
    async startListening() {
        this.micButton.classList.add('listening');
        this.micButton.innerHTML = '<i class="fas fa-stop"></i>';
        this.statusElement.textContent = 'Listening...';
        
        try {
            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.inputSource = this.audioContext.createMediaStreamSource(stream);
            this.inputSource.connect(this.inputAnalyser);
            
            // Start spectrum animation
            this.startSpectrumAnimation();
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.statusElement.textContent = 'Mic access denied';
            this.stopListening();
        }
    }
    
    stopListening() {
        this.isListening = false;
        this.micButton.classList.remove('listening');
        this.micButton.innerHTML = '<i class="fas fa-microphone"></i>';
        this.statusElement.textContent = 'Ready';
        
        // Stop input source
        if (this.inputSource) {
            this.inputSource.disconnect();
            this.inputSource = null;
        }
        
        // Stop animation if no output
        if (!this.isSpeaking) {
            this.stopSpectrumAnimation();
        }
    }
    
    startSpeaking() {
        this.isSpeaking = true;
        this.micButton.classList.add('speaking');
        this.statusElement.textContent = 'AI Speaking...';
        
        // Start spectrum animation if not already running
        if (!this.animationId) {
            this.startSpectrumAnimation();
        }
    }
    
    stopSpeaking() {
        this.isSpeaking = false;
        this.micButton.classList.remove('speaking');
        this.statusElement.textContent = 'Ready';
        
        // Stop animation if not listening
        if (!this.isListening) {
            this.stopSpectrumAnimation();
        }
    }
    
    // Connect audio element for output analysis
    connectAudioElement(audioElement) {
        if (this.outputSource) {
            this.outputSource.disconnect();
        }
        
        this.outputSource = this.audioContext.createMediaElementSource(audioElement);
        this.outputSource.connect(this.outputAnalyser);
        this.outputSource.connect(this.audioContext.destination);
    }
    
    startSpectrumAnimation() {
        const updateSpectrum = () => {
            // Input spectrum
            if (this.inputAnalyser && this.isListening) {
                const inputData = new Uint8Array(this.inputAnalyser.frequencyBinCount);
                this.inputAnalyser.getByteFrequencyData(inputData);
                
                this.inputBars.forEach((bar, i) => {
                    const value = inputData[i] / 255;
                    const height = Math.max(2, value * 50);
                    bar.style.height = `${height}px`;
                });
            } else {
                // Reset input bars
                this.inputBars.forEach(bar => {
                    bar.style.height = '2px';
                });
            }
            
            // Output spectrum
            if (this.outputAnalyser && this.isSpeaking) {
                const outputData = new Uint8Array(this.outputAnalyser.frequencyBinCount);
                this.outputAnalyser.getByteFrequencyData(outputData);
                
                this.outputBars.forEach((bar, i) => {
                    const value = outputData[i] / 255;
                    const height = Math.max(2, value * 50);
                    bar.style.height = `${height}px`;
                });
            } else {
                // Reset output bars
                this.outputBars.forEach(bar => {
                    bar.style.height = '2px';
                });
            }
            
            this.animationId = requestAnimationFrame(updateSpectrum);
        };
        
        updateSpectrum();
    }
    
    stopSpectrumAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Reset all bars
        this.inputBars.forEach(bar => bar.style.height = '2px');
        this.outputBars.forEach(bar => bar.style.height = '2px');
    }
    
    updateTranscript(text, isPartial = false) {
        this.transcriptElement.textContent = text;
        if (isPartial) {
            this.transcriptElement.style.opacity = '0.7';
        } else {
            this.transcriptElement.style.opacity = '1';
        }
    }
    
    setStatus(status) {
        this.statusElement.textContent = status;
    }
    
    // Clean up
    destroy() {
        this.stopSpectrumAnimation();
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.panel) {
            this.panel.remove();
        }
    }
}