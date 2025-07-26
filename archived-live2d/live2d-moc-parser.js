// Simple Live2D MOC Parser
// This attempts to extract basic structure from .moc files

export class SimpleMOCParser {
    constructor() {
        this.parameters = {};
        this.parts = {};
        this.drawables = [];
    }
    
    async parseMOCFile(mocPath) {
        try {
            const response = await fetch(mocPath);
            const buffer = await response.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            
            // MOC files start with "moc" magic bytes
            if (bytes[0] !== 0x6D || bytes[1] !== 0x6F || bytes[2] !== 0x63) {
                throw new Error('Not a valid MOC file');
            }
            
            // Extract strings (parameters and parts names)
            const strings = this.extractStrings(bytes);
            
            // Categorize strings
            strings.forEach(str => {
                if (str.startsWith('PARAM_')) {
                    this.parameters[str] = {
                        name: str,
                        value: 0,
                        min: -1,
                        max: 1
                    };
                } else if (str.startsWith('PARTS_')) {
                    this.parts[str] = {
                        name: str,
                        visible: true
                    };
                }
            });
            
            // Create basic drawable structure based on common patterns
            this.createDrawableStructure();
            
            return {
                parameters: this.parameters,
                parts: this.parts,
                drawables: this.drawables
            };
            
        } catch (error) {
            console.error('Failed to parse MOC file:', error);
            throw error;
        }
    }
    
    extractStrings(bytes) {
        const strings = [];
        let currentString = '';
        
        for (let i = 0; i < bytes.length; i++) {
            const byte = bytes[i];
            
            // ASCII printable characters
            if (byte >= 32 && byte <= 126) {
                currentString += String.fromCharCode(byte);
            } else {
                if (currentString.length > 3) {
                    strings.push(currentString);
                }
                currentString = '';
            }
        }
        
        return [...new Set(strings)]; // Remove duplicates
    }
    
    createDrawableStructure() {
        // Based on common Live2D structure, create basic drawable layout
        // This is an approximation since we can't fully parse the binary format
        
        const commonDrawables = [
            // Background/Body
            { id: 'D_BODY', textureIndex: 0, vertexPositions: this.createBodyVertices() },
            
            // Face
            { id: 'D_FACE', textureIndex: 0, vertexPositions: this.createFaceVertices() },
            
            // Eyes
            { id: 'D_EYE_L', textureIndex: 0, vertexPositions: this.createEyeVertices('left') },
            { id: 'D_EYE_R', textureIndex: 0, vertexPositions: this.createEyeVertices('right') },
            
            // Mouth
            { id: 'D_MOUTH', textureIndex: 0, vertexPositions: this.createMouthVertices() },
            
            // Hair
            { id: 'D_HAIR_FRONT', textureIndex: 0, vertexPositions: this.createHairVertices('front') },
            { id: 'D_HAIR_SIDE', textureIndex: 0, vertexPositions: this.createHairVertices('side') },
            { id: 'D_HAIR_BACK', textureIndex: 0, vertexPositions: this.createHairVertices('back') }
        ];
        
        this.drawables = commonDrawables;
    }
    
    // Create approximate vertex positions for body parts
    createBodyVertices() {
        return {
            baseX: 0.5,
            baseY: 0.7,
            width: 0.6,
            height: 0.6,
            uvX: 0,
            uvY: 0.4,
            uvWidth: 1,
            uvHeight: 0.6
        };
    }
    
    createFaceVertices() {
        return {
            baseX: 0.5,
            baseY: 0.3,
            width: 0.3,
            height: 0.3,
            uvX: 0.3,
            uvY: 0,
            uvWidth: 0.4,
            uvHeight: 0.4
        };
    }
    
    createEyeVertices(side) {
        const xOffset = side === 'left' ? -0.08 : 0.08;
        return {
            baseX: 0.5 + xOffset,
            baseY: 0.28,
            width: 0.08,
            height: 0.06,
            uvX: side === 'left' ? 0.35 : 0.55,
            uvY: 0.2,
            uvWidth: 0.1,
            uvHeight: 0.08
        };
    }
    
    createMouthVertices() {
        return {
            baseX: 0.5,
            baseY: 0.38,
            width: 0.1,
            height: 0.05,
            uvX: 0.45,
            uvY: 0.35,
            uvWidth: 0.1,
            uvHeight: 0.05
        };
    }
    
    createHairVertices(part) {
        const configs = {
            front: { x: 0.5, y: 0.15, uvX: 0.2, uvY: 0 },
            side: { x: 0.5, y: 0.25, uvX: 0, uvY: 0 },
            back: { x: 0.5, y: 0.2, uvX: 0.6, uvY: 0 }
        };
        
        const config = configs[part];
        return {
            baseX: config.x,
            baseY: config.y,
            width: 0.4,
            height: 0.3,
            uvX: config.uvX,
            uvY: config.uvY,
            uvWidth: 0.4,
            uvHeight: 0.3
        };
    }
}