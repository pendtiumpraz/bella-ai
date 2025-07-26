// Live2D Model Loader with path fixing
export class Live2DModelLoader {
    constructor() {
        this.modelCache = new Map();
    }
    
    async loadModel(modelPath) {
        try {
            // Load model JSON
            const response = await fetch(modelPath);
            const modelJson = await response.json();
            
            // Fix paths to be relative
            const modelDir = modelPath.substring(0, modelPath.lastIndexOf('/') + 1);
            const fixedModel = this.fixModelPaths(modelJson, modelDir);
            
            return fixedModel;
        } catch (error) {
            console.error('Failed to load Live2D model:', error);
            throw error;
        }
    }
    
    fixModelPaths(modelJson, modelDir) {
        const fixed = { ...modelJson };
        
        // Fix model path
        if (fixed.model) {
            const modelFile = this.extractFileName(fixed.model);
            fixed.model = modelDir + modelFile;
        }
        
        // Fix texture paths
        if (fixed.textures && Array.isArray(fixed.textures)) {
            fixed.textures = fixed.textures.map(texture => {
                if (texture.includes('/')) {
                    // Extract just the texture folder and filename
                    const match = texture.match(/([^/]+\/texture_\d+\.png)$/);
                    if (match) {
                        return modelDir + match[1];
                    }
                }
                return modelDir + texture;
            });
        }
        
        // Fix physics path
        if (fixed.physics) {
            const physicsFile = this.extractFileName(fixed.physics);
            fixed.physics = modelDir + physicsFile;
        }
        
        // Fix motions paths
        if (fixed.motions) {
            const fixedMotions = {};
            for (const [key, motionGroup] of Object.entries(fixed.motions)) {
                fixedMotions[key] = motionGroup.map(motion => {
                    if (motion.file) {
                        motion.file = modelDir + 'motions/' + this.extractFileName(motion.file);
                    }
                    return motion;
                });
            }
            fixed.motions = fixedMotions;
        }
        
        // Fix expressions paths
        if (fixed.expressions) {
            fixed.expressions = fixed.expressions.map(expr => {
                if (expr.file) {
                    expr.file = modelDir + 'expressions/' + this.extractFileName(expr.file);
                }
                return expr;
            });
        }
        
        console.log('Fixed model paths:', fixed);
        return fixed;
    }
    
    extractFileName(fullPath) {
        return fullPath.split('/').pop().split('\\').pop();
    }
}