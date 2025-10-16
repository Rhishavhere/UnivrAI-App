// src/utils/voice.ts - Robust Android Fix

import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { EdgeTTS } from 'edge-tts-universal/browser';

export class VoiceRecognition {
  private isListening = false;
  private recognitionTimeout: NodeJS.Timeout | null = null;

  async isAvailable(): Promise<boolean> {
    try {
      const { available } = await SpeechRecognition.available();
      return available;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }

  async start(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    // Check and request permissions
    try {
      const permissionStatus = await SpeechRecognition.checkPermissions();
      if (permissionStatus.speechRecognition !== 'granted') {
        const permissionRequest = await SpeechRecognition.requestPermissions();
        if (permissionRequest.speechRecognition !== 'granted') {
          onError?.('Microphone permission denied. Please enable it in settings.');
          return;
        }
      }
    } catch (error) {
      console.error('Permission error:', error);
      onError?.('Could not access microphone permissions.');
      return;
    }

    if (this.isListening) {
      console.log('Already listening, stopping first...');
      await this.stop();
    }

    this.isListening = true;
    let hasReceivedResult = false;

    try {
      // Clean up any existing listeners
      await SpeechRecognition.removeAllListeners();
      console.log('Starting speech recognition...');

      // Set up listener for results
      await SpeechRecognition.addListener('partialResults', async (data: any) => {
        console.log('Received data:', data);
        
        if (hasReceivedResult) {
          console.log('Already processed result, ignoring...');
          return;
        }

        if (data.matches && data.matches.length > 0) {
          hasReceivedResult = true;
          const transcript = data.matches[0];
          console.log('Transcript received:', transcript);

          // Clear timeout
          if (this.recognitionTimeout) {
            clearTimeout(this.recognitionTimeout);
            this.recognitionTimeout = null;
          }

          // Stop and clean up
          this.isListening = false;
          try {
            await SpeechRecognition.stop();
            await SpeechRecognition.removeAllListeners();
          } catch (e) {
            console.error('Error stopping recognition:', e);
          }

          // Return result
          onResult(transcript);
        }
      });

      // Start recognition
      await SpeechRecognition.start({
        language: 'en-US',
        maxResults: 5,
        prompt: 'Speak now',
        partialResults: true,
        popup: false,
      });

      console.log('Speech recognition started successfully');

      // Safety timeout - auto-stop after 10 seconds
      this.recognitionTimeout = setTimeout(async () => {
        console.log('Recognition timeout reached');
        if (this.isListening && !hasReceivedResult) {
          this.isListening = false;
          try {
            await SpeechRecognition.stop();
            await SpeechRecognition.removeAllListeners();
          } catch (e) {
            console.error('Error in timeout cleanup:', e);
          }
          onError?.('No speech detected. Please try again.');
        }
      }, 10000);

    } catch (error: any) {
      console.error('Speech recognition start error:', error);
      this.isListening = false;
      
      if (this.recognitionTimeout) {
        clearTimeout(this.recognitionTimeout);
        this.recognitionTimeout = null;
      }

      try {
        await SpeechRecognition.removeAllListeners();
      } catch (e) {
        console.error('Error removing listeners:', e);
      }

      onError?.(error.message || 'Could not start voice recognition. Please try again.');
    }
  }

  async stop(): Promise<void> {
    console.log('Stopping speech recognition...');
    
    if (this.recognitionTimeout) {
      clearTimeout(this.recognitionTimeout);
      this.recognitionTimeout = null;
    }

    if (this.isListening) {
      this.isListening = false;
      try {
        await SpeechRecognition.stop();
        await SpeechRecognition.removeAllListeners();
        console.log('Speech recognition stopped');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  getIsListening(): boolean {
    return this.isListening;
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