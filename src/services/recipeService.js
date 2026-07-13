import { isSupabaseConfigured, supabase } from '../config/supabase.js';

const RECIPE_SELECT = `
  id,
  title,
  slug,
  description,
  prep_minutes,
  cook_minutes,
  servings,
  difficulty,
  cover_image_path,
  external_image_url,
  is_featured,
  created_at,
  recipe_categories (
    categories (
      id,
      name,
      slug
    )
  )
`;

const RECIPE_DETAIL_SELECT = `
  id,
  author_id,
  title,
  slug,
  description,
  ingredients,
  instructions,
  prep_minutes,
  cook_minutes,
  servings,
  difficulty,
  cover_image_path,
  external_image_url,
  is_featured,
  created_at,
  recipe_categories (
    categories (
      id,
      name,
      slug
    )
  )
`;

function requireSupabaseClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase не е конфигуриран. Провери env променливите.');
  }

  return supabase;
}

function normalizeRecipe(row) {
  const categories = (row.recipe_categories || [])
    .map((item) => item.categories)
    .filter(Boolean);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || '',
    prepMinutes: row.prep_minutes || 0,
    cookMinutes: row.cook_minutes || 0,
    totalMinutes: (row.prep_minutes || 0) + (row.cook_minutes || 0),
    servings: row.servings,
    difficulty: row.difficulty,
    imageUrl: row.external_image_url || '',
    coverImagePath: row.cover_image_path || '',
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    categories
  };
}

function normalizeReview(row, profile) {
  return {
    id: row.id,
    userId: row.user_id,
    rating: row.rating,
    comment: row.comment || '',
    createdAt: row.created_at,
    authorName: profile?.display_name || 'Потребител'
  };
}

function filterRecipes(recipes, { search = '', categorySlug = 'all' } = {}) {
  const normalizedSearch = search.trim().toLocaleLowerCase('bg-BG');

  return recipes.filter((recipe) => {
    const matchesSearch = !normalizedSearch
      || recipe.title.toLocaleLowerCase('bg-BG').includes(normalizedSearch)
      || recipe.description.toLocaleLowerCase('bg-BG').includes(normalizedSearch);

    const matchesCategory = categorySlug === 'all'
      || recipe.categories.some((category) => category.slug === categorySlug);

    return matchesSearch && matchesCategory;
  });
}

export async function getCategories() {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('categories')
    .select('id, name, slug, description, sort_order')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getPublishedRecipes(filters = {}) {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('recipes')
    .select(RECIPE_SELECT)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return filterRecipes((data || []).map(normalizeRecipe), filters);
}

export async function getNewRecipes(limit = 6) {
  const recipes = await getPublishedRecipes();
  return recipes.slice(0, limit);
}

export async function getPopularToday(limit = 5) {
  const recipes = await getPublishedRecipes();
  return recipes
    .slice()
    .sort((first, second) => {
      if (first.isFeatured !== second.isFeatured) {
        return Number(second.isFeatured) - Number(first.isFeatured);
      }

      return new Date(second.createdAt) - new Date(first.createdAt);
    })
    .slice(0, limit);
}

export async function getRecipeById(id) {
  const recipes = await getPublishedRecipes();
  return recipes.find((recipe) => String(recipe.id) === String(id)) || null;
}

export async function getRecipeDetailsBySlug(slug) {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('recipes')
    .select(RECIPE_DETAIL_SELECT)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? enrichRecipeDetails(data) : null;
}

export async function getRecipeDetailsById(id) {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('recipes')
    .select(RECIPE_DETAIL_SELECT)
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? enrichRecipeDetails(data) : null;
}

export async function upsertRecipeReview({ recipeId, userId, rating, comment }) {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('reviews')
    .upsert(
      {
        recipe_id: recipeId,
        user_id: userId,
        rating,
        comment
      },
      { onConflict: 'recipe_id,user_id' }
    )
    .select('id, recipe_id, user_id, rating, comment, created_at, updated_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function enrichRecipeDetails(row) {
  const recipe = normalizeRecipe(row);
  const [authorProfile, reviews] = await Promise.all([
    getProfilesByIds([row.author_id]),
    getRecipeReviews(row.id)
  ]);

  const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    ...recipe,
    authorId: row.author_id,
    authorName: authorProfile.get(row.author_id)?.display_name || 'Автор от Вкусно.bg',
    ingredients: row.ingredients || [],
    instructions: row.instructions || '',
    reviews,
    averageRating: reviews.length ? ratingSum / reviews.length : 0,
    reviewCount: reviews.length
  };
}

async function getRecipeReviews(recipeId) {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('reviews')
    .select('id, user_id, rating, comment, created_at, updated_at')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const reviews = data || [];
  const profileMap = await getProfilesByIds([...new Set(reviews.map((review) => review.user_id))]);

  return reviews.map((review) => normalizeReview(review, profileMap.get(review.user_id)));
}

async function getProfilesByIds(ids) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  const profileMap = new Map();

  if (!uniqueIds.length) {
    return profileMap;
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .select('id, display_name, avatar_path')
    .in('id', uniqueIds);

  if (error) {
    throw error;
  }

  (data || []).forEach((profile) => {
    profileMap.set(profile.id, profile);
  });

  return profileMap;
}
