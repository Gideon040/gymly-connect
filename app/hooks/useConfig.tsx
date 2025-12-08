'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Config {
  gymId: string;
  gymName: string;
  gymSlug: string;
  testPhone: string;
  welcomeDate: string;
  welcomeMessage: string;
  cancelResponses: Record<string, { date: string; message: string }>;
  inactiveResponses: Record<string, { date: string; message: string }>;
  birthdayDate: string;
  birthdayMessage: string;
}

interface Stats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  deliveryRate: number;
}

interface ConfigContextType {
  config: Config;
  stats: Stats;
  loading: boolean;
  updateConfig: (updates: Partial<Config>) => void;
  updateCancelResponse: (reason: string, field: 'date' | 'message', value: string) => void;
  updateInactiveResponse: (days: string, field: 'date' | 'message', value: string) => void;
  saveConfig: () => Promise<void>;
  saved: boolean;
}

const defaultConfig: Config = {
  gymId: '',
  gymName: 'Potentia Gym',
  gymSlug: 'potentia-gym',
  testPhone: '+31624242177',
  welcomeDate: 'deze week',
  welcomeMessage: 'Potentia Gym - we kijken ernaar uit je te ontmoeten!',
  cancelResponses: {},
  inactiveResponses: {
    '30': { date: 'alweer 30 dagen', message: 'We missen je! Kom je snel weer trainen?' },
    '60': { date: 'al 60 dagen', message: 'Lang niet gezien! We hebben je plek warm gehouden.' },
  },
  birthdayDate: 'vandaag jarig',
  birthdayMessage: '🎉 Gefeliciteerd met je verjaardag!',
};

const defaultStats: Stats = {
  total: 0,
  byType: {},
  byStatus: {},
  deliveryRate: 0,
};

const ConfigContext = createContext<ConfigContextType | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Later: haal gym slug uit auth/session
  const gymSlug = 'potentia-gym';

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load templates
      const templatesRes = await fetch(`/api/templates?gym=${gymSlug}`);
      const templatesData = await templatesRes.json();

      // Load stats
      const statsRes = await fetch(`/api/stats?gym=${gymSlug}`);
      const statsData = await statsRes.json();

      if (templatesData.gym) {
        const newConfig = { ...defaultConfig };
        newConfig.gymId = templatesData.gym.id;
        newConfig.gymName = templatesData.gym.name;
        newConfig.gymSlug = templatesData.gym.slug;

        templatesData.templates?.forEach((t: { type: string; trigger_key: string | null; date_text: string; message_text: string }) => {
          if (t.type === 'proefles') {
            newConfig.welcomeDate = t.date_text;
            newConfig.welcomeMessage = t.message_text;
          } else if (t.type === 'inactief_30') {
            newConfig.inactiveResponses['30'] = { date: t.date_text, message: t.message_text };
          } else if (t.type === 'inactief_60') {
            newConfig.inactiveResponses['60'] = { date: t.date_text, message: t.message_text };
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

      if (statsData.stats) {
        const total = statsData.stats.total || 0;
        const delivered = statsData.stats.byStatus?.delivered || 0;
        setStats({
          ...statsData.stats,
          deliveryRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  function updateConfig(updates: Partial<Config>) {
    setConfig(prev => ({ ...prev, ...updates }));
    setSaved(false);
  }

  function updateCancelResponse(reason: string, field: 'date' | 'message', value: string) {
    setConfig(prev => ({
      ...prev,
      cancelResponses: {
        ...prev.cancelResponses,
        [reason]: {
          ...prev.cancelResponses[reason],
          [field]: value,
        },
      },
    }));
    setSaved(false);
  }

  function updateInactiveResponse(days: string, field: 'date' | 'message', value: string) {
    setConfig(prev => ({
      ...prev,
      inactiveResponses: {
        ...prev.inactiveResponses,
        [days]: {
          ...prev.inactiveResponses[days],
          [field]: value,
        },
      },
    }));
    setSaved(false);
  }

  async function saveConfig() {
    const gymSlug = config.gymSlug;

    try {
      // Save proefles
      await fetch(`/api/templates?gym=${gymSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'proefles',
          dateText: config.welcomeDate,
          messageText: config.welcomeMessage,
        }),
      });

      // Save inactief
      for (const [days, data] of Object.entries(config.inactiveResponses)) {
        await fetch(`/api/templates?gym=${gymSlug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: `inactief_${days}`,
            dateText: data.date,
            messageText: data.message,
          }),
        });
      }

      // Save verjaardag
      await fetch(`/api/templates?gym=${gymSlug}`, {
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
        await fetch(`/api/templates?gym=${gymSlug}`, {
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
    <ConfigContext.Provider value={{ 
      config, 
      stats, 
      loading, 
      updateConfig, 
      updateCancelResponse, 
      updateInactiveResponse, 
      saveConfig, 
      saved 
    }}>
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