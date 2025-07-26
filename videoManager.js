// videoManager.js - Bella's Avatar Emotion Manager
// Mengatur video avatar Bella berdasarkan emosi dan konteks percakapan

class VideoManager {
    constructor() {
        this.currentEmotion = 'neutral';
        this.videoCategories = {
            happy: [
                '视频资源/jimeng-2025-07-16-1043-笑着优雅的左右摇晃，过一会儿手扶着下巴，保持微笑.mp4',
                '视频资源/jimeng-2025-07-16-4437-比耶，然后微笑着优雅的左右摇晃.mp4',
                '视频资源/生成跳舞视频.mp4'
            ],
            neutral: [
                '视频资源/3D 建模图片制作.mp4',
                '视频资源/生成加油视频.mp4'
            ],
            angry: [
                '视频资源/负面/jimeng-2025-07-16-9418-双手叉腰，嘴巴一直在嘟囔，表情微微生气.mp4'
            ]
        };
        
        this.emotionKeywords = {
            happy: ['senang', 'bahagia', 'gembira', 'lucu', 'haha', 'wow', 'bagus', 'terima kasih', 'love'],
            angry: ['marah', 'kesal', 'benci', 'tidak suka', 'buruk', 'jelek'],
            sad: ['sedih', 'kecewa', 'menangis', 'kesepian']
        };
    }

    // Analyze text to detect emotion
    detectEmotion(text) {
        const lowerText = text.toLowerCase();
        
        for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                return emotion;
            }
        }
        
        return 'neutral';
    }

    // Get appropriate video based on emotion
    getVideoForEmotion(emotion) {
        const category = this.videoCategories[emotion] || this.videoCategories.neutral;
        return category[Math.floor(Math.random() * category.length)];
    }

    // Switch to emotion-based video
    switchToEmotionVideo(text) {
        const emotion = this.detectEmotion(text);
        
        if (emotion !== this.currentEmotion) {
            this.currentEmotion = emotion;
            const video = this.getVideoForEmotion(emotion);
            
            // Trigger video switch event
            window.dispatchEvent(new CustomEvent('bella-emotion-change', {
                detail: { emotion, video }
            }));
            
            return { emotion, video };
        }
        
        return null;
    }

    // Get current emotion
    getCurrentEmotion() {
        return this.currentEmotion;
    }
    
    // Export detect emotion for external use
    detectEmotion(text) {
        const lowerText = text.toLowerCase();
        
        for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                return emotion;
            }
        }
        
        return 'neutral';
    }
}

export { VideoManager };