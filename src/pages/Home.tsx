// src/pages/Home.tsx - Web Speech API Integration

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Volume2, VolumeX, Send, Keyboard, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TextToSpeech } from '@/utils/voice';
import useSpeechRecognition from '@/hooks/speechRecognition';
import { sendToGemini, getSystemPrompt, Message } from '@/utils/gemini';
import { sendAlert, getAlertPrompt} from '@/utils/alert';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import SplitText from '@/components/SplitText';
import RotatingText from '@/components/RotatingText';
import Aurora from '@/components/Aurora';


const Home: React.FC = () => {
  const { student } = useAuth();
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [textInput, setTextInput] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);

  const { text, startListening, stopListening, isListening, hasRecognitionSupport } = useSpeechRecognition();
  const tts = useRef(new TextToSpeech());
  const isProcessingRef = useRef(false);

  // Process speech recognition text when it's captured
  useEffect(() => {
    if (text && text.trim() && !isProcessingRef.current) {
      console.log('Speech text received:', text);
      processInput(text);
    }
  }, [text]);

  // Check for speech recognition support
  useEffect(() => {
    if (!hasRecognitionSupport) {
      toast({
        title: 'Voice Recognition Unavailable',
        description: 'Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.',
        variant: 'destructive',
      });
    }
  }, [hasRecognitionSupport, toast]);

  const processInput = async (inputContent: string) => {
    if (!inputContent.trim() || isProcessingRef.current) {
      console.log('Skipping process - empty or already processing');
      return;
    }

    isProcessingRef.current = true;
    console.log('Processing input:', inputContent);

    const userMessage: Message = { role: 'user', content: inputContent };
    setMessages(prev => [...prev, userMessage]);

    // Check for emergency keywords

    setIsProcessing(true);
    setCurrentSubtitle('Processing...');

    const lowerContent = inputContent.toLowerCase();

    if (lowerContent.includes('emergency') || lowerContent.includes('alert')) {

      const alertPrompt = getAlertPrompt(
        student?.name || '',
        student?.usn || '',
        student?.semester || 0,
        student?.branch || ''
      );

      const response = await sendAlert(lowerContent, alertPrompt);
      setIsProcessing(false);
      const alertMsg = "I just alerted the authorities. They will be here soon!";
      setCurrentSubtitle(alertMsg);
      setIsSpeaking(true);
        
        await tts.current.speak(alertMsg, () => {
          console.log('TTS finished');
          setIsSpeaking(false);
        });
      try {
        await fetch('http://192.168.0.5:5000/sos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: response,
            timestamp: new Date().toISOString(),
          }),
        });
        toast({
          title: 'Emergency Alert Sent',
          description: 'Your emergency message has been forwarded to campus security.',
          variant: 'default',
        });
      } catch (error) {
        console.error('Failed to send emergency alert:', error);
        toast({
          title: 'Alert Failed',
          description: 'Could not send emergency alert. Please try again.',
          variant: 'destructive',
        });
      }
    }
    else{

      const systemPrompt = getSystemPrompt(
        student?.name || '',
        student?.usn || '',
        student?.semester || 0,
        student?.branch || ''
      );

      try {
  
        console.log('Sending to Gemini...');
        const response = await sendToGemini([...messages, userMessage], systemPrompt);
        console.log('Gemini response received');

        const assistantMessage: Message = { role: 'assistant', content: response };
        setMessages(prev => [...prev, assistantMessage]);
  
        setIsProcessing(false);
        setCurrentSubtitle(response);
        setIsSpeaking(true);
        
        await tts.current.speak(response, () => {
          console.log('TTS finished');
          setIsSpeaking(false);
        });
      } catch (error: any) {
        console.error('Error processing:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to process your request.',
          variant: 'destructive',
        });
        setCurrentSubtitle('');
        setIsProcessing(false);
        setIsSpeaking(false);
      } finally {
        isProcessingRef.current = false;
      }
    };
  }

 
    

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const handleTextSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (textInput.trim() === '' || isProcessing || isListening || isSpeaking) return;

    const content = textInput;
    setTextInput('');
    setShowKeyboard(false); 
    await processInput(content);
  };

  const toggleSpeaker = async () => {
    if (isSpeaking) {
      await tts.current.stop();
      setIsSpeaking(false);
      setCurrentSubtitle('');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  return (
    <Layout>
      <div className="h-screen w-screen relative overflow-hidden">
        {/* Background Layer */}
        <div className="fixed inset-0 z-[-1]">
           <Aurora
            colorStops={["#264EE0", "#180F2E", "#2641AD"]}
            blend={0.5}
            amplitude={0.6}
            speed={isSpeaking ? 2 : 0.5}
          />
        </div>

        {/* Dynamic Foreground Orbs */}
         <div className={`fixed top-[20%] left-[20%] w-[300px] h-[300px] bg-primary/30 rounded-full blur-[80px] pointer-events-none transition-opacity duration-1000 ${isSpeaking ? 'opacity-80' : 'opacity-30'}`} />
         <div className={`fixed bottom-[20%] right-[20%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none transition-opacity duration-1000 ${isSpeaking ? 'opacity-80' : 'opacity-30'}`} />

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-center justify-center p-6 pb-24">

          {/* Assistant Visual / Subtitles */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-4 mt-16">
            
            {/* Visualizer Circle - Placeholder for now, could be an audio visualizer */}
            <div className={`w-32 h-32 rounded-full mb-8 flex items-center justify-center transition-all duration-500 ${isListening ? 'scale-110 shadow-voice-glow bg-primary' : isSpeaking ? 'scale-105 shadow-[0_0_60px_rgba(var(--accent),0.5)] bg-accent' : 'bg-white/5 border border-white/10'}`}>
                 {isListening ? (
                    <div className="w-full h-full rounded-full animate-ping bg-primary/50 absolute" />
                 ) : null}
                 {isSpeaking ? (
                      <Volume2 className="h-12 w-12 text-white animate-pulse" />
                 ) : (
                    <div className="w-4 h-4 rounded-full bg-white/50" />
                 )}
            </div>


            {currentSubtitle ? (
              <div className="relative min-h-[200px] flex items-center justify-center glass p-8 rounded-2xl border-white/5 shadow-2xl max-w-3xl w-full">
                <SplitText
                  key={currentSubtitle}
                  text={currentSubtitle}
                  className="text-2xl md:text-3xl font-sans font-medium leading-relaxed text-center text-white drop-shadow-lg"
                  delay={50}
                  duration={0.4}
                  ease="power2.out"
                  splitType="words"
                  from={{ opacity: 0, y: 20 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                />
              </div>
            ) : (
              <div className="text-center space-y-6">
                 <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60 pb-2">
                   {getGreeting()}
                 </h1>
                
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl text-muted-foreground">I am here to help,</span>
                  <RotatingText
                    texts={[student.name || 'Student', student.usn || 'Scholar']}
                    mainClassName="bg-gradient-primary px-3 py-1 rounded-lg text-xl text-white font-medium"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden"
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    rotationInterval={3000}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interaction Zone */}
          <div className="flex flex-col items-center gap-6 w-full max-w-md px-4 absolute bottom-12 safe-area-bottom">
             
             {/* Text Input Overlay */}
             {showKeyboard && (
                <form onSubmit={handleTextSubmit} className="w-full mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
                  <div className="relative flex items-center gap-2">
                     <Input
                        type="text"
                        placeholder="Ask me anything..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        disabled={isProcessing || isListening || isSpeaking}
                        className="h-14 pl-6 pr-12 rounded-full bg-background/80 backdrop-blur-xl border-white/20 text-lg shadow-2xl focus:ring-primary/50"
                        autoFocus
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!textInput.trim() || isProcessing}
                        className="absolute right-2 top-2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
                      >
                         <Send className="h-5 w-5" />
                      </Button>
                      <Button
                        type='button'
                        variant="ghost"
                        size="icon"
                        className="absolute -right-12 top-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                        onClick={() => setShowKeyboard(false)}
                      >
                         <X className="h-6 w-6"/>
                      </Button>
                  </div>
                </form>
             )}


            {/* Controls */}
            {!showKeyboard && (
            <div className="flex items-center justify-center gap-8 p-4 rounded-3xl backdrop-blur-sm bg-black/10 border border-white/5 shadow-2xl transition-all hover:bg-black/20">
              
               <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowKeyboard(true)}
                disabled={isListening}
                className="h-14 w-14 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all hover:scale-110"
              >
                <Keyboard className="h-6 w-6" />
              </Button>

              <Button
                size="lg"
                onClick={handleVoiceInput}
                disabled={isProcessing || isSpeaking}
                className={`h-20 w-20 rounded-full transition-all duration-300 shadow-xl border border-white/20 ${
                  isListening
                    ? 'bg-destructive text-white hover:bg-destructive shadow-voice-glow animate-pulse scale-110'
                    : 'bg-gradient-accent text-primary-foreground hover:scale-110 hover:shadow-accent/40'
                }`}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>

              <Button
                 variant="ghost"
                 size="icon"
                onClick={toggleSpeaker}
                disabled={!isSpeaking}
                className={`h-14 w-14 rounded-full transition-all hover:scale-110 ${isSpeaking ? 'text-accent bg-accent/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                {isSpeaking ? (
                  <Volume2 className="h-6 w-6" />
                ) : (
                  <VolumeX className="h-6 w-6" />
                )}
              </Button>
            </div>
            )}
             <p className="text-sm text-white/40 font-medium tracking-wider uppercase">
               {isListening ? 'Listening...' : isProcessing ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Ready'}
             </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;