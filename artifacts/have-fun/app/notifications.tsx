import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandMark, ScreenBackground, styles as ui } from '@/components/have-fun-ui';
import { events, formatInterested } from '@/data/events';
import { useColors } from '@/hooks/useColors';

const notifications = [
  { id: '1', eventId: 'live-concert-tunis', title: 'Something is happening tonight', subtitle: 'A live concert is waiting in Carthage.', icon: 'music-note', colorKey: 'pink' as const },
  { id: '2', eventId: 'tunis-drift-show', title: 'Something fun tomorrow', subtitle: 'New activity near you: Tunis Drift Show.', icon: 'car-sports', colorKey: 'orange' as const },
  { id: '3', eventId: 'street-food-festival', title: 'Make this week count', subtitle: 'Street Food Festival is coming to La Marsa.', icon: 'silverware-fork-knife', colorKey: 'gold' as const },
];

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <ScreenBackground>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.topbar}><BrandMark compact /><Pressable onPress={() => router.back()}><Feather name="x" size={21} color={colors.foreground} /></Pressable></View>
            <View style={styles.intro}><Text style={[styles.kicker, { color: colors.pink }]}>YOUR SIGNAL</Text><Text style={[styles.title, { color: colors.foreground }]}>Come with us.</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Useful nudges for things worth leaving home for.</Text></View>
          </View>
        }
        renderItem={({ item }) => {
          const event = events.find((entry) => entry.id === item.eventId) ?? events[0];
          const color = colors[item.colorKey];
          return (
            <Pressable onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })} style={({ pressed }) => [styles.notificationCard, { backgroundColor: colors.glass, borderColor: `${color}75`, opacity: pressed ? 0.82 : 1 }]}>
              <View style={[styles.notificationIcon, { backgroundColor: `${color}22` }]}><MaterialCommunityIcons name={item.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']} size={21} color={color} /></View>
              <View style={styles.copy}><Text style={[styles.invite, { color }]}>COME WITH US</Text><Text style={[styles.notificationTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.notificationSubtitle, { color: colors.mutedForeground }]}>{item.subtitle}</Text><View style={styles.notificationMeta}><Text style={[styles.metaText, { color: colors.secondaryForeground }]}>{event.dateLabel} · {event.time}</Text><Text style={[styles.metaText, { color: colors.mutedForeground }]}>{formatInterested(event.interested)} interested</Text></View></View><Feather name="arrow-up-right" size={18} color={color} /></Pressable>
          );
        }}
        ListFooterComponent={<View style={[styles.preferenceHint, { backgroundColor: colors.secondary }]}><Feather name="sliders" size={16} color={colors.blue} /><Text style={[styles.preferenceText, { color: colors.mutedForeground }]}>Tune your categories and frequency in Profile.</Text></View>}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  intro: { paddingTop: 43, paddingBottom: 26 },
  kicker: { fontSize: 10, fontWeight: '700', letterSpacing: 2.5, marginBottom: 8 },
  title: { fontSize: 36, lineHeight: 40, fontWeight: '700', letterSpacing: -1.2 },
  subtitle: { fontSize: 14, lineHeight: 20, marginTop: 10, maxWidth: 290 },
  notificationCard: { borderRadius: 22, borderWidth: 1, padding: 15, flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  notificationIcon: { width: 43, height: 43, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  invite: { fontSize: 9, fontWeight: '800', letterSpacing: 1.6, marginBottom: 5 },
  notificationTitle: { fontSize: 16, fontWeight: '700' },
  notificationSubtitle: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  notificationMeta: { flexDirection: 'row', gap: 12, marginTop: 12 },
  metaText: { fontSize: 10, fontWeight: '600' },
  preferenceHint: { borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 9 },
  preferenceText: { fontSize: 11, flex: 1 },
});