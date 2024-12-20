import { PrismaClient } from '@prisma/client';
import { decrypt } from '../../src/lib/encryption';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function decryptExistingApplications() {
  try {
    const applications = await prisma.application.findMany();
    console.log(`Found ${applications.length} applications to process`);

    for (const app of applications) {
      try {
        // Only decrypt if content appears to be encrypted (contains the IV separator)
        if (!app.content.includes(':')) {
          console.log(`Application ${app.id} is not encrypted, skipping...`);
          continue;
        }

        const decryptedContent = decrypt(app.content);
        await prisma.application.update({
          where: { id: app.id },
          data: { content: decryptedContent }
        });
        console.log(`Decrypted application ${app.id}`);
      } catch (error) {
        console.error(`Failed to decrypt application ${app.id}:`, error);
      }
    }

    console.log('Rollback completed');
  } catch (error) {
    console.error('Rollback failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

decryptExistingApplications()
  .catch(console.error); 