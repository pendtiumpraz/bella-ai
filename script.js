// 导入BellaAI核心模块
import { BellaAI } from './core.js';
import { ChatInterface } from './chatInterface.js';

document.addEventListener('DOMContentLoaded', async function() {
    // --- Get all necessary DOM elements first ---
    const transcriptDiv = document.getElementById('transcript');
    const loadingScreen = document.getElementById('loading-screen');
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    const micButton = document.getElementById('mic-button');


    // --- AI Core Initialization ---
    let bellaAI;
    let chatInterface;
    
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
    
    // 然后尝试初始化AI核心
    micButton.disabled = true;
    transcriptDiv.textContent = 'Sedang membangunkan inti Bella...';
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
        
        micButton.disabled = false;
        transcriptDiv.textContent = 'Bella sudah siap, klik mikrofon untuk mulai bicara.';
    } catch (error) {
        console.error('Failed to initialize Bella AI:', error);
        transcriptDiv.textContent = 'Model lokal gagal dimuat, menggunakan cloud API.';
        
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
        
        // 禁用语音功能，但保持界面可用
        micButton.disabled = true;
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
    function switchVideo() {
        // 1. 选择下一个视频
        const currentVideoSrc = activeVideo.querySelector('source').getAttribute('src');
        let nextVideoSrc = currentVideoSrc;
        while (nextVideoSrc === currentVideoSrc) {
            const randomIndex = Math.floor(Math.random() * videoList.length);
            nextVideoSrc = videoList[randomIndex];
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

            // 为新的 activeVideo 绑定 ended 事件
            activeVideo.addEventListener('ended', switchVideo, { once: true });
        }, { once: true }); // 使用 { once: true } 确保事件只被处理一次
    }

    // 初始启动
    activeVideo.addEventListener('ended', switchVideo, { once: true });
    
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


    // --- 语音识别核心 ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    // 检查浏览器是否支持语音识别
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true; // 持续识别
        recognition.lang = 'zh-CN'; // 设置语言为中文
        recognition.interimResults = true; // 获取临时结果

        recognition.onresult = async (event) => {
            const transcriptContainer = document.getElementById('transcript');
            let final_transcript = '';
            let interim_transcript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            // Update interim results
            transcriptContainer.textContent = `Kamu: ${final_transcript || interim_transcript}`;

            // Once we have a final result, process it with the AI
            if (final_transcript && bellaAI) {
                const userText = final_transcript.trim();
                transcriptContainer.textContent = `Kamu: ${userText}`;

                // 如果聊天界面已打开，也在聊天窗口中显示
                if (chatInterface && chatInterface.getVisibility()) {
                    chatInterface.addMessage('user', userText);
                }

                try {
                    // Let Bella think
                    const thinkingText = document.createElement('p');
                    thinkingText.textContent = 'Bella sedang berpikir...';
                    thinkingText.style.color = '#888';
                    thinkingText.style.fontStyle = 'italic';
                    transcriptContainer.appendChild(thinkingText);
                    
                    const response = await bellaAI.think(userText);
                    
                    transcriptContainer.removeChild(thinkingText);
                    const bellaText = document.createElement('p');
                    bellaText.textContent = `Bella: ${response}`;
                    bellaText.style.color = '#ff6b9d';
                    bellaText.style.fontWeight = 'bold';
                    bellaText.style.marginTop = '10px';
                    transcriptContainer.appendChild(bellaText);

                    // 如果聊天界面已打开，也在聊天窗口中显示
                    if (chatInterface && chatInterface.getVisibility()) {
                        chatInterface.addMessage('assistant', response);
                    }

                    // TTS功能暂时禁用，将在下一阶段激活
                    // TODO: 激活语音合成功能
                    // const audioData = await bellaAI.speak(response);
                    // const blob = new Blob([audioData], { type: 'audio/wav' });
                    // const audioUrl = URL.createObjectURL(blob);
                    // const audio = new Audio(audioUrl);
                    // audio.play();

                } catch (error) {
                    console.error('Bella AI processing error:', error);
                    const errorText = document.createElement('p');
                    const errorMsg = 'Bella mengalami masalah saat memproses, tapi dia masih berusaha belajar...';
                    errorText.textContent = errorMsg;
                    errorText.style.color = '#ff9999';
                    transcriptContainer.appendChild(errorText);
                    
                    if (chatInterface && chatInterface.getVisibility()) {
                        chatInterface.addMessage('assistant', errorMsg);
                    }
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Error pengenalan suara:', event.error);
            const transcriptContainer = document.getElementById('transcript');
            
            switch(event.error) {
                case 'not-allowed':
                    transcriptContainer.textContent = 'Akses mikrofon ditolak. Silakan izinkan akses mikrofon di browser.';
                    // Show permission prompt
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices.getUserMedia({ audio: true })
                            .then(stream => {
                                console.log('Mikrofon diizinkan');
                                stream.getTracks().forEach(track => track.stop());
                            })
                            .catch(err => {
                                console.error('Gagal mendapat izin mikrofon:', err);
                            });
                    }
                    break;
                case 'no-speech':
                    transcriptContainer.textContent = 'Tidak ada suara terdeteksi. Coba lagi.';
                    break;
                case 'audio-capture':
                    transcriptContainer.textContent = 'Mikrofon tidak ditemukan. Pastikan mikrofon terhubung.';
                    break;
                case 'network':
                    transcriptContainer.textContent = 'Error jaringan. Periksa koneksi internet.';
                    break;
                default:
                    transcriptContainer.textContent = `Error: ${event.error}`;
            }
            
            // Reset button state
            isListening = false;
            micButton.classList.remove('is-listening');
        };

    } else {
        console.log('Browser Anda tidak mendukung fitur pengenalan suara.');
        // 可以在界面上给用户提示
    }

    // --- 麦克风按钮交互 ---
    let isListening = false;

    micButton.addEventListener('click', async function() {
        if (!SpeechRecognition) {
            const transcriptText = document.getElementById('transcript');
            transcriptText.textContent = 'Browser tidak mendukung voice recognition.';
            return;
        }

        // Check microphone permission first
        if (isListening === false) {
            try {
                // Request permission before starting recognition
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log('Mikrofon diizinkan');
                // Stop the stream immediately - we just needed permission
                stream.getTracks().forEach(track => track.stop());
                
                // Now start recognition
                isListening = true;
                micButton.classList.add('is-listening');
                const transcriptContainer = document.querySelector('.transcript-container');
                const transcriptText = document.getElementById('transcript');
                transcriptText.textContent = 'Mendengarkan...';
                transcriptContainer.classList.add('visible');
                recognition.start();
                
            } catch (err) {
                console.error('Error mendapat izin mikrofon:', err);
                const transcriptText = document.getElementById('transcript');
                const transcriptContainer = document.querySelector('.transcript-container');
                transcriptContainer.classList.add('visible');
                
                if (err.name === 'NotAllowedError') {
                    transcriptText.textContent = 'Akses mikrofon ditolak. Klik ikon gembok di address bar untuk memberi izin.';
                } else if (err.name === 'NotFoundError') {
                    transcriptText.textContent = 'Mikrofon tidak ditemukan. Pastikan mikrofon terhubung.';
                } else {
                    transcriptText.textContent = 'Error: ' + err.message;
                }
            }
        } else {
            // Stop recognition
            isListening = false;
            micButton.classList.remove('is-listening');
            const transcriptContainer = document.querySelector('.transcript-container');
            const transcriptText = document.getElementById('transcript');
            recognition.stop();
            transcriptContainer.classList.remove('visible');
            transcriptText.textContent = '';
        }
    });




});