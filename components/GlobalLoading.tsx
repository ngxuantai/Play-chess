import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import {
  selectIsLoading,
  selectLoadingMessage,
} from "@/redux/selectors/loadingSelector";
import { Colors } from "@/constants/Colors";

const GlobalLoading: React.FC = () => {
  const isLoading = useSelector(selectIsLoading);
  const loadingMessage = useSelector(selectLoadingMessage);

  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator
          size={90}
          color={Colors.LIGHTBLUE}
        />
        {loadingMessage && <Text style={styles.message}>{loadingMessage}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default GlobalLoading;
