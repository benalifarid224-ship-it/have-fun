import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
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
import { useColors } from '@/hooks/useColors';
import { Event, formatInterested } from '@/data/events';
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
  const { categories } = require('@/data/events') as typeof import('@/data/events');
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

function EventImage({ source, style }: { source: ImageSourcePropType; style?: StyleProp<ImageStyle> }) {
  return <Image source={source} style={[styles.eventImage, style]} resizeMode="cover" />;
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
        <EventImage source={event.image} style={styles.cardImage} />
        <LinearGradient colors={['transparent', `${colors.navy}cc`]} style={StyleSheet.absoluteFill} />
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
        <Text numberOfLines={1} style={[styles.eventTitle, { color: colors.foreground }]}>{event.title}</Text>
        <Text numberOfLines={2} style={[styles.eventDescription, { color: colors.mutedForeground }]}>{event.description}</Text>
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
            <Text style={[styles.viewEventText, { color: event.accent }]}>View event</Text>
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
  return (
    <Pressable
      testID="interested-button"
      onPress={() => toggleInterest(event.id)}
      style={({ pressed }) => [styles.interestedButton, { backgroundColor: interested ? `${event.accent}24` : event.accent, borderColor: event.accent, opacity: pressed ? 0.78 : 1 }]}
    >
      <Feather name="heart" size={18} color={interested ? event.accent : colors.navy} fill={interested ? event.accent : colors.navy} />
      <Text style={[styles.interestedText, { color: interested ? event.accent : colors.navy }]}>{interested ? 'Interested' : 'I’m interested'}</Text>
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
  filterRow: { flexDirection: 'row', gap: 7, marginBottom: 14 },
  filterPill: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  categoryScroller: { flexDirection: 'row', gap: 8, paddingBottom: 3 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 9 },
  categoryText: { fontSize: 12, fontWeight: '600' },
  eventCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, marginBottom: 15, elevation: 5 },
  cardImageWrap: { height: 172, position: 'relative' },
  eventImage: { width: '100%', height: '100%' },
  cardImage: { position: 'absolute', inset: 0 },
  categoryBadge: { position: 'absolute', top: 13, left: 13, flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 },
  categoryBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  cardHeart: { position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardContent: { padding: 15 },
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
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingCopy: { flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: '600' },
  settingDescription: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  toggle: { width: 34, height: 20, borderRadius: 10, padding: 3, justifyContent: 'center' },
  toggleKnob: { width: 14, height: 14, borderRadius: 7 },
});