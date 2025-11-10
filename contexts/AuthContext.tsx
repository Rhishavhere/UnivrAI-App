import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Student, students } from "@/data/students";

const AUTH_STORAGE_KEY = "campus_assistant_auth";

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUSN = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUSN) {
        const student = students.find((s) => s.usn === storedUSN);
        if (student) {
          setCurrentStudent(student);
        }
      }
    } catch (error) {
      console.error("Failed to load stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (usn: string, password: string): Promise<boolean> => {
    const student = students.find(
      (s) => s.usn === usn && s.password === password
    );

    if (student) {
      setCurrentStudent(student);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, usn);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(async () => {
    setCurrentStudent(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return useMemo(
    () => ({
      currentStudent,
      isLoading,
      isAuthenticated: !!currentStudent,
      login,
      logout,
    }),
    [currentStudent, isLoading, login, logout]
  );
});
