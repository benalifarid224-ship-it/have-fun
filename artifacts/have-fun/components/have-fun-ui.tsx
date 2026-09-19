import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Image,
  ImageStyle,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@/hooks/useColors';
import { categories, Event, formatInterested } from '@/data/events';
import { useAppState } from '@/context/app-state';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const colors = useColors();
  return (
    <View style={compact ? styles.brandCompact : styles.brand}>
      <View style={[styles.brandDot, { backgroundColor: colors.pink }]} />
      <View style={[styles.brandDotSmall, { backgroundColor: colors.blue }]} />
      <View>
        <Text style={[styles.brandTitle, { color: colors.foreground }]}>HAVE FUN</Text>
        {!compact && <Text style={[styles.brandCaption, { color: colors.mutedForeground }]}>COME WITH US</Text>}
      </View>
    </View>
  );
}

export function ScreenBackground({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const colors = useColors();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }, style]}>
      <View style={[styles.orb, styles.orbTop, { backgroundColor: colors.purple }]} />
      <View style={[styles.orb, styles.orbRight, { backgroundColor: colors.blue }]} />
      {children}
    </View>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  color,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  label: string;
  color?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityLabel={label}
      testID={`icon-button-${label.toLowerCase().replaceAll(' ', '-')}`}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.glass, borderColor: colors.border, opacity: pressed ? 0.68 : 1 }]}
    >
      <Feather name={icon} size={18} color={color ?? colors.foreground} />
    </Pressable>
  );
}

export function SectionLabel({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <View>
        {eyebrow && <Text style={[styles.eyebrow, { color: colors.pink }]}>{eyebrow}</Text>}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      {action && onAction && (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={[styles.sectionAction, { color: colors.blue }]}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function LiveSignal({ count, accent }: { count: number; accent: string }) {
  const colors = useColors();
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 1200 }), withTiming(0, { duration: 1200 })),
      -1,
      false,
    );
  }, [pulse]);
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.18, 0.55]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.86, 1.18]) }],
  }));
  return (
    <View style={[styles.liveSignal, { backgroundColor: colors.glass, borderColor: `${accent}66` }]}>
      <View style={styles.signalPulseWrap}>
        <Animated.View style={[styles.signalPulse, { borderColor: accent }, pulseStyle]} />
        <View style={[styles.signalDot, { backgroundColor: accent }]} />
      </View>
      <View style={styles.signalCopy}>
        <Text style={[styles.signalEyebrow, { color: accent }]}>HAPPENING NOW</Text>
        <Text style={[styles.signalTitle, { color: colors.foreground }]}>{count} reasons to leave the house tonight.</Text>
      </View>
      <Feather name="arrow-up-right" size={18} color={accent} />
    </View>
  );
}

