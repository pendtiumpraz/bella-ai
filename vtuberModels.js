// vtuberModels.js - VRM Models Only

export const vtuberModels = {
    vrm: [
        // Galih Series
        {
            name: "Galih Hoodie",
            path: "vtuber/Galih Hoodie.vrm",
            type: "VRM",
            description: "Galih dengan hoodie casual"
        },
        {
            name: "Galih Hoodie Edmuku",
            path: "vtuber/Galih Hoodie Edmuku.vrm",
            type: "VRM",
            description: "Galih dengan hoodie Edmuku"
        },
        {
            name: "Galih Hoodie Esteh",
            path: "vtuber/Galih Hoodie Esteh.vrm",
            type: "VRM",
            description: "Galih dengan hoodie Esteh"
        },
        {
            name: "Galih T-shirt Aveecena",
            path: "vtuber/Galih T shirt Aveecena.vrm",
            type: "VRM",
            description: "Galih dengan T-shirt Aveecena"
        },
        // Anime Characters
        {
            name: "Ai Hoshino",
            path: "vtuber/Ai_Hoshino_.vrm",
            type: "VRM",
            description: "Ai Hoshino dari Oshi no Ko"
        },
        {
            name: "Anya Forger",
            path: "vtuber/Anya_Forger.vrm",
            type: "VRM",
            description: "Anya dari Spy x Family"
        },
        {
            name: "Nezuko Kamado",
            path: "vtuber/Nezuko_kamado.vrm",
            type: "VRM",
            description: "Nezuko dari Demon Slayer"
        },
        {
            name: "Fern",
            path: "vtuber/Fern VT model.vrm",
            type: "VRM",
            description: "Fern dari Frieren"
        },
        // Original Characters
        {
            name: "Aria",
            path: "vtuber/Avatar 3D Aria.vrm",
            type: "VRM",
            description: "Avatar 3D Aria"
        },
        {
            name: "Cesilia",
            path: "vtuber/Cesilia.vrm",
            type: "VRM",
            description: "Cesilia character"
        },
        {
            name: "DUST",
            path: "vtuber/DUST.vrm",
            type: "VRM",
            description: "DUST character"
        },
        {
            name: "Freestyle Test",
            path: "vtuber/Freestyletest.vrm",
            type: "VRM",
            description: "Freestyle test model"
        },
        {
            name: "Goldy",
            path: "vtuber/Goldy.vrm",
            type: "VRM",
            description: "Goldy character"
        },
        {
            name: "Kokuyou v0",
            path: "vtuber/Kokuyou_0.0.vrm",
            type: "VRM",
            description: "Kokuyou version 0.0"
        },
        {
            name: "Kokuyou v1",
            path: "vtuber/Kokuyou_1.0.vrm",
            type: "VRM",
            description: "Kokuyou version 1.0"
        },
        {
            name: "Lilac",
            path: "vtuber/Lilac.vrm",
            type: "VRM",
            description: "Lilac character"
        },
        {
            name: "Maya",
            path: "vtuber/Maya2.vrm",
            type: "VRM",
            description: "Maya character v2"
        },
        {
            name: "Mura Mura",
            path: "vtuber/Mura Mura - Freebie Model.vrm",
            type: "VRM",
            description: "Mura Mura freebie model"
        },
        {
            name: "Niya",
            path: "vtuber/Niya.vrm",
            type: "VRM",
            description: "Niya character"
        },
        {
            name: "Rose",
            path: "vtuber/Rose - Final.vrm",
            type: "VRM",
            description: "Rose final version"
        }
    ]
};

// Function to get all models (VRM only now)
export function getAllModels() {
    return vtuberModels.vrm;
}

// Function to get models by type
export function getModelsByType(type) {
    if (type === 'VRM') return vtuberModels.vrm;
    return [];
}