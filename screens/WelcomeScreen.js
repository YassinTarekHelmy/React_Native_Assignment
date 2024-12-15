import React from "react";
import { View, StyleSheet, Text, Button, Image } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Image 
        source={require('./assets/welcome.png')} // Replace with your image path
        style={styles.image}
      /> */}
      <Text style={styles.title}>Welcome to Our App</Text>
      <Text style={styles.subtitle}>Your journey starts here.</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate("Login")}
          color="#6200ea"
        />
        <View style={{ height: 10 }} /> {/* Spacer between buttons */}
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate("SignUp")}
          color="#03dac5"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 20, // Optional rounded corners
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
});
