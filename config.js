// Bella AI Configuration Override
// Use this to disable local model loading on shared hosting

window.BELLA_CONFIG = {
    // Skip local model loading
    skipLocalModels: true,
    
    // Default to Cloud API
    useCloudAPI: true,
    
    // Default provider
    defaultProvider: 'gemini',
    
    // Disable model download attempts
    disableModelDownload: true
};

console.log('Bella AI Config: Using Cloud API, skipping local models');