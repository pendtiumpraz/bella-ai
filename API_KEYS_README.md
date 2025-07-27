# API Keys Setup

## Using API Keys

Bella AI now supports automatic API key loading. To use your API keys:

1. **Create api-keys.js file** (this file is gitignored for security):

```javascript
// api-keys.js
window.BELLA_API_KEYS = {
    groq: 'YOUR_GROQ_API_KEY',
    openai: 'YOUR_OPENAI_API_KEY',
    gemini: 'YOUR_GEMINI_API_KEY',
    // Add other providers as needed
};
```

2. **Replace YOUR_*_API_KEY with your actual API keys**

3. **The keys will be automatically loaded when Bella starts**

## Important Security Notes

- **NEVER commit api-keys.js to git**
- The file is already in .gitignore
- Keep your API keys private
- Use environment variables in production

## Alternative: Manual Setup

You can also set API keys manually through the Settings UI in the chat interface.

## Default Provider

Bella is configured to use Groq as the default provider (fast and free tier available).