import { PrismaClient } from '@prisma/client';
import { encrypt } from '../../src/lib/encryption';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function encryptExistingApplications() {
  try {
    const applications = await prisma.application.findMany();
    console.log(`Found ${applications.length} applications to process`);

    for (const app of applications) {
      try {
        // Skip if content is already encrypted (contains the IV separator)
        if (app.content.includes(':')) {
          console.log(`Application ${app.id} is already encrypted, skipping...`);
          continue;
        }

        const encryptedContent = encrypt(app.content);
        await prisma.application.update({
          where: { id: app.id },
          data: { content: encryptedContent }
        });
        console.log(`Encrypted application ${app.id}`);
      } catch (error) {
        console.error(`Failed to encrypt application ${app.id}:`, error);
      }
    }

    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

encryptExistingApplications()
  .catch(console.error); 