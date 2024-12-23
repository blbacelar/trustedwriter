const isClient = typeof window !== "undefined";

export const serverLogger = {
  async log(message: string, level: string = "info", data?: any) {
    try {
      if (isClient) {
        await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, level, data }),
        });
      } else {
        // Server-side logging
        console.log(`[${level.toUpperCase()}] ${message}`, data || "");
      }
    } catch (error) {
      console.error("Failed to send log:", error);
    }
  },

  debug: (message: string, data?: any) =>
    serverLogger.log(message, "debug", data),
  error: (message: string, data?: any) =>
    serverLogger.log(message, "error", data),
  info: (message: string, data?: any) =>
    serverLogger.log(message, "info", data),
};
