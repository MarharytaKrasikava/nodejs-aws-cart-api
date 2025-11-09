import { Injectable } from '@nestjs/common';
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

@Injectable()
export class DatabaseConfig {
  private readonly secretsManager: SecretsManager;

  constructor() {
    const configs =
      process.env.NODE_ENV === 'AWS_LAMBDA'
        ? {
            region: process.env.AWS_REGION,
          }
        : {
            region: 'eu-central-1',
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          };
    this.secretsManager = new SecretsManager(configs);
  }

  async getDatabaseConfig(): Promise<any> {
    try {
      const response = await this.secretsManager.getSecretValue({
        SecretId: process.env.DB_SECRET_NAME,
      });

      if (!response.SecretString) {
        throw new Error('No secret string found');
      }

      return JSON.parse(response.SecretString);
    } catch (error) {
      console.error('Error fetching database secret:', error);
      throw error;
    }
  }
}
