// videoAvatar.js - Use existing Bella videos as avatar
// Reuse the beautiful pre-recorded videos as interactive avatar

class VideoAvatar {
    constructor() {
        this.currentVideo = null;
        this.videos = {
            neutral: '视频资源/3D 建模图片制作.mp4',
            happy: '视频资源/jimeng-2025-07-16-4437-比耶，然后微笑着优雅的左右摇晃.mp4',
            excited: '视频资源/生成跳舞视频.mp4',
            cheerful: '视频资源/生成加油视频.mp4',
            thinking: '视频资源/jimeng-2025-07-16-1043-笑着优雅的左右摇晃，过一会儿手扶着下巴，保持微笑.mp4',
            angry: '视频资源/负面/jimeng-2025-07-16-9418-双手叉腰，嘴巴一直在嘟囔，表情微微生气.mp4'
        };
        
        this.init();
    }
    
    init() {
        // Create video element
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.loop = true;
        this.videoElement.muted = true;
        this.videoElement.playsinline = true;
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = '100%';
        this.videoElement.style.objectFit = 'contain';
        
        // Set default video
        this.setEmotion('neutral');
    }
    
    setEmotion(emotion) {
        const videoSrc = this.videos[emotion] || this.videos.neutral;
        
        if (this.currentVideo !== videoSrc) {
            this.currentVideo = videoSrc;
            this.videoElement.src = videoSrc;
            this.videoElement.play().catch(e => console.log('Video play error:', e));
        }
    }
    
    mount(container) {
        container.appendChild(this.videoElement);
    }
    
    unmount() {
        if (this.videoElement.parentNode) {
            this.videoElement.parentNode.removeChild(this.videoElement);
        }
    }
    
    // Lip sync simulation (video speed adjustment)
    startSpeaking() {
        // Slightly speed up video when speaking
        this.videoElement.playbackRate = 1.1;
    }
    
    stopSpeaking() {
        this.videoElement.playbackRate = 1.0;
    }
}

export { VideoAvatar };