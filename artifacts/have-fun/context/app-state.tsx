import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CategoryId } from '@/data/events';

type NotificationPreferences = {
  music: boolean;
  sports: boolean;
  nearby: boolean;
  weeklyDigest: boolean;
};

type AppStateValue = {
  interestedIds: string[];
  toggleInterest: (eventId: string) => void;
  isInterested: (eventId: string) => boolean;
  notificationPreferences: NotificationPreferences;
  toggleNotificationPreference: (key: keyof NotificationPreferences) => void;
  selectedProfileCategories: CategoryId[];
  toggleProfileCategory: (category: CategoryId) => void;
};

const defaultPreferences: NotificationPreferences = {
  music: true,
  sports: true,
  nearby: true,
  weeklyDigest: false,
};

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [interestedIds, setInterestedIds] = useState<string[]>([]);
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences>(defaultPreferences);
  const [selectedProfileCategories, setSelectedProfileCategories] = useState<CategoryId[]>([
    'music',
    'sports',
    'food',
  ]);

  useEffect(() => {
    void Promise.all([
      AsyncStorage.getItem('have-fun:interested'),
      AsyncStorage.getItem('have-fun:notifications'),
      AsyncStorage.getItem('have-fun:profile-categories'),
    ]).then(([storedInterested, storedNotifications, storedCategories]) => {
      if (storedInterested) setInterestedIds(JSON.parse(storedInterested) as string[]);
      if (storedNotifications) {
        setNotificationPreferences({
          ...defaultPreferences,
          ...(JSON.parse(storedNotifications) as Partial<NotificationPreferences>),
        });
      }
      if (storedCategories) setSelectedProfileCategories(JSON.parse(storedCategories) as CategoryId[]);
    });
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      interestedIds,
      toggleInterest: (eventId) => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setInterestedIds((current) => {
          const next = current.includes(eventId)
            ? current.filter((id) => id !== eventId)
            : [...current, eventId];
          void AsyncStorage.setItem('have-fun:interested', JSON.stringify(next));
          return next;
        });
      },
      isInterested: (eventId) => interestedIds.includes(eventId),
      notificationPreferences,
      toggleNotificationPreference: (key) => {
        void Haptics.selectionAsync();
        setNotificationPreferences((current) => {
          const next = { ...current, [key]: !current[key] };
          void AsyncStorage.setItem('have-fun:notifications', JSON.stringify(next));
          return next;
        });
      },
      selectedProfileCategories,
      toggleProfileCategory: (category) => {
        setSelectedProfileCategories((current) => {
          const next = current.includes(category)
            ? current.filter((item) => item !== category)
            : [...current, category];
          void AsyncStorage.setItem('have-fun:profile-categories', JSON.stringify(next));
          return next;
        });
      },
    }),
    [interestedIds, notificationPreferences, selectedProfileCategories],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used inside AppStateProvider');
  return context;
}