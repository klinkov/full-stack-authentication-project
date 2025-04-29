import { makeAutoObservable } from 'mobx';
import Keycloak from 'keycloak-js';
import { message } from 'antd';
import { http } from '../services/api';

class AuthStore {
    keycloak: Keycloak | null = null;
    isAuthenticated: boolean = false;
    user: any = null;
    roles: string[] = [];

    constructor() {
        makeAutoObservable(this);
        this.initKeycloak();
    }

    initKeycloak = async () => {
        this.keycloak = new Keycloak({
            url: import.meta.env.VITE_KEYCLOAK_URL,
            realm: import.meta.env.VITE_KEYCLOAK_REALM,
            clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
        });

        try {
            const authenticated = await this.keycloak.init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            });

            if (authenticated) {
                await this.loadUserProfile();
                this.isAuthenticated = true;
            }
        } catch (error) {
            message.error('Failed to initialize authentication');
        }
    };

    login = async () => {
        try {
            await this.keycloak?.login();
        } catch (error) {
            message.error('Login failed');
        }
    };

    register = async () => {
        try {
            await this.keycloak?.register();
        } catch (error) {
            message.error('Registration failed');
        }
    };

    logout = async () => {
        try {
            await this.keycloak?.logout();
            this.isAuthenticated = false;
            this.user = null;
            this.roles = [];
        } catch (error) {
            message.error('Logout failed');
        }
    };

    loadUserProfile = async () => {
        try {
            const profile = await this.keycloak?.loadUserProfile();
            this.user = profile;
            this.roles = this.keycloak?.tokenParsed?.realm_access?.roles || [];

            // Sync with backend
            await http.post('/users/sync', {
                id: profile?.id,
                email: profile?.email,
            });
        } catch (error) {
            message.error('Failed to load user profile');
        }
    };

    changeEmail = async (email: string) => {
        try {
            await http.put('/users/email', { email });
            await this.loadUserProfile();
            message.success('Email change request sent. Please check your inbox.');
        } catch (error) {
            message.error('Failed to change email');
            throw error;
        }
    };

    changePassword = async () => {
        try {
            await this.keycloak?.login({
                action: 'UPDATE_PASSWORD',
            });
        } catch (error) {
            message.error('Failed to initiate password change');
        }
    };
}

export default new AuthStore();