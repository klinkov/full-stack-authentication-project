import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KeycloakService {
    private readonly keycloakUrl = process.env.KEYCLOAK_URL;
    private readonly realm = 'talent-realm';

    async updateUserEmail(userId: string, email: string) {
        try {
            const adminToken = await this.getAdminToken();
            await axios.put(
                `${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}`,
                { email, emailVerified: false },
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
        } catch (error) {
            throw new HttpException(
                'Failed to update user in Keycloak',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async getAdminToken() {
        const response = await axios.post(
            `${this.keycloakUrl}/realms/master/protocol/openid-connect/token`,
            new URLSearchParams({
                client_id: 'admin-cli',
                username: 'admin',
                password: 'admin',
                grant_type: 'password',
            }),
        );
        return response.data.access_token;
    }
}