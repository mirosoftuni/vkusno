import { getPublicStorageUrl, isSupabaseConfigured, supabase } from '../config/supabase.js';

const IMAGE_BUCKET = 'recipe-images';
const DUPLICATE_ROW_CODE = '23505';

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
    category_id,
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
  const coverImagePath = row.cover_image_path || '';

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
    imageUrl: row.external_image_url || getPublicStorageUrl(IMAGE_BUCKET, coverImagePath),
    coverImagePath,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    categories,
    categoryIds: (row.recipe_categories || [])
      .map((item) => item.category_id || item.categories?.id)
      .filter(Boolean)
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

export function slugifyTitle(title) {
  const transliterationMap = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sht',
    ъ: 'a',
    ь: 'y',
    ю: 'yu',
    я: 'ya'
  };

  return title
    .trim()
    .toLocaleLowerCase('bg-BG')
    .split('')
    .map((letter) => transliterationMap[letter] || letter)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    || `recepta-${Date.now()}`;
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
  return getRecipeDetails('slug', slug, true);
}

export async function getRecipeDetailsById(id) {
  return getRecipeDetails('id', id, true);
}

export async function getEditableRecipeBySlug(slug) {
  return getRecipeDetails('slug', slug, false);
}

export async function getEditableRecipeById(id) {
  return getRecipeDetails('id', id, false);
}

export async function getCurrentUserRole(userId) {
  if (!userId) {
    return null;
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.role || null;
}

export async function createRecipe({ userId, values, categoryIds, imageFile }) {
  const client = requireSupabaseClient();
  const imagePayload = await uploadRecipeImage(userId, imageFile);
  const baseSlug = slugifyTitle(values.title);

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const slug = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`;
    const { data, error } = await client
      .from('recipes')
      .insert({
        ...toRecipeRow(values),
        ...imagePayload,
        author_id: userId,
        slug,
        is_published: true
      })
      .select('id, slug')
      .single();

    if (!error) {
      await replaceRecipeCategories(data.id, categoryIds);
      return data;
    }

    if (error.code !== DUPLICATE_ROW_CODE || attempt === 5) {
      throw error;
    }
  }

  throw new Error('Не успяхме да създадем уникален адрес за рецептата.');
}

export async function updateRecipe({ userId, recipeId, values, categoryIds, imageFile }) {
  const client = requireSupabaseClient();
  const imagePayload = await uploadRecipeImage(userId, imageFile);
  const baseSlug = slugifyTitle(values.title);

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const slug = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`;
    const { data, error } = await client
      .from('recipes')
      .update({
        ...toRecipeRow(values),
        ...imagePayload,
        slug
      })
      .eq('id', recipeId)
      .select('id, slug')
      .single();

    if (!error) {
      await replaceRecipeCategories(data.id, categoryIds);
      return data;
    }

    if (error.code !== DUPLICATE_ROW_CODE || attempt === 5) {
      throw error;
    }
  }

  throw new Error('Не успяхме да обновим адреса на рецептата.');
}

export async function deleteRecipe(recipeId) {
  const client = requireSupabaseClient();
  const { error } = await client
    .from('recipes')
    .delete()
    .eq('id', recipeId);

  if (error) {
    throw error;
  }
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

async function getRecipeDetails(column, value, publishedOnly) {
  const client = requireSupabaseClient();
  let query = client
    .from('recipes')
    .select(RECIPE_DETAIL_SELECT)
    .eq(column, value);

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return data ? enrichRecipeDetails(data) : null;
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

async function replaceRecipeCategories(recipeId, categoryIds) {
  const client = requireSupabaseClient();
  const selectedIds = [...new Set((categoryIds || []).map(Number).filter(Boolean))];

  const { error: deleteError } = await client
    .from('recipe_categories')
    .delete()
    .eq('recipe_id', recipeId);

  if (deleteError) {
    throw deleteError;
  }

  if (!selectedIds.length) {
    return;
  }

  const { error: insertError } = await client
    .from('recipe_categories')
    .insert(selectedIds.map((categoryId) => ({
      recipe_id: recipeId,
      category_id: categoryId
    })));

  if (insertError) {
    throw insertError;
  }
}

async function uploadRecipeImage(userId, imageFile) {
  if (!imageFile || !imageFile.size) {
    return {};
  }

  const client = requireSupabaseClient();
  const extension = imageFile.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const path = `${userId}/${fileName}`;

  const { error } = await client.storage
    .from(IMAGE_BUCKET)
    .upload(path, imageFile, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  return {
    cover_image_path: path,
    external_image_url: getPublicStorageUrl(IMAGE_BUCKET, path)
  };
}

function toRecipeRow(values) {
  return {
    title: values.title,
    description: values.description,
    ingredients: values.ingredients,
    instructions: values.instructions,
    prep_minutes: values.prepMinutes,
    cook_minutes: values.cookMinutes,
    servings: values.servings,
    difficulty: values.difficulty
  };
}
