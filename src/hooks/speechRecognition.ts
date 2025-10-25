import { useEffect, useState } from "react"

let recognition: any = null
if ("webkitSpeechRecognition" in window) {
  recognition = new (window as any).webkitSpeechRecognition()
  recognition.continuous = false // Changed to false for single utterance
  recognition.lang = "en-US"
  recognition.interimResults = false
  recognition.maxAlternatives = 1
}

const useSpeechRecognition = () => {
  const [text, setText] = useState("")
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    if (!recognition) return

    recognition.onresult = (event: any) => {
      console.log("Speech recognition result:", event)
      // Get the final transcript from the last result
      const transcript = event.results[event.results.length - 1][0].transcript
      console.log("Transcript:", transcript)
      setText(transcript)
    }

    recognition.onend = () => {
      console.log("Speech recognition ended")
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
      setText("")
    }

    recognition.onstart = () => {
      console.log("Speech recognition started")
      setIsListening(true)
    }
  }, [])

  const startListening = () => {
    if (!recognition) {
      console.error("Speech recognition not supported")
      return
    }
    
    setText("")
    setIsListening(true)
    
    try {
      recognition.start()
    } catch (error) {
      console.error("Error starting recognition:", error)
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (!recognition) return
    
    setIsListening(false)
    try {
      recognition.stop()
    } catch (error) {
      console.error("Error stopping recognition:", error)
    }
  }

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  }
}

export default useSpeechRecognition