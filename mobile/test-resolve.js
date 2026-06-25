try {
  const path = require.resolve('@react-native/metro-config');
  console.log('Found:', path);
} catch (e) {
  console.error('Cannot resolve:', e.message);
}
