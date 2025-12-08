'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Config {
  gymName: string;
  testPhone: string;
  welcomeDate: string;
  welcomeMessage: string;
  cancelResponses: Record<string, { date: string; message: string }>;
  inactive30Date: string;
  inactive30Message: string;
  inactive60Date: string;
  inactive60Message: string;
  birthdayDate: string;
  birthdayMessage: string;
}

interface ConfigContextType {
  config: Config;
  loading: boolean;
  updateConfig: (updates: Partial<Config>) => void;
  updateCancelResponse: (reason: string, date: string, message: string) => void;
  saveConfig: () => Promise<void>;
  saved: boolean;
}

const defaultConfig: Config = {
  gymName: 'Potentia Gym',
  testPhone: '+31624242177',
  welcomeDate: 'deze week',
  welcomeMessage: 'Potentia Gym - we kijken ernaar uit je te ontmoeten!',
  cancelResponses: {},
  inactive30Date: 'alweer 30 dagen',
  inactive30Message: 'We missen je! Kom je snel weer trainen?',
  inactive60Date: 'al 60 dagen',
  inactive60Message: 'Lang niet gezien! We hebben je plek warm gehouden.',
  birthdayDate: 'vandaag jarig',
  birthdayMessage: '🎉 Gefeliciteerd met je verjaardag!',
};

const ConfigContext = createContext<ConfigContextType | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const res = await fetch('/api/templates?gym=potentia-gym');
      const data = await res.json();

      if (data.templates) {
        const newConfig = { ...defaultConfig };
        
        if (data.gym?.name) {
          newConfig.gymName = data.gym.name;
        }

        data.templates.forEach((t: { type: string; trigger_key: string | null; date_text: string; message_text: string }) => {
          if (t.type === 'proefles') {
            newConfig.welcomeDate = t.date_text;
            newConfig.welcomeMessage = t.message_text;
          } else if (t.type === 'inactief_30') {
            newConfig.inactive30Date = t.date_text;
            newConfig.inactive30Message = t.message_text;
          } else if (t.type === 'inactief_60') {
            newConfig.inactive60Date = t.date_text;
            newConfig.inactive60Message = t.message_text;
          } else if (t.type === 'verjaardag') {
            newConfig.birthdayDate = t.date_text;
            newConfig.birthdayMessage = t.message_text;
          } else if (t.type === 'opzegging' && t.trigger_key) {
            newConfig.cancelResponses[t.trigger_key] = {
              date: t.date_text,
              message: t.message_text,
            };
          }
        });

        setConfig(newConfig);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  }

  function updateConfig(updates: Partial<Config>) {
    setConfig(prev => ({ ...prev, ...updates }));
    setSaved(false);
  }

  function updateCancelResponse(reason: string, date: string, message: string) {
    setConfig(prev => ({
      ...prev,
      cancelResponses: {
        ...prev.cancelResponses,
        [reason]: { date, message },
      },
    }));
    setSaved(false);
  }

  async function saveConfig() {
    try {
      // Save proefles
      await fetch('/api/templates?gym=potentia-gym', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'proefles',
          dateText: config.welcomeDate,
          messageText: config.welcomeMessage,
        }),
      });

      // Save inactief_30
      await fetch('/api/templates?gym=potentia-gym', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'inactief_30',
          dateText: config.inactive30Date,
          messageText: config.inactive30Message,
        }),
      });

      // Save inactief_60
      await fetch('/api/templates?gym=potentia-gym', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'inactief_60',
          dateText: config.inactive60Date,
          messageText: config.inactive60Message,
        }),
      });

      // Save verjaardag
      await fetch('/api/templates?gym=potentia-gym', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'verjaardag',
          dateText: config.birthdayDate,
          messageText: config.birthdayMessage,
        }),
      });

      // Save cancel responses
      for (const [reason, data] of Object.entries(config.cancelResponses)) {
        await fetch('/api/templates?gym=potentia-gym', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'opzegging',
            triggerKey: reason,
            dateText: data.date,
            messageText: data.message,
          }),
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  return (
    <ConfigContext.Provider value={{ config, loading, updateConfig, updateCancelResponse, saveConfig, saved }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
}