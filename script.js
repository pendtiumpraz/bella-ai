// 导入BellaAI核心模块
import { BellaAI } from './core.js';
import { ChatInterface } from './chatInterface.js';
import { VideoManager } from './videoManager.js';
import { VideoAvatar } from './videoAvatar.js';
import { VoiceUI } from './voiceUI.js';

document.addEventListener('DOMContentLoaded', async function() {
    // --- Get all necessary DOM elements first ---
    const loadingScreen = document.getElementById('loading-screen');
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');


    // --- AI Core Initialization ---
    let bellaAI;
    let chatInterface;
    let videoManager;
    let bellaAvatar;
    let voiceUI;
    let isAvatarMode = true; // Start with avatar mode by default
    
    // Initialize video emotion manager
    videoManager = new VideoManager();
    
    // Initialize avatar placeholder
    bellaAvatar = null; // Live2D support removed
    
    // Avatar mode toggle
    const toggleBtn = document.getElementById('toggle-avatar-mode');
    const selectAvatarBtn = document.getElementById('select-avatar-btn');
    const avatarContainer = document.getElementById('avatar-container');
    const videoContainer = document.getElementById('video-container');
    
    // Track current avatar info
    let currentAvatarName = 'Bella';
    let currentAvatarGender = 'female'; // default
    
    // Hide the video mode toggle button
    if (toggleBtn) {
        toggleBtn.style.display = 'none';
    }
    
    // Set initial state to avatar mode
    if (isAvatarMode) {
        videoContainer.style.display = 'none';
        avatarContainer.style.display = 'flex';
        video1.pause();
        video2.pause();
        
        // Auto load Galih Esteh as default avatar
        setTimeout(() => {
            const defaultAvatar = {
                name: 'Galih Hoodie Esteh',
                path: 'vtuber/Galih Hoodie Esteh.vrm',
                type: 'VRM',
                description: 'Galih dengan Hoodie Esteh'
            };
            
            // Update gender for default avatar
            currentAvatarName = defaultAvatar.name;
            currentAvatarGender = getAvatarGender(defaultAvatar.name);
            
            // Trigger avatar selection event
            window.postMessage({
                type: 'avatarSelected',
                avatar: defaultAvatar
            }, '*');
            
            console.log('Auto-loading default avatar: Galih Hoodie Esteh');
        }, 2000); // Wait 2 seconds for everything to initialize
    }
    
    toggleBtn?.addEventListener('click', () => {
        isAvatarMode = !isAvatarMode;
        
        if (isAvatarMode) {
            videoContainer.style.display = 'none';
            avatarContainer.style.display = 'flex';
            toggleBtn.innerHTML = '<i class="fas fa-film"></i> Switch to Video';
            
            // Stop video to save resources
            video1.pause();
            video2.pause();
            
            // Keep current avatar name if already selected
            // Otherwise it will be default Bella
        } else {
            videoContainer.style.display = 'block';
            avatarContainer.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-video"></i> Switch to Avatar';
            
            // Resume video
            video1.play();
            
            // Update chat interface to show Bella for video mode
            if (chatInterface) {
                chatInterface.updateAssistant('Bella AI', '💝');
            }
            
            // Update AI cloud service to use Bella name
            if (bellaAI && bellaAI.cloudAPI) {
                bellaAI.cloudAPI.updateAssistantName('Bella');
            }
        }
    });
    
    // Helper function to determine avatar gender
    function getAvatarGender(avatarName) {
        const femaleAvatars = ['Ai Hoshino', 'Anya Forger', 'Nezuko Kamado', 'Fern', 'Bella'];
        const maleAvatars = ['Galih Hoodie Esteh', 'Galih Hoodie', 'Galih Hoodie Edmuku', 'Galih T-shirt Aveecena'];
        
        if (femaleAvatars.includes(avatarName)) {
            return 'female';
        } else if (maleAvatars.includes(avatarName)) {
            return 'male';
        }
        // Default to female if unknown
        return 'female';
    }
    
    // Helper function to get appropriate TTS settings
    function getTTSSettings(gender) {
        if (gender === 'male') {
            return {
                pitch: 0.8,  // Lower pitch for male voice
                rate: 0.9
            };
        } else {
            return {
                pitch: 1.2,  // Higher pitch for female voice
                rate: 0.9
            };
        }
    }
    
    // Helper function to select best voice for gender
    function selectBestVoice(voices, preferredLang, gender) {
        // First try to find Indonesian voice with matching gender
        let bestVoice = voices.find(voice => {
            const isIndonesian = voice.lang.startsWith(preferredLang);
            const voiceName = voice.name.toLowerCase();
            
            if (gender === 'male') {
                return isIndonesian && (voiceName.includes('male') || voiceName.includes('man'));
            } else {
                return isIndonesian && (voiceName.includes('female') || voiceName.includes('woman'));
            }
        });
        
        // If no gender-specific Indonesian voice, try any Indonesian voice
        if (!bestVoice) {
            bestVoice = voices.find(voice => voice.lang.startsWith(preferredLang));
        }
        
        // If still no voice, try to find any voice with matching gender
        if (!bestVoice) {
            bestVoice = voices.find(voice => {
                const voiceName = voice.name.toLowerCase();
                if (gender === 'male') {
                    return voiceName.includes('male') || voiceName.includes('man');
                } else {
                    return voiceName.includes('female') || voiceName.includes('woman');
                }
            });
        }
        
        return bestVoice;
    }
    
    // Helper function to clean up all avatar displays
    function hideAllAvatars() {
        // Hide canvas avatar
        const bellaCanvas = document.getElementById('bella-avatar');
        if (bellaCanvas) bellaCanvas.style.display = 'none';
        
        // Hide VRM iframe
        const vrmFrame = document.getElementById('vrm-avatar');
        if (vrmFrame) vrmFrame.style.display = 'none';
        
        // Remove Live2D iframe
        const live2dFrame = document.getElementById('live2d-avatar');
        if (live2dFrame) live2dFrame.remove();
    }
    
    // Avatar selection button
    selectAvatarBtn.addEventListener('click', () => {
        // Open avatar selector in new window
        const avatarWindow = window.open('avatarSelector.html', 'AvatarSelector', 'width=1200,height=800');
        
        // Listen for avatar selection
        window.addEventListener('message', async (event) => {
            if (event.data.type === 'useAlternativeViewer') {
                // Switch to alternative viewer if SDK fails
                const live2dFrame = document.getElementById('live2d-avatar');
                if (live2dFrame) {
                    live2dFrame.src = 'live2d-accurate-viewer.html';
                    console.log('Switched to alternative Live2D viewer');
                }
            } else if (event.data.type === 'avatarSelected') {
                const selectedAvatar = event.data.avatar;
                console.log('Avatar selected:', selectedAvatar);
                
                // Update current avatar info
                currentAvatarName = selectedAvatar.name;
                currentAvatarGender = getAvatarGender(selectedAvatar.name);
                console.log(`Avatar: ${currentAvatarName}, Gender: ${currentAvatarGender}`);
                
                // Update chat interface with avatar name
                if (chatInterface) {
                    chatInterface.updateAssistant(selectedAvatar.name, '🎭');
                    
                    // Clear chat history
                    chatInterface.clearChat();
                    
                    // Add greeting from new avatar
                    setTimeout(() => {
                        const greetings = {
                            'Galih Hoodie Esteh': 'Halo bro! Aku Galih, suka banget sama es teh! Mau ngobrol atau butuh bantuan apa nih? 🧋',
                            'Galih Hoodie': 'Hai! Aku Galih, gimana kabarnya hari ini? Ada yang bisa kubantu? 😎',
                            'Galih Hoodie Edmuku': 'Yo! Galih disini, siap membantu kamu! Apa yang bisa kulakukan? 🎵',
                            'Galih T-shirt Aveecena': 'Halo! Aku Galih dari Aveecena. Ada project seru yang mau dikerjain bareng? 💻',
                            'Ai Hoshino': 'Halo! Aku Ai Hoshino dari B-Komachi! Senang bertemu denganmu! ✨',
                            'Anya Forger': 'Waku waku! Anya suka kacang! Mau main sama Anya? 🥜',
                            'Nezuko Kamado': 'Mmm... mmm! *mengangguk senang* 🎋',
                            'Fern': 'Halo, aku Fern. Ada yang bisa kubantu hari ini? 🌿',
                            'default': `Halo! Aku ${selectedAvatar.name}. Senang bertemu denganmu! 😊`
                        };
                        
                        const greeting = greetings[selectedAvatar.name] || greetings['default'];
                        chatInterface.addMessage('assistant', greeting);
                    }, 1500);
                }
                
                // Update AI cloud service with avatar name
                if (bellaAI && bellaAI.cloudAPI) {
                    bellaAI.cloudAPI.updateAssistantName(selectedAvatar.name);
                    
                    // Set personality based on character
                    const personalities = {
                        'Galih Hoodie Esteh': 'Kamu adalah Galih, cowok santai yang suka banget sama es teh. Kamu friendly, humoris, dan suka ngobrol casual. Gunakan bahasa gaul Indonesia yang santai.',
                        'Galih Hoodie': 'Kamu adalah Galih, cowok cool dengan hoodie. Kamu asik diajak ngobrol, supportive, dan suka membantu teman-teman.',
                        'Galih Hoodie Edmuku': 'Kamu adalah Galih, suka musik EDM dan party. Kamu energetic, fun, dan suka bikin suasana jadi seru.',
                        'Galih T-shirt Aveecena': 'Kamu adalah Galih dari Aveecena. Kamu tech-savvy, suka coding, dan passionate tentang teknologi.',
                        'Ai Hoshino': 'Kamu adalah Ai Hoshino, idol dari grup B-Komachi. Kamu ceria, penuh semangat, dan selalu berusaha membuat fans senang.',
                        'Anya Forger': 'Kamu adalah Anya Forger dari Spy x Family. Kamu anak kecil yang lucu, suka kacang, dan bisa baca pikiran. Gunakan kata "waku waku" saat excited.',
                        'Nezuko Kamado': 'Kamu adalah Nezuko Kamado dari Demon Slayer. Kamu tidak bisa bicara banyak, hanya "mmm" atau anggukan, tapi sangat peduli dan protektif.',
                        'Fern': 'Kamu adalah Fern dari Frieren. Kamu penyihir muda yang tenang, dewasa, dan bertanggung jawab.'
                    };
                    
                    if (personalities[selectedAvatar.name]) {
                        bellaAI.cloudAPI.systemPrompt = personalities[selectedAvatar.name];
                    }
                }
                
                // Hide all avatars first
                hideAllAvatars();
                
                // Send cleanup message to current VRM iframe if exists
                const currentVrmFrame = document.getElementById('vrm-avatar');
                if (currentVrmFrame && currentVrmFrame.contentWindow && currentVrmFrame.style.display !== 'none') {
                    currentVrmFrame.contentWindow.postMessage({ type: 'cleanup' }, '*');
                    // Give time for cleanup
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                // Handle different avatar types
                if (selectedAvatar.type === 'VRM') {
                    console.log('Switching to VRM model:', selectedAvatar.name);
                    
                    // Show VRM iframe
                    const vrmFrame = document.getElementById('vrm-avatar');
                    // Keep using vrm-avatar.html
                    vrmFrame.style.display = 'block';
                    
                    // Force style update
                    vrmFrame.style.width = '100%';
                    vrmFrame.style.height = '100%';
                    vrmFrame.style.position = 'absolute';
                    vrmFrame.style.top = '0';
                    vrmFrame.style.left = '0';
                    
                    console.log('VRM frame visibility:', vrmFrame.style.display);
                    
                    // Wait for iframe to load then send message
                    if (vrmFrame.contentWindow) {
                        // If already loaded, send immediately
                        vrmFrame.contentWindow.postMessage({
                            type: 'loadModel',
                            path: selectedAvatar.path
                        }, '*');
                        console.log('Sent loadModel message for:', selectedAvatar.path);
                    } else {
                        // Wait for iframe to load
                        vrmFrame.onload = () => {
                            setTimeout(() => {
                                vrmFrame.contentWindow.postMessage({
                                    type: 'loadModel',
                                    path: selectedAvatar.path
                                }, '*');
                                console.log('Sent loadModel message after iframe load:', selectedAvatar.path);
                            }, 1000);
                        };
                    }
                    
                } else {
                    console.log('Unknown avatar type:', selectedAvatar.type);
                }
            }
        });
    });
    
    // 首先初始化聊天界面（不依赖AI）
    try {
        chatInterface = new ChatInterface();
        console.log('聊天界面初始化成功');
        console.log('ChatInterface实例创建完成:', chatInterface);
        console.log('聊天容器元素:', chatInterface.chatContainer);
        console.log('聊天容器是否在DOM中:', document.body.contains(chatInterface.chatContainer));
        
        // 自动显示聊天界面（调试用）
        setTimeout(() => {
            console.log('Mencoba menampilkan interface chat otomatis...');
            chatInterface.show();
            console.log('Interface chat sudah ditampilkan otomatis');
            console.log('聊天界面可见性:', chatInterface.getVisibility());
            console.log('聊天容器类名:', chatInterface.chatContainer.className);
        }, 2000);
    } catch (error) {
        console.error('聊天界面初始化失败:', error);
    }
    
    // Initialize Voice UI
    try {
        voiceUI = new VoiceUI();
        console.log('Voice UI initialized successfully');
        
        // Set up voice UI callbacks
        voiceUI.onMicClick = () => {
            // This will be handled by speech recognition below
        };
        
        voiceUI.onVolumeChange = (type, value) => {
            if (type === 'output' && 'speechSynthesis' in window) {
                // Adjust TTS volume
                window.speechSynthesisVolume = value;
            }
        };
    } catch (error) {
        console.error('Failed to initialize Voice UI:', error);
    }
    
    // 然后尝试初始化AI核心
    try {
        bellaAI = await BellaAI.getInstance();
        console.log('Bella AI 初始化成功');
        
        // 设置聊天界面的AI回调函数
        if (chatInterface) {
            chatInterface.onMessageSend = async (message) => {
                try {
                    chatInterface.showTypingIndicator();
                    const response = await bellaAI.think(message);
                    chatInterface.hideTypingIndicator();
                    chatInterface.addMessage('assistant', response);
                    
                    // Speak the response
                    if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(response);
                        utterance.lang = 'id-ID';
                        const ttsSettings = getTTSSettings(currentAvatarGender);
                        utterance.rate = ttsSettings.rate;
                        utterance.pitch = ttsSettings.pitch;
                        utterance.volume = 0.8;
                        
                        const voices = window.speechSynthesis.getVoices();
                        const bestVoice = selectBestVoice(voices, 'id', currentAvatarGender);
                        if (bestVoice) {
                            utterance.voice = bestVoice;
                            console.log(`Using voice: ${bestVoice.name} for ${currentAvatarGender} avatar`);
                        }
                        
                        // Sync avatar mouth with speech
                        if (isAvatarMode) {
                            const vrmFrame = document.getElementById('vrm-avatar');
                            const live2dFrame = document.getElementById('live2d-avatar');
                            
                            if (vrmFrame && vrmFrame.style.display !== 'none' && vrmFrame.contentWindow) {
                                // Detect emotion from response
                                let emotion = 'neutral';
                                const lowerResponse = response.toLowerCase();
                                if (lowerResponse.includes('senang') || lowerResponse.includes('bahagia') || lowerResponse.includes('😊') || lowerResponse.includes('😄')) {
                                    emotion = 'happy';
                                } else if (lowerResponse.includes('sedih') || lowerResponse.includes('maaf') || lowerResponse.includes('😢')) {
                                    emotion = 'sad';
                                } else if (lowerResponse.includes('marah') || lowerResponse.includes('kesal') || lowerResponse.includes('😠')) {
                                    emotion = 'angry';
                                } else if (lowerResponse.includes('wow') || lowerResponse.includes('amazing') || lowerResponse.includes('😮')) {
                                    emotion = 'surprised';
                                }
                                
                                // Send message to VRM iframe to start speaking with emotion
                                vrmFrame.contentWindow.postMessage({
                                    type: 'speak',
                                    text: response,
                                    emotion: emotion
                                }, '*');
                            } else if (live2dFrame && live2dFrame.style.display !== 'none' && live2dFrame.contentWindow) {
                                // Send message to Live2D iframe to start speaking
                                live2dFrame.contentWindow.postMessage({
                                    type: 'speak',
                                    text: response
                                }, '*');
                            } else if (bellaAvatar) {
                                bellaAvatar.startSpeaking();
                                utterance.onend = () => {
                                    bellaAvatar.stopSpeaking();
                                };
                            }
                        }
                        
                        // Start speaking animation in Voice UI if available
                        if (voiceUI) {
                            voiceUI.startSpeaking();
                            
                            utterance.onend = () => {
                                voiceUI.stopSpeaking();
                                voiceUI.setStatus('Ready');
                            };
                        }
                        
                        window.speechSynthesis.speak(utterance);
                    }
                    
                    // Update emotion based on mode
                    if (isAvatarMode && bellaAvatar) {
                        // Update avatar emotion
                        const emotion = videoManager.detectEmotion(response);
                        bellaAvatar.setEmotion(emotion);
                    } else {
                        // Update video emotion
                        const emotionChange = videoManager.switchToEmotionVideo(response);
                        if (emotionChange) {
                            console.log('Bella emotion changed to:', emotionChange.emotion);
                        }
                    }
                } catch (error) {
                    console.error('Error pemrosesan AI:', error);
                    chatInterface.hideTypingIndicator();
                    chatInterface.addMessage('assistant', '抱歉，我现在有点困惑，请稍后再试...');
                }
            };
            
            // 设置提供商切换回调
            chatInterface.onProviderChange = (provider) => {
                console.log('Beralih ke provider AI:', provider);
                if (provider === 'local') {
                    bellaAI.useCloudAPI = false;
                } else {
                    bellaAI.useCloudAPI = true;
                    bellaAI.cloudAPI.switchProvider(provider);
                }
            };
            
            // 设置API密钥保存回调
            chatInterface.onAPIKeySave = (provider, apiKey) => {
                console.log('Menyimpan API key:', provider);
                bellaAI.cloudAPI.setAPIKey(provider, apiKey);
            };
        }
        
        // Voice UI is ready
        if (voiceUI) {
            voiceUI.setStatus('AI Ready');
        }
    } catch (error) {
        console.error('Failed to initialize Bella AI:', error);
        if (voiceUI) {
            voiceUI.setStatus('Using cloud AI');
        }
        
        // Buat instance BellaAI tanpa model lokal
        bellaAI = await BellaAI.getInstance();
        
        // Setup chat dengan cloud API
        if (chatInterface) {
            chatInterface.onMessageSend = async (message) => {
                try {
                    chatInterface.showTypingIndicator();
                    const response = await bellaAI.think(message);
                    chatInterface.hideTypingIndicator();
                    chatInterface.addMessage('assistant', response);
                    
                    // Speak the response
                    if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(response);
                        utterance.lang = 'id-ID';
                        const ttsSettings = getTTSSettings(currentAvatarGender);
                        utterance.rate = ttsSettings.rate;
                        utterance.pitch = ttsSettings.pitch;
                        utterance.volume = 0.8;
                        
                        const voices = window.speechSynthesis.getVoices();
                        const bestVoice = selectBestVoice(voices, 'id', currentAvatarGender);
                        if (bestVoice) {
                            utterance.voice = bestVoice;
                            console.log(`Using voice: ${bestVoice.name} for ${currentAvatarGender} avatar`);
                        }
                        
                        // Sync avatar mouth with speech
                        if (isAvatarMode) {
                            const vrmFrame = document.getElementById('vrm-avatar');
                            const live2dFrame = document.getElementById('live2d-avatar');
                            
                            if (vrmFrame && vrmFrame.style.display !== 'none' && vrmFrame.contentWindow) {
                                // Detect emotion from response
                                let emotion = 'neutral';
                                const lowerResponse = response.toLowerCase();
                                if (lowerResponse.includes('senang') || lowerResponse.includes('bahagia') || lowerResponse.includes('😊') || lowerResponse.includes('😄')) {
                                    emotion = 'happy';
                                } else if (lowerResponse.includes('sedih') || lowerResponse.includes('maaf') || lowerResponse.includes('😢')) {
                                    emotion = 'sad';
                                } else if (lowerResponse.includes('marah') || lowerResponse.includes('kesal') || lowerResponse.includes('😠')) {
                                    emotion = 'angry';
                                } else if (lowerResponse.includes('wow') || lowerResponse.includes('amazing') || lowerResponse.includes('😮')) {
                                    emotion = 'surprised';
                                }
                                
                                // Send message to VRM iframe to start speaking with emotion
                                vrmFrame.contentWindow.postMessage({
                                    type: 'speak',
                                    text: response,
                                    emotion: emotion
                                }, '*');
                            } else if (live2dFrame && live2dFrame.style.display !== 'none' && live2dFrame.contentWindow) {
                                // Send message to Live2D iframe to start speaking
                                live2dFrame.contentWindow.postMessage({
                                    type: 'speak',
                                    text: response
                                }, '*');
                            } else if (bellaAvatar) {
                                bellaAvatar.startSpeaking();
                                utterance.onend = () => {
                                    bellaAvatar.stopSpeaking();
                                };
                            }
                        }
                        
                        // Start speaking animation in Voice UI if available
                        if (voiceUI) {
                            voiceUI.startSpeaking();
                            
                            utterance.onend = () => {
                                voiceUI.stopSpeaking();
                                voiceUI.setStatus('Ready');
                            };
                        }
                        
                        window.speechSynthesis.speak(utterance);
                    }
                    
                    // Update emotion based on mode
                    if (isAvatarMode && bellaAvatar) {
                        // Update avatar emotion
                        const emotion = videoManager.detectEmotion(response);
                        bellaAvatar.setEmotion(emotion);
                    } else {
                        // Update video emotion
                        const emotionChange = videoManager.switchToEmotionVideo(response);
                        if (emotionChange) {
                            console.log('Bella emotion changed to:', emotionChange.emotion);
                        }
                    }
                } catch (error) {
                    console.error('Error pemrosesan AI:', error);
                    chatInterface.hideTypingIndicator();
                    chatInterface.addMessage('assistant', 'Maaf, ada masalah dengan koneksi AI. Coba lagi nanti...');
                }
            };
            
            // Setup provider dan API key callbacks
            chatInterface.onProviderChange = (provider) => {
                console.log('Beralih ke provider AI:', provider);
                if (provider === 'local') {
                    bellaAI.useCloudAPI = false;
                } else {
                    bellaAI.useCloudAPI = true;
                    bellaAI.cloudAPI.switchProvider(provider);
                }
            };
            
            chatInterface.onAPIKeySave = (provider, apiKey) => {
                console.log('Menyimpan API key:', provider);
                bellaAI.cloudAPI.setAPIKey(provider, apiKey);
            };
        }
    }

    // --- Loading screen handling ---
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        // Hide it after the animation to prevent it from blocking interactions
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // 显示聊天控制面板
            const chatControlPanel = document.querySelector('.chat-control-panel');
            if (chatControlPanel) {
                chatControlPanel.classList.add('visible');
            }
        }, 500); // This time should match the transition time in CSS
    }, 1500); // Start fading out after 1.5 seconds

    let activeVideo = video1;
    let inactiveVideo = video2;
    
    // Force play video on load
    activeVideo.play().catch(error => {
        console.error("Error playing initial video:", error);
        // Try to play on user interaction
        document.addEventListener('click', () => {
            activeVideo.play();
        }, { once: true });
    });

    // 视频列表
    const videoList = [
        '视频资源/3D 建模图片制作.mp4',
        '视频资源/jimeng-2025-07-16-1043-笑着优雅的左右摇晃，过一会儿手扶着下巴，保持微笑.mp4',
        '视频资源/jimeng-2025-07-16-4437-比耶，然后微笑着优雅的左右摇晃.mp4',
        '视频资源/生成加油视频.mp4',
        '视频资源/生成跳舞视频.mp4',
        '视频资源/负面/jimeng-2025-07-16-9418-双手叉腰，嘴巴一直在嘟囔，表情微微生气.mp4'
    ];

    // --- 视频交叉淡入淡出播放功能 ---
    function switchVideo(forcedVideoSrc = null) {
        // 1. 选择下一个视频
        const currentVideoSrc = activeVideo.querySelector('source').getAttribute('src');
        let nextVideoSrc;
        
        if (forcedVideoSrc) {
            nextVideoSrc = forcedVideoSrc;
        } else {
            nextVideoSrc = currentVideoSrc;
            while (nextVideoSrc === currentVideoSrc) {
                const randomIndex = Math.floor(Math.random() * videoList.length);
                nextVideoSrc = videoList[randomIndex];
            }
        }

        // 2. 设置不活动的 video 元素的 source
        inactiveVideo.querySelector('source').setAttribute('src', nextVideoSrc);
        inactiveVideo.load();

        // 3. 当不活动的视频可以播放时，执行切换
        inactiveVideo.addEventListener('canplaythrough', function onCanPlayThrough() {
            // 确保事件只触发一次
            inactiveVideo.removeEventListener('canplaythrough', onCanPlayThrough);

            // 4. 播放新视频
            inactiveVideo.play().catch(error => {
                console.error("Video play failed:", error);
            });

            // 5. 切换 active class 来触发 CSS 过渡
            activeVideo.classList.remove('active');
            inactiveVideo.classList.add('active');

            // 6. 更新角色
            [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo];

            // Video sudah loop, tidak perlu event ended
            // activeVideo.addEventListener('ended', switchVideo, { once: true });
        }, { once: true }); // 使用 { once: true } 确保事件只被处理一次
    }

    // Video akan loop terus menerus, tidak perlu event ended
    
    // Listen for emotion-based video changes
    window.addEventListener('bella-emotion-change', (event) => {
        const { emotion, video } = event.detail;
        console.log('Switching to emotion video:', emotion, video);
        switchVideo(video);
    });
    
    // 聊天控制按钮事件
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatTestBtn = document.getElementById('chat-test-btn');
    
    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', () => {
            if (chatInterface) {
                console.log('聊天按钮被点击');
                console.log('点击前聊天界面状态:', chatInterface.getVisibility());
                console.log('点击前聊天容器类名:', chatInterface.chatContainer.className);
                
                chatInterface.toggle();
                
                console.log('点击后聊天界面状态:', chatInterface.getVisibility());
                console.log('点击后聊天容器类名:', chatInterface.chatContainer.className);
                console.log('聊天界面切换，当前状态:', chatInterface.getVisibility());
                
                // 更新按钮状态
                const isVisible = chatInterface.getVisibility();
                chatToggleBtn.innerHTML = isVisible ? 
                    '<i class="fas fa-times"></i><span>Tutup</span>' : 
                    '<i class="fas fa-comments"></i><span>Chat</span>';
                console.log('Text tombol diupdate menjadi:', chatToggleBtn.innerHTML);
            }
        });
    }
    
    if (chatTestBtn) {
        chatTestBtn.addEventListener('click', () => {
            if (chatInterface) {
                const testMessages = [
                    'Halo! Saya Bella, senang bertemu denganmu!',
                    'Interface chat berfungsi normal, semua fitur sudah siap.',
                    'Ini adalah pesan test untuk verifikasi fungsi interface.'
                ];
                const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
                chatInterface.addMessage('assistant', randomMessage);
                
                // Jika chat interface belum tampil, tampilkan otomatis
                if (!chatInterface.getVisibility()) {
                    chatInterface.show();
                    chatToggleBtn.innerHTML = '<i class="fas fa-times"></i><span>Tutup</span>';
                }
                
                console.log('Pesan test sudah ditambahkan:', randomMessage);
            }
        });
    }


    // --- Speech Recognition with Voice UI ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    let isListening = false;

    // Setup speech recognition if supported
    if (SpeechRecognition && voiceUI) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'id-ID'; // Indonesian
        recognition.interimResults = true;

        recognition.onresult = async (event) => {
            let final_transcript = '';
            let interim_transcript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            // Update Voice UI transcript
            voiceUI.updateTranscript(final_transcript || interim_transcript, !final_transcript);

            // Once we have a final result, process it with the AI
            if (final_transcript && bellaAI) {
                const userText = final_transcript.trim();
                voiceUI.updateTranscript(`You: ${userText}`);

                // 如果聊天界面已打开，也在聊天窗口中显示
                if (chatInterface && chatInterface.getVisibility()) {
                    chatInterface.addMessage('user', userText);
                }

                try {
                    // Update Voice UI status
                    voiceUI.setStatus('AI thinking...');
                    
                    const response = await bellaAI.think(userText);
                    
                    voiceUI.updateTranscript(`${selectedAvatar ? selectedAvatar.name : 'AI'}: ${response}`);
                    voiceUI.setStatus('Speaking...');

                    // 如果聊天界面已打开，也在聊天窗口中显示
                    if (chatInterface && chatInterface.getVisibility()) {
                        chatInterface.addMessage('assistant', response);
                    }

                    // Use browser TTS untuk suara Bella
                    if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(response);
                        utterance.lang = 'id-ID'; // Bahasa Indonesia
                        const ttsSettings = getTTSSettings(currentAvatarGender);
                        utterance.rate = ttsSettings.rate;
                        utterance.pitch = ttsSettings.pitch;
                        utterance.volume = 0.8;
                        
                        // Pilih voice Indonesia jika ada
                        const voices = window.speechSynthesis.getVoices();
                        const bestVoice = selectBestVoice(voices, 'id', currentAvatarGender);
                        if (bestVoice) {
                            utterance.voice = bestVoice;
                            console.log(`Using voice: ${bestVoice.name} for ${currentAvatarGender} avatar`);
                        }
                        
                        // Start speaking animation in Voice UI if available
                        if (voiceUI) {
                            voiceUI.startSpeaking();
                            
                            utterance.onend = () => {
                                voiceUI.stopSpeaking();
                                voiceUI.setStatus('Ready');
                            };
                        }
                        
                        window.speechSynthesis.speak(utterance);
                    }
                    
                    // Switch video based on emotion
                    const emotionChange = videoManager.switchToEmotionVideo(response);
                    if (emotionChange) {
                        console.log('Bella emotion changed to:', emotionChange.emotion);
                    }

                } catch (error) {
                    console.error('AI processing error:', error);
                    const errorMsg = 'AI mengalami masalah saat memproses, tapi masih berusaha belajar...';
                    voiceUI.updateTranscript(errorMsg);
                    voiceUI.setStatus('Error');
                    
                    if (chatInterface && chatInterface.getVisibility()) {
                        chatInterface.addMessage('assistant', errorMsg);
                    }
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            switch(event.error) {
                case 'not-allowed':
                    voiceUI.setStatus('Mic access denied');
                    voiceUI.updateTranscript('Please allow microphone access in your browser.');
                    break;
                case 'no-speech':
                    voiceUI.setStatus('No speech detected');
                    break;
                case 'audio-capture':
                    voiceUI.setStatus('No microphone found');
                    break;
                case 'network':
                    voiceUI.setStatus('Network error');
                    break;
                default:
                    voiceUI.setStatus(`Error: ${event.error}`);
            }
            voiceUI.stopListening();
            
            isListening = false;
        };

        // Voice UI mic button handler
        voiceUI.onMicClick = async () => {
            if (!SpeechRecognition) {
                voiceUI.setStatus('Speech recognition not supported');
                return;
            }
            
            if (!isListening) {
                try {
                    isListening = true;
                    recognition.start();
                    voiceUI.setStatus('Listening...');
                } catch (err) {
                    console.error('Failed to start recognition:', err);
                    voiceUI.setStatus('Failed to start');
                    isListening = false;
                    voiceUI.stopListening();
                }
            } else {
                isListening = false;
                recognition.stop();
                voiceUI.stopListening();
            }
        };
    } else {
        console.log('Speech recognition not supported');
        if (voiceUI) {
            voiceUI.setStatus('Speech recognition not supported');
        }
    }




});