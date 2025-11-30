/**
 * Add CHG-012 changelog entry for TypeScript build fix
 */

import { PrismaClient, ChangeCategory, ChangeSeverity } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.changelogEntry.create({
    data: {
      refNumber: 'CHG-012',
      title: 'Fix TypeScript Build Error in Neon Actions',
      description: 'Fixed production build failure by adding explicit type annotation to DatabaseStatus enum variable in Neon sync actions. Resolved "Type \'ERROR\' is not assignable to type \'ACTIVE\'" TypeScript error.',
      category: ChangeCategory.BUGFIX,
      severity: ChangeSeverity.PATCH,
      fileChanges: JSON.stringify([
        { ref: 'LIB-016', path: 'lib/actions/neon.ts', change: 'Added DatabaseStatus type annotation to status variable' },
        { ref: 'CONFIG-006', path: 'package.json', change: 'Updated version from 0.5.0 to 0.5.1' },
      ]),
      author: 'Claude Code',
    },
  });

  console.log('✅ Added CHG-012 changelog entry');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
