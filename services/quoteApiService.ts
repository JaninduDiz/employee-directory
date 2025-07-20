import { QUOTE_API_BASE_URL } from "@/constants";
import { Quote } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

class QuoteApiService {
  private static readonly CACHE_KEY = "cached_quote";
  private static readonly CACHE_TIMESTAMP_KEY = "cache_timestamp";
  private static readonly CACHE_DURATION = 1 * 60 * 60 * 1000; // cache for 1 hour

  /**
   * Fetches quote from API or returns cached data if available and fresh
   */
  static async getQuote(): Promise<Quote> {
    try {
      const isFresh = await this.isCacheFresh();
      console.log("💾 Cache is fresh:", isFresh);

      if (isFresh) {
        const cachedQuote = await this.getCachedQuote();
        if (cachedQuote) {
          console.log("✅ Returning fresh cached quote");
          return cachedQuote;
        }
      }

      const freshQuote = await this.fetchFromApi();

      await this.cacheQuote(freshQuote);
      return freshQuote;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("API fetch failed:", error);

      const cachedQuote = await this.getCachedQuote();
      if (cachedQuote) {
        return cachedQuote;
      }

      throw new Error(
        `Unable to fetch quote: ${errorMessage}. No cached data available.`
      );
    }
  }

  /**
   * Fetches quote from API
   */
  private static async fetchFromApi(): Promise<Quote> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000);

      const response = await fetch(QUOTE_API_BASE_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      const quoteData = Array.isArray(data) ? data[0] : data;

      if (
        !quoteData ||
        typeof quoteData.content !== "string" ||
        typeof quoteData.author !== "string"
      ) {
        throw new Error(`Invalid API response format: ${JSON.stringify(data)}`);
      }

      const transformedQuote: Quote = {
        quote: quoteData.content,
        author: quoteData.author,
      };

      return transformedQuote;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout after 10 seconds");
      }
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }

  /**
   * Saves quote to cache with timestamp
   */
  private static async cacheQuote(quote: Quote): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [this.CACHE_KEY, JSON.stringify(quote)],
        [this.CACHE_TIMESTAMP_KEY, Date.now().toString()],
      ]);
    } catch (error) {}
  }

  /**
   * Gets cached quote
   */
  private static async getCachedQuote(): Promise<Quote | null> {
    try {
      const cachedData = await AsyncStorage.getItem(this.CACHE_KEY);

      if (!cachedData) {
        return null;
      }

      const parsed = JSON.parse(cachedData);

      return parsed;
    } catch (error) {
      return null;
    }
  }

  /**
   * Checks if cached data is still fresh (within 1 hour)
   */
  private static async isCacheFresh(): Promise<boolean> {
    try {
      const timestampStr = await AsyncStorage.getItem(this.CACHE_TIMESTAMP_KEY);

      if (!timestampStr) {
        return false;
      }

      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      const age = now - timestamp;
      const isValid = age < this.CACHE_DURATION;

      return isValid;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear all cached data (useful for debugging)
   */
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.CACHE_KEY,
        this.CACHE_TIMESTAMP_KEY,
      ]);
    } catch (error) {}
  }
}

export default QuoteApiService;
