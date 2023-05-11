import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export default function App() {
  const [showWebView, setShowWebView] = React.useState(false);
  const [location, setLocation] = React.useState<{}>({});
  const [errorMsg, setErrorMsg] = React.useState('');
  let text = 'Buscando... ';

  React.useEffect(() => {
    const fn = async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === 'granted') {
        setShowWebView(true);
      }
    };

    const geoLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso para acceder a Geolocalización rechzado');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    fn();
    geoLocation();
  }, []);

  if (!showWebView) {
    return (
      <View>
        <Text>Otorgar permisos</Text>
      </View>
    );
  }

  if (errorMsg) {
    setErrorMsg(errorMsg);
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <WebView
        userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
        source={{ uri: 'https://stackblitz.com/edit/react-b1mwzt?file=src%2FApp.js' }}
        style={{
          marginTop: 30
        }}
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        javaScriptEnabled
        scalesPageToFit
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState
        javaScriptEnabledAndroid
        useWebkit
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  paragraph: {
    paddingTop: 30,
    fontSize: 18,
    textAlign: 'center',
  },
});
