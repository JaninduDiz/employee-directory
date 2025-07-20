import { useThemeColors } from "@/hooks/useTheme";
import QuoteApiService from "@/services/quoteApiService";
import { Quote } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

interface QuoteDisplayProps {
  externalRefreshing?: boolean;
}

const QuoteCard = forwardRef<any, QuoteDisplayProps>(
  ({ externalRefreshing }, ref) => {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const colors = useThemeColors();
    const styles = createStyles(colors);

    useEffect(() => {
      loadQuote();
    }, []);

    const loadQuote = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const newQuote = await QuoteApiService.getQuote();
        setQuote(newQuote);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load quote";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      refreshQuote: loadQuote,
    }));

    if (loading && !externalRefreshing) {
      return (
        <View style={styles.quoteContainer}>
          <View style={styles.centerContent}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading quote...</Text>
          </View>
        </View>
      );
    }

    return (
      <React.Fragment>
        <View style={styles.quoteContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Unable to load quote!</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadQuote}>
                <Ionicons name="reload" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ) : quote ? (
            <>
              <Text style={styles.quoteHeaderText}>Quote</Text>
              <Text style={styles.quoteText}>"{quote.quote}"</Text>
              <Text style={styles.authorText}>— {quote.author}</Text>
            </>
          ) : null}
        </View>
      </React.Fragment>
    );
  }
);

const createStyles = (colors: any) =>
  StyleSheet.create({
    centerContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
    loadingText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 12,
      fontWeight: "bold",
    },
    quoteContainer: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.secondary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    quoteHeaderText: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 8,
    },
    quoteText: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 4,
    },
    authorText: {
      textAlign: "right",
      fontSize: 13,
      color: colors.text,
      fontStyle: "italic",
      fontWeight: "500",
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
      fontWeight: "bold",
      paddingLeft: 10,
    },
    retryButton: {
      width: 40,
      alignItems: "center",
      paddingVertical: 10,
    },
  });

export default QuoteCard;
