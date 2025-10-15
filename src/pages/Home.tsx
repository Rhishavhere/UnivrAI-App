// src/pages/Home.tsx - NO CHANGES REQUIRED

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { VoiceRecognition, TextToSpeech } from '@/utils/voice';
import { sendToGemini, getSystemPrompt, Message } from '@/utils/gemini';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const Home: React.FC = () => {
  const { student } = useAuth();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');

  const voiceRecognition = useRef(new VoiceRecognition());
  const tts = useRef(new TextToSpeech());

  useEffect(() => {
    const checkAvailability = async () => {
      const isVrAvailable = await voiceRecognition.current.isAvailable();
      if (!isVrAvailable) {
        toast({
          title: 'Voice Recognition Unavailable',
          description: 'Speech recognition is not supported on this device.',
          variant: 'destructive',
        });
      }
    };
    checkAvailability();
  }, [toast]);

  const processInput = async (inputContent: string) => {
    if (!inputContent.trim()) return;

    const userMessage: Message = { role: 'user', content: inputContent };
    setMessages(prev => [...prev, userMessage]);

    setIsProcessing(true);
    setCurrentSubtitle('Processing...');
    
    try {
      const systemPrompt = getSystemPrompt(
        student?.name || '',
        student?.usn || '',
        student?.semester || 0,
        student?.branch || ''
      );

      const response = await sendToGemini([...messages, userMessage], systemPrompt);

      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);

      setIsProcessing(false);
      setCurrentSubtitle(response);
      setIsSpeaking(true);
      
      await tts.current.speak(response, () => {
        setIsSpeaking(false);
        setCurrentSubtitle('');
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process your request. Please check your API key.',
        variant: 'destructive',
      });
      console.error('Error:', error);
      setCurrentSubtitle('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      await voiceRecognition.current.stop();
      setIsListening(false);
      setCurrentSubtitle('');
      return;
    }

    setIsListening(true);
    setCurrentSubtitle('Listening...');

    await voiceRecognition.current.start(
      async (transcript) => {
        setIsListening(false);
        setCurrentSubtitle(transcript);
        await processInput(transcript);
      },
      (error) => {
        setIsListening(false);
        toast({
          title: 'Error',
          description: `Voice recognition error: ${error}`,
          variant: 'destructive',
        });
        setCurrentSubtitle('');
      }
    );
  };

  const toggleSpeaker = async () => {
    if (isSpeaking) {
      await tts.current.stop();
      setIsSpeaking(false);
      setCurrentSubtitle('');
    }
  };

  return (
    <Layout>
      <div className="h-screen w-screen fixed inset-0 overflow-hidden bg-gradient-to-br from-background via-primary/20 to-accent/20 animate-gradient">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-accent/30 animate-gradient-shift" />
        
        <div className="relative h-full flex flex-col items-center justify-center p-6">
          <div className="absolute top-8 left-0 right-0 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {student?.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              Campus Assistant
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center w-full max-w-2xl px-4">
            {currentSubtitle ? (
              <div className="text-center space-y-4 animate-fade-in">
                <p className="text-2xl md:text-4xl font-medium text-foreground leading-relaxed">
                  {currentSubtitle}
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">
                  Tap the microphone to start
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-6 pb-12">
            <div className="flex items-center justify-center gap-6">
              <Button
                size="lg"
                onClick={handleVoiceInput}
                disabled={isProcessing || isSpeaking}
                className={`h-24 w-24 rounded-full transition-all ${
                  isListening
                    ? 'bg-destructive hover:bg-destructive shadow-voice-glow animate-pulse'
                    : 'bg-gradient-accent hover:opacity-90'
                }`}
              >
                {isListening ? (
                  <MicOff className="h-10 w-10" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={toggleSpeaker}
                disabled={!isSpeaking}
                className="h-20 w-20 rounded-full border-2"
              >
                {isSpeaking ? (
                  <Volume2 className="h-7 w-7 text-accent animate-pulse" />
                ) : (
                  <VolumeX className="h-7 w-7" />
                )}
              </Button>
            </div>

            <div className="text-center min-h-[28px]">
              {isListening && (
                <p className="text-accent text-lg font-medium animate-pulse">Listening...</p>
              )}
              {isProcessing && (
                <p className="text-primary text-lg font-medium">Processing...</p>
              )}
              {isSpeaking && (
                <p className="text-accent text-lg font-medium animate-pulse">Speaking...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;