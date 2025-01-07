export const logger = {
  debug: (message: string, ...args: any[]) => {
    // Only log in development and when DEBUG is explicitly enabled
    if (
      process.env.NODE_ENV === "development" &&
      process.env.DEBUG === "true"
    ) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    // Log errors to console and send to server
    console.error(`[ERROR] ${message}`, ...args);

    // Only send errors to the server in production
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          level: "error",
          data: args.length ? args : undefined,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => {
        // Silently catch fetch errors to prevent loops
        console.error("Failed to send error log:", err);
      });
    }
  },
  info: (message: string, ...args: any[]) => {
    // Only log info in development
    if (process.env.NODE_ENV === "development") {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
};
