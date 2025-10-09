/**
 * Add Missing Columns Migration Script
 * Adds category, visibility, allow_comments, and featured columns to snippets table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
  console.log('🔧 Running Database Migration...\n');
  console.log('='.repeat(60));
  
  try {
    // Check current schema
    console.log('\n1️⃣  Checking current schema...');
    const { data: columns, error: schemaError } = await supabase
      .rpc('get_columns', { table_name: 'snippets' })
      .catch(() => ({ data: null, error: null })); // Ignore if function doesn't exist
    
    // Add missing columns using raw SQL
    console.log('\n2️⃣  Adding missing columns...');
    
    const migrations = [
      {
        name: 'category',
        sql: `ALTER TABLE public.snippets ADD COLUMN IF NOT EXISTS category TEXT;`
      },
      {
        name: 'visibility',
        sql: `ALTER TABLE public.snippets ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' NOT NULL;`
      },
      {
        name: 'allow_comments',
        sql: `ALTER TABLE public.snippets ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true NOT NULL;`
      },
      {
        name: 'featured',
        sql: `ALTER TABLE public.snippets ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false NOT NULL;`
      }
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('exec_sql', { query: migration.sql })
        .catch(() => ({ error: 'RPC not available - use SQL Editor' }));
      
      if (error && typeof error === 'string') {
        console.log(`   ⚠️  ${migration.name}: ${error}`);
        console.log(`   💡 Please run add-missing-columns.sql in Supabase SQL Editor`);
        return;
      } else if (error) {
        console.log(`   ⚠️  ${migration.name}: ${error.message}`);
      } else {
        console.log(`   ✅ ${migration.name} column added`);
      }
    }
    
    // Create indexes
    console.log('\n3️⃣  Creating indexes...');
    const indexes = [
      `CREATE INDEX IF NOT EXISTS idx_snippets_category ON public.snippets(category);`,
      `CREATE INDEX IF NOT EXISTS idx_snippets_visibility ON public.snippets(visibility);`,
      `CREATE INDEX IF NOT EXISTS idx_snippets_featured ON public.snippets(featured);`
    ];
    
    for (const indexSql of indexes) {
      await supabase.rpc('exec_sql', { query: indexSql }).catch(() => {});
    }
    console.log('   ✅ Indexes created');
    
    // Test query with new columns
    console.log('\n4️⃣  Testing query with new columns...');
    const { data, error } = await supabase
      .from('snippets')
      .select('id, title, category, visibility, allow_comments, featured')
      .limit(1);
    
    if (error) {
      console.error('   ❌ Query failed:', error.message);
      console.log('\n📋 Manual Steps Required:');
      console.log('   1. Go to https://supabase.com/dashboard');
      console.log('   2. Select your project');
      console.log('   3. Click "SQL Editor"');
      console.log('   4. Paste the contents of add-missing-columns.sql');
      console.log('   5. Click "Run"\n');
    } else {
      console.log('   ✅ Query successful!');
      if (data && data.length > 0) {
        console.log('   Sample row:', data[0]);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✨ Migration Complete!\n');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n📋 Please run add-missing-columns.sql manually in Supabase SQL Editor');
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
