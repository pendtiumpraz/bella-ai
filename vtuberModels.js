// vtuberModels.js - VRM Models Only

export const vtuberModels = {
    vrm: [
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