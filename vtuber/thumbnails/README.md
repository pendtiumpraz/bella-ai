# VRM Model Thumbnails Guide

This folder is for storing thumbnail images for VRM models.

## How to Add Thumbnails

1. **Download thumbnail images** from VRoid Hub or take screenshots of the models
2. **Save images** in this folder with descriptive names (e.g., `ai_hoshino.jpg`, `anya_forger.png`)
3. **Update vtuberModels.js** to link thumbnails:
   ```javascript
   {
       name: "Ai Hoshino",
       path: "vtuber/Ai_Hoshino_.vrm",
       type: "VRM",
       description: "Ai Hoshino dari Oshi no Ko",
       thumbnail: "vtuber/thumbnails/ai_hoshino.jpg" // Update this line
   }
   ```

## Recommended Image Format
- Format: JPG or PNG
- Size: 400x400 pixels (square)
- File size: Under 200KB for fast loading

## Finding Thumbnails on VRoid Hub
1. Search for the model name on https://hub.vroid.com/
2. Find the matching model
3. Right-click on the preview image and save it
4. Rename the file to match the model name

## Example Thumbnail URLs
When you find models on VRoid Hub, the thumbnail URLs usually follow this pattern:
- https://hub.vroid.com/characters/[character-id]/models/[model-id]/thumbnail.jpg

Note: Some models may require you to be logged in to VRoid Hub to access thumbnails.