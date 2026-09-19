import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AtmosphereLayer, AudioPreview, AnimatedEventImage, InterestedButton, IconButton, ScreenBackground, styles as ui } from '@/components/have-fun-ui';
import { events, formatInterested } from '@/data/events';
import { useAppState } from '@/context/app-state';
import { useColors } from '@/hooks/useColors';

export default function EventDetailsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = events.find((item) => item.id === id) ?? events[0];
  const { isInterested } = useAppState();
  const interested = isInterested(event.id);

  const openLocation = () => {
    const query = encodeURIComponent(`${event.venue}, ${event.address}`);
    void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const shareEvent = () => {
    void Share.share({ message: `${event.title} · ${event.dateLabel} at ${event.time}\n${event.venue}, ${event.location}\nHave Fun` });
  };

  return (
    <ScreenBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}>
        <View style={styles.heroImage}>
          <AnimatedEventImage source={event.image} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['rgba(8,9,20,0.18)', colors.background]} locations={[0.25, 1]} style={StyleSheet.absoluteFill} />
          <AtmosphereLayer event={event} />
          <View style={[styles.header, { top: insets.top + 12 }]}>
            <IconButton icon="arrow-left" label="Go back" onPress={() => router.back()} />
            <View style={styles.headerActions}>
              <IconButton icon="share-2" label="Share event" onPress={shareEvent} />
            </View>
          </View>
          <View style={styles.heroCopy}>
            <View style={[styles.categoryBadge, { backgroundColor: event.accent }]}>
              <MaterialCommunityIcons name={event.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']} size={14} color={colors.navy} />
              <Text style={[styles.categoryBadgeText, { color: colors.navy }]}>{event.categoryLabel.toUpperCase()}</Text>
            </View>
            <Text style={[styles.title, { color: colors.foreground }]}>{event.title}</Text>
            <Text style={[styles.heroCuriosity, { color: colors.secondaryForeground }]}>{event.curiosityLine}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.detailMeta}>
            <View style={styles.detailMetaItem}>
              <View style={[styles.metaIcon, { backgroundColor: `${event.accent}20` }]}>
                <Feather name="calendar" size={17} color={event.accent} />
              </View>
              <View><Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>WHEN</Text><Text style={[styles.metaValue, { color: colors.foreground }]}>{event.dateLabel} · {event.time}</Text></View>
            </View>
            <View style={styles.detailMetaItem}>
              <View style={[styles.metaIcon, { backgroundColor: `${event.accent}20` }]}>
                <Feather name="map-pin" size={17} color={event.accent} />
              </View>
              <View><Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>WHERE</Text><Text style={[styles.metaValue, { color: colors.foreground }]}>{event.location}</Text></View>
            </View>
          </View>
          <Text style={[styles.description, { color: colors.secondaryForeground }]}>{event.description}</Text>
          <AudioPreview source={event.audioEnabled ? event.audioSource : undefined} accent={event.accent} duration={event.audioDuration} />
          <View style={[styles.venueCard, { backgroundColor: colors.glass, borderColor: colors.border }]}>
            <View style={[styles.venueIcon, { backgroundColor: `${event.accent}20` }]}>
              <Feather name="map-pin" size={19} color={event.accent} />
            </View>
            <View style={styles.venueCopy}>
              <Text style={[styles.venueName, { color: colors.foreground }]}>{event.venue}</Text>
              <Text style={[styles.venueAddress, { color: colors.mutedForeground }]}>{event.address}</Text>
            </View>
            <Pressable onPress={openLocation} testID="open-location">
              <Feather name="arrow-up-right" size={18} color={event.accent} />
            </Pressable>
          </View>
          {(event.organizerName || event.ageRequirement || event.additionalInfo) && (
            <View style={[styles.infoCard, { backgroundColor: colors.glass, borderColor: colors.border }]}>
              <Text style={[styles.infoEyebrow, { color: event.accent }]}>GOOD TO KNOW</Text>
              {event.organizerName && <View style={styles.infoRow}><Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Organizer</Text><Text style={[styles.infoValue, { color: colors.foreground }]}>{event.organizerName}</Text></View>}
              {event.ageRequirement && <View style={styles.infoRow}><Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Age</Text><Text style={[styles.infoValue, { color: colors.foreground }]}>{event.ageRequirement}</Text></View>}
              {event.additionalInfo && <Text style={[styles.additionalInfo, { color: colors.secondaryForeground }]}>{event.additionalInfo}</Text>}
            </View>
          )}
          <View style={styles.interestedRow}>
            <View style={styles.interestedCount}>
              <Feather name="heart" size={17} color={event.accent} fill={interested ? event.accent : 'transparent'} />
              <Text style={[styles.countText, { color: colors.foreground }]}>{formatInterested(event.interested + (interested ? 1 : 0))} interested</Text>
            </View>
            <Text style={[styles.comeWithUs, { color: event.accent }]}>COME WITH US</Text>
          </View>
          <InterestedButton event={event} />
          <View style={styles.linksRow}>
            <Pressable onPress={openLocation} style={[styles.linkButton, { backgroundColor: colors.secondary, borderColor: colors.border }]}><Feather name="navigation" size={16} color={colors.blue} /><Text style={[styles.linkText, { color: colors.foreground }]}>Open location</Text></Pressable>
            {(event.ticketUrl || event.websiteUrl) && <Pressable onPress={() => void Linking.openURL(event.ticketUrl ?? event.websiteUrl ?? '')} style={[styles.linkButton, { backgroundColor: colors.secondary, borderColor: colors.border }]}><Feather name="external-link" size={16} color={colors.gold} /><Text style={[styles.linkText, { color: colors.foreground }]}>Tickets / website</Text></Pressable>}
          </View>
          <Text style={[styles.exitNote, { color: colors.mutedForeground }]}>The best part happens outside the app.</Text>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  heroImage: { height: 440, position: 'relative' },
  header: { position: 'absolute', left: 18, right: 18, flexDirection: 'row', justifyContent: 'space-between' },
  headerActions: { flexDirection: 'row', gap: 8 },
  heroCopy: { position: 'absolute', left: 19, right: 19, bottom: 27 },
  categoryBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7 },
  categoryBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  title: { fontSize: 37, lineHeight: 41, fontWeight: '700', letterSpacing: -1.25, marginTop: 13 },
  heroCuriosity: { fontSize: 14, lineHeight: 20, marginTop: 8, maxWidth: 310 },
  body: { paddingHorizontal: 19, paddingTop: 4 },
  detailMeta: { flexDirection: 'row', gap: 25, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  detailMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 },
  metaIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  metaLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.6, marginBottom: 3 },
  metaValue: { fontSize: 12, fontWeight: '700' },
  description: { fontSize: 15, lineHeight: 23, paddingVertical: 20 },
  venueCard: { borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  venueIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  venueCopy: { flex: 1 },
  venueName: { fontSize: 13, fontWeight: '700' },
  venueAddress: { fontSize: 11, marginTop: 3 },
  infoCard: { borderWidth: 1, borderRadius: 18, padding: 15, marginTop: 12 },
  infoEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.6, marginBottom: 11 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  infoLabel: { fontSize: 11 },
  infoValue: { fontSize: 11, fontWeight: '700' },
  additionalInfo: { fontSize: 12, lineHeight: 18, marginTop: 11 },
  interestedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  interestedCount: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  countText: { fontSize: 13, fontWeight: '700' },
  comeWithUs: { fontSize: 9, fontWeight: '800', letterSpacing: 1.6 },
  linksRow: { flexDirection: 'row', gap: 9, marginTop: 11 },
  linkButton: { flex: 1, minHeight: 48, borderRadius: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  linkText: { fontSize: 11, fontWeight: '700' },
  exitNote: { textAlign: 'center', fontSize: 11, marginTop: 25 },
});