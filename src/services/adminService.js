import { isSupabaseConfigured, supabase } from '../config/supabase.js';
import { getRecipeImagePublicUrl } from './storageService.js';

function requireSupabaseClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase не е конфигуриран. Провери env променливите.');
  }

  return supabase;
}

function normalizeRecipe(row) {
  const coverImagePath = row.cover_image_path || '';

  return {
    id: row.id,
    authorId: row.author_id,
    title: row.title,
    slug: row.slug,
    description: row.description || '',
    imageUrl: row.external_image_url || getRecipeImagePublicUrl(coverImagePath),
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    categories: (row.recipe_categories || [])
      .map((item) => item.categories)
      .filter(Boolean)
  };
}

export async function getAdminDashboardData() {
  const client = requireSupabaseClient();

  const [profilesResult, rolesResult, recipesResult, categoriesResult] = await Promise.all([
    client
      .from('profiles')
      .select('id, display_name, bio, avatar_path')
      .order('display_name', { ascending: true }),
    client
      .from('user_roles')
      .select('user_id, role')
      .order('role', { ascending: true }),
    client
      .from('recipes')
      .select(`
        id,
        author_id,
        title,
        slug,
        description,
        cover_image_path,
        external_image_url,
        is_published,
        is_featured,
        created_at,
        recipe_categories (
          categories (
            id,
            name,
            slug
          )
        )
      `)
      .order('created_at', { ascending: false }),
    client
      .from('categories')
      .select('id, name, slug, description, sort_order')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
  ]);

  const results = [profilesResult, rolesResult, recipesResult, categoriesResult];
  const failedResult = results.find((result) => result.error);
  if (failedResult) {
    throw failedResult.error;
  }

  const roleByUserId = new Map((rolesResult.data || []).map((role) => [role.user_id, role.role]));
  const profileByUserId = new Map((profilesResult.data || []).map((profile) => [profile.id, profile]));

  const users = (profilesResult.data || []).map((profile) => ({
    id: profile.id,
    displayName: profile.display_name || 'Потребител',
    bio: profile.bio || '',
    avatarPath: profile.avatar_path || '',
    role: roleByUserId.get(profile.id) || 'user'
  }));

  const recipes = (recipesResult.data || []).map((recipe) => ({
    ...normalizeRecipe(recipe),
    authorName: profileByUserId.get(recipe.author_id)?.display_name || 'Потребител'
  }));

  return {
    users,
    recipes,
    categories: categoriesResult.data || []
  };
}

export async function updateUserRole(userId, role) {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('user_roles')
    .upsert(
      {
        user_id: userId,
        role
      },
      { onConflict: 'user_id' }
    )
    .select('user_id, role')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateRecipeAdminFlags(recipeId, values) {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('recipes')
    .update(values)
    .eq('id', recipeId)
    .select('id, is_published, is_featured')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveCategory(values) {
  const client = requireSupabaseClient();
  const payload = {
    name: values.name,
    slug: values.slug,
    description: values.description || null,
    sort_order: values.sortOrder
  };

  const query = values.id
    ? client.from('categories').update(payload).eq('id', values.id)
    : client.from('categories').insert(payload);

  const { data, error } = await query
    .select('id, name, slug, description, sort_order')
    .single();

  if (error) {
    throw error;
  }

  return data;
}
