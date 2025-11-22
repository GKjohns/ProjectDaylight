# Supabase Test Setup

This test page validates that Supabase authentication and database operations are working correctly in the `src` project.

## Setup Instructions

1. **Run the migration**:
   - Open your Supabase console (SQL Editor)
   - Execute the migration file: `db_migrations/0004_test_notes_table.sql`
   - This creates a `test_notes` table with proper RLS policies

2. **Configure Google OAuth** (if not already done):
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add your OAuth credentials
   - Add redirect URL: `http://localhost:3000/test`

3. **Environment Variables** (Optional):
   The Supabase URL and key are already configured in `nuxt.config.ts` with fallback values. 
   
   If you want to use environment variables instead, create a `.env` file in the `src` directory:
   ```
   SUPABASE_URL=https://soebpfvyoorstmbimrmj.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZWJwZnZ5b29yc3RtYmltcm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTA0NDcsImV4cCI6MjA3OTMyNjQ0N30.otNY3vWXy5GUqEOGzebSewH2X0khQDHE1oqZwnY7Ij0
   ```

## Testing Steps

1. Start the dev server:
   ```bash
   cd src
   npm run dev
   ```

2. Navigate to `http://localhost:3000` and click "Test Supabase"

3. Test the following features:
   - ✅ Sign in with Google
   - ✅ Add a test note
   - ✅ View your notes
   - ✅ Delete a note
   - ✅ Sign out
   - ✅ Verify RLS (sign in as different user, shouldn't see other's notes)

## What's Being Tested

- **Authentication**: Google OAuth sign-in/sign-out flow
- **Database Reads**: Fetching notes from Supabase
- **Database Writes**: Creating new notes
- **Database Deletes**: Removing notes
- **Row Level Security**: Users can only see their own notes (when logged in)
- **Real-time sync**: Data persists across page refreshes

### Important Note on User IDs

The `useSupabaseUser()` composable returns JWT token claims where the user ID is in the `sub` field. However, the recommended way to get the user ID is:

```typescript
const { data: { session } } = await supabase.auth.getSession()
const userId = session?.user?.id  // ✅ Correct way
```

The test page uses this approach for all database operations.

## Table Schema

The `test_notes` table has the following structure:

```sql
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users)
- title (TEXT, required)
- content (TEXT, optional)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

## Troubleshooting

### Row Level Security (RLS) Errors

If you get an RLS error when adding notes:

1. **Check the console** - The error message will have more details
2. **Verify you're logged in** - Check that the user ID displays in the auth section
3. **Run the fix migration** - Execute `db_migrations/0005_fix_test_notes_rls.sql` in your Supabase SQL Editor
   - This updates the policies to use `TO authenticated` which is more explicit
   
4. **Test with RLS disabled** (temporarily):
   ```sql
   -- In Supabase SQL Editor, run:
   ALTER TABLE public.test_notes DISABLE ROW LEVEL SECURITY;
   -- Try adding a note
   -- Then re-enable it:
   ALTER TABLE public.test_notes ENABLE ROW LEVEL SECURITY;
   ```

5. **Verify the session** - Check browser console for "Session: Active" when adding notes

### Other Common Issues

- **"Error signing in"**: Check Google OAuth configuration in Supabase
- **"Error fetching notes"**: Verify the migration was run successfully  
- **"Row not found"**: RLS policies may not be applied correctly (see above)
- **Redirect issues**: Make sure the redirect URL matches in Supabase dashboard

