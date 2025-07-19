import * as SecureStore from "expo-secure-store";

export class AuthService {
  private static readonly AUTH_KEY = "user_authenticated";
  private static readonly MOCK_PIN = "1234";

  static async authenticate(
    pin: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (pin !== this.MOCK_PIN) {
        return { success: false, error: "Invalid PIN" };
      }

      await SecureStore.setItemAsync(this.AUTH_KEY, "true");
      return { success: true };
    } catch (error) {
      return { success: false, error: "Authentication failed" };
    }
  }

  static async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.AUTH_KEY);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const isAuth = await SecureStore.getItemAsync(this.AUTH_KEY);
      return isAuth === "true";
    } catch (error) {
      return false;
    }
  }
}
