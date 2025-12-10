// src/pages/Chat.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Volume2, VolumeX, Loader2, Send, Bot, User, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TextToSpeech } from '@/utils/voice';
import { sendToGemini, getSystemPrompt, Message } from '@/utils/gemini';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import Aurora from '@/components/Aurora';

const Chat: React.FC = () => {
  const { student } = useAuth();
  const { toast } = useToast();
  // const [isListening, setIsListening] = useState(false); // Removed unused variable
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  // const [currentTranscript, setCurrentTranscript] = useState(''); // Removed unused variable
  const [textInput, setTextInput] = useState('');

  const tts = useRef(new TextToSpeech());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


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

  const handleTextSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (textInput.trim() === '' || isProcessing || isSpeaking) return;

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
      <div className="relative h-screen w-full flex flex-col overflow-hidden bg-background">
        
        {/* Subtle Background */}
         <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <Aurora 
              colorStops={["#180F2E", "#264EE0", "#000000"]} 
              blend={0.4} 
              amplitude={0.3} 
              speed={0.2} 
            />
         </div>

        {/* Header Spacer */}
        <div className="h-20 shrink-0" />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar z-10 pb-32">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-0 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-5">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center rotate-3 shadow-xl backdrop-blur-md border border-white/5">
                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                   Hello, {student?.name?.split(' ')[0] || 'Scholar'}
                </h3>
                <p className="text-muted-foreground">
                  I'm ready to help with your classes, campus events, or facilities. Just type below!
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  {message.role === 'assistant' && (
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center mt-1 shadow-lg">
                        <Bot className="h-5 w-5 text-white" />
                     </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl shadow-sm backdrop-blur-md border ${
                      message.role === 'user'
                        ? 'bg-primary/90 text-white rounded-tr-sm border-primary/20 shadow-primary/20'
                        : 'glass text-foreground rounded-tl-sm border-white/5'
                    }`}
                  >
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === 'user' && (
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center mt-1">
                        <User className="h-5 w-5 text-secondary-foreground" />
                     </div>
                  )}
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex gap-4 justify-start animate-in fade-in">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center mt-1">
                        <Bot className="h-5 w-5 text-white" />
                     </div>
                  <div className="p-4 rounded-2xl rounded-tl-sm glass border-white/5">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-6 left-0 right-0 px-4 md:px-0 z-20 flex justify-center">
            <div className="w-full max-w-3xl glass p-2 rounded-full border-white/10 shadow-2xl flex items-center gap-2 pr-2 animate-in slide-in-from-bottom-10 duration-500">
               <Input
                  type="text"
                  placeholder="Type a message..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isProcessing || isSpeaking}
                  className="flex-1 h-12 pl-6 bg-transparent border-none text-base focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  autoFocus
                />
                
                {isSpeaking && (
                   <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleSpeaker}
                    className="rounded-full hover:bg-white/10 text-accent animate-pulse"
                    title="Stop Speaking"
                   >
                     <Volume2 className="h-5 w-5" />
                   </Button>
                )}

                <Button
                  onClick={handleTextSubmit}
                  size="icon"
                  disabled={!textInput.trim() || isProcessing}
                  className="h-10 w-10 rounded-full bg-gradient-primary hover:opacity-90 transition-transform active:scale-95"
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;