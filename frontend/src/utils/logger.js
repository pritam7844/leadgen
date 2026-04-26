const isDev = import.meta.env.MODE === 'development';

/**
 * LeadFlow Frontend Logger
 * Provides structured logging with environment-based toggling.
 */
const logger = {
  info: (message, ...args) => {
    if (isDev) {
      console.log(`%c[INFO] ${new Date().toLocaleTimeString()}: %c${message}`, 'color: #00bfff; font-weight: bold;', 'color: inherit;', ...args);
    }
  },
  
  warn: (message, ...args) => {
    if (isDev) {
      console.warn(`%c[WARN] ${new Date().toLocaleTimeString()}: %c${message}`, 'color: #ff8c00; font-weight: bold;', 'color: inherit;', ...args);
    }
  },
  
  error: (message, ...args) => {
    // Always log errors, even in production, but with less detail if needed
    console.error(`%c[ERROR] ${new Date().toLocaleTimeString()}: %c${message}`, 'color: #ff4500; font-weight: bold;', 'color: inherit;', ...args);
  },
  
  debug: (message, ...args) => {
    if (isDev) {
      console.debug(`%c[DEBUG] ${new Date().toLocaleTimeString()}: %c${message}`, 'color: #8a2be2; font-weight: bold;', 'color: inherit;', ...args);
    }
  },

  /**
   * Specifically for logging API calls
   */
  api: (type, method, url, data) => {
    if (isDev) {
      const colors = {
        request: '#10b981', // green
        response: '#3b82f6', // blue
        error: '#ef4444' // red
      };
      console.log(
        `%c[API ${type.toUpperCase()}] %c${method.toUpperCase()} %c${url}`,
        `color: ${colors[type]}; font-weight: bold;`,
        'color: #94a3b8; font-weight: bold;',
        'color: inherit;',
        data || ''
      );
    }
  }
};

export default logger;
