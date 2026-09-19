import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventCard, BrandMark, CategorySelector, LiveSignal, ScreenBackground, SectionLabel, TimeFilterRow } from '@/components/have-fun-ui';
import { events } from '@/data/events';
import { fetchRemoteEvents } from '@/data/api-events';
import { useColors } from '@/hooks/useColors';

export default function DiscoverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState('today');
  const [category, setCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [availableEvents, setAvailableEvents] = useState(events);
  const [feedMessage, setFeedMessage] = useState<string | null>(null);
  const filteredEvents = useMemo(
    () => availableEvents.filter((event) => event.timeFilter === timeFilter && (category === 'all' || event.category === category)),
    [availableEvents, category, timeFilter],
  );

  React.useEffect(() => {
    let mounted = true;
    void fetchRemoteEvents()
      .then((remoteEvents) => {
        if (!mounted || remoteEvents.length === 0) return;
        setAvailableEvents(remoteEvents);
        setFeedMessage(null);
      })
      .catch(() => {
        if (mounted) setFeedMessage('Live feed unavailable · showing local picks');
      });
    return () => {
      mounted = false;
    };
  }, []);

  const refresh = () => {
    setRefreshing(true);
    void fetchRemoteEvents()
      .then((remoteEvents) => {
        if (remoteEvents.length > 0) {
          setAvailableEvents(remoteEvents);
          setFeedMessage(null);
        }
      })
      .catch(() => setFeedMessage('Live feed unavailable · showing local picks'))
      .finally(() => setRefreshing(false));
  };

  return (
    <ScreenBackground>
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 100 }]}
        ListHeaderComponent={
          <View>
            <View style={styles.topbar}>
              <BrandMark />
              <View style={styles.topbarActions}>
                <Pressable onPress={() => router.push('/notifications')} style={[styles.notificationButton, { backgroundColor: colors.glass, borderColor: colors.border }]}>
                  <Feather name="bell" size={18} color={colors.foreground} />
                  <View style={[styles.notificationDot, { backgroundColor: colors.pink }]} />
                </Pressable>
                <Pressable onPress={() => router.push('/profile')} style={[styles.notificationButton, { backgroundColor: colors.glass, borderColor: colors.border }]}>
                  <Feather name="user" size={18} color={colors.foreground} />
                </Pressable>
              </View>
            </View>
            <View style={styles.hero}>
              <Text style={[styles.heroKicker, { color: colors.mutedForeground }]}>YOU'RE IN</Text>
              <Pressable style={styles.locationRow} onPress={() => undefined}>
                <Feather name="map-pin" size={16} color={colors.blue} />
                <Text style={[styles.locationText, { color: colors.foreground }]}>Tunis, Tunisia</Text>
                <Feather name="chevron-down" size={15} color={colors.mutedForeground} />
              </Pressable>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>Something is{'\n'}happening.</Text>
              <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>Find your next reason to go out.</Text>
            </View>
            <TimeFilterRow active={timeFilter} onChange={setTimeFilter} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContent}>
              <CategorySelector selected={category} onChange={setCategory} />
            </ScrollView>
            <LiveSignal count={availableEvents.filter((event) => event.timeFilter === 'today').length} accent={colors.pink} />
            {feedMessage && <Text style={[styles.feedMessage, { color: colors.mutedForeground }]}>{feedMessage}</Text>}
            <SectionLabel eyebrow="DISCOVER" title={timeFilter === 'today' ? 'Tonight in Tunis' : `Coming up ${timeFilter === 'week' ? 'this week' : timeFilter === 'month' ? 'next month' : 'tomorrow'}`} />
            {filteredEvents.length === 0 && (
              <View style={[styles.empty, { backgroundColor: colors.glass, borderColor: colors.border }]}>
                <Feather name="compass" size={24} color={colors.primary} />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Nothing here yet</Text>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Try another category or time window. We’ll keep looking.</Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          filteredEvents.length > 0 ? (
            <View style={styles.footerNote}>
              <View style={[styles.footerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.footerText, { color: colors.mutedForeground }]}>COME WITH US · HAVE FUN</Text>
              <View style={[styles.footerLine, { backgroundColor: colors.border }]} />
            </View>
          ) : null
        }
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18 },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topbarActions: { flexDirection: 'row', gap: 8 },
  notificationButton: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { width: 6, height: 6, borderRadius: 3, position: 'absolute', top: 10, right: 11 },
  hero: { paddingTop: 35, paddingBottom: 24 },
  heroKicker: { fontSize: 10, fontWeight: '700', letterSpacing: 2.5, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  locationText: { fontSize: 14, fontWeight: '700' },
  heroTitle: { fontSize: 43, lineHeight: 45, fontWeight: '700', letterSpacing: -1.8, marginTop: 24 },
  heroSub: { fontSize: 14, marginTop: 10 },
  categoryContent: { paddingBottom: 27 },
  empty: { borderWidth: 1, borderRadius: 22, padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginTop: 11 },
  emptyText: { fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 6, maxWidth: 250 },
  footerNote: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 8 },
  footerLine: { flex: 1, height: 1 },
  footerText: { fontSize: 9, fontWeight: '700', letterSpacing: 1.7 },
  feedMessage: { fontSize: 11, textAlign: 'center', marginTop: -12, marginBottom: 14 },
});
