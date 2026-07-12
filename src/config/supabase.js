import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const missingEnvVars = [
  ['VITE_SUPABASE_URL', supabaseUrl],
  ['VITE_SUPABASE_PUBLISHABLE_KEY', supabasePublishableKey]
]
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isSupabaseConfigured = missingEnvVars.length === 0;

if (!isSupabaseConfigured) {
  console.warn(`Supabase env variables are missing: ${missingEnvVars.join(', ')}`);
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

export function getPublicStorageUrl(bucket, path) {
  if (!isSupabaseConfigured || !bucket || !path) {
    return '';
  }

  const normalizedPath = path.replace(/^\/+/, '');
  const { data } = supabase.storage.from(bucket).getPublicUrl(normalizedPath);

  return data.publicUrl;
}