export function TimeFilterRow({ active, onChange }: { active: string; onChange: (value: string) => void }) {
  const colors = useColors();
  const filters = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'Next month' },
  ];
  return (
    <View style={styles.filterRow}>
      {filters.map((filter) => {
        const selected = active === filter.value;
        return (
          <Pressable
            key={filter.value}
            testID={`time-filter-${filter.value}`}
            onPress={() => onChange(filter.value)}
            style={[styles.filterPill, { backgroundColor: selected ? colors.primary : colors.secondary, borderColor: selected ? colors.primary : colors.border }]}
          >
            <Text style={[styles.filterText, { color: selected ? colors.primaryForeground : colors.mutedForeground }]}>{filter.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CategorySelector({ selected, onChange }: { selected: string; onChange: (value: string) => void }) {
  const colors = useColors();
  return (
    <View style={styles.categoryScroller}>
      {categories.map((category) => {
        const active = selected === category.id;
        return (
          <Pressable
            key={category.id}
            testID={`category-${category.id}`}
            onPress={() => onChange(category.id)}
            style={[styles.categoryChip, { backgroundColor: active ? `${category.color}25` : colors.glass, borderColor: active ? category.color : colors.border }]}
          >
            <MaterialCommunityIcons name={category.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']} size={15} color={active ? category.color : colors.mutedForeground} />
            <Text style={[styles.categoryText, { color: active ? colors.foreground : colors.mutedForeground }]}>{category.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function AtmosphereLayer({ event }: { event: Event }) {
  const pulse = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 1800 }), withTiming(0, { duration: 1800 })),
      -1,
      false,
    );
    drift.value = withRepeat(
      withSequence(withTiming(1, { duration: 2400 }), withTiming(0, { duration: 2400 })),
      -1,
      false,
    );
  }, [drift, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.14, 0.42]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.92, 1.08]) }],
  }));
  const driftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(drift.value, [0, 1], [-26, 26]) }],
    opacity: interpolate(drift.value, [0, 1], [0.1, 0.36]),
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {event.atmosphere === 'streaks' ? (
        <>
          <Animated.View style={[styles.atmosphereStreak, { backgroundColor: event.accent }, driftStyle]} />
          <Animated.View style={[styles.atmosphereStreak, styles.atmosphereStreakTwo, { backgroundColor: event.tint }, driftStyle]} />
        </>
      ) : event.atmosphere === 'grid' ? (
        <Animated.View style={[styles.atmosphereGrid, { borderColor: event.accent }, pulseStyle]} />
      ) : event.atmosphere === 'particles' || event.atmosphere === 'calm' ? (
        <>
          <Animated.View style={[styles.atmosphereParticle, styles.atmosphereParticleOne, { backgroundColor: event.accent }, pulseStyle]} />
          <Animated.View style={[styles.atmosphereParticle, styles.atmosphereParticleTwo, { backgroundColor: event.tint }, pulseStyle]} />
          <Animated.View style={[styles.atmosphereParticle, styles.atmosphereParticleThree, { backgroundColor: event.accent }, driftStyle]} />
        </>
      ) : (
        <Animated.View style={[styles.atmosphereHalo, { borderColor: event.accent }, pulseStyle]} />
      )}
    </View>
  );
}

export function AnimatedEventImage({ source, style }: { source: ImageSourcePropType; style?: StyleProp<ImageStyle> }) {
  const zoom = useSharedValue(1);
  useEffect(() => {
    zoom.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 5200 }), withTiming(1, { duration: 5200 })),
      -1,
      false,
    );
  }, [zoom]);
  const imageStyle = useAnimatedStyle(() => ({ transform: [{ scale: zoom.value }] }));
  return <Animated.Image source={source} style={[styles.eventImage, style, imageStyle]} resizeMode="cover" />;
}

