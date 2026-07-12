import { isSupabaseConfigured, supabase } from '../config/supabase.js';

const DUPLICATE_ROW_CODE = '23505';

function requireSupabaseClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase не е конфигуриран. Провери VITE_SUPABASE_URL и VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  return supabase;
}

function isDuplicateRowError(error) {
  return error?.code === DUPLICATE_ROW_CODE;
}

export function getFallbackDisplayName(user) {
  return user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Потребител';
}

export async function getCurrentSession() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }

  return data.session;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user || null;
}

export async function getProfile(userId) {
  if (!userId || !isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, bio, avatar_path')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function ensureUserRecords(user, displayName) {
  const client = requireSupabaseClient();
  if (!user?.id) {
    return;
  }

  const safeDisplayName = (displayName || getFallbackDisplayName(user)).trim();

  const { error: profileError } = await client
    .from('profiles')
    .insert({
      id: user.id,
      display_name: safeDisplayName
    });

  if (profileError && !isDuplicateRowError(profileError)) {
    throw profileError;
  }

  const { error: roleError } = await client
    .from('user_roles')
    .insert({
      user_id: user.id,
      role: 'user'
    });

  if (roleError && !isDuplicateRowError(roleError)) {
    throw roleError;
  }
}

export async function signInWithPassword(email, password) {
  const client = requireSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    throw error;
  }

  if (data.user) {
    await ensureUserRecords(data.user);
  }

  return data;
}

export async function signUp({ email, password, displayName }) {
  const client = requireSupabaseClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName
      }
    }
  });

  if (error) {
    throw error;
  }

  if (data.user && data.session) {
    await ensureUserRecords(data.user, displayName);
  }

  return data;
}

export async function signOut() {
  const client = requireSupabaseClient();
  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getAuthNavbarState() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, displayName: null };
  }

  const profile = await getProfile(user.id);

  return {
    user,
    displayName: profile?.display_name || getFallbackDisplayName(user)
  };
}
