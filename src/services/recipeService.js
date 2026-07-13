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