export function EventCard({ event }: { event: Event }) {
  const colors = useColors();
  const router = useRouter();
  const { isInterested, toggleInterest } = useAppState();
  const interested = isInterested(event.id);
  return (
    <Pressable
      testID={`event-card-${event.id}`}
      onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
      style={({ pressed }) => [styles.eventCard, { backgroundColor: colors.card, borderColor: `${event.accent}70`, opacity: pressed ? 0.88 : 1 }]}
    >
      <View style={styles.cardImageWrap}>
        <AnimatedEventImage source={event.image} style={styles.cardImage} />
        <LinearGradient colors={['transparent', `${colors.navy}cc`]} style={StyleSheet.absoluteFill} />
        <AtmosphereLayer event={event} />
        <View style={[styles.categoryBadge, { backgroundColor: `${event.accent}e8` }]}>
          <MaterialCommunityIcons name={event.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']} size={13} color={colors.navy} />
          <Text style={[styles.categoryBadgeText, { color: colors.navy }]}>{event.categoryLabel.toUpperCase()}</Text>
        </View>
        <Pressable
          accessibilityLabel={interested ? 'Remove interest' : 'Mark interested'}
          testID={`interest-${event.id}`}
          onPress={(pressEvent) => {
            pressEvent.stopPropagation();
            toggleInterest(event.id);
          }}
          style={[styles.cardHeart, { backgroundColor: colors.glass }]}
        >
          <Feather name="heart" size={16} color={interested ? event.accent : colors.white} fill={interested ? event.accent : 'transparent'} />
        </Pressable>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.eventSubtitle, { color: event.accent }]}>{event.subtitle.toUpperCase()}</Text>
        <Text numberOfLines={1} style={[styles.eventTitle, { color: colors.foreground }]}>{event.title}</Text>
        <Text numberOfLines={2} style={[styles.eventDescription, { color: colors.secondaryForeground }]}>{event.curiosityLine}</Text>
        <View style={styles.eventMetaRow}>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={13} color={event.accent} />
            <Text style={[styles.metaText, { color: colors.secondaryForeground }]}>{event.dateLabel} · {event.time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={13} color={event.accent} />
            <Text style={[styles.metaText, { color: colors.secondaryForeground }]}>{event.location}</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.metaItem}>
            <Feather name="heart" size={13} color={event.accent} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{formatInterested(event.interested + (interested ? 1 : 0))} interested</Text>
          </View>
          <View style={styles.viewEvent}>
            <Text style={[styles.viewEventText, { color: event.accent }]}>Discover event</Text>
            <Feather name="arrow-up-right" size={15} color={event.accent} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function InterestedButton({ event }: { event: Event }) {
  const colors = useColors();
  const { isInterested, toggleInterest } = useAppState();
  const interested = isInterested(event.id);
  const pressScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));
  return (
    <Animated.View style={buttonStyle}>
      <Pressable
        testID="interested-button"
        onPress={() => {
          pressScale.value = withSequence(withTiming(0.96, { duration: 80 }), withTiming(1, { duration: 220 }));
          toggleInterest(event.id);
        }}
        style={({ pressed }) => [styles.interestedButton, { backgroundColor: interested ? `${event.accent}24` : event.accent, borderColor: event.accent, opacity: pressed ? 0.78 : 1 }]}
      >
        <Feather name="heart" size={18} color={interested ? event.accent : colors.navy} fill={interested ? event.accent : colors.navy} />
        <Text style={[styles.interestedText, { color: interested ? event.accent : colors.navy }]}>{interested ? 'Interested' : 'I’m interested'}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function AudioPreview({ source, accent, duration = 8 }: { source?: number; accent: string; duration?: number }) {
  const colors = useColors();
  const player = useAudioPlayer(source ?? null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const hasAudio = Boolean(source);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: false,
      interruptionMode: 'mixWithOthers',
      allowsRecording: false,
      shouldPlayInBackground: false,
    });
    player.volume = 0.42;
    return () => {
      if (player.playing) player.pause();
    };
  }, [player]);

  const togglePlayback = () => {
    if (!hasAudio) return;
    if (status.playing) player.pause();
    else {
      player.volume = 0.42;
      player.play();
    }
  };

  const progress = status.duration > 0 ? Math.min(1, status.currentTime / status.duration) : 0;
  return (
    <Pressable
      testID="audio-preview"
      accessibilityLabel={hasAudio ? 'Toggle event audio preview' : 'No audio preview available'}
      onPress={togglePlayback}
      style={({ pressed }) => [styles.audioPreview, { backgroundColor: colors.glass, borderColor: `${accent}66`, opacity: pressed && hasAudio ? 0.8 : hasAudio ? 1 : 0.72 }]}
    >
      <View style={[styles.audioIcon, { backgroundColor: `${accent}22` }]}>
        <Feather name={hasAudio ? (status.playing ? 'volume-2' : 'play') : 'volume-x'} size={17} color={accent} />
      </View>
      <View style={styles.audioCopy}>
        <Text style={[styles.audioEyebrow, { color: accent }]}>ATMOSPHERE PREVIEW</Text>
        <Text style={[styles.audioLabel, { color: colors.foreground }]}>{hasAudio ? (status.playing ? 'Playing softly' : 'Tap to hear the mood') : 'No audio preview for this event'}</Text>
        {hasAudio && <View style={[styles.audioTrack, { backgroundColor: colors.input }]}><View style={[styles.audioProgress, { backgroundColor: accent, width: `${Math.max(8, progress * 100)}%` }]} /></View>}
      </View>
      <Text style={[styles.audioDuration, { color: colors.mutedForeground }]}>{hasAudio ? `${Math.round(status.duration || duration)}s` : '—'}</Text>
    </Pressable>
  );
}

