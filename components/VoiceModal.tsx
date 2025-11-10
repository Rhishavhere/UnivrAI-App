import { useAuth } from "@/contexts/AuthContext";
import { attendanceData } from "@/data/attendance";
import { classes } from "@/data/classes";
import { collegeInfo } from "@/data/collegeInfo";
import { events } from "@/data/events";
import { generateText } from "@rork-ai/toolkit-sdk";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { ChevronDown, Mic } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
}

type ConversationState = "idle" | "listening" | "processing" | "speaking";

export default function VoiceModal({ visible, onClose }: VoiceModalProps) {
  const { currentStudent } = useAuth();
  const [state, setState] = useState<ConversationState>("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const recording = useRef<Audio.Recording | null>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === "listening" || state === "processing") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        })
      ).start();
    } else {
      pulseAnim.setValue(1);
      waveAnim.setValue(0);
    }
  }, [state, pulseAnim, waveAnim]);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      setupAudio();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
      cleanupAudio();
      setState("idle");
      setTranscript("");
      setResponse("");
      setError("");
    }
  }, [visible, slideAnim]);

  const setupAudio = async () => {
    try {
      if (Platform.OS !== "web") {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }
    } catch (err) {
      console.error("Failed to setup audio:", err);
    }
  };

  const cleanupAudio = async () => {
    if (recording.current) {
      try {
        await recording.current.stopAndUnloadAsync();
      } catch (err) {
        console.error("Failed to cleanup recording:", err);
      }
      recording.current = null;
    }
    Speech.stop();
  };

  const startListening = async () => {
    try {
      setError("");
      setTranscript("");
      setResponse("");
      setState("listening");

      if (Platform.OS === "web") {
        setError("Voice input is not available on web. Please use a mobile device.");
        setState("idle");
        return;
      }

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        setError("Microphone permission denied");
        setState("idle");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {},
      });

      recording.current = newRecording;
    } catch (err) {
      console.error("Failed to start recording:", err);
      setError("Failed to start recording");
      setState("idle");
    }
  };

  const stopListening = async () => {
    try {
      if (!recording.current) return;

      setState("processing");
      await recording.current.stopAndUnloadAsync();

      const uri = recording.current.getURI();
      recording.current = null;

      if (!uri) {
        setError("No audio recorded");
        setState("idle");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      await transcribeAudio(uri);
    } catch (err) {
      console.error("Failed to stop recording:", err);
      setError("Failed to process recording");
      setState("idle");
    }
  };

  const transcribeAudio = async (uri: string) => {
    try {
      const formData = new FormData();

      const uriParts = uri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      const audioFile = {
        uri,
        name: `recording.${fileType}`,
        type: `audio/${fileType}`,
      } as any;

      formData.append("audio", audioFile);

      const response = await fetch("https://toolkit.rork.com/stt/transcribe/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const data = await response.json();
      const text = data.text || "";

      if (!text.trim()) {
        setError("Could not understand audio. Please try again.");
        setState("idle");
        return;
      }

      setTranscript(text);
      await getAIResponse(text);
    } catch (err) {
      console.error("Transcription error:", err);
      setError("Sorry, my brains are off");
      setState("idle");
    }
  };

  const getAIResponse = async (userMessage: string) => {
    try {
      const systemPrompt = buildSystemPrompt();

      const aiResponse = await generateText({
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\nUser: ${userMessage}`,
          },
        ],
      });

      setResponse(aiResponse);
      setState("speaking");
      await speakResponse(aiResponse);
    } catch (err) {
      console.error("AI error:", err);
      const errorResponse = "Sorry, my brains are off";
      setResponse(errorResponse);
      setState("speaking");
      await speakResponse(errorResponse);
    }
  };

  const buildSystemPrompt = () => {
    const studentInfo = currentStudent
      ? `
Current Student Information:
- Name: ${currentStudent.name}
- USN: ${currentStudent.usn}
- Branch: ${currentStudent.branch}
- Semester: ${currentStudent.semester}
- Section: ${currentStudent.section}
- CGPA: ${currentStudent.cgpa}
- Overall Attendance: ${currentStudent.attendancePercentage}%
- Email: ${currentStudent.email}
- Phone: ${currentStudent.phoneNumber}
`
      : "";

    const attendanceInfo = currentStudent
      ? `
Student's Attendance Details:
${attendanceData[currentStudent.usn]
  ?.map(
    (record) =>
      `- ${record.subjectName} (${record.subjectCode}): ${record.percentage}% (${record.attended}/${record.total} classes)`
  )
  .join("\n")}
`
      : "";

    const classesInfo = `
Available Classes:
${classes
  .map(
    (cls) => `
- ${cls.name} (${cls.code})
  Instructor: ${cls.instructor}
  Credits: ${cls.credits}
  Schedule: ${cls.schedule.map((s) => `${s.day} ${s.time} at ${s.room}`).join(", ")}
`
  )
  .join("\n")}
`;

    const eventsInfo = `
Upcoming Events:
${events
  .map(
    (event) => `
- ${event.title}
  Date: ${event.date} at ${event.time}
  Location: ${event.location}
  Category: ${event.category}
  Description: ${event.description}
`
  )
  .join("\n")}
`;

    const collegeInfoText = `
College Information:
Name: ${collegeInfo.name}
Established: ${collegeInfo.established}
Address: ${collegeInfo.address}
Phone: ${collegeInfo.phone}
Email: ${collegeInfo.email}
Website: ${collegeInfo.website}

About: ${collegeInfo.about}

Departments:
${collegeInfo.departments
  .map(
    (dept) => `
- ${dept.name}
  Head: ${dept.head}
  Location: ${dept.location}
  Email: ${dept.email}
  Phone: ${dept.phone}
`
  )
  .join("\n")}

Facilities:
${collegeInfo.facilities
  .map(
    (facility) => `
- ${facility.name}
  Description: ${facility.description}
  Location: ${facility.location}
  Timings: ${facility.timings}
`
  )
  .join("\n")}
`;

    return `You are a helpful Smart Campus Assistant AI for Modern Science College of Engineering. You help students with information about their classes, attendance, events, college facilities, and general campus queries.

${studentInfo}
${attendanceInfo}
${classesInfo}
${eventsInfo}
${collegeInfoText}

Instructions:
- Be conversational, friendly, and helpful
- Provide accurate information based on the data above
- Keep responses concise and clear for voice interaction
- If asked about something not in the data, politely say you don't have that information
- Use the student's name when appropriate
- For attendance queries, mention specific percentages and classes
- For schedule queries, provide day, time, and room information
- Always be encouraging and supportive`;
  };

  const speakResponse = async (text: string) => {
    return new Promise<void>((resolve) => {
      Speech.speak(text, {
        language: "en",
        pitch: 1.0,
        rate: 0.95,
        onDone: () => {
          setState("idle");
          resolve();
        },
        onError: () => {
          setState("idle");
          resolve();
        },
      });
    });
  };

  const handleMicPress = () => {
    if (state === "idle") {
      startListening();
    } else if (state === "listening") {
      stopListening();
    } else if (state === "speaking") {
      Speech.stop();
      setState("idle");
    }
  };

  const getStateText = () => {
    switch (state) {
      case "listening":
        return "Listening...";
      case "processing":
        return "Processing...";
      case "speaking":
        return "Speaking...";
      default:
        return "Tap to speak";
    }
  };

  const getStateColor = () => {
    switch (state) {
      case "listening":
        return "#00ff88";
      case "processing":
        return "#00d4ff";
      case "speaking":
        return "#ff006e";
      default:
        return "#1a1a2e";
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case "listening":
        return "#00ff88";
      case "processing":
        return "#00d4ff";
      case "speaking":
        return "#ff006e";
      default:
        return "#888";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[getStateColor(), "#0a0a0a"]}
            style={styles.modalGradient}
          >
            <View style={styles.dragHandle}>
              <View style={styles.handle} />
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ChevronDown size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.content}>
              <View style={styles.titleSection}>
                <Text style={styles.title}>Neural Interface</Text>
                <View style={styles.statusChip}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor() },
                    ]}
                  />
                  <Text style={styles.statusText}>{getStateText()}</Text>
                </View>
              </View>

              <View style={styles.visualizerContainer}>
                {(state === "listening" || state === "processing") && (
                  <>
                    <Animated.View
                      style={[
                        styles.wave,
                        {
                          opacity: waveAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.2, 0.4, 0.2],
                          }),
                          transform: [
                            {
                              scale: waveAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 2.2],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.wave,
                        styles.waveSecondary,
                        {
                          opacity: waveAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.15, 0.3, 0.15],
                          }),
                          transform: [
                            {
                              scale: waveAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.8],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  </>
                )}

                <TouchableOpacity
                  onPress={handleMicPress}
                  disabled={state === "processing"}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    style={[
                      styles.micButton,
                      {
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  >
                    {state === "processing" ? (
                      <ActivityIndicator size="large" color="#00ff88" />
                    ) : (
                      <Mic
                        size={48}
                        color="#00ff88"
                        strokeWidth={2.5}
                        fill={state === "listening" ? "#00ff88" : "transparent"}
                      />
                    )}
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {transcript && (
                <View style={styles.textContainer}>
                  <Text style={styles.label}>{'>'} INPUT:</Text>
                  <Text style={styles.text}>{transcript}</Text>
                </View>
              )}

              {response && (
                <View style={styles.textContainer}>
                  <Text style={styles.label}>{'<'} RESPONSE:</Text>
                  <Text style={styles.text}>{response}</Text>
                </View>
              )}

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{'!'} ERROR: {error}</Text>
                </View>
              )}

              {state === "idle" && !transcript && (
                <View style={styles.hintContainer}>
                  <Text style={styles.hintText}>
                    Ask about classes, attendance, events, or campus info
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    height: SCREEN_HEIGHT * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalGradient: {
    flex: 1,
  },
  dragHandle: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 32,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#fff",
    letterSpacing: 1,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "rgba(255, 255, 255, 0.9)",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  visualizerContainer: {
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 32,
  },
  wave: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "rgba(0, 255, 136, 0.3)",
  },
  waveSecondary: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.2)",
  },
  micButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(0, 255, 136, 0.15)",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 136, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  textContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#00ff88",
    marginBottom: 8,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  text: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 110, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 110, 0.3)",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  errorText: {
    fontSize: 13,
    color: "#ff006e",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  hintContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  hintText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 20,
  },
});
