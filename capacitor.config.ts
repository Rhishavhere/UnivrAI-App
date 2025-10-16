import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.echo',
  appName: 'Smart Campus Assistant',
  webDir: 'dist',
  server: {
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    SpeechRecognition: {
      language: "en-US",
    }
  }
};

export default config;
