declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET: string;
      MAILER_EMAIL: string;
      MAILER_PASSWORD: string;
      PUBLIC_APP_URL: string;
    }
  }
}

export {};
