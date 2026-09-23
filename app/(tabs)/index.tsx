import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/Screen';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import { getProfile, type Profile } from '@/lib/profiles';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      let active = true;
      getProfile(user.id).then((next) => active && setProfile(next));
      return () => {
        active = false;
      };
    }, [user])
  );

  const teacher = profile?.role === 'teacher';
  return (
    <Screen title="Home">
      <View style={styles.identity}>
        <Text style={styles.name}>{profile?.full_name || user?.email || 'Account'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.role}>{teacher ? 'TEACHER' : 'STUDENT'}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {teacher ? (
          <AppButton label="Create event" icon="add-circle-outline" onPress={() => router.push('/(tabs)/events')} />
        ) : (
          <AppButton label="Scan QR" icon="scan-outline" onPress={() => router.push('/(tabs)/scan')} />
        )}
        <AppButton label="Attendance history" icon="list-outline" variant="secondary" onPress={() => router.push('/(tabs)/history')} />
        <AppButton label="Profile" icon="person-outline" variant="secondary" onPress={() => router.push('/(tabs)/profile')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { backgroundColor: COLORS.primary, borderRadius: 20, padding: 20, gap: 10 },
  name: { color: COLORS.inverted, fontSize: 21, fontWeight: '800' },
  roleBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.accent, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  role: { color: COLORS.primaryDark, fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  actions: { gap: 12 },
});
