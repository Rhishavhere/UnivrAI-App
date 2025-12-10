// src/pages/Home.tsx - Web Speech API Integration

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Volume2, VolumeX, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TextToSpeech } from '@/utils/voice';
import useSpeechRecognition from '@/hooks/speechRecognition';
import { sendToGemini, getSystemPrompt, Message } from '@/utils/gemini';
import { sendAlert, getAlertPrompt} from '@/utils/alert';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import SplitText from '@/components/SplitText';
import RotatingText from '@/components/RotatingText';
import DarkVeil from '@/components/DarkVeil';
import Aurora from '@/components/Aurora';


const Home: React.FC = () => {
  const { student } = useAuth();
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [textInput, setTextInput] = useState('');

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
      setCurrentSubtitle("I just alerted the authorities. They will be here soon!");
      setIsSpeaking(true);
        
        await tts.current.speak("I just alerted the authorities. They will be here soon!", () => {
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
      <div className="h-screen w-screen">
        <div className="w-screen h-lvh top-0" style={{ position: 'absolute', zIndex: '-99' }}>
          <Aurora
            colorStops={["#264EE0", "#180F2E", "#2641AD"]}
            blend={0.5}
            amplitude={0.5}
            speed={isSpeaking ? 2 : 1}
          />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center p-6 ">

          <div className="flex-1 flex items-center justify-center w-full max-w-2xl px-4 mt-20">
            {currentSubtitle ? (
              <div className="text-justify space-y-4 animate-fade-in h-72 ">
                <SplitText
                  key={currentSubtitle}
                  text={currentSubtitle}
                  className="text-2xl font-sans font-semibold leading-relaxed text-center"
                  delay={100}
                  duration={0.6}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                />
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div>
                  <p className='text-2xl font-sans font-semibold mb-4'>{getGreeting()}</p>
                  <RotatingText
                    texts={[student.name, student.usn]}
                    mainClassName=" mb-4 bg-gradient-primary px-2 sm:px-2 md:px-3 text-2xl text-white font-sans font-semibold overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2500}
                  />
                </div>
                <p className="text-lg text-muted-foreground">
                  {isListening ? 'Listening... (tap mic to stop)' : 'Tap the microphone to start'}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-6 w-full max-w-md px-4 mb-20">
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2 w-full">
              <Input
                type="text"
                placeholder="Type your message..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isProcessing || isListening || isSpeaking}
                className="flex-1 p-3 text-base bg-card/50 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="icon"
                disabled={textInput.trim() === '' || isProcessing || isListening || isSpeaking}
                className="h-10 w-10"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>

            <div className="flex items-center justify-center gap-6">
              <Button
                size="lg"
                onClick={handleVoiceInput}
                disabled={isProcessing || isSpeaking}
                className={`h-12 w-28 rounded-full transition-all ${
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
                className="h-14 w-20 rounded-full border-2"
              >
                {isSpeaking ? (
                  <Volume2 className="h-7 w-7 text-accent animate-pulse" />
                ) : (
                  <VolumeX className="h-7 w-7" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;