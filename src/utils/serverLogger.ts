const isClient = typeof window !== "undefined";

export const serverLogger = {
  async log(message: string, level: string = "info", data?: any) {
    console.log(`[${level.toUpperCase()}] ${message}`, data || ""); // Always log to console

    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          level,
          data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error("Failed to send log to server:", response.status);
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
