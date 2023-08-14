declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly VITE_NAME: string
            NODE_ENV: 'development' | 'production'
        }
    }
}

export {};