/// <reference types="react/client" />

interface ImportMetaEnv {
    readonly VITE_NAME: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }