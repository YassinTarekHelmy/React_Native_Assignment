import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { View, Text, Button, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { app } from "../firebaseConfig";


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setLoggedInUser } = useAuth();

  const auth = getAuth(app);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '173767811471-hb8rf8pmro3ah6juqn3bvcjic7gf2mpd.apps.googleusercontent.com'
    });
  }, []);
  


  const handleLogin = () => {
    setError(null); // Reset error
    setIsLoading(true);
    signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoggedInUser(user);
      })
      .catch((err) => {
        setError("Invalid email or password. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const signInResult = await GoogleSignin.signIn();
        
        // Try the new style of google-sign in result, from v13+ of that module
        idToken = signInResult.data?.idToken;

        if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.idToken;
        }
        if (!idToken) {
        throw new Error('No ID token found');
        }
    
        // Create a Google credential with the token
        const googleCredential = await GoogleAuthProvider.credential(idToken);

        console.log("Google Credential: ", googleCredential);
        
        const s = await signInWithCredential(googleCredential);

        console.log("Sign in with Google: ", s);

        return s; 
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to your account</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
          <View style={styles.buttonContainer}>
        <Button title="Google" onPress={async () => await onGoogleButtonPress().then(() => { 
            console.log("User signed in with Google");
            setLoggedInUser(auth().currentUser);
            navigation.navigate("HomeScreen");

        })}/>
          <Button title="Login" onPress={handleLogin} color="#007AFF" />
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate("SignUp")}
            color="#FF3B30"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
  error: {
    color: "#FF3B30",
    marginBottom: 10,
    textAlign: "center",
  },
});
