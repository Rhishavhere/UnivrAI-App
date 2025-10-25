// src/utils/voice.ts - Web Speech API Implementation

import { EdgeTTS } from 'edge-tts-universal/browser';
export class TextToSpeech {
  private isSpeaking = false;
  private audioPlayer: HTMLAudioElement | null = null;

  isAvailable(): boolean {
    return true;
  }

  async speak(text: string, onEnd?: () => void): Promise<void> {
    if (this.isSpeaking && this.audioPlayer) {
      await this.stop();
    }

    this.isSpeaking = true;
    try {
      console.log('Starting TTS for:', text.substring(0, 50) + '...');
      
      // Initialize Edge TTS
      const tts = new EdgeTTS(text, 'en-US-AvaNeural');
      console.log('EdgeTTS initialized, synthesizing...');
      
      const result = await tts.synthesize();
      console.log('Synthesis complete, result:', result);
      
      // Get audio data
      const audioData = await result.audio.arrayBuffer();
      console.log('Audio data received, size:', audioData.byteLength);
      
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('Audio URL created:', audioUrl);

      this.audioPlayer = new Audio(audioUrl);
      
      // Set volume to maximum
      this.audioPlayer.volume = 1.0;
      
      this.audioPlayer.onloadedmetadata = () => {
        console.log('Audio loaded, duration:', this.audioPlayer?.duration);
      };
      
      this.audioPlayer.onended = () => {
        console.log('TTS playback ended');
        this.isSpeaking = false;
        URL.revokeObjectURL(audioUrl);
        this.audioPlayer = null;
        onEnd?.();
      };
      
      this.audioPlayer.onerror = (error) => {
        console.error('Audio playback error:', error);
        console.error('Audio player error details:', this.audioPlayer?.error);
        this.isSpeaking = false;
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        this.audioPlayer = null;
        onEnd?.();
      };
      
      this.audioPlayer.onplay = () => {
        console.log('Audio started playing');
      };
      
      console.log('Attempting to play audio...');
      const playPromise = this.audioPlayer.play();
      
      playPromise
        .then(() => {
          console.log('TTS playback started successfully');
        })
        .catch((error) => {
          console.error('Play failed:', error);
          this.isSpeaking = false;
          URL.revokeObjectURL(audioUrl);
          this.audioPlayer = null;
          onEnd?.();
        });

    } catch (error) {
      console.error("Edge TTS Error:", error);
      this.isSpeaking = false;
      onEnd?.();
    }
  }

  async stop(): Promise<void> {
    console.log('Stopping TTS...');
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      if (this.audioPlayer.src) {
        URL.revokeObjectURL(this.audioPlayer.src);
      }
      this.audioPlayer = null;
    }
    this.isSpeaking = false;
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}