// Fix Live2D model paths
const fs = require('fs');
const path = require('path');

// Function to fix paths in model.json
function fixModelJson(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        const modelDir = path.basename(path.dirname(filePath));
        const modelName = path.basename(filePath, '.model.json');
        
        // Fix model path
        if (data.model && data.model.includes(':/')) {
            data.model = modelName + '.moc';
        }
        
        // Fix texture paths
        if (data.textures) {
            data.textures = data.textures.map(texture => {
                if (texture.includes(':/')) {
                    return modelName + '.2048/texture_00.png';
                }
                return texture;
            });
        }
        
        // Fix physics path
        if (data.physics && data.physics.includes(':/')) {
            data.physics = modelName + '.physics.json';
        }
        
        // Write back
        fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'));
        console.log('Fixed:', filePath);
        
    } catch (error) {
        console.error('Error fixing', filePath, ':', error.message);
    }
}

// Fix all model.json files
const modelsToFix = [
    'vtuber/1263521352/monika/monika.model.json',
    'vtuber/1175870452/Kurama_Koharu/Kurama_Koharu.model.json',
    'vtuber/1251173723/Nagisa_Shiota/nagisa_shiota.model.json',
    'vtuber/1253260612/Ritsu/ritsu.model.json',
    'vtuber/1269517423/Karma_Akabane/karma_akabane.model.json',
    'vtuber/1299061480/akai_haato/akai_haato.model.json',
    'vtuber/1355968422/monika_talk/monika_talk.model.json',
    'vtuber/1355983025/tsunomaki_watame/tsunomaki_watame.model.json',
    'vtuber/1356086603/Nagisa_Shiota_talk/nagisa_shiota_talk.model.json',
    'vtuber/1399305354/monika_blink/monika_blink.model.json'
];

modelsToFix.forEach(modelPath => {
    const fullPath = path.join(__dirname, modelPath);
    if (fs.existsSync(fullPath)) {
        fixModelJson(fullPath);
    }
});

console.log('Done fixing model paths!');
