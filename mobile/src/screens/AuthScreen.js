import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import CompanionAvatar from '../components/CompanionAvatar';

const AuthScreen = ({ navigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <CompanionAvatar companion="para" size={100} />
        <Text style={styles.title}>{isLogin ? 'Bon retour !' : 'Créer un compte'}</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Connecte-toi pour tes mèmes.' : 'Rejoins la communauté.'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>E-MAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="ton@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>MOT DE PASSE</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.mainBtn} onPress={() => navigate('Home')}>
          <Text style={styles.mainBtnText}>{isLogin ? 'SE CONNECTER' : 'CRÉER COMPTE'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switch}>
          <Text style={styles.switchText}>
            {isLogin ? "Pas encore de compte ? S'INSCRIRE" : "Déjà inscrit ? SE CONNECTER"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: spacing.xl, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  title: { fontSize: 28, fontWeight: '900', color: colors.almostBlack, marginTop: 16 },
  subtitle: { fontSize: 16, color: colors.graphite, textAlign: 'center' },
  form: { width: '100%', padding: 20, borderRadius: radius.xl, borderWidth: 2, borderColor: colors.cloudGray },
  label: { fontWeight: '900', fontSize: 13, color: colors.silver, marginBottom: 8 },
  input: {
    height: 50, borderWidth: 2, borderColor: colors.cloudGray,
    borderRadius: radius.md, paddingHorizontal: 16, marginBottom: 20,
    fontSize: 16, color: colors.almostBlack
  },
  mainBtn: {
    height: 54, backgroundColor: colors.duoBlue, borderRadius: radius.md,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.duoBlueDark, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, elevation: 4
  },
  mainBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  switch: { marginTop: 24, alignItems: 'center' },
  switchText: { fontWeight: '800', color: colors.duoBlue, fontSize: 13 }
});

export default AuthScreen;
