import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandMark, ScreenBackground, SectionLabel, SettingRow, styles as ui } from '@/components/have-fun-ui';
import { categories } from '@/data/events';
import { useAppState } from '@/context/app-state';
import { useColors } from '@/hooks/useColors';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notificationPreferences, toggleNotificationPreference, selectedProfileCategories, toggleProfileCategory } = useAppState();
  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}><BrandMark compact /><Pressable onPress={() => router.push('/notifications')}><Feather name="bell" size={19} color={colors.foreground} /></Pressable></View>
        <View style={styles.profileHero}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={[styles.avatarText, { color: colors.primaryForeground }]}>G</Text></View>
          <View style={styles.profileCopy}><Text style={[styles.eyebrow, { color: colors.blue }]}>YOUR HAVE FUN</Text><Text style={[styles.profileTitle, { color: colors.foreground }]}>Guest account</Text><Text style={[styles.profileSubtitle, { color: colors.mutedForeground }]}>Save your plans and tune your signal.</Text></View>
        </View>
        <Pressable onPress={() => Alert.alert('Account setup', 'Email sign-in will be connected when the app authentication service is enabled. Your interests and preferences are already saved on this device.')} style={[styles.accountButton, { backgroundColor: colors.secondary, borderColor: colors.border }]}><Feather name="lock" size={15} color={colors.primary} /><Text style={[styles.accountButtonText, { color: colors.foreground }]}>Set up email account</Text><Feather name="arrow-up-right" size={15} color={colors.mutedForeground} /></Pressable>
        <View style={styles.section}><SectionLabel eyebrow="PERSONALIZE" title="Your categories" /><Text style={[styles.helper, { color: colors.mutedForeground }]}>Pick the energy you want to hear about.</Text><View style={styles.categoryGrid}>{categories.filter((category) => category.id !== 'all').map((category) => { const active = selectedProfileCategories.includes(category.id); return <Pressable key={category.id} onPress={() => toggleProfileCategory(category.id)} style={[styles.preferenceChip, { backgroundColor: active ? `${category.color}22` : colors.glass, borderColor: active ? category.color : colors.border }]}><MaterialCommunityIcons name={category.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']} size={16} color={active ? category.color : colors.mutedForeground} /><Text style={[styles.preferenceChipText, { color: active ? colors.foreground : colors.mutedForeground }]}>{category.label}</Text>{active && <Feather name="check" size={13} color={category.color} />}</Pressable>; })}</View></View>
        <View style={styles.section}><SectionLabel eyebrow="NOTIFICATIONS" title="Keep it useful" /><SettingRow icon="music" title="Music & shows" description="Concerts, festivals, and live sets." value={notificationPreferences.music} onChange={() => toggleNotificationPreference('music')} /><SettingRow icon="activity" title="Sports & action" description="Matches, drift, and outdoor energy." value={notificationPreferences.sports} onChange={() => toggleNotificationPreference('sports')} /><SettingRow icon="map-pin" title="Near Tunis" description="Only show the places closest to you." value={notificationPreferences.nearby} onChange={() => toggleNotificationPreference('nearby')} /><SettingRow icon="calendar" title="Weekly signal" description="One calm round-up every Thursday." value={notificationPreferences.weeklyDigest} onChange={() => toggleNotificationPreference('weeklyDigest')} /></View>
        <View style={[styles.philosophy, { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}45` }]}><Feather name="sun" size={18} color={colors.gold} /><Text style={[styles.philosophyText, { color: colors.secondaryForeground }]}>The goal is not more screen time. It’s a better reason to step outside.</Text></View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18 },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileHero: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingTop: 37, paddingBottom: 22 },
  avatar: { width: 60, height: 60, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 25, fontWeight: '700' },
  profileCopy: { flex: 1 },
  eyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.8, marginBottom: 5 },
  profileTitle: { fontSize: 22, fontWeight: '700' },
  profileSubtitle: { fontSize: 12, marginTop: 4 },
  accountButton: { minHeight: 48, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14 },
  accountButtonText: { flex: 1, fontSize: 12, fontWeight: '700' },
  section: { paddingTop: 31 },
  helper: { fontSize: 12, marginTop: -5, marginBottom: 15 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  preferenceChip: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 13, paddingHorizontal: 10, paddingVertical: 9 },
  preferenceChipText: { fontSize: 11, fontWeight: '600' },
  philosophy: { borderWidth: 1, borderRadius: 18, padding: 15, flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 31 },
  philosophyText: { flex: 1, fontSize: 12, lineHeight: 18, fontWeight: '500' },
});