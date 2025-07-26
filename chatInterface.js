// chatInterface.js - 贝拉的聊天界面组件
// 这个模块负责创建和管理优雅的聊天界面，体现贝拉的温暖个性

class ChatInterface {
    constructor() {
        this.isVisible = false;
        this.messages = [];
        this.maxMessages = 50; // 最多显示50条消息
        this.chatContainer = null;
        this.messageContainer = null;
        this.inputContainer = null;
        this.messageInput = null;
        this.sendButton = null;
        this.toggleButton = null;
        this.settingsPanel = null;
        this.isSettingsVisible = false;
        this.assistantName = 'Bella'; // Default name
        this.assistantAvatar = '💝'; // Default avatar
        
        this.init();
    }

    // 初始化聊天界面
    init() {
        this.createChatContainer();
        this.createToggleButton();
        this.createSettingsPanel();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    // 创建聊天容器
    createChatContainer() {
        // 主聊天容器
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'bella-chat-container';
        this.chatContainer.innerHTML = `
            <div class="bella-chat-header">
                <div class="bella-chat-title">
                    <div class="bella-avatar">${this.assistantAvatar}</div>
                    <div class="bella-title-text">
                        <h3>${this.assistantName}</h3>
                        <span class="bella-status">Online</span>
                    </div>
                </div>
                <div class="bella-chat-controls">
                    <button class="bella-settings-btn" title="Pengaturan">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="bella-minimize-btn" title="Minimalkan">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <div class="bella-chat-messages"></div>
            <div class="bella-chat-input-container">
                <div class="bella-input-wrapper">
                    <input type="text" class="bella-message-input" placeholder="Ngobrol dengan ${this.assistantName}..." maxlength="500">
                    <button class="bella-send-btn" title="Kirim">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="bella-input-hint">
                    Tekan Enter untuk kirim, Shift + Enter untuk baris baru
                </div>
            </div>
        `;

        // 获取关键元素引用
        this.messageContainer = this.chatContainer.querySelector('.bella-chat-messages');
        this.inputContainer = this.chatContainer.querySelector('.bella-chat-input-container');
        this.messageInput = this.chatContainer.querySelector('.bella-message-input');
        this.sendButton = this.chatContainer.querySelector('.bella-send-btn');
        
        document.body.appendChild(this.chatContainer);
    }

    // 创建切换按钮
    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'bella-chat-toggle';
        this.toggleButton.innerHTML = `
            <div class="bella-toggle-icon">
                <i class="fas fa-comments"></i>
            </div>
            <div class="bella-toggle-text">Chat dengan ${this.assistantName}</div>
        `;
        this.toggleButton.title = 'Buka jendela chat';
        
        document.body.appendChild(this.toggleButton);
    }

