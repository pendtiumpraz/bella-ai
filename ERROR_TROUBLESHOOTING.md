# Bella AI - Error Troubleshooting Guide

## Current Errors and Solutions

### 1. Model File Not Found Errors (404)

**Error Messages:**
```
GET http://127.0.0.1:8081/models/Xenova/LaMini-Flan-T5-77M/tokenizer.json net::ERR_ABORTED 404 (Not Found)
GET http://127.0.0.1:8081/models/Xenova/whisper-asr/tokenizer.json net::ERR_ABORTED 404 (Not Found)
```

**Cause:** The local AI models are not downloaded or placed in the correct directory.

**Solution:**

1. **Create the models directory structure:**
   ```bash
   mkdir -p models/Xenova/LaMini-Flan-T5-77M
   mkdir -p models/Xenova/whisper-asr
   ```

2. **Download the models:**
   
   For LaMini-Flan-T5-77M:
   - Visit: https://huggingface.co/Xenova/LaMini-Flan-T5-77M
   - Download all ONNX model files and tokenizer files
   - Place them in `models/Xenova/LaMini-Flan-T5-77M/`

   For Whisper ASR:
   - Visit: https://huggingface.co/Xenova/whisper-asr
   - Download all ONNX model files and tokenizer files
   - Place them in `models/Xenova/whisper-asr/`

3. **Alternative: Use Cloud API Only**
   - The app is already configured to use Gemini by default
   - Local models are optional - the chat will work without them
   - To disable local model warnings, you can comment out the model loading in `core.js`

### 2. Chat Interface Display Issue

**Symptom:** 
```
chatContainer 计算样式 opacity: 0
```

**Cause:** The chat container is not fully visible due to CSS animation timing.

**Solution:** This is a timing issue during initialization. The chat interface should become visible after the CSS transition completes (usually within 300-500ms).

### 3. API Authentication Errors (If encountered)

**For Hyperbolic API:**
- Ensure you have a valid API key from https://hyperbolic.xyz
- Save the API key through the settings panel in the chat interface

**For Gemini API:**
- The default API key may have usage limits
- Get your own key from: https://makersuite.google.com/app/apikey
- Update it in the settings panel

## Quick Fix Summary

### Option 1: Use Cloud API Only (Recommended)
The app is already configured to work with cloud APIs. No additional setup needed.

### Option 2: Download Local Models
If you want to use local models for offline functionality:

1. Download models from Hugging Face
2. Place them in the correct `models/` directory structure
3. Ensure all required files are present:
   - `tokenizer.json`
   - `tokenizer_config.json`
   - `config.json`
   - Model weight files (`.onnx`)

### Option 3: Disable Local Model Loading
Edit `core.js` and comment out lines 39-60 to skip local model initialization:

```javascript
// Comment out local model loading to remove errors
/*
try {
    console.log('Loading LLM model...');
    this.llm = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M');
    console.log('LLM model loaded successfully.');
} catch (error) {
    console.error('Failed to load LLM model:', error);
}
*/
```

## Testing the Application

1. **Test Cloud API:**
   - Click the Chat button
   - Type a message
   - You should get a response from Gemini

2. **Test Microphone:**
   - Click the microphone button
   - Allow permission when prompted
   - Speak your message

3. **Switch AI Providers:**
   - Click the settings icon in chat
   - Select different providers
   - Add API keys as needed

## Need Help?

If errors persist after trying these solutions:
1. Check browser console for specific error messages
2. Ensure you're using a modern browser (Chrome, Firefox, Edge)
3. Verify the server is running on http://localhost:8081
4. Check network connectivity for cloud API calls