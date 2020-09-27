declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URI: string;
    NODE_ENV: 'development' | 'production';
    PORT: string;
    JWT_SECRET: string;
  }
}
