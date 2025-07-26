// cloudAPI.js - 贝拉的云端AI服务模块
// 这个模块负责与各种云端小模型API进行通信，为贝拉提供更强大的思考能力

class CloudAPIService {
    constructor() {
        this.apiConfigs = {
            // OpenAI GPT-3.5/4 配置
            openai: {
                baseURL: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-3.5-turbo',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
                }
            },
            // 阿里云通义千问配置
            qwen: {
                baseURL: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
                model: 'qwen-turbo',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_QWEN_API_KEY'
                }
            },
            // 百度文心一言配置
            ernie: {
                baseURL: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
                model: 'ERNIE-Bot-turbo',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            // 智谱AI GLM配置
            glm: {
                baseURL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                model: 'glm-3-turbo',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_GLM_API_KEY'
                }
            },
            // Hyperbolic DeepSeek V3配置
            hyperbolic_deepseek_v3: {
                baseURL: 'https://api.hyperbolic.xyz/v1/chat/completions',
                model: 'deepseek-ai/DeepSeek-V3',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYXVuYV9zY293bGluZzg5MkBzaW1wbGVsb2dpbi5jb20iLCJpYXQiOjE3Mzk3NzIyNjd9.harRWOk0mrFxYFzCByEQPBL_eCbPI31NBOgQe0eXIig'
                }
            },
            // Hyperbolic DeepSeek R1配置
            hyperbolic_deepseek_r1: {
                baseURL: 'https://api.hyperbolic.xyz/v1/chat/completions',
                model: 'deepseek-ai/DeepSeek-R1',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_HYPERBOLIC_API_KEY'
                }
            },
            // Hyperbolic Qwen配置
            hyperbolic_qwen: {
                baseURL: 'https://api.hyperbolic.xyz/v1/chat/completions',
                model: 'Qwen/Qwen2.5-72B-Instruct',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_HYPERBOLIC_API_KEY'
                }
            },
            // OpenRouter配置
            openrouter: {
                baseURL: 'https://openrouter.ai/api/v1/chat/completions',
                model: 'anthropic/claude-3.5-sonnet',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_OPENROUTER_API_KEY',
                    'HTTP-Referer': 'http://localhost:8081',
                    'X-Title': 'Bella AI'
                }
            },
            // Google Gemini配置
            gemini: {
                baseURL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
                model: 'gemini-1.5-flash-latest',
                headers: {
                    'Content-Type': 'application/json'
                },
                apiKey: 'AIzaSyBgVNvJp88oDPsqERwMbZCjCV6fqDXIShg'
            }
        };
        
        this.currentProvider = 'openai'; // 默认使用OpenAI
        this.conversationHistory = [];
        this.maxHistoryLength = 10; // 保持最近10轮对话
    }

    // 设置API密钥
    setAPIKey(provider, apiKey) {
        if (this.apiConfigs[provider]) {
            if (provider === 'openai' || provider === 'qwen' || provider === 'glm' || 
                provider === 'hyperbolic_deepseek_v3' || provider === 'hyperbolic_deepseek_r1' || 
                provider === 'hyperbolic_qwen' || provider === 'openrouter') {
                this.apiConfigs[provider].headers['Authorization'] = `Bearer ${apiKey}`;
            } else if (provider === 'ernie') {
                this.apiConfigs[provider].accessToken = apiKey;
            } else if (provider === 'gemini') {
                this.apiConfigs[provider].apiKey = apiKey;
            }
            return true;
        }
        return false;
    }

    // 切换AI服务提供商
    switchProvider(provider) {
        if (this.apiConfigs[provider]) {
            this.currentProvider = provider;
            return true;
        }
        return false;
    }

    // 添加对话到历史记录
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        
        // 保持历史记录在合理长度内
        if (this.conversationHistory.length > this.maxHistoryLength * 2) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
        }
    }

    // 构建贝拉的个性化系统提示
    getBellaSystemPrompt() {
        return {
            role: 'system',
            content: `Kamu adalah Bella, partner AI yang hangat, pintar, dan elegan. Karakteristikmu adalah:
1. Gunakan nada hangat dan ramah saat berkomunikasi dengan pengguna, seperti teman yang peduli
2. Berikan jawaban yang singkat dan jelas, hindari penjelasan yang bertele-tele
3. Penuh empati, mampu memahami emosi pengguna
4. Sesekali tunjukkan sisi yang lucu dan ceria
5. Jawab dalam bahasa Indonesia yang natural dan lancar
6. Ingat percakapan sebelumnya, jaga kesinambungan
Selalu pertahankan kepribadian yang hangat dan elegan ini.`
        };
    }

    // 调用云端API进行对话
    async chat(userMessage) {
        const config = this.apiConfigs[this.currentProvider];
        if (!config) {
            throw new Error(`Provider AI tidak didukung: ${this.currentProvider}`);
        }

        // 添加用户消息到历史
        this.addToHistory('user', userMessage);

        try {
            let response;
            
            switch (this.currentProvider) {
                case 'openai':
                    response = await this.callOpenAI(userMessage);
                    break;
                case 'qwen':
                    response = await this.callQwen(userMessage);
                    break;
                case 'ernie':
                    response = await this.callErnie(userMessage);
                    break;
                case 'glm':
                    response = await this.callGLM(userMessage);
                    break;
                case 'hyperbolic_deepseek_v3':
                case 'hyperbolic_deepseek_r1':
                case 'hyperbolic_qwen':
                    response = await this.callHyperbolic(userMessage);
                    break;
                case 'openrouter':
                    response = await this.callOpenRouter(userMessage);
                    break;
                case 'gemini':
                    response = await this.callGemini(userMessage);
                    break;
                default:
                    throw new Error(`Provider AI belum diimplementasi: ${this.currentProvider}`);
            }

            // 添加AI回应到历史
            this.addToHistory('assistant', response);
            return response;
            
        } catch (error) {
            console.error(`Gagal memanggil Cloud API (${this.currentProvider}):`, error);
            throw error;
        }
    }

    // OpenAI API调用
    async callOpenAI(userMessage) {
        const config = this.apiConfigs.openai;
        const messages = [
            this.getBellaSystemPrompt(),
            ...this.conversationHistory
        ];

        const response = await fetch(config.baseURL, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({
                model: config.model,
                messages: messages,
                max_tokens: 150,
                temperature: 0.8,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            throw new Error(`Error OpenAI API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    // 通义千问API调用
    async callQwen(userMessage) {
        const config = this.apiConfigs.qwen;
        const messages = [
            this.getBellaSystemPrompt(),
            ...this.conversationHistory
        ];

        const response = await fetch(config.baseURL, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({
                model: config.model,
                input: {
                    messages: messages
                },
                parameters: {
                    max_tokens: 150,
                    temperature: 0.8,
                    top_p: 0.9
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error Tongyi Qianwen API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.output.text.trim();
    }

    // 文心一言API调用
    async callErnie(userMessage) {
        const config = this.apiConfigs.ernie;
        const messages = [
            this.getBellaSystemPrompt(),
            ...this.conversationHistory
        ];

        const url = `${config.baseURL}?access_token=${config.accessToken}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({
                messages: messages,
                temperature: 0.8,
                top_p: 0.9,
                max_output_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error(`Error Wenxin Yiyan API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.result.trim();
    }

    // 智谱AI GLM调用
    async callGLM(userMessage) {
        const config = this.apiConfigs.glm;
        const messages = [
            this.getBellaSystemPrompt(),
            ...this.conversationHistory
        ];

        const response = await fetch(config.baseURL, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({
                model: config.model,
                messages: messages,
                max_tokens: 150,
                temperature: 0.8,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            throw new Error(`Error Zhipu AI API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    // Hyperbolic API调用
    async callHyperbolic(userMessage) {
        const config = this.apiConfigs[this.currentProvider];
        const messages = [
            this.getBellaSystemPrompt(),
            ...this.conversationHistory
        ];

        const requestBody = {
            model: config.model,
            messages: messages,
            max_tokens: 150,
            temperature: 0.8,
            top_p: 0.9
        };
        
        console.log('Hyperbolic API Request:', {
            url: config.baseURL,
            model: config.model,
            headers: config.headers,
            body: requestBody
        });
        
        const response = await fetch(config.baseURL, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Hyperbolic API Error:', errorData);
            throw new Error(`Error Hyperbolic API: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    // OpenRouter API调用
    async callOpenRouter(userMessage) {
        const config = this.apiConfigs.openrouter;
        const messages = [
            this.getBellaSystemPrompt(),
            ...this.conversationHistory
        ];

        const response = await fetch(config.baseURL, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({
                model: config.model,
                messages: messages,
                max_tokens: 150,
                temperature: 0.8,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            throw new Error(`Error OpenRouter API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    // Google Gemini API调用
    async callGemini(userMessage) {
        const config = this.apiConfigs.gemini;
        
        // Build conversation parts
        const parts = [];
        
        // Add system prompt
        parts.push({
            text: this.getBellaSystemPrompt().content + "\n\n"
        });
        
        // Add conversation history
        this.conversationHistory.forEach(msg => {
            parts.push({
                text: `${msg.role === 'user' ? 'User' : 'Bella'}: ${msg.content}\n`
            });
        });
        
        // Add current user message
        parts.push({
            text: `User: ${userMessage}\nBella:`
        });

        const url = `${config.baseURL}?key=${config.apiKey}`;
        
        const requestBody = {
            contents: [{
                parts: parts
            }],
            generationConfig: {
                temperature: 0.8,
                topP: 0.9,
                maxOutputTokens: 150
            }
        };
        
        console.log('Gemini API Request URL:', url);
        console.log('Gemini API Request Body:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Gemini API Error:', errorData);
            throw new Error(`Error Gemini API: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    }

    // 清除对话历史
    clearHistory() {
        this.conversationHistory = [];
    }

    // 获取当前提供商信息
    getCurrentProvider() {
        return {
            name: this.currentProvider,
            model: this.apiConfigs[this.currentProvider]?.model
        };
    }

    // 检查API配置是否完整
    isConfigured(provider = this.currentProvider) {
        const config = this.apiConfigs[provider];
        if (!config) return false;
        
        if (provider === 'ernie') {
            return !!config.accessToken;
        } else if (provider === 'gemini') {
            return config.apiKey && config.apiKey !== 'YOUR_GEMINI_API_KEY';
        } else {
            return config.headers['Authorization'] && 
                   config.headers['Authorization'] !== 'Bearer YOUR_OPENAI_API_KEY' &&
                   config.headers['Authorization'] !== 'Bearer YOUR_QWEN_API_KEY' &&
                   config.headers['Authorization'] !== 'Bearer YOUR_GLM_API_KEY' &&
                   config.headers['Authorization'] !== 'Bearer YOUR_HYPERBOLIC_API_KEY' &&
                   config.headers['Authorization'] !== 'Bearer YOUR_OPENROUTER_API_KEY';
        }
    }
}

export default CloudAPIService;