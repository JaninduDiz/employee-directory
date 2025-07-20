import { useThemeColors } from "@/hooks/useTheme";
import { View, StyleSheet, Text } from "react-native";
import { Quote } from "../types";

export default function QuoteCard({
  quote,
  loading,
}: {
  quote: Quote | null;
  loading: boolean;
}) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.quoteContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.textSecondary }}>Loading quote...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.quoteText}>Quote</Text>
          <Text style={styles.quoteStyle}>
            {" "}
            {quote?.quote ? `"${quote.quote}"` : ""}
          </Text>
          <Text style={styles.authorText}>
            {quote?.author ? `- ${quote.author}` : ""}
          </Text>
        </>
      )}
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    quoteContainer: {
      backgroundColor: colors.secondary,
      padding: 16,
      borderRadius: 12,
      marginTop: 12,
      marginBottom: 12,
    },
    quoteText: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    quoteStyle: {
      fontSize: 15,
      color: colors.text,
      marginBottom: 4,
    },
    authorText: {
      textAlign: "right",
      fontSize: 12,
      color: colors.text,
      fontStyle: "italic",
      fontWeight: "500",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start",
    },
  });
