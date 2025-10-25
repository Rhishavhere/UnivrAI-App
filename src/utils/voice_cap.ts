// src/utils/voice.ts - Robust Android Fix

import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { EdgeTTS } from 'edge-tts-universal/browser';

export class VoiceRecognition {
  private isRecording: boolean = false;
  private currentTranscript: string = '';

  /**
   * Check if voice recognition is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const { available } = await SpeechRecognition.available();
      return available;
    } catch (error) {
      console.error('Speech recognition check failed:', error);
      return false;
    }
  }

  /**
   * Request microphone permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { speechRecognition } = await SpeechRecognition.requestPermissions();
      return speechRecognition === 'granted';
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  /**
   * Start voice recognition
   * User must manually stop by calling stop()
   */
  async start(
    onResult: (transcript: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (this.isRecording) {
      console.warn('Already recording');
      return;
    }

    // Request permissions first
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      onError('Microphone permission denied');
      return;
    }

    this.isRecording = true;
    this.currentTranscript = '';

    try {
      // Listen for speech results
      await SpeechRecognition.addListener('partialResults', (data: { matches: string[] }) => {
        if (data.matches && data.matches.length > 0) {
          this.currentTranscript = data.matches[0];
          console.log('Current transcript:', this.currentTranscript);
        }
      });

      // Start recognition
      await SpeechRecognition.start({
        language: 'en-US',
        maxResults: 1,
        prompt: 'Listening...',
        partialResults: true,
        popup: false,
      });

      console.log('Voice recognition started');
    } catch (error: any) {
      console.error('Failed to start recognition:', error);
      this.isRecording = false;
      SpeechRecognition.removeAllListeners();
      onError(error?.message || 'Failed to start speech recognition');
    }
  }

  /**
   * Stop voice recognition and return final transcript
   */
  async stop(): Promise<void> {
    if (!this.isRecording) {
      console.warn('Not currently recording');
      return;
    }

    try {
      await SpeechRecognition.stop();
      this.isRecording = false;
      SpeechRecognition.removeAllListeners();
      console.log('Voice recognition stopped');
    } catch (error) {
      console.error('Error stopping recognition:', error);
      this.isRecording = false;
      SpeechRecognition.removeAllListeners();
    }
  }

  /**
   * Get current transcript
   */
  getTranscript(): string {
    return this.currentTranscript;
  }

  /**
   * Check if currently recording
   */
  isListening(): boolean {
    return this.isRecording;
  }
}

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
      const tts = new EdgeTTS(text, 'en-US-AvaNeural');
      const result = await tts.synthesize();
      
      const audioData = await result.audio.arrayBuffer();
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      this.audioPlayer = new Audio(audioUrl);
      
      this.audioPlayer.onended = () => {
        console.log('TTS playback ended');
        this.isSpeaking = false;
        URL.revokeObjectURL(audioUrl);
        this.audioPlayer = null;
        onEnd?.();
      };
      
      this.audioPlayer.onerror = (error) => {
        console.error('Audio playback error:', error);
        this.isSpeaking = false;
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        this.audioPlayer = null;
        onEnd?.();
      };
      
      await this.audioPlayer.play();
      console.log('TTS playback started');

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