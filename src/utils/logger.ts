export const logger = {
  debug: (message: string, ...args: any[]) => {
    // Only log in development or if NEXT_PUBLIC_DEBUG is true
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_DEBUG === "true"
    ) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    // Always log errors
    console.error(`[ERROR] ${message}`, ...args);
  },
};
