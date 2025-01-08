const isClient = typeof window !== "undefined";

export const serverLogger = {
  async log(message: string, level: string = "info", data?: any) {
    // Only console log in development with DEBUG enabled
    if (
      process.env.NODE_ENV === "development" &&
      process.env.DEBUG === "true"
    ) {
      console.log(`[${level.toUpperCase()}] ${message}`, data || "");
    }

    // Only log errors to API in production
    if (process.env.NODE_ENV === "production") {
      if (level === "error") {
        try {
          await fetch("/api/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message,
              level,
              data,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          // Silently catch fetch errors to prevent loops
          console.error("Failed to send log:", error);
        }
      }
    }
  },

  debug: (message: string, data?: any) =>
    process.env.DEBUG === "true" && serverLogger.log(message, "debug", data),
  error: (message: string, data?: any) =>
    serverLogger.log(message, "error", data),
  info: (message: string, data?: any) =>
    process.env.DEBUG === "true" && serverLogger.log(message, "info", data),
};
