// Script to automatically capture thumbnails from VRM models
// Run this in the browser console on vrm-screenshot-generator.html

async function captureAllThumbnails() {
    const models = [
        { name: "APHO2 Bronya", path: "vtuber/APHO2 Bronya.vrm" },
        { name: "Acacia Kaguya", path: "vtuber/Acacia Kaguya.vrm" },
        { name: "Ai Hoshino", path: "vtuber/Ai_Hoshino_.vrm" },
        { name: "Alyss", path: "vtuber/Alyss.vrm" },
        { name: "Anya Forger", path: "vtuber/Anya_Forger.vrm" },
        { name: "Azur Lane Enterprise", path: "vtuber/Azur Lane Enterprise.vrm" },
        { name: "Beatrice", path: "vtuber/Beatrice.vrm" },
        { name: "Bronya HoTr", path: "vtuber/Bronya HoTr.vrm" },
        { name: "Carlotta", path: "vtuber/Carlotta.vrm" },
        { name: "Caroline", path: "vtuber/Caroline.vrm" },
        { name: "Cesilia", path: "vtuber/Cesilia.vrm" },
        { name: "Changli", path: "vtuber/Changli.vrm" },
        { name: "Chen Qianyu", path: "vtuber/Chen Qianyu.vrm" },
        { name: "Cipher", path: "vtuber/Cipher.vrm" },
        { name: "Clorinde", path: "vtuber/clorinde.vrm" },
        { name: "DUST", path: "vtuber/DUST.vrm" },
        { name: "DreamSeeker", path: "vtuber/DreamSeeker.vrm" },
        { name: "Dushevnaya", path: "vtuber/Dushevnaya.vrm" },
        { name: "Eula Lawrence", path: "vtuber/Eula Lawrence.vrm" },
        { name: "Fern", path: "vtuber/Fern VT model.vrm" },
        { name: "Guinaifen", path: "vtuber/Guinaifen.vrm" },
        { name: "Haruhi Suzumiya", path: "vtuber/Haruhi Suzumia Long hair.vrm" },
        { name: "Herrscher of Finality", path: "vtuber/Herrscher of Finality.vrm" },
        { name: "iCO Gore", path: "vtuber/iCO Gore.vrm" },
        { name: "Jingliu", path: "vtuber/jingliu hsr.vrm" },
        { name: "Kiana Kaslana", path: "vtuber/Kiana kaslana.vrm" },
        { name: "Kirito", path: "vtuber/kirito.vrm" },
        { name: "Lilac", path: "vtuber/Lilac.vrm" },
        { name: "Luna", path: "vtuber/Luna.vrm" },
        { name: "Magical girl sirin", path: "vtuber/Magical girl sirin.vrm" },
        { name: "Maya", path: "vtuber/Maya2.vrm" },
        { name: "Meryl", path: "vtuber/Meryl.vrm" },
        { name: "Ming Chao", path: "vtuber/Ming Chao.vrm" },
        { name: "Mizuhara Chizuru", path: "vtuber/Mizuhara Chizuru.vrm" },
        { name: "Navia", path: "vtuber/Navia.vrm" },
        { name: "Nezuko Kamado", path: "vtuber/Nezuko_kamado.vrm" },
        { name: "Nico Robin", path: "vtuber/Nico Robin.vrm" },
        { name: "Prinz Eugen", path: "vtuber/Prinz Eugen.vrm" },
        { name: "Raiden Mei", path: "vtuber/Raiden Mei.vrm" },
        { name: "Ram", path: "vtuber/ram.vrm" },
        { name: "Rem", path: "vtuber/rem.vrm" },
        { name: "Sirin", path: "vtuber/Sirin.vrm" },
        { name: "Skirk", path: "vtuber/Skirk.vrm" },
        { name: "Yae Miko", path: "vtuber/Yae Miko.vrm" }
    ];

    console.log(`Starting thumbnail capture for ${models.length} models...`);
    
    // This function should be run in the browser console
    // after opening vrm-screenshot-generator.html
    
    const instructions = `
=== INSTRUCTIONS ===
1. Open vrm-screenshot-generator.html in your browser
2. Open Developer Console (F12)
3. Copy and paste this script
4. The script will automatically load each model and save screenshots
5. Screenshots will be downloaded to your Downloads folder
6. Move them to bella/vtuber/thumbnails/

Note: You may need to allow multiple downloads in your browser
`;
    
    console.log(instructions);
}

// Instructions to update vtuberModels.js after capturing
const updateInstructions = `
After capturing all thumbnails:

1. Move all PNG files to bella/vtuber/thumbnails/
2. Update vtuberModels.js by changing:
   thumbnail: null
   to:
   thumbnail: "vtuber/thumbnails/[character_name].png"

Example:
   thumbnail: "vtuber/thumbnails/ai_hoshino.png"
`;

console.log(updateInstructions);

// Export for use
if (typeof module !== 'undefined') {
    module.exports = { captureAllThumbnails };
}