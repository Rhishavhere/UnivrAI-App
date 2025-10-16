// src/pages/Home.tsx - NO CHANGES REQUIRED

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { VoiceRecognition, TextToSpeech } from '@/utils/voice';
import { sendToGemini, getSystemPrompt, Message } from '@/utils/gemini';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const Chat: React.FC = () => {
  const { student } = useAuth();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [textInput, setTextInput] = useState('');

  const voiceRecognition = useRef(new VoiceRecognition());
  const tts = useRef(new TextToSpeech());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTranscript]);

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

      setIsSpeaking(true);
      await tts.current.speak(response, () => {
        setIsSpeaking(false);
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process your request. Please check your API key.',
        variant: 'destructive',
      });
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
      if (isSpeaking) {
          setIsSpeaking(false);
      }
    }
  };

  const handleVoiceInput = async () => {
    setTextInput('');

    if (isListening) {
      await voiceRecognition.current.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setCurrentTranscript('');

    await voiceRecognition.current.start(
      async (transcript) => {
        setIsListening(false);
        setCurrentTranscript(transcript);
        await processInput(transcript);
        setCurrentTranscript('');
      },
      (error) => {
        setIsListening(false);
        toast({
          title: 'Error',
          description: `Voice recognition error: ${error}`,
          variant: 'destructive',
        });
        setCurrentTranscript('');
      }
    );
  };

  const handleTextSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (textInput.trim() === '' || isProcessing || isListening || isSpeaking) return;

    const content = textInput;
    setTextInput('');
    await processInput(content);
  };

  const toggleSpeaker = async () => {
    if (isSpeaking) {
      await tts.current.stop();
      setIsSpeaking(false);
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col p-4 ">

        <Card className="flex-1 bg-card border-border p-4 mb-4 overflow-y-auto mt-24">
          {messages.length === 0 && !currentTranscript ? (
            <div className="h-full flex items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Type to start a conversation 💬
                </p>
                <p className="text-sm text-muted-foreground">
                  Ask me about classes, events, facilities, or campus tours!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {currentTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-primary/50 text-primary-foreground">
                    <p className="text-sm italic">{currentTranscript}</p>
                  </div>
                </div>
              )}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-secondary text-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </Card>

        <form onSubmit={handleTextSubmit} className="flex items-center gap-2 mb-4">
            <Input
                type="text"
                placeholder="Type your message..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isProcessing || isListening || isSpeaking}
                className="flex-1 p-3 text-base"
            />
            <Button
                type="submit"
                size="icon"
                disabled={textInput.trim() === '' || isProcessing || isListening || isSpeaking}
            >
                <Send className="h-5 w-5" />
            </Button>
        </form>

        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={toggleSpeaker}
            disabled={!isSpeaking}
            className="h-16 w-16 rounded-full border-border"
          >
            {isSpeaking ? (
              <Volume2 className="h-6 w-6 text-accent" />
            ) : (
              <VolumeX className="h-6 w-6" />
            )}
          </Button>
        </div>

      </div>
    </Layout>
  );
};

export default Chat;