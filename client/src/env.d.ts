/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API: string; // Sale stat API endpoint
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}