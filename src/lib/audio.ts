/**
 * Chrome-Optimized Audio Manager for iWords
 * Focuses on synchronous execution to preserve user gestures and prevent "interrupted" errors.
 */
class AudioManager {
    private synth: SpeechSynthesis | null = null;
    private keepAlive: any[] = []; // Global reference to prevent GC

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
        }
    }

    /**
     * The core speak method. Synchronous to ensure Chrome doesn't lose user gesture.
     */
    public speak(text: string, lang: string = 'en-US') {
        if (!this.synth) return;

        console.log(`[Audio] Speaking: "${text}"`);

        // 1. 立即停止当前所有播放 (同步执行)
        this.synth.cancel();
        
        // 2. 如果处于暂停状态，立即恢复
        if (this.synth.paused) {
            this.synth.resume();
        }

        // 3. 立即创建 Utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // 4. 防止垃圾回收：存入全局数组
        this.keepAlive.push(utterance);

        utterance.lang = lang;
        utterance.rate = 1.0;
        utterance.volume = 1.0;

        // 5. 立即选择语音
        const voices = this.synth.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith(lang)) || 
                              voices.find(v => v.lang.startsWith('en'));
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // 6. 绑定清理事件
        utterance.onend = () => {
            console.log('[Audio] Ended');
            this.removeFromKeepAlive(utterance);
        };

        utterance.onerror = (event: any) => {
            console.error('[Audio] Error:', event.error);
            this.removeFromKeepAlive(utterance);
        };

        // 7. 关键：同步调用 speak，不要有任何 await
        this.synth.speak(utterance);

        // 8. Chrome Bug 修复：持续唤醒引擎
        // 有些版本的 Chrome 会在播放长句子时突然暂停
        const resumeInterval = setInterval(() => {
            if (!this.synth?.speaking) {
                clearInterval(resumeInterval);
            } else {
                this.synth?.resume();
            }
        }, 5000);
    }

    private removeFromKeepAlive(u: SpeechSynthesisUtterance) {
        this.keepAlive = this.keepAlive.filter(item => item !== u);
    }
}

export const audioManager = new AudioManager();
