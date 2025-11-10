import VoiceModal from "@/components/VoiceModal";
import { useAuth } from "@/contexts/AuthContext";
import { attendanceData } from "@/data/attendance";
import { events } from "@/data/events";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  Code2,
  Cpu,
  Mail,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const { currentStudent } = useAuth();
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);

  const attendance = currentStudent
    ? attendanceData[currentStudent.usn] || []
    : [];

  const upcomingEvents = events.slice(0, 2);

  const avgAttendance = currentStudent?.attendancePercentage || 0;
  const attendanceStatus =
    avgAttendance >= 85 ? "Optimal" : avgAttendance >= 75 ? "Stable" : "Critical";

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <LinearGradient
          colors={["#0a0a0a", "#1a1a2e", "#16213e"]}
          style={styles.backgroundGradient}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerLabel}>SMART CAMPUS AI</Text>
                <Text style={styles.headerTitle}>Mission Control</Text>
              </View>
              <View style={styles.statusBadge}>
                <Activity size={12} color="#00ff88" />
                <Text style={styles.statusText}>ONLINE</Text>
              </View>
            </View>

            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {currentStudent?.name.charAt(0)}
                  </Text>
                  <View style={styles.userAvatarGlow} />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{currentStudent?.name}</Text>
                  <Text style={styles.userMeta}>
                    {currentStudent?.usn} • Sem {currentStudent?.semester}
                  </Text>
                </View>
              </View>
              <View style={styles.cgpaChip}>
                <Code2 size={14} color="#00d4ff" />
                <Text style={styles.cgpaText}>{currentStudent?.cgpa} CGPA</Text>
              </View>
            </View>
          </View>

          <View style={styles.systemsGrid}>
            <View style={[styles.systemCard, styles.systemCardPrimary]}>
              <View style={styles.systemHeader}>
                <View style={styles.systemIcon}>
                  <Cpu size={20} color="#00ff88" />
                </View>
                <Terminal size={16} color="#888" />
              </View>
              <Text style={styles.systemTitle}>Neural Network</Text>
              <Text style={styles.systemValue}>Active</Text>
              <Text style={styles.systemDesc}>AI Assistant Ready</Text>
            </View>

            <View style={[styles.systemCard, styles.systemCardSecondary]}>
              <View style={styles.systemHeader}>
                <View style={styles.systemIcon}>
                  <BarChart3 size={20} color="#00d4ff" />
                </View>
                <Activity size={16} color="#888" />
              </View>
              <Text style={styles.systemTitle}>Attendance</Text>
              <Text style={styles.systemValue}>{avgAttendance}%</Text>
              <Text style={styles.systemDesc}>Status: {attendanceStatus}</Text>
            </View>

            <View style={[styles.systemCard, styles.systemCardTertiary]}>
              <View style={styles.systemHeader}>
                <View style={styles.systemIcon}>
                  <Zap size={20} color="#ff006e" />
                </View>
                <Brain size={16} color="#888" />
              </View>
              <Text style={styles.systemTitle}>Events</Text>
              <Text style={styles.systemValue}>{events.length}</Text>
              <Text style={styles.systemDesc}>Upcoming Tasks</Text>
            </View>

            <View style={[styles.systemCard, styles.systemCardQuaternary]}>
              <View style={styles.systemHeader}>
                <View style={styles.systemIcon}>
                  <BookOpen size={20} color="#ffbe0b" />
                </View>
                <Sparkles size={16} color="#888" />
              </View>
              <Text style={styles.systemTitle}>Subjects</Text>
              <Text style={styles.systemValue}>{attendance.length}</Text>
              <Text style={styles.systemDesc}>Active Courses</Text>
            </View>
          </View>

          <View style={styles.analyticsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>// Performance Analytics</Text>
              <View style={styles.terminalCursor} />
            </View>
            <View style={styles.analyticsCard}>
              <View style={styles.analyticsHeader}>
                <View style={styles.analyticsLegend}>
                  <View style={[styles.legendDot, { backgroundColor: "#00ff88" }]} />
                  <Text style={styles.legendText}>{'>'} 75%</Text>
                </View>
                <View style={styles.analyticsLegend}>
                  <View style={[styles.legendDot, { backgroundColor: "#ff006e" }]} />
                  <Text style={styles.legendText}>{'<'} 75%</Text>
                </View>
              </View>
              <View style={styles.barChart}>
                {attendance.map((record, index) => (
                  <View key={index} style={styles.barGroup}>
                    <View style={styles.barTrack}>
                      <LinearGradient
                        colors={
                          record.percentage >= 75
                            ? ["#00ff88", "#00d4ff"]
                            : ["#ff006e", "#ff4d00"]
                        }
                        style={[
                          styles.barFill,
                          {
                            height: `${Math.max(record.percentage * 0.8, 10)}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barCode}>{record.subjectCode}</Text>
                    <Text style={styles.barValue}>{record.percentage}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>// Scheduled Events</Text>
              <Calendar size={16} color="#00d4ff" />
            </View>
            {upcomingEvents.map((event) => (
              <View key={event.id} style={styles.eventBlock}>
                <View style={styles.eventLine} />
                <View style={styles.eventContent}>
                  <View style={styles.eventTop}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View
                      style={[
                        styles.eventTag,
                        { borderColor: getCategoryColor(event.category) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.eventTagText,
                          { color: getCategoryColor(event.category) },
                        ]}
                      >
                        {event.category.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.eventLocation}>
                    📍 {event.location}
                  </Text>
                  <Text style={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    • {event.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.capabilitiesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>// System Capabilities</Text>
            </View>
            <View style={styles.capGrid}>
              <View style={styles.capCard}>
                <Brain size={24} color="#00ff88" />
                <Text style={styles.capTitle}>Neural AI</Text>
                <Text style={styles.capDesc}>Advanced Q&A</Text>
              </View>
              <View style={styles.capCard}>
                <Sparkles size={24} color="#00d4ff" />
                <Text style={styles.capTitle}>Voice I/O</Text>
                <Text style={styles.capDesc}>Natural Speech</Text>
              </View>
              <View style={styles.capCard}>
                <Mail size={24} color="#ff006e" />
                <Text style={styles.capTitle}>Mail Sync</Text>
                <Text style={styles.capDesc}>Real-time</Text>
              </View>
              <View style={styles.capCard}>
                <BookOpen size={24} color="#ffbe0b" />
                <Text style={styles.capTitle}>Study Aid</Text>
                <Text style={styles.capDesc}>Smart Help</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <TouchableOpacity
          style={styles.aiTriggerBar}
          onPress={() => setVoiceModalVisible(true)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#00ff88", "#00d4ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.aiTriggerGradient}
          >
            <View style={styles.aiTriggerContent}>
              <View style={styles.aiTriggerIcon}>
                <Cpu size={24} color="#000" />
              </View>
              <View style={styles.aiTriggerText}>
                <Text style={styles.aiTriggerLabel}>AI ASSISTANT</Text>
                <Text style={styles.aiTriggerSubtext}>Tap to activate neural interface</Text>
              </View>
              <View style={styles.aiTriggerPulse} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <VoiceModal
          visible={voiceModalVisible}
          onClose={() => setVoiceModalVisible(false)}
        />
      </View>
    </>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    technical: "#00ff88",
    cultural: "#ff006e",
    sports: "#00d4ff",
    academic: "#ffbe0b",
  };
  return colors[category] || "#888";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#00ff88",
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#fff",
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderWidth: 1,
    borderColor: "#00ff88",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: "#00ff88",
    letterSpacing: 1,
  },
  userCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 212, 255, 0.2)",
    borderWidth: 2,
    borderColor: "#00d4ff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#00d4ff",
  },
  userAvatarGlow: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00d4ff",
    opacity: 0.2,
  },
  userDetails: {
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  userMeta: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  cgpaChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.3)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  cgpaText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#00d4ff",
  },
  systemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  systemCard: {
    width: (width - 52) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  systemCardPrimary: {
    borderColor: "rgba(0, 255, 136, 0.3)",
  },
  systemCardSecondary: {
    borderColor: "rgba(0, 212, 255, 0.3)",
  },
  systemCardTertiary: {
    borderColor: "rgba(255, 0, 110, 0.3)",
  },
  systemCardQuaternary: {
    borderColor: "rgba(255, 190, 11, 0.3)",
  },
  systemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  systemIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  systemTitle: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  systemValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 2,
  },
  systemDesc: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
  },
  analyticsSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  terminalCursor: {
    width: 8,
    height: 16,
    backgroundColor: "#00ff88",
  },
  analyticsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
  },
  analyticsHeader: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  analyticsLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  barChart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 140,
  },
  barGroup: {
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  barTrack: {
    width: 32,
    height: 110,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  barCode: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: "rgba(255, 255, 255, 0.4)",
  },
  barValue: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#00ff88",
  },
  eventsSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  eventBlock: {
    flexDirection: "row",
    marginBottom: 16,
  },
  eventLine: {
    width: 3,
    backgroundColor: "rgba(0, 212, 255, 0.3)",
    marginRight: 12,
    borderRadius: 2,
  },
  eventContent: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  eventTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#fff",
    flex: 1,
    marginRight: 8,
  },
  eventTag: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  eventTagText: {
    fontSize: 9,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
  eventLocation: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
  },
  eventDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  capabilitiesSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  capGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  capCard: {
    width: (width - 50) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  capTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#fff",
  },
  capDesc: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
  },
  aiTriggerBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  aiTriggerGradient: {
    padding: 18,
  },
  aiTriggerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  aiTriggerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  aiTriggerText: {
    flex: 1,
    gap: 2,
  },
  aiTriggerLabel: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#000",
    letterSpacing: 1,
  },
  aiTriggerSubtext: {
    fontSize: 11,
    color: "rgba(0, 0, 0, 0.7)",
  },
  aiTriggerPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
});
