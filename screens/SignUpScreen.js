import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { createUserWithEmailAndPassword, getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { app } from "../firebaseConfig";

import { AuthContext } from "../AuthContext";

export default function SignUpScreen({ navigation }) {
  const { setLoggedInUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth(app);

  const handleSignUp = () => {
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoggedInUser(user);
        Alert.alert("Account created successfully!");
        navigation.navigate("Login");
      })
      .catch((err) => {
        Alert.alert("Failed to create account. Please try again.");
        console.error("Error during sign up:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("Recaptcha verified");
        },
      }, auth);
    }
  };

  const handlePhoneAuth = () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setIsPhoneAuth(true);
        Alert.alert("Verification code sent to your phone.");
      })
      .catch((err) => {
        console.error("Error during phone authentication:", err);
        Alert.alert("Failed to send verification code. Please try again.");
      });
  };

  const verifyCode = () => {
    if (verificationId && verificationCode) {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      auth.signInWithCredential(credential)
        .then((userCredential) => {
          const user = userCredential.user;
          setLoggedInUser(user);
          Alert.alert("Phone number verified successfully!");
          navigation.navigate("Login");
        })
        .catch((err) => {
          console.error("Error verifying code:", err);
          Alert.alert("Invalid verification code. Please try again.");
        });
    } else {
      Alert.alert("Please enter the verification code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      {!isPhoneAuth ? (
        <>
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

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          {isLoading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <View style={styles.buttonContainer}>
              <Button title="Sign Up with Email" onPress={handleSignUp} color="#007AFF" />
              <Button title="Sign Up with Phone" onPress={handlePhoneAuth} color="#FFA500" />
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate("Login")}
                color="#FF3B30"
              />
            </View>
          )}
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            keyboardType="number-pad"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <Button title="Verify Code" onPress={verifyCode} color="#007AFF" />
        </>
      )}

      <View id="recaptcha-container" />
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