    // 创建设置面板
    createSettingsPanel() {
        this.settingsPanel = document.createElement('div');
        this.settingsPanel.className = 'bella-settings-panel';
        this.settingsPanel.innerHTML = `
            <div class="bella-settings-header">
                <h4>Pengaturan Chat</h4>
                <button class="bella-settings-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="bella-settings-content">
                <div class="bella-setting-group">
                    <label>Provider AI</label>
                    <select class="bella-provider-select">
                        <option value="gemini" selected>Google Gemini</option>
                        <option value="hyperbolic_deepseek_v3">Hyperbolic DeepSeek V3</option>
                        <option value="hyperbolic_deepseek_r1">Hyperbolic DeepSeek R1</option>
                        <option value="hyperbolic_qwen">Hyperbolic Qwen</option>
                        <option value="openrouter">OpenRouter</option>
                        <option value="openai">OpenAI GPT</option>
                        <option value="qwen">Tongyi Qianwen</option>
                        <option value="ernie">Wenxin Yiyan</option>
                        <option value="glm">Zhipu AI</option>
                        <option value="local">Model Lokal</option>
                    </select>
                </div>
                <div class="bella-setting-group bella-api-key-group" style="display: none;">
                    <label>API Key</label>
                    <input type="password" class="bella-api-key-input" placeholder="Masukkan API Key">
                    <button class="bella-api-key-save">Simpan</button>
                </div>
                <div class="bella-setting-group">
                    <label>Mode Chat</label>
                    <select class="bella-mode-select">
                        <option value="casual">Santai</option>
                        <option value="assistant">Asisten Pintar</option>
                        <option value="creative">Partner Kreatif</option>
                    </select>
                </div>
                <div class="bella-setting-group">
                    <button class="bella-clear-history">Hapus Riwayat Chat</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.settingsPanel);
    }

    // 绑定事件
    bindEvents() {
        // 切换聊天窗口
        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });

        // 最小化按钮
        this.chatContainer.querySelector('.bella-minimize-btn').addEventListener('click', () => {
            this.hide();
        });

        // 设置按钮
        this.chatContainer.querySelector('.bella-settings-btn').addEventListener('click', () => {
            this.toggleSettings();
        });

        // 发送消息
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // 输入框事件
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 输入框自动调整高度
        this.messageInput.addEventListener('input', () => {
            this.adjustInputHeight();
        });

        // 设置面板事件
        this.bindSettingsEvents();
    }

    // 绑定设置面板事件
    bindSettingsEvents() {
        // 关闭设置面板
        this.settingsPanel.querySelector('.bella-settings-close').addEventListener('click', () => {
            this.hideSettings();
        });

        // 提供商选择
        const providerSelect = this.settingsPanel.querySelector('.bella-provider-select');
        const apiKeyGroup = this.settingsPanel.querySelector('.bella-api-key-group');
        
        providerSelect.addEventListener('change', (e) => {
            const provider = e.target.value;
            if (provider === 'local' || provider === 'gemini' || 
                provider === 'hyperbolic_deepseek_v3' || 
                provider === 'hyperbolic_deepseek_r1' || 
                provider === 'hyperbolic_qwen') {
                apiKeyGroup.style.display = 'none';
            } else {
                apiKeyGroup.style.display = 'block';
            }
            
            // Trigger provider change event
            this.onProviderChange?.(provider);
        });

        // API密钥保存
        this.settingsPanel.querySelector('.bella-api-key-save').addEventListener('click', () => {
            const provider = providerSelect.value;
            const apiKey = this.settingsPanel.querySelector('.bella-api-key-input').value;
            
            if (apiKey.trim()) {
                this.onAPIKeySave?.(provider, apiKey.trim());
                this.showNotification('API Key berhasil disimpan', 'success');
            }
        });

        // 清除聊天记录
        this.settingsPanel.querySelector('.bella-clear-history').addEventListener('click', () => {
            this.clearMessages();
            this.onClearHistory?.();
            this.hideSettings();
        });
    }

    // 添加欢迎消息
    addWelcomeMessage() {
        this.addMessage('assistant', `Halo! Saya ${this.assistantName}, partner AI kamu. Senang bertemu denganmu! Ada yang ingin dibicarakan?`, true);
    }

    // 切换聊天窗口显示/隐藏
    toggle() {
        console.log('ChatInterface.toggle() 被调用');
        console.log('切换前 isVisible:', this.isVisible);
        
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
        
        console.log('切换后 isVisible:', this.isVisible);
    }

    // 显示聊天窗口
    show() {
        console.log('ChatInterface.show() 被调用');
        console.log('显示前 isVisible:', this.isVisible);
        console.log('显示前 chatContainer.className:', this.chatContainer.className);
        
        this.isVisible = true;
        this.chatContainer.classList.add('visible');
        
        console.log('显示后 isVisible:', this.isVisible);
        console.log('显示后 chatContainer.className:', this.chatContainer.className);
        console.log('chatContainer 计算样式 opacity:', window.getComputedStyle(this.chatContainer).opacity);
        console.log('chatContainer 计算样式 transform:', window.getComputedStyle(this.chatContainer).transform);
        
        this.toggleButton.classList.add('active');
        this.messageInput.focus();
        this.scrollToBottom();
    }

    // 隐藏聊天窗口
    hide() {
        this.isVisible = false;
        this.chatContainer.classList.remove('visible');
        this.toggleButton.classList.remove('active');
        this.hideSettings();
    }

    // 切换设置面板
    toggleSettings() {
        if (this.isSettingsVisible) {
            this.hideSettings();
        } else {
            this.showSettings();
        }
    }

    // 显示设置面板
    showSettings() {
        this.isSettingsVisible = true;
        this.settingsPanel.classList.add('visible');
    }

    // 隐藏设置面板
    hideSettings() {
        this.isSettingsVisible = false;
        this.settingsPanel.classList.remove('visible');
    }

    // 发送消息
    sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text) return;

        // 添加用户消息
        this.addMessage('user', text);
        
        // 清空输入框
        this.messageInput.value = '';
        this.adjustInputHeight();
        
        // 触发消息发送事件
        this.onMessageSend?.(text);
    }

    // 添加消息到聊天界面
    addMessage(role, content, isWelcome = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `bella-message bella-message-${role}`;
        
        if (isWelcome) {
            messageElement.classList.add('bella-welcome-message');
        }

        const timestamp = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageElement.innerHTML = `
            <div class="bella-message-avatar">
                ${role === 'user' ? '👤' : this.assistantAvatar}
            </div>
            <div class="bella-message-content">
                <div class="bella-message-text">${this.formatMessage(content)}</div>
                <div class="bella-message-time">${timestamp}</div>
            </div>
        `;

        this.messageContainer.appendChild(messageElement);
        this.messages.push({ role, content, timestamp: Date.now() });

        // 限制消息数量
        if (this.messages.length > this.maxMessages) {
            const oldMessage = this.messageContainer.firstChild;
            if (oldMessage) {
                this.messageContainer.removeChild(oldMessage);
            }
            this.messages.shift();
        }

        // 滚动到底部
        this.scrollToBottom();

        // 添加动画效果
        setTimeout(() => {
            messageElement.classList.add('bella-message-appear');
        }, 10);
    }

    // 格式化消息内容
    formatMessage(content) {
        // 简单的文本格式化，支持换行
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    // 显示打字指示器
    showTypingIndicator() {
        const existingIndicator = this.messageContainer.querySelector('.bella-typing-indicator');
        if (existingIndicator) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'bella-typing-indicator';
        typingElement.innerHTML = `
            <div class="bella-message-avatar">💝</div>
            <div class="bella-message-content">
                <div class="bella-typing-dots">
                    <span class="bella-typing-dot"></span>
                    <span class="bella-typing-dot"></span>
                    <span class="bella-typing-dot"></span>
                </div>
            </div>
        `;

        this.messageContainer.appendChild(typingElement);
        this.scrollToBottom();
        
        // 添加显示动画
        setTimeout(() => {
            typingElement.classList.add('bella-typing-show');
        }, 10);
    }

    // 隐藏打字指示器
    hideTypingIndicator() {
        const indicator = this.messageContainer.querySelector('.bella-typing-indicator');
        if (indicator) {
            this.messageContainer.removeChild(indicator);
        }
    }

    // 清除所有消息
    clearMessages() {
        this.messageContainer.innerHTML = '';
        this.messages = [];
        this.addWelcomeMessage();
    }

    // 滚动到底部
    scrollToBottom() {
        setTimeout(() => {
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }, 10);
    }

    // 调整输入框高度
    adjustInputHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `bella-notification bella-notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('bella-notification-show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('bella-notification-show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 检查聊天窗口是否可见
    getVisibility() {
        return this.isVisible;
    }
    
    // Update assistant name and avatar
    updateAssistant(name, avatar = '🤖') {
        this.assistantName = name;
        this.assistantAvatar = avatar;
        
        // Update header
        const titleElement = this.chatContainer.querySelector('.bella-title-text h3');
        if (titleElement) {
            titleElement.textContent = name;
        }
        
        const avatarElement = this.chatContainer.querySelector('.bella-chat-header .bella-avatar');
        if (avatarElement) {
            avatarElement.textContent = avatar;
        }
        
        // Update input placeholder
        if (this.messageInput) {
            this.messageInput.placeholder = `Ngobrol dengan ${name}...`;
        }
        
        // Update toggle button
        const toggleText = this.toggleButton.querySelector('.bella-toggle-text');
        if (toggleText) {
            toggleText.textContent = `Chat dengan ${name}`;
        }
    }

    // 设置回调函数
    onMessageSend = null;
    onProviderChange = null;
    onAPIKeySave = null;
    onClearHistory = null;
}

// ES6模块导出
export { ChatInterface };