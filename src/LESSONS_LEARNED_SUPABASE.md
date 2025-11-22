# Lessons Learned: Nuxt + Supabase Integration

## Date: November 22, 2025
## Project: ProjectDaylight - src test app

---

## Summary

Successfully set up and debugged Supabase authentication and database operations in a Nuxt 4 application using the `@nuxtjs/supabase` module. This document captures key learnings from the implementation.

---

## Key Learnings

### 1. **Getting the User ID - The Critical Distinction**

**Problem:** The `useSupabaseUser()` composable returns JWT token claims, not the full User object.

**Discovery:**
- `useSupabaseUser()` returns: `{ sub: "user-id", email: "...", ... }` (JWT claims)
- The user ID is in the `sub` field, not `id`
- This caused `null` user IDs when trying to insert database records

**Solution:** ✅ Always use `session.user.id` for database operations

```typescript
// ❌ WRONG - returns JWT claims where ID is in 'sub'
const user = useSupabaseUser()
const userId = user.value.id  // undefined!

// ✅ CORRECT - use session.user for database operations
const { data: { session } } = await supabase.auth.getSession()
const userId = session?.user?.id  // correct user ID
```

### 2. **Nuxt Supabase Module Configuration**

**Key Configuration Points:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],
  
  supabase: {
    // Can be set directly in config or via env variables
    url: process.env.SUPABASE_URL || 'fallback-url',
    key: process.env.SUPABASE_KEY || 'fallback-key',
    redirect: false  // Disable auto-redirect for flexible auth flows
  }
})
```

**Environment Variables:**
- Use `SUPABASE_URL` and `SUPABASE_KEY` (without `NUXT_PUBLIC_` prefix)
- The module reads these automatically
- Fallback values in config useful for development

### 3. **Row Level Security (RLS) Policies**

**Problem:** Initial RLS policies used `TO public` role which didn't properly authenticate users.

**Evolution of Fixes:**

```sql
-- ❌ Initial attempt - too restrictive
CREATE POLICY "Users can insert" ON test_notes
  FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id);

-- ⚠️  Better but still had issues  
CREATE POLICY "Enable insert" ON test_notes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ✅ Final solution - permissive for dev/testing
CREATE POLICY "Dev allow all" ON test_notes
  FOR ALL TO public
  USING (true)
  WITH CHECK (true);
```

**Lesson:** For development test tables, use permissive policies. For production, use strict authenticated role policies.

### 4. **OAuth Redirect Configuration**

**Working Configuration:**

```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/test`
  }
})
```

**Requirements:**
1. Must be configured in Supabase Dashboard → Authentication → URL Configuration
2. Must match exactly (including path)
3. localhost URLs work for development

### 5. **Database Column Constraints**

**Problem:** `user_id` was NOT NULL, causing inserts to fail when user wasn't properly authenticated.

**Lesson:** For test/development tables, consider nullable foreign keys to allow easier debugging:

```sql
-- Development approach
ALTER TABLE test_notes ALTER COLUMN user_id DROP NOT NULL;

-- Production approach
-- Keep NOT NULL and ensure auth is always present
```

---

## Architecture Patterns That Worked

### 1. Session-Based User ID Retrieval

```typescript
async function addNote() {
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id || null
  
  await supabase.from('table').insert({ user_id: userId, ... })
}
```

### 2. Reactive User Watching

```typescript
const user = useSupabaseUser()

watch(user, async (newUser) => {
  if (newUser) {
    await fetchUserData()
  }
}, { immediate: true })
```

### 3. Filtered Queries Based on Auth State

```typescript
let query = supabase.from('notes').select('*')

if (userId) {
  query = query.eq('user_id', userId)
}

const { data } = await query
```

---

## Common Pitfalls to Avoid

1. **❌ Don't use `user.value.id`** - Use `session.user.id` instead
2. **❌ Don't assume `useSupabaseUser()` returns a full User object** - It returns JWT claims
3. **❌ Don't forget to configure OAuth redirects** in Supabase Dashboard
4. **❌ Don't use overly restrictive RLS policies** during development without proper auth testing
5. **❌ Don't mix `SUPABASE_URL` and `NUXT_PUBLIC_SUPABASE_URL`** - stick to one pattern

---

## Testing Checklist

When setting up Supabase in a new Nuxt project:

- [ ] Install `@nuxtjs/supabase` module
- [ ] Configure `url` and `key` in nuxt.config.ts
- [ ] Set up OAuth provider in Supabase Dashboard
- [ ] Configure redirect URLs in Supabase
- [ ] Create test table with RLS policies
- [ ] Test sign-in flow
- [ ] Verify `session.user.id` is accessible after login
- [ ] Test database insert with proper user_id
- [ ] Test RLS policies with multiple users
- [ ] Verify data persists across page refreshes

---

## Resources

- [Nuxt Supabase Module Docs](https://supabase.nuxtjs.org/getting-started/introduction)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)

---

## File References

- Test page: `src/app/pages/test.vue`
- Configuration: `src/nuxt.config.ts`
- Migrations: `db_migrations/0004_*.sql` through `0007_*.sql`

