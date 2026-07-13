import { getPublicStorageUrl, isSupabaseConfigured, supabase } from '../config/supabase.js';

export const STORAGE_BUCKETS = {
  avatars: 'avatars',
  recipeImages: 'recipe-images'
};

function requireSupabaseClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase не е конфигуриран. Провери env променливите.');
  }

  return supabase;
}

function getSafeExtension(file) {
  return file?.name
    ?.split('.')
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, '') || 'jpg';
}

export async function uploadUserFile({ bucket, userId, file, prefix = '' }) {
  if (!file || !file.size) {
    return { path: '', publicUrl: '' };
  }

  if (!userId) {
    throw new Error('Липсва потребител за upload.');
  }

  const client = requireSupabaseClient();
  const safePrefix = prefix ? `${prefix.replace(/[^a-z0-9-]/gi, '-')}-` : '';
  const path = `${userId}/${safePrefix}${Date.now()}-${crypto.randomUUID()}.${getSafeExtension(file)}`;

  const { error } = await client.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  return {
    path,
    publicUrl: getPublicStorageUrl(bucket, path)
  };
}

export function getAvatarPublicUrl(path) {
  return getPublicStorageUrl(STORAGE_BUCKETS.avatars, path);
}

export function getRecipeImagePublicUrl(path) {
  return getPublicStorageUrl(STORAGE_BUCKETS.recipeImages, path);
}

export function uploadAvatar(userId, file) {
  return uploadUserFile({
    bucket: STORAGE_BUCKETS.avatars,
    userId,
    file,
    prefix: 'avatar'
  });
}

export function uploadRecipeImage(userId, file) {
  return uploadUserFile({
    bucket: STORAGE_BUCKETS.recipeImages,
    userId,
    file,
    prefix: 'recipe'
  });
}
