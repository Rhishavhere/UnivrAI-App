// src/utils/voice.ts

import { SpeechRecognition } from '@capacitor-community/speech-recognition';
// CHANGE 1: Import 'EdgeTTS' from the browser-specific entry point
import { EdgeTTS } from 'edge-tts-universal/browser';

// VoiceRecognition class remains unchanged.
export class VoiceRecognition {
  private isListening = false;

  async isAvailable(): Promise<boolean> {
    const { available } = await SpeechRecognition.available();
    return available;
  }

  async start(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    const permissionStatus = await SpeechRecognition.checkPermissions();
    if (permissionStatus.speechRecognition !== 'granted') {
      const permissionRequest = await SpeechRecognition.requestPermissions();
      if (permissionRequest.speechRecognition !== 'granted') {
        onError?.('User denied permission for speech recognition.');
        return;
      }
    }

    if (this.isListening) {
      return;
    }

    this.isListening = true;
    try {
      await SpeechRecognition.start({
        language: 'en-US',
        partialResults: false,
        popup: false,
      });

      SpeechRecognition.addListener('partialResults', async (data: any) => {
        if (data.matches && data.matches.length > 0) {
          this.isListening = false;
          onResult(data.matches[0]);
        }
      });
    } catch (error: any) {
      this.isListening = false;
      onError?.(error.message || 'An unknown speech recognition error occurred.');
    }
  }

  async stop(): Promise<void> {
    if (this.isListening) {
      await SpeechRecognition.stop();
      this.isListening = false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}


// Text to Speech (TTS) - Corrected for Vite/Browser Build
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
      // CHANGE 2: Use the imported 'EdgeTTS' class
      const tts = new EdgeTTS(text, 'en-US-AvaNeural');
      const result = await tts.synthesize();
      
      const audioData = await result.audio.arrayBuffer();
      
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      this.audioPlayer = new Audio(audioUrl);
      
      this.audioPlayer.onended = () => {
        this.isSpeaking = false;
        URL.revokeObjectURL(audioUrl);
        this.audioPlayer = null;
        onEnd?.();
      };
      
      await this.audioPlayer.play();

    } catch (error) {
      console.error("Edge TTS Error:", error);
      this.isSpeaking = false;
      onEnd?.();
    }
  }

  async stop(): Promise<void> {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      if(this.audioPlayer.src) {
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