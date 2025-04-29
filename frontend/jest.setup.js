// Mock import.meta.env for Vite environment variables
Object.defineProperty(global, 'import', {
    value: {
        meta: {
            env: {
                VITE_API_URL: 'http://localhost:3000',
                VITE_KEYCLOAK_URL: 'https://mock-keycloak-server/auth',
                VITE_KEYCLOAK_REALM: 'mock-realm',
                VITE_KEYCLOAK_CLIENT_ID: 'mock-client-id',
            },
        },
    },
});