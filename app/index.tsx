import { Button, StyleSheet, TextInput } from "react-native";
import React from "react";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your PIN"
        style={{ borderWidth: 1, padding: 10, margin: 10, width: "80%" }}
      />
      <Link href="/(main)">Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
