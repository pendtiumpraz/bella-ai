// core.js - Bella's Brain (v3)
// 贝拉的核心AI逻辑，支持本地模型和云端API的混合架构

import { pipeline, env, AutoTokenizer, AutoModelForSpeechSeq2Seq } from './vendor/transformers.js';
import CloudAPIService from './cloudAPI.js';

// 本地模型配置
env.allowLocalModels = true;
env.useBrowserCache = false;
env.allowRemoteModels = false;
env.backends.onnx.logLevel = 'verbose';
env.localModelPath = './models/';


class BellaAI {
    static instance = null;

    static async getInstance() {
        if (this.instance === null) {
            this.instance = new BellaAI();
            await this.instance.init();
        }
        return this.instance;
    }

    constructor() {
        this.cloudAPI = new CloudAPIService();
        this.useCloudAPI = true; // 默认使用云端API
        this.currentMode = 'casual'; // 聊天模式：casual, assistant, creative
        
        // 设置默认为Gemini（已有API key）
        this.cloudAPI.switchProvider('gemini');
    }

    async init() {
        console.log('Initializing Bella\'s core AI...');
        
        // 优先加载LLM模型（聊天功能）
        try {
            console.log('Loading LLM model...');
            this.llm = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M');
            console.log('LLM model loaded successfully.');
        } catch (error) {
            console.error('Failed to load LLM model:', error);
            // LLM加载失败，但不阻止初始化
        }
        
        // 尝试加载ASR模型（语音识别功能）
        try {
            console.log('Loading ASR model...');
            const modelPath = 'Xenova/whisper-asr';
            const tokenizer = await AutoTokenizer.from_pretrained(modelPath);
            const model = await AutoModelForSpeechSeq2Seq.from_pretrained(modelPath);
            this.asr = await pipeline('automatic-speech-recognition', model, { tokenizer });
            console.log('ASR model loaded successfully.');
        } catch (error) {
            console.warn('ASR model failed to load, voice recognition will be disabled:', error);
            // ASR加载失败，但不影响聊天功能
            this.asr = null;
        }

        // TTS模型暂时禁用
        // try {
        //     console.log('Loading TTS model...');
        //     this.tts = await pipeline('text-to-speech', 'Xenova/speecht5_tts', { quantized: false });
        //     console.log('TTS model loaded successfully.');
        // } catch (error) {
        //     console.warn('TTS model failed to load, voice synthesis will be disabled:', error);
        //     this.tts = null;
        // }

        console.log('Bella\'s core AI initialized successfully.');
    }

    async think(prompt) {
        try {
            // 如果启用了云端API且配置正确，优先使用云端服务
            if (this.useCloudAPI && this.cloudAPI.isConfigured()) {
                return await this.thinkWithCloudAPI(prompt);
            }
            
            // 否则使用本地模型
            return await this.thinkWithLocalModel(prompt);
            
        } catch (error) {
            console.error('Error dalam proses berpikir:', error);
            
            // 如果云端API失败，尝试降级到本地模型
            if (this.useCloudAPI) {
                console.log('Cloud API gagal, beralih ke model lokal...');
                try {
                    return await this.thinkWithLocalModel(prompt);
                } catch (localError) {
                    console.error('Model lokal juga gagal:', localError);
                }
            }
            
            return this.getErrorResponse();
        }
    }

    // 使用云端API进行思考
    async thinkWithCloudAPI(prompt) {
        const enhancedPrompt = this.enhancePromptForMode(prompt);
        return await this.cloudAPI.chat(enhancedPrompt);
    }

    // 使用本地模型进行思考
    async thinkWithLocalModel(prompt) {
        if (!this.llm) {
            return "Aku masih belajar cara berpikir, tunggu sebentar...";
        }
        
        const bellaPrompt = this.enhancePromptForMode(prompt, true);
        
        const result = await this.llm(bellaPrompt, {
            max_new_tokens: 50,
            temperature: 0.8,
            top_k: 40,
            do_sample: true,
        });
        
        // 清理生成的文本
        let response = result[0].generated_text;
        if (response.includes(bellaPrompt)) {
            response = response.replace(bellaPrompt, '').trim();
        }
        
        return response || "Aku perlu mikir lagi...";
    }

    // 根据模式增强提示词
    enhancePromptForMode(prompt, isLocal = false) {
        const modePrompts = {
            casual: isLocal ? 
                `Sebagai Bella, partner AI yang hangat dan lucu, jawab dengan nada santai dan ramah: ${prompt}` :
                `Tolong jawab dengan nada hangat dan santai, seperti teman yang peduli. Tetap singkat dan menarik: ${prompt}`,
            assistant: isLocal ?
                `Sebagai asisten pintar Bella, berikan bantuan yang berguna dan akurat: ${prompt}` :
                `Sebagai asisten AI yang profesional tapi hangat, berikan informasi dan saran yang akurat dan berguna: ${prompt}`,
            creative: isLocal ?
                `Sebagai partner AI kreatif Bella, gunakan imajinasi untuk menjawab: ${prompt}` :
                `Gunakan kreativitas dan imajinasi, berikan respons dan ide yang menarik dan unik: ${prompt}`
        };
        
        return modePrompts[this.currentMode] || modePrompts.casual;
    }

    // 获取错误回应
    getErrorResponse() {
        const errorResponses = [
            "Maaf, aku agak bingung sekarang, biar aku rapikan dulu pikiranku...",
            "Hmm... aku perlu mikir lagi, tunggu sebentar ya.",
            "Pikiranku agak kacau, beri aku waktu sebentar untuk merapikannya.",
            "Biar aku susun lagi kata-kataku, tunggu sebentar."
        ];
        
        return errorResponses[Math.floor(Math.random() * errorResponses.length)];
    }

    // 设置聊天模式
    setChatMode(mode) {
        if (['casual', 'assistant', 'creative'].includes(mode)) {
            this.currentMode = mode;
            return true;
        }
        return false;
    }

    // 切换AI服务提供商
    switchProvider(provider) {
        if (provider === 'local') {
            this.useCloudAPI = false;
            return true;
        } else {
            const success = this.cloudAPI.switchProvider(provider);
            if (success) {
                this.useCloudAPI = true;
            }
            return success;
        }
    }

    // 设置API密钥
    setAPIKey(provider, apiKey) {
        return this.cloudAPI.setAPIKey(provider, apiKey);
    }

    // 清除对话历史
    clearHistory() {
        this.cloudAPI.clearHistory();
    }

    // 获取当前配置信息
    getCurrentConfig() {
        return {
            useCloudAPI: this.useCloudAPI,
            provider: this.useCloudAPI ? this.cloudAPI.getCurrentProvider() : { name: 'local', model: 'LaMini-Flan-T5-77M' },
            mode: this.currentMode,
            isConfigured: this.useCloudAPI ? this.cloudAPI.isConfigured() : true
        };
    }

    async listen(audioData) {
        if (!this.asr) {
            throw new Error('语音识别模型未初始化');
        }
        const result = await this.asr(audioData);
        return result.text;
    }

    async speak(text) {
        if (!this.tts) {
            throw new Error('语音合成模型未初始化');
        }
        // We need speaker embeddings for SpeechT5
        const speaker_embeddings = 'models/Xenova/speecht5_tts/speaker_embeddings.bin';
        const result = await this.tts(text, {
            speaker_embeddings,
        });
        return result.audio;
    }

    // 获取云端API服务实例（用于外部访问）
    getCloudAPIService() {
        return this.cloudAPI;
    }
}

// ES6模块导出
export { BellaAI };