export function SettingRow({ icon, title, description, value, onChange }: { icon: React.ComponentProps<typeof Feather>['name']; title: string; description: string; value: boolean; onChange: () => void }) {
  const colors = useColors();
  return (
    <Pressable onPress={onChange} style={({ pressed }) => [styles.settingRow, { borderBottomColor: colors.border, opacity: pressed ? 0.72 : 1 }]}>
      <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={17} color={colors.primary} />
      </View>
      <View style={styles.settingCopy}>
        <Text style={[styles.settingTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>{description}</Text>
      </View>
      <View style={[styles.toggle, { backgroundColor: value ? colors.primary : colors.input }]}>
        <View style={[styles.toggleKnob, { backgroundColor: colors.white, transform: [{ translateX: value ? 11 : -1 }] }]} />
      </View>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  orb: { position: 'absolute', width: 180, height: 180, borderRadius: 90, opacity: 0.08 },
  orbTop: { top: -100, left: -50 },
  orbRight: { top: 220, right: -120 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  brandCompact: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot: { width: 12, height: 12, borderRadius: 4, transform: [{ rotate: '45deg' }] },
  brandDotSmall: { width: 6, height: 6, borderRadius: 3, marginLeft: -15, marginTop: 12 },
  brandTitle: { fontSize: 15, fontWeight: '700', letterSpacing: 2.2 },
  brandCaption: { fontSize: 9, fontWeight: '600', letterSpacing: 2.6, marginTop: 3 },
  iconButton: { width: 40, height: 40, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 2.4, marginBottom: 5 },
  sectionTitle: { fontSize: 25, fontWeight: '700', letterSpacing: -0.5 },
  sectionAction: { fontSize: 13, fontWeight: '600', marginBottom: 3 },
  liveSignal: { minHeight: 76, borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, marginBottom: 23 },
  signalPulseWrap: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  signalPulse: { position: 'absolute', width: 30, height: 30, borderRadius: 15, borderWidth: 1 },
  signalDot: { width: 9, height: 9, borderRadius: 5 },
  signalCopy: { flex: 1 },
  signalEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.6, marginBottom: 4 },
  signalTitle: { fontSize: 13, lineHeight: 18, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 7, marginBottom: 14 },
  filterPill: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  categoryScroller: { flexDirection: 'row', gap: 8, paddingBottom: 3 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 9 },
  categoryText: { fontSize: 12, fontWeight: '600' },
  eventCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, marginBottom: 15, elevation: 5 },
  cardImageWrap: { height: 190, position: 'relative' },
  eventImage: { width: '100%', height: '100%' },
  cardImage: { position: 'absolute', inset: 0 },
  atmosphereHalo: { position: 'absolute', width: 230, height: 230, borderWidth: 1, borderRadius: 115, right: -50, top: -90 },
  atmosphereGrid: { position: 'absolute', width: 210, height: 130, borderWidth: 1, borderRadius: 18, right: -28, top: 28, transform: [{ rotate: '-12deg' }] },
  atmosphereStreak: { position: 'absolute', height: 3, width: 190, top: 68, right: -52, transform: [{ rotate: '-16deg' }] },
  atmosphereStreakTwo: { top: 112, right: -84, width: 230 },
  atmosphereParticle: { position: 'absolute', width: 9, height: 9, borderRadius: 5 },
  atmosphereParticleOne: { right: 32, top: 50 },
  atmosphereParticleTwo: { right: 92, top: 114, width: 5, height: 5 },
  atmosphereParticleThree: { right: 144, top: 76, width: 6, height: 6 },
  categoryBadge: { position: 'absolute', top: 13, left: 13, flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 },
  categoryBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  cardHeart: { position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardContent: { padding: 15 },
  eventSubtitle: { fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginBottom: 6 },
  eventTitle: { fontSize: 19, fontWeight: '700', letterSpacing: -0.25 },
  eventDescription: { fontSize: 12, lineHeight: 18, marginTop: 6 },
  eventMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 11, marginTop: 13 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  viewEvent: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  viewEventText: { fontSize: 12, fontWeight: '700' },
  interestedButton: { minHeight: 54, borderRadius: 17, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9 },
  interestedText: { fontSize: 15, fontWeight: '700' },
  audioPreview: { borderWidth: 1, borderRadius: 18, minHeight: 70, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  audioIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  audioCopy: { flex: 1 },
  audioEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginBottom: 4 },
  audioLabel: { fontSize: 12, fontWeight: '600' },
  audioTrack: { height: 3, borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  audioProgress: { height: 3, borderRadius: 2 },
  audioDuration: { fontSize: 10, fontWeight: '700' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingCopy: { flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: '600' },
  settingDescription: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  toggle: { width: 34, height: 20, borderRadius: 10, padding: 3, justifyContent: 'center' },
  toggleKnob: { width: 14, height: 14, borderRadius: 7 },
});