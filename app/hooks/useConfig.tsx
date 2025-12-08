'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Default responses voor opzegging
const DEFAULT_CANCEL_RESPONSES: Record<string, { date: string; message: string }> = {
  HIGH_COST: { date: 'even contact op', message: 'We hebben ook flexibele abonnementen. Mogen we je bellen over de mogelijkheden?' },
  FOUND_CHEAPER_ALTERNATIVE: { date: 'even contact op', message: 'We matchen graag andere aanbiedingen. Laat ons weten wat je hebt gevonden!' },
  FINANCIAL_HARDSHIP: { date: 'even contact op', message: 'We begrijpen het. We hebben opties om je te helpen - mogen we je bellen?' },
  LACK_OF_PROGRESS: { date: 'een gratis PT sessie', message: 'We willen je helpen je doelen te bereiken. Gratis personal training sessie?' },
  SLOW_RESULTS: { date: 'een gratis PT sessie', message: 'Laat ons je helpen met een persoonlijk plan. Gratis PT sessie aangeboden!' },
  LOST_INTEREST: { date: 'deze week', message: 'Heb je onze nieuwe groepslessen al gezien? Kom vrijblijvend langs!' },
  FEELING_OVERWHELMED: { date: 'rustig aan', message: 'Begin klein - we helpen je graag met een relaxed schema. Geen druk!' },
  TIME_CONSTRAINTS: { date: 'flexibele tijden', message: 'We zijn doordeweeks 6-23u open. Vroege of late workout past misschien beter?' },
  INCONVENIENT_HOURS: { date: 'onze nieuwe tijden', message: 'We hebben onze openingstijden uitgebreid! Check onze nieuwe uren.' },
  LOCATION_CHANGE: { date: 'veel succes', message: 'Jammer dat je verhuist! Je bent altijd welkom als je in de buurt bent.' },
  COMMUTING_DIFFICULTY: { date: 'even kijken', message: 'Vervoer lastig? We hebben gratis parkeren en zijn goed bereikbaar met OV.' },
  LACK_OF_COMMUNITY: { date: 'onze community events', message: 'We organiseren nu meer groepsactiviteiten! Kom kennismaken met andere leden.' },
  FRIENDS_LEFT: { date: 'een bring-a-friend actie', message: 'Breng een nieuwe vriend gratis mee! Samen sporten is leuker.' },
  UNWELCOMING_ENVIRONMENT: { date: 'persoonlijk contact', message: 'Dit vinden we vervelend om te horen. Mogen we je bellen om dit te bespreken?' },
  POOR_COMMUNICATION: { date: 'verbetering', message: 'Bedankt voor je feedback. We willen dit graag rechtzetten - mogen we bellen?' },
  LACK_OF_ATTENTION: { date: 'een gratis PT sessie', message: 'Je verdient meer aandacht! Gratis personal training om je op weg te helpen?' },
  GENERAL_DISSATISFACTION: { date: 'graag contact', message: 'We horen graag wat er beter kan. Mogen we je bellen voor feedback?' },
  EQUIPMENT_ISSUES: { date: 'goed nieuws', message: 'We hebben geïnvesteerd in nieuwe apparatuur! Kom gerust kijken.' },
  CLEANLINESS_CONCERNS: { date: 'verbeteringen', message: 'We hebben extra schoonmaakrondes ingevoerd. Kom zelf kijken!' },
  HEALTH_ISSUES: { date: 'beterschap', message: 'We hopen dat het snel beter gaat. Je bent altijd welkom terug wanneer je klaar bent.' },
  MAJOR_LIFE_CHANGE: { date: 'succes', message: 'Veel succes met de veranderingen! Onze deur staat altijd open.' },
  TRAVEL_FREQUENCY: { date: 'flexibele opties', message: 'We hebben ook strippenkaarten voor wie veel reist. Interesse?' },
  SELF_SUFFICIENT: { date: 'goed gedaan', message: 'Knap dat je zelfstandig verder gaat! Mocht je ons missen, je bent welkom.' },
  SEASONAL_MEMBER: { date: 'tot snel', message: 'We zien je graag terug volgend seizoen! Tot dan.' },
  BETTER_ALTERNATIVE: { date: 'even contact', message: 'We zijn benieuwd wat je hebt gevonden. Feedback helpt ons verbeteren!' },
  OTHER: { date: 'binnenkort', message: 'We vinden het jammer dat je weggaat. Mogen we vragen waarom?' },
};

// Default responses voor inactieve leden
const DEFAULT_INACTIVE_RESPONSES: Record<string, { date: string; message: string }> = {
  '30': { date: 'alweer 30 dagen', message: 'We missen je! Kom je snel weer trainen? Je eerste workout terug is altijd de moeilijkste 💪' },
  '60': { date: 'al 60 dagen', message: 'Lang niet gezien! We hebben je plek warm gehouden. Zullen we een afspraak maken om je weer op weg te helpen?' },
};

// Default birthday message
const DEFAULT_BIRTHDAY_MESSAGE = {
  date: 'vandaag jarig',
  message: '🎉 Gefeliciteerd met je verjaardag! Kom langs voor een feestelijke workout - je eerste drankje is van ons!',
};

// Default class reminder message
const DEFAULT_CLASS_REMINDER_MESSAGE = {
  date: 'morgen',
  message: 'Je staat ingeschreven voor een les! Vergeet niet je sportspullen mee te nemen 💪',
};

export interface Config {
  // Gym info
  gymName: string;
  testPhone: string;
  // Proefles
  welcomeDate: string;
  welcomeMessage: string;
  // Opzegging
  cancelResponses: Record<string, { date: string; message: string }>;
  // Inactieve leden
  inactiveResponses: Record<string, { date: string; message: string }>;
  // Verjaardagen
  birthdayMessage: { date: string; message: string };
  // Les reminders
  classReminderMessage: { date: string; message: string };
}

const defaultConfig: Config = {
  gymName: 'Potentia Gym',
  testPhone: '+31624242177',
  welcomeDate: 'deze week',
  welcomeMessage: 'Potentia Gym - we kijken ernaar uit je te ontmoeten!',
  cancelResponses: DEFAULT_CANCEL_RESPONSES,
  inactiveResponses: DEFAULT_INACTIVE_RESPONSES,
  birthdayMessage: DEFAULT_BIRTHDAY_MESSAGE,
  classReminderMessage: DEFAULT_CLASS_REMINDER_MESSAGE,
};

interface ConfigContextType {
  config: Config;
  updateConfig: (updates: Partial<Config>) => void;
  updateCancelResponse: (reason: string, field: 'date' | 'message', value: string) => void;
  updateInactiveResponse: (days: string, field: 'date' | 'message', value: string) => void;
  updateBirthdayMessage: (field: 'date' | 'message', value: string) => void;
  updateClassReminderMessage: (field: 'date' | 'message', value: string) => void;
  saveConfig: () => void;
  saved: boolean;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [saved, setSaved] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('gymly-config-v4');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig({
        ...defaultConfig,
        ...parsed,
        cancelResponses: { ...DEFAULT_CANCEL_RESPONSES, ...parsed.cancelResponses },
        inactiveResponses: { ...DEFAULT_INACTIVE_RESPONSES, ...parsed.inactiveResponses },
        birthdayMessage: { ...DEFAULT_BIRTHDAY_MESSAGE, ...parsed.birthdayMessage },
        classReminderMessage: { ...DEFAULT_CLASS_REMINDER_MESSAGE, ...parsed.classReminderMessage },
      });
    }
  }, []);

  const updateConfig = (updates: Partial<Config>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateCancelResponse = (reason: string, field: 'date' | 'message', value: string) => {
    setConfig(prev => ({
      ...prev,
      cancelResponses: {
        ...prev.cancelResponses,
        [reason]: { ...prev.cancelResponses[reason], [field]: value },
      },
    }));
  };

  const updateInactiveResponse = (days: string, field: 'date' | 'message', value: string) => {
    setConfig(prev => ({
      ...prev,
      inactiveResponses: {
        ...prev.inactiveResponses,
        [days]: { ...prev.inactiveResponses[days], [field]: value },
      },
    }));
  };

  const updateBirthdayMessage = (field: 'date' | 'message', value: string) => {
    setConfig(prev => ({
      ...prev,
      birthdayMessage: { ...prev.birthdayMessage, [field]: value },
    }));
  };

  const updateClassReminderMessage = (field: 'date' | 'message', value: string) => {
    setConfig(prev => ({
      ...prev,
      classReminderMessage: { ...prev.classReminderMessage, [field]: value },
    }));
  };

  const saveConfig = () => {
    localStorage.setItem('gymly-config-v4', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ConfigContext.Provider value={{ 
      config, 
      updateConfig, 
      updateCancelResponse, 
      updateInactiveResponse, 
      updateBirthdayMessage,
      updateClassReminderMessage,
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