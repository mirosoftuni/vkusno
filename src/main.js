import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { initI18n } from './i18n.js';
import {
  getAdminDashboardData,
  saveCategory,
  updateRecipeAdminFlags,
  updateUserRole
} from './services/adminService.js';
import { isSupabaseConfigured } from './config/supabase.js';
import {
  getAuthNavbarState,
  getCurrentUser,
  getProfile,
  signInWithPassword,
  signOut,
  signUp,
  updateProfile
} from './services/authService.js';
import {
  createRecipe,
  deleteRecipe,
  getCategories,
  getCurrentUserRole,
  getEditableRecipeById,
  getEditableRecipeBySlug,
  getNewRecipes,
  getPopularToday,
  getPublishedRecipes,
  getRecipesByAuthor,
  getRecipeDetailsById,
  getRecipeDetailsBySlug,
  slugifyTitle,
  updateRecipe,
  upsertRecipeReview
} from './services/recipeService.js';
import { getAvatarPublicUrl, uploadAvatar } from './services/storageService.js';
import { renderPopularRecipeItem, renderRecipeCard } from './components/recipeCard.js';

void isSupabaseConfigured;

const recipes = [
  {
    id: 1,
    title: 'Домашна леща с печени зеленчуци',
    category: 'Постни ястия',
    time: 45,
    difficulty: 'Лесна',
    author: 'Мария Петрова',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    description: 'Сгряваща леща с морков, чушка и ароматни подправки за делнична вечеря.',
    ingredients: ['250 г леща', '1 морков', '1 червена чушка', '1 глава лук', '2 с.л. олио', 'чубрица', 'сол и пипер'],
    steps: ['Измийте лещата и я сложете да заври.', 'Запечете нарязаните зеленчуци за кратко.', 'Смесете всичко и гответе до омекване.', 'Подправете и сервирайте топла.']
  },
  {
    id: 2,
    title: 'Пилешки кюфтенца с млечен сос',
    category: 'Основни ястия',
    time: 35,
    difficulty: 'Средна',
    author: 'Иван Георгиев',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80',
    description: 'Леки кюфтенца с пресни билки и свеж сос с кисело мляко.',
    ingredients: ['500 г пилешка кайма', '1 яйце', 'галета', 'копър', '200 г кисело мляко', 'чесън'],
    steps: ['Омесете каймата с яйце, галета и подправки.', 'Оформете малки кюфтенца.', 'Изпечете ги върху хартия.', 'Разбъркайте соса и поднесете.']
  },
  {
    id: 3,
    title: 'Бърз ябълков сладкиш',
    category: 'Десерти',
    time: 55,
    difficulty: 'Лесна',
    author: 'Елена Стоянова',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=1200&q=80',
    description: 'Пухкав сладкиш с ябълки, канела и хрупкава захарна коричка.',
    ingredients: ['3 ябълки', '2 яйца', '180 г захар', '220 г брашно', '100 мл олио', 'канела'],
    steps: ['Разбийте яйцата със захарта.', 'Добавете брашното и олиото.', 'Разпределете ябълките отгоре.', 'Печете до златисто.']
  },
  {
    id: 4,
    title: 'Салата с домати, сирене и печен пипер',
    category: 'Салати',
    time: 15,
    difficulty: 'Лесна',
    author: 'Николай Василев',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    description: 'Цветна сезонна салата с балансиран дресинг и много свежест.',
    ingredients: ['2 домата', '2 печени пипера', '100 г сирене', 'магданоз', 'зехтин', 'оцет'],
    steps: ['Нарежете зеленчуците.', 'Натрошете сиренето.', 'Добавете дресинга.', 'Разбъркайте внимателно.']
  },
  {
    id: 5,
    title: 'Супа топчета по домашному',
    category: 'Супи',
    time: 50,
    difficulty: 'Средна',
    author: 'Даниела Колева',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    description: 'Класическа супа с ориз, зеленчуци и нежна застройка.',
    ingredients: ['300 г кайма', 'ориз', 'морков', 'целина', 'яйце', 'кисело мляко'],
    steps: ['Оформете малки топчета.', 'Сварете зеленчуците.', 'Добавете топчетата и ориза.', 'Застройте внимателно.']
  },
  {
    id: 6,
    title: 'Пълнени чушки с ориз',
    category: 'Традиционни',
    time: 70,
    difficulty: 'Средна',
    author: 'Георги Димитров',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    description: 'Ароматни чушки с ориз, зеленчуци и доматен сос.',
    ingredients: ['8 чушки', '1 ч.ч. ориз', 'лук', 'морков', 'домати', 'магданоз'],
    steps: ['Задушете плънката.', 'Напълнете чушките.', 'Подредете ги в тава.', 'Печете с доматен сос.']
  }
];

const categoryLinks = [
  { label: 'Салати', icon: 'bi-flower1' },
  { label: 'Супи', icon: 'bi-cup-hot' },
  { label: 'Основни ястия', icon: 'bi-egg-fried' },
  { label: 'Постни ястия', icon: 'bi-leaf' },
  { label: 'Традиционни', icon: 'bi-house-heart' },
  { label: 'Десерти', icon: 'bi-cake2' }
];

const categories = [...new Set(recipes.map((recipe) => recipe.category))];
let currentAdminState = null;

document.addEventListener('DOMContentLoaded', async () => {
  initI18n();
  setActiveNavigation();
  const shouldRenderPage = await initAuth();
  if (!shouldRenderPage) {
    return;
  }

  if (isHomePage()) {
    await initHomePage();
  } else {
    renderCategoryPills();
    renderCategoryList();
    renderRecipeCards(recipes);
    renderTopRecipes();
    bindSearch();
  }

  await renderRecipeDetails();
  await initProfilePage();
  await initAdminPage();
  bindDemoForms();
  await bindRecipeForm();
});

async function initAuth() {
  try {
    const canRenderPage = await applyPageGuard();
    if (!canRenderPage) {
      return false;
    }

    markAuthReady();
    await renderAuthNavigation();
    bindLoginForm();
    bindRegisterForm();
    bindSignOut();

    return true;
  } catch (error) {
    console.error(error);
    markAuthReady();
    renderAuthNavigationFallback();
    return true;
  }
}

function markAuthReady() {
  if (document.body.dataset.pageAccess) {
    document.body.dataset.authReady = 'true';
  }
}

function setActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function isHomePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  return currentPage === 'index.html' && document.querySelector('[data-popular-recipes]');
}

async function initHomePage() {
  const state = {
    categories: [],
    search: '',
    categorySlug: 'all'
  };

  try {
    state.categories = await getCategories();
    renderHomeCategories(state.categories, state.categorySlug);
    bindHomeSearch(state);
    await renderHomeRecipeSections(state);
  } catch (error) {
    console.error(error);
    renderHomeError();
  }
}

async function renderHomeRecipeSections(state) {
  setRecipeListLoading();

  const [recipesFromSearch, newRecipes, popularRecipes] = await Promise.all([
    getPublishedRecipes({ search: state.search, categorySlug: state.categorySlug }),
    getNewRecipes(6),
    getPopularToday(5)
  ]);

  const list = state.search || state.categorySlug !== 'all'
    ? recipesFromSearch
    : newRecipes;

  renderHomeRecipeCards(list);
  renderPopularRecipes(popularRecipes);
}

function renderHomeCategories(categoriesList, activeSlug) {
  const pillsContainer = document.querySelector('[data-categories]');
  const listContainer = document.querySelector('[data-category-list]');

  if (pillsContainer) {
    pillsContainer.innerHTML = [
      { name: 'Всички', slug: 'all' },
      ...categoriesList
    ].map((category) => `
      <button class="btn ${category.slug === activeSlug ? 'btn-success' : 'btn-outline-success'} btn-sm rounded-pill" type="button" data-home-category="${category.slug}">
        ${escapeHtml(category.name)}
      </button>
    `).join('');
  }

  if (listContainer) {
    listContainer.innerHTML = categoriesList.map((category) => `
      <button class="category-link category-button" type="button" data-home-category="${category.slug}">
        <span><i class="bi bi-tag"></i> ${escapeHtml(category.name)}</span>
        <i class="bi bi-chevron-right"></i>
      </button>
    `).join('');
  }
}

function renderHomeRecipeCards(list) {
  const container = document.querySelector('[data-recipe-list]');
  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div class="col-12">
        <div class="content-panel empty-state">
          <i class="bi bi-search"></i>
          <h2 class="h5 mb-1">Няма намерени рецепти</h2>
          <p class="text-secondary mb-0">Пробвай с друга дума или избери различна категория.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(renderRecipeCard).join('');
}

function renderPopularRecipes(list) {
  const container = document.querySelector('[data-popular-recipes]');
  if (!container) return;

  container.innerHTML = list.length
    ? list.map(renderPopularRecipeItem).join('')
    : '<p class="text-secondary mb-0">Все още няма популярни рецепти.</p>';
}

function bindHomeSearch(state) {
  const form = document.querySelector('[data-search-form]');
  const input = document.querySelector('[data-search-input]');
  const categoryRoot = document.querySelector('main');
  if (!form || !input || !categoryRoot) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    state.search = input.value.trim();
    await renderHomeRecipeSections(state);
  });

  input.addEventListener('input', debounce(async () => {
    state.search = input.value.trim();
    await renderHomeRecipeSections(state);
  }, 250));

  categoryRoot.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-home-category]');
    if (!button) return;

    state.categorySlug = button.dataset.homeCategory;
    renderHomeCategories(state.categories, state.categorySlug);
    await renderHomeRecipeSections(state);
  });
}

function setRecipeListLoading() {
  const container = document.querySelector('[data-recipe-list]');
  if (!container) return;

  container.innerHTML = `
    <div class="col"><div class="content-panel loading-card"></div></div>
    <div class="col"><div class="content-panel loading-card"></div></div>
  `;
}

function renderHomeError() {
  const listContainer = document.querySelector('[data-recipe-list]');
  const categoryContainer = document.querySelector('[data-category-list]');
  const popularContainer = document.querySelector('[data-popular-recipes]');

  if (listContainer) {
    listContainer.innerHTML = `
      <div class="col-12">
        <div class="content-panel empty-state">
          <i class="bi bi-exclamation-triangle"></i>
          <h2 class="h5 mb-1">Не успяхме да заредим рецептите</h2>
          <p class="text-secondary mb-0">Провери Supabase настройките и опитай отново.</p>
        </div>
      </div>
    `;
  }

  if (categoryContainer) {
    categoryContainer.innerHTML = '<p class="text-secondary mb-0">Категориите не са заредени.</p>';
  }

  if (popularContainer) {
    popularContainer.innerHTML = '<p class="text-secondary mb-0">Популярните рецепти не са заредени.</p>';
  }
}

function debounce(callback, delay) {
  let timerId;

  return (...args) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => callback(...args), delay);
  };
}

async function applyPageGuard() {
  const access = document.body.dataset.pageAccess;
  if (!access) {
    return true;
  }

  const user = await getCurrentUser();
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (access === 'guest' && user) {
    window.location.replace('profile.html');
    return false;
  }

  if (access === 'auth' && !user) {
    window.location.replace(`login.html?next=${encodeURIComponent(currentPage)}`);
    return false;
  }

  return true;
}

async function renderAuthNavigation() {
  const containers = document.querySelectorAll('[data-auth-nav]');
  if (!containers.length) return;

  const { user, displayName } = await getAuthNavbarState();
  const role = user ? await getNavigationRole(user.id) : null;
  updateProtectedNavigation({ user, role });

  const html = user
    ? `
      <a class="btn btn-outline-success btn-sm auth-user-pill" href="profile.html">
        <i class="bi bi-person-circle"></i>
        ${escapeHtml(displayName)}
      </a>
      <button class="btn btn-success btn-sm" type="button" data-sign-out>
        <i class="bi bi-box-arrow-right"></i>
        Изход
      </button>
    `
    : `
      <a class="btn btn-outline-success btn-sm" href="login.html">Вход</a>
      <a class="btn btn-success btn-sm" href="register.html">Регистрация</a>
    `;

  containers.forEach((container) => {
    container.innerHTML = html;
  });
}

function renderAuthNavigationFallback() {
  updateProtectedNavigation({ user: null, role: null });

  document.querySelectorAll('[data-auth-nav]').forEach((container) => {
    container.innerHTML = `
      <a class="btn btn-outline-success btn-sm" href="login.html">Вход</a>
      <a class="btn btn-success btn-sm" href="register.html">Регистрация</a>
    `;
  });
}

async function getNavigationRole(userId) {
  try {
    return await getCurrentUserRole(userId);
  } catch (error) {
    console.error(error);
    return null;
  }
}

function updateProtectedNavigation({ user, role }) {
  document.querySelectorAll('[data-guest-only]').forEach((element) => {
    element.classList.toggle('d-none', Boolean(user));
  });

  document.querySelectorAll('[data-auth-only]').forEach((element) => {
    element.classList.toggle('d-none', !user);
  });

  document.querySelectorAll('[data-admin-only]').forEach((element) => {
    element.classList.toggle('d-none', role !== 'admin');
  });
}

function bindLoginForm() {
  const form = document.querySelector('[data-login-form]');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormLoading(form, true);
    setFormAlert(form, '', 'success', true);

    try {
      const email = form.querySelector('#email').value.trim();
      const password = form.querySelector('#password').value;
      await signInWithPassword(email, password);

      setFormAlert(form, 'Успешен вход. Пренасочваме към профила...', 'success');
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get('next') || 'profile.html';
    } catch (error) {
      setFormAlert(form, getAuthErrorMessage(error), 'danger');
    } finally {
      setFormLoading(form, false);
    }
  });
}

function bindRegisterForm() {
  const form = document.querySelector('[data-register-form]');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormLoading(form, true);
    setFormAlert(form, '', 'success', true);

    try {
      const displayName = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const password = form.querySelector('#password').value;
      const data = await signUp({ email, password, displayName });

      if (data.session) {
        setFormAlert(form, 'Профилът е създаден. Пренасочваме...', 'success');
        window.location.href = 'profile.html';
      } else {
        setFormAlert(form, 'Регистрацията е успешна. Провери имейла си, за да потвърдиш профила.', 'success');
      }
    } catch (error) {
      setFormAlert(form, getAuthErrorMessage(error), 'danger');
    } finally {
      setFormLoading(form, false);
    }
  });
}

function bindSignOut() {
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-sign-out]');
    if (!button) return;

    button.disabled = true;

    try {
      await signOut();
      window.location.href = 'index.html';
    } catch (error) {
      console.error(error);
      button.disabled = false;
    }
  });
}

function setFormLoading(form, isLoading) {
  const button = form.querySelector('[data-submit-button]');
  if (!button) return;

  button.disabled = isLoading;
  button.dataset.originalText ||= button.textContent.trim();
  button.textContent = isLoading ? 'Моля, изчакай...' : button.dataset.originalText;
}

function setFormAlert(form, message, type, hide = false) {
  const alert = form.querySelector('[data-form-alert]');
  if (!alert) return;

  alert.textContent = message;
  alert.className = `alert alert-${type}${hide ? ' d-none' : ''}`;
}

function getAuthErrorMessage(error) {
  if (!isSupabaseConfigured) {
    return 'Supabase не е конфигуриран. Провери env променливите.';
  }

  return error?.message || 'Възникна грешка. Опитай отново.';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderCategoryPills() {
  const container = document.querySelector('[data-categories]');
  if (!container) return;

  container.innerHTML = ['Всички', ...categories].map((category, index) => `
    <button class="btn ${index === 0 ? 'btn-success' : 'btn-outline-success'} btn-sm rounded-pill" type="button" data-category="${category}">
      ${category}
    </button>
  `).join('');
}

function renderCategoryList() {
  const container = document.querySelector('[data-category-list]');
  if (!container) return;

  container.innerHTML = categoryLinks.map((category) => `
    <a href="index.html" class="category-link">
      <span><i class="bi ${category.icon}"></i> ${category.label}</span>
      <i class="bi bi-chevron-right"></i>
    </a>
  `).join('');
}

function renderRecipeCards(list) {
  const container = document.querySelector('[data-recipe-list]');
  if (!container) return;

  container.innerHTML = list.map((recipe) => `
    <article class="col">
      <div class="card recipe-card h-100">
        <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between gap-2 mb-2">
            <span class="badge text-bg-light border">${recipe.category}</span>
            <span class="small text-warning"><i class="bi bi-star-fill"></i> ${recipe.rating}</span>
          </div>
          <h2 class="h5 card-title">${recipe.title}</h2>
          <p class="card-text text-secondary">${recipe.description}</p>
          <div class="recipe-meta mt-auto">
            <span><i class="bi bi-clock"></i> ${recipe.time} мин</span>
            <span><i class="bi bi-bar-chart"></i> ${recipe.difficulty}</span>
          </div>
          <a href="recipe.html?id=${recipe.id}" class="btn btn-outline-success mt-3">
            Виж рецептата
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

function renderTopRecipes() {
  const container = document.querySelector('[data-top-recipes]');
  if (!container) return;

  container.innerHTML = [...recipes]
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 5)
    .map((recipe, index) => `
      <a class="top-recipe" href="recipe.html?id=${recipe.id}">
        <span class="top-recipe-rank">${index + 1}</span>
        <span class="top-recipe-body">
          <strong>${recipe.title}</strong>
          <small><i class="bi bi-star-fill"></i> ${recipe.rating} · ${recipe.time} мин</small>
        </span>
      </a>
    `).join('');
}

function renderStaticRecipeDetails() {
  const container = document.querySelector('[data-recipe-details]');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const recipe = recipes.find((item) => item.id === Number(params.get('id'))) || recipes[0];

  document.title = `${recipe.title} | Вкусно.bg`;
  container.innerHTML = `
    <div class="recipe-hero row g-0">
      <div class="col-lg-6">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-hero-image">
      </div>
      <div class="col-lg-6 p-4 p-lg-5">
        <span class="badge text-bg-success mb-3">${recipe.category}</span>
        <h1>${recipe.title}</h1>
        <p class="lead text-secondary">${recipe.description}</p>
        <div class="recipe-stats">
          <span><i class="bi bi-clock"></i> ${recipe.time} мин</span>
          <span><i class="bi bi-bar-chart"></i> ${recipe.difficulty}</span>
          <span><i class="bi bi-star-fill"></i> ${recipe.rating}</span>
        </div>
        <p class="mt-4 mb-0 text-secondary">Автор: <strong>${recipe.author}</strong></p>
      </div>
    </div>
    <div class="row g-4 mt-4">
      <section class="col-lg-4">
        <div class="content-panel">
          <h2 class="h4">Продукти</h2>
          <ul class="ingredient-list">
            ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
          </ul>
        </div>
      </section>
      <section class="col-lg-8">
        <div class="content-panel">
          <h2 class="h4">Начин на приготвяне</h2>
          <ol class="step-list">
            ${recipe.steps.map((step) => `<li>${step}</li>`).join('')}
          </ol>
        </div>
      </section>
    </div>
  `;
}

async function initProfilePage() {
  const container = document.querySelector('[data-profile-recipes]');
  if (!container) return;

  const form = document.querySelector('[data-profile-form]');
  const user = await getCurrentUser();
  if (!user) return;

  try {
    const [profile, role, userRecipes] = await Promise.all([
      getProfile(user.id),
      getCurrentUserRole(user.id),
      getRecipesByAuthor(user.id)
    ]);

    renderProfileHeader(user, profile, role);
    fillProfileForm(form, profile, user);
    renderProfileStats(userRecipes, role);
    renderProfileRecipeList(container, userRecipes);
    bindProfileForm(form, user, profile);
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-exclamation-triangle"></i>
        <p class="text-secondary mb-0">Не успяхме да заредим профила.</p>
      </div>
    `;
  }
}

function renderProfileHeader(user, profile, role) {
  const name = profile?.display_name || user.email?.split('@')[0] || 'Потребител';
  const bio = profile?.bio || 'Домашен кулинар във Вкусно.bg.';
  const avatarUrl = getProfileAvatarUrl(profile?.avatar_path);

  document.querySelector('[data-profile-name]')?.replaceChildren(document.createTextNode(name));
  document.querySelector('[data-profile-bio]')?.replaceChildren(document.createTextNode(bio));
  document.querySelector('[data-profile-role]')?.replaceChildren(document.createTextNode(getRoleLabel(role)));

  const avatar = document.querySelector('[data-profile-avatar]');
  if (avatar) {
    avatar.src = avatarUrl;
    avatar.alt = `Профилна снимка на ${name}`;
  }
}

function fillProfileForm(form, profile, user) {
  if (!form) return;

  form.querySelector('#display_name').value = profile?.display_name || user.email?.split('@')[0] || '';
  form.querySelector('#bio').value = profile?.bio || '';
  form.dataset.avatarPath = profile?.avatar_path || '';
}

function renderProfileStats(userRecipes, role) {
  const count = document.querySelector('[data-profile-recipes-count]');
  const shortRole = document.querySelector('[data-profile-role-short]');

  if (count) count.textContent = String(userRecipes.length);
  if (shortRole) shortRole.textContent = role || 'user';
}

function renderProfileRecipeList(container, userRecipes) {
  if (!userRecipes.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-journal-plus"></i>
        <p class="text-secondary mb-0">Все още нямаш добавени рецепти.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = userRecipes.map((recipe) => {
    const totalMinutes = recipe.totalMinutes || recipe.prepMinutes || recipe.cookMinutes;
    const imageUrl = recipe.imageUrl || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80';

    return `
      <a class="list-group-item list-group-item-action d-flex align-items-center gap-3" href="recipe.html?slug=${encodeURIComponent(recipe.slug)}">
        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(recipe.title)}" class="profile-recipe-thumb">
        <span class="flex-grow-1">
          <strong class="d-block">${escapeHtml(recipe.title)}</strong>
          <small class="text-secondary">${escapeHtml(recipe.categories[0]?.name || 'Рецепта')} · ${totalMinutes} мин · ${getDifficultyLabel(recipe.difficulty)}</small>
        </span>
        <i class="bi bi-chevron-right"></i>
      </a>
    `;
  }).join('');
}

function bindProfileForm(form, user, profile) {
  if (!form || form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormLoading(form, true);
    setFormAlert(form, '', 'success', true);

    try {
      const avatarFile = form.querySelector('#avatar')?.files?.[0] || null;
      const uploadedAvatar = avatarFile ? await uploadAvatar(user.id, avatarFile) : null;
      const avatarPath = uploadedAvatar?.path || form.dataset.avatarPath || profile?.avatar_path || '';

      const updatedProfile = await updateProfile(user.id, {
        displayName: form.querySelector('#display_name').value.trim(),
        bio: form.querySelector('#bio').value.trim(),
        avatarPath
      });

      form.dataset.avatarPath = updatedProfile.avatar_path || '';
      renderProfileHeader(user, updatedProfile, await getCurrentUserRole(user.id));
      await renderAuthNavigation();
      setFormAlert(form, 'Профилът е обновен успешно.', 'success');
    } catch (error) {
      console.error(error);
      setFormAlert(form, error?.message || 'Не успяхме да обновим профила.', 'danger');
    } finally {
      setFormLoading(form, false);
    }
  });
}

function getProfileAvatarUrl(path) {
  return getAvatarPublicUrl(path)
    || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';
}

function getRoleLabel(role) {
  return role === 'admin' ? 'Администратор' : 'Потребител';
}
async function initAdminPage() {
  const panel = document.querySelector('[data-admin-panel]');
  const warning = document.querySelector('[data-admin-warning]');
  if (!panel) return;

  const user = await getCurrentUser();
  const role = user ? await getCurrentUserRole(user.id) : null;

  if (role !== 'admin') {
    panel.classList.add('d-none');
    if (warning) {
      warning.classList.remove('d-none');
      warning.innerHTML = `
        <strong>Нямаш достъп до административния панел.</strong>
        Тази страница е достъпна само за потребители с роля <code>admin</code>.
      `;
    }
    return;
  }

  panel.classList.remove('d-none');
  warning?.classList.add('d-none');

  try {
    const state = await getAdminDashboardData();
    renderAdminDashboard(state);
    bindAdminActions();
  } catch (error) {
    console.error(error);
    if (warning) {
      warning.classList.remove('d-none');
      warning.classList.replace('alert-warning', 'alert-danger');
      warning.textContent = error?.message || 'Не успяхме да заредим административните данни.';
    }
  }
}

function renderAdminDashboard(state) {
  currentAdminState = state;
  const recipesCount = document.querySelector('[data-admin-recipes-count]');
  const publishedCount = document.querySelector('[data-admin-published-count]');
  const usersCount = document.querySelector('[data-admin-users-count]');

  if (recipesCount) recipesCount.textContent = String(state.recipes.length);
  if (publishedCount) {
    publishedCount.textContent = String(state.recipes.filter((recipe) => recipe.isPublished).length);
  }
  if (usersCount) usersCount.textContent = String(state.users.length);

  renderAdminUsers(state.users);
  renderAdminRecipes(state.recipes);
  renderAdminCategories(state.categories);
}

function renderAdminUsers(users) {
  const tbody = document.querySelector('[data-admin-users]');
  if (!tbody) return;

  tbody.innerHTML = users.map((user) => `
    <tr>
      <td>
        <strong class="d-block">${escapeHtml(user.displayName)}</strong>
        <small class="text-secondary">${escapeHtml(user.id)}</small>
      </td>
      <td style="width: 150px;">
        <select class="form-select form-select-sm" data-admin-user-role data-user-id="${escapeHtml(user.id)}">
          <option value="user" ${user.role === 'user' ? 'selected' : ''}>user</option>
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function renderAdminRecipes(recipesList) {
  const tbody = document.querySelector('[data-admin-recipes]');
  if (!tbody) return;

  tbody.innerHTML = recipesList.map((recipe) => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-3">
          <img src="${escapeHtml(recipe.imageUrl || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=300&q=80')}" alt="${escapeHtml(recipe.title)}" class="admin-thumb">
          <span>
            <strong class="d-block">${escapeHtml(recipe.title)}</strong>
            <small class="text-secondary">${escapeHtml(recipe.categories[0]?.name || 'Без категория')}</small>
          </span>
        </div>
      </td>
      <td>${escapeHtml(recipe.authorName)}</td>
      <td>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" data-admin-recipe-toggle data-recipe-id="${recipe.id}" data-field="is_published" ${recipe.isPublished ? 'checked' : ''}>
          <label class="form-check-label">Публикувана</label>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" data-admin-recipe-toggle data-recipe-id="${recipe.id}" data-field="is_featured" ${recipe.isFeatured ? 'checked' : ''}>
          <label class="form-check-label">Топ</label>
        </div>
      </td>
      <td class="text-end">
        <a class="btn btn-sm btn-outline-secondary" href="recipe-form.html?slug=${encodeURIComponent(recipe.slug)}" aria-label="Редакция">
          <i class="bi bi-pencil-square"></i>
        </a>
      </td>
    </tr>
  `).join('');
}

function renderAdminCategories(categoriesList) {
  const container = document.querySelector('[data-admin-categories]');
  if (!container) return;

  container.innerHTML = categoriesList.map((category) => `
    <article class="list-group-item d-flex justify-content-between align-items-start gap-3">
      <span>
        <strong class="d-block">${escapeHtml(category.name)}</strong>
        <small class="text-secondary">${escapeHtml(category.slug)} · подредба ${category.sort_order}</small>
        ${category.description ? `<span class="d-block text-secondary mt-1">${escapeHtml(category.description)}</span>` : ''}
      </span>
      <button class="btn btn-sm btn-outline-secondary" type="button" data-admin-category-edit="${category.id}">
        <i class="bi bi-pencil"></i>
      </button>
    </article>
  `).join('');
}

function bindAdminActions() {
  const panel = document.querySelector('[data-admin-panel]');
  const categoryForm = document.querySelector('[data-admin-category-form]');
  if (!panel || panel.dataset.bound === 'true') return;
  panel.dataset.bound = 'true';

  panel.addEventListener('change', async (event) => {
    const roleSelect = event.target.closest('[data-admin-user-role]');
    const recipeToggle = event.target.closest('[data-admin-recipe-toggle]');

    if (roleSelect) {
      await handleAdminRoleChange(roleSelect);
    }

    if (recipeToggle) {
      await handleAdminRecipeToggle(recipeToggle);
    }
  });

  panel.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-admin-category-edit]');
    const resetButton = event.target.closest('[data-admin-category-reset]');

    if (editButton) {
      const category = currentAdminState?.categories.find((item) => String(item.id) === String(editButton.dataset.adminCategoryEdit));
      if (category) fillAdminCategoryForm(categoryForm, category);
    }

    if (resetButton) {
      resetAdminCategoryForm(categoryForm);
    }
  });

  categoryForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await handleAdminCategorySubmit(categoryForm);
  });
}

async function handleAdminRoleChange(select) {
  const previousValue = select.dataset.previousValue || (select.value === 'admin' ? 'user' : 'admin');
  select.disabled = true;

  try {
    await updateUserRole(select.dataset.userId, select.value);
    select.dataset.previousValue = select.value;
  } catch (error) {
    console.error(error);
    select.value = previousValue;
    window.alert(error?.message || 'Не успяхме да обновим ролята.');
  } finally {
    select.disabled = false;
  }
}

async function handleAdminRecipeToggle(input) {
  input.disabled = true;

  try {
    await updateRecipeAdminFlags(input.dataset.recipeId, {
      [input.dataset.field]: input.checked
    });
  } catch (error) {
    console.error(error);
    input.checked = !input.checked;
    window.alert(error?.message || 'Не успяхме да обновим рецептата.');
  } finally {
    input.disabled = false;
  }
}

async function handleAdminCategorySubmit(form) {
  setFormLoading(form, true);
  setFormAlert(form, '', 'success', true);

  try {
    const name = form.querySelector('#category_name').value.trim();
    const slugInput = form.querySelector('#category_slug');
    const savedCategory = await saveCategory({
      id: form.querySelector('#category_id').value || null,
      name,
      slug: slugInput.value.trim() || slugifyTitle(name),
      description: form.querySelector('#category_description').value.trim(),
      sortOrder: Number(form.querySelector('#category_sort_order').value) || 0
    });

    const state = await getAdminDashboardData();
    renderAdminDashboard(state);
    resetAdminCategoryForm(form);
    setFormAlert(form, `Категорията "${savedCategory.name}" е запазена.`, 'success');
  } catch (error) {
    console.error(error);
    setFormAlert(form, error?.message || 'Не успяхме да запазим категорията.', 'danger');
  } finally {
    setFormLoading(form, false);
  }
}

function fillAdminCategoryForm(form, category) {
  if (!form) return;

  form.querySelector('#category_id').value = category.id;
  form.querySelector('#category_name').value = category.name || '';
  form.querySelector('#category_slug').value = category.slug || '';
  form.querySelector('#category_description').value = category.description || '';
  form.querySelector('#category_sort_order').value = category.sort_order || 0;
}

function resetAdminCategoryForm(form) {
  if (!form) return;

  form.reset();
  form.querySelector('#category_id').value = '';
  setFormAlert(form, '', 'success', true);
}

function bindSearch() {
  const form = document.querySelector('[data-search-form]');
  const input = document.querySelector('[data-search-input]');
  const categoryBox = document.querySelector('[data-categories]');
  if (!form || !input) return;

  let activeCategory = 'Всички';

  function applyFilters() {
    const query = input.value.trim().toLowerCase();
    const filtered = recipes.filter((recipe) => {
      const matchesQuery = [recipe.title, recipe.description, recipe.category].some((field) => field.toLowerCase().includes(query));
      const matchesCategory = activeCategory === 'Всички' || recipe.category === activeCategory;
      return matchesQuery && matchesCategory;
    });

    renderRecipeCards(filtered);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });

  input.addEventListener('input', applyFilters);

  categoryBox?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;

    activeCategory = button.dataset.category;
    categoryBox.querySelectorAll('button').forEach((item) => {
      item.classList.toggle('btn-success', item === button);
      item.classList.toggle('btn-outline-success', item !== button);
    });
    applyFilters();
  });
}

function bindDemoForms() {
  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const alert = form.querySelector('[data-form-alert]');
      if (alert) {
        alert.classList.remove('d-none');
      }
    });
  });
}

async function bindRecipeForm() {
  const form = document.querySelector('[data-recipe-form]');
  if (!form) return;

  const user = await getCurrentUser();
  if (!user) return;

  const params = new URLSearchParams(window.location.search);
  const recipeSlug = params.get('slug');
  const recipeId = params.get('id');
  const isEditMode = Boolean(recipeSlug || recipeId);
  const categoryContainer = form.querySelector('[data-form-categories]');
  const deleteButton = form.querySelector('[data-delete-recipe]');
  let currentRecipe = null;
  let currentUserRole = null;

  try {
    const categoriesList = await getCategories();
    renderRecipeFormCategories(categoryContainer, categoriesList);

    if (isEditMode) {
      currentRecipe = recipeSlug
        ? await getEditableRecipeBySlug(recipeSlug)
        : await getEditableRecipeById(recipeId);

      if (!currentRecipe) {
        setFormAlert(form, 'Рецептата не е намерена или нямаш достъп до нея.', 'danger');
        disableRecipeForm(form);
        return;
      }

      currentUserRole = await getCurrentUserRole(user.id);
      const canManage = currentRecipe.authorId === user.id || currentUserRole === 'admin';

      if (!canManage) {
        setFormAlert(form, 'Само авторът или администратор може да редактира тази рецепта.', 'danger');
        disableRecipeForm(form);
        return;
      }

      fillRecipeForm(form, currentRecipe);
      renderCurrentRecipeImage(form, currentRecipe.imageUrl);
      updateRecipeFormHeader('Редакция', 'Редактирай рецепта', 'Запази промените');
      deleteButton?.classList.remove('d-none');
    }
  } catch (error) {
    console.error(error);
    setFormAlert(form, error?.message || 'Не успяхме да заредим формата.', 'danger');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      setFormLoading(form, true);
      setFormAlert(form, '', 'success', true);

      const values = collectRecipeFormValues(form);
      const categoryIds = getSelectedRecipeCategoryIds(form);
      const imageFile = form.querySelector('#image')?.files?.[0] || null;

      if (!categoryIds.length) {
        throw new Error('Избери поне една категория.');
      }

      const savedRecipe = currentRecipe
        ? await updateRecipe({
          userId: user.id,
          recipeId: currentRecipe.id,
          values: {
            ...values,
            authorId: currentRecipe.authorId
          },
          categoryIds,
          imageFile
        })
        : await createRecipe({
          userId: user.id,
          values,
          categoryIds,
          imageFile
        });

      setFormAlert(form, 'Рецептата е запазена успешно.', 'success');
      window.location.href = `recipe.html?slug=${encodeURIComponent(savedRecipe.slug)}`;
    } catch (error) {
      console.error(error);
      setFormAlert(form, error?.message || 'Не успяхме да запазим рецептата.', 'danger');
    } finally {
      setFormLoading(form, false);
    }
  });

  deleteButton?.addEventListener('click', async () => {
    if (!currentRecipe || !window.confirm('Сигурни ли сте, че искате да изтриете тази рецепта?')) {
      return;
    }

    try {
      deleteButton.disabled = true;
      await deleteRecipe(currentRecipe.id);
      window.location.href = 'index.html';
    } catch (error) {
      console.error(error);
      setFormAlert(form, error?.message || 'Не успяхме да изтрием рецептата.', 'danger');
      deleteButton.disabled = false;
    }
  });
}

function renderRecipeFormCategories(container, categoriesList) {
  if (!container) return;

  container.innerHTML = categoriesList.map((category) => `
    <label class="form-check category-check">
      <input class="form-check-input" type="checkbox" name="categories" value="${category.id}">
      <span class="form-check-label">${escapeHtml(category.name)}</span>
    </label>
  `).join('');
}

function fillRecipeForm(form, recipe) {
  form.querySelector('#title').value = recipe.title || '';
  form.querySelector('#description').value = recipe.description || '';
  form.querySelector('#ingredients').value = (recipe.ingredients || []).join('\n');
  form.querySelector('#instructions').value = recipe.instructions || '';
  form.querySelector('#prep_minutes').value = recipe.prepMinutes || 0;
  form.querySelector('#cook_minutes').value = recipe.cookMinutes || 0;
  form.querySelector('#servings').value = recipe.servings || 1;
  form.querySelector('#difficulty').value = recipe.difficulty || 'easy';

  const selectedCategoryIds = new Set((recipe.categoryIds || []).map(String));
  form.querySelectorAll('input[name="categories"]').forEach((checkbox) => {
    checkbox.checked = selectedCategoryIds.has(checkbox.value);
  });
}

function collectRecipeFormValues(form) {
  return {
    title: form.querySelector('#title').value.trim(),
    description: form.querySelector('#description').value.trim(),
    ingredients: form.querySelector('#ingredients').value
      .split('\n')
      .map((ingredient) => ingredient.trim())
      .filter(Boolean),
    instructions: form.querySelector('#instructions').value.trim(),
    prepMinutes: Number(form.querySelector('#prep_minutes').value) || 0,
    cookMinutes: Number(form.querySelector('#cook_minutes').value) || 0,
    servings: Number(form.querySelector('#servings').value) || 1,
    difficulty: form.querySelector('#difficulty').value
  };
}

function getSelectedRecipeCategoryIds(form) {
  return [...form.querySelectorAll('input[name="categories"]:checked')]
    .map((checkbox) => checkbox.value);
}

function renderCurrentRecipeImage(form, imageUrl) {
  const container = form.querySelector('[data-current-image]');
  if (!container || !imageUrl) return;

  container.classList.remove('d-none');
  container.innerHTML = `<img src="${escapeHtml(imageUrl)}" alt="Текуща снимка на рецептата">`;
}

function updateRecipeFormHeader(eyebrow, title, buttonText) {
  const eyebrowElement = document.querySelector('[data-form-eyebrow]');
  const titleElement = document.querySelector('[data-form-title]');
  const submitButton = document.querySelector('[data-submit-button]');

  if (eyebrowElement) eyebrowElement.textContent = eyebrow;
  if (titleElement) titleElement.textContent = title;
  if (submitButton) {
    submitButton.innerHTML = `<i class="bi bi-check2-circle"></i> ${buttonText}`;
    submitButton.dataset.originalText = buttonText;
  }

  document.title = `${title} | Вкусно.bg`;
}

function disableRecipeForm(form) {
  form.querySelectorAll('input, textarea, select, button').forEach((control) => {
    control.disabled = true;
  });
}

async function renderRecipeDetails() {
  const container = document.querySelector('[data-recipe-details]');
  if (!container) return;

  container.innerHTML = '<div class="content-panel loading-card"></div>';

  try {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const id = params.get('id');
    const recipe = slug
      ? await getRecipeDetailsBySlug(slug)
      : await getRecipeDetailsById(id);

    if (!recipe) {
      renderRecipeNotFound(container);
      return;
    }

    const user = await getCurrentUser();
    const role = user ? await getCurrentUserRole(user.id) : null;
    const canManage = Boolean(user && (user.id === recipe.authorId || role === 'admin'));

    document.title = `${recipe.title} | Вкусно.bg`;
    container.innerHTML = renderRecipeDetailHtml(recipe, user, canManage);
    bindReviewForm(recipe, user);
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="content-panel empty-state">
        <i class="bi bi-exclamation-triangle"></i>
        <h1 class="h4 mb-1">Не успяхме да заредим рецептата</h1>
        <p class="text-secondary mb-0">Провери връзката със Supabase и опитай отново.</p>
      </div>
    `;
  }
}

function renderRecipeDetailHtml(recipe, user, canManage = false) {
  const totalMinutes = recipe.totalMinutes || recipe.prepMinutes || recipe.cookMinutes;
  const difficulty = getDifficultyLabel(recipe.difficulty);
  const imageUrl = recipe.imageUrl || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80';
  const currentUserReview = user
    ? recipe.reviews.find((review) => review.userId === user.id)
    : null;

  return `
    <div class="recipe-hero row g-0">
      <div class="col-lg-6">
        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(recipe.title)}" class="recipe-hero-image">
      </div>
      <div class="col-lg-6 p-4 p-lg-5">
        <div class="d-flex flex-wrap gap-2 mb-3">
          ${recipe.categories.map((category) => `<span class="badge text-bg-success">${escapeHtml(category.name)}</span>`).join('')}
        </div>
        <h1>${escapeHtml(recipe.title)}</h1>
        <p class="lead text-secondary">${escapeHtml(recipe.description)}</p>
        <div class="recipe-stats">
          <span><i class="bi bi-clock"></i> ${totalMinutes} мин</span>
          <span><i class="bi bi-people"></i> ${recipe.servings} порции</span>
          <span><i class="bi bi-bar-chart"></i> ${difficulty}</span>
          <span><i class="bi bi-star-fill"></i> ${formatAverageRating(recipe.averageRating)} (${recipe.reviewCount})</span>
        </div>
        <p class="mt-4 mb-0 text-secondary">Автор: <strong>${escapeHtml(recipe.authorName)}</strong></p>
        ${canManage ? `
          <a class="btn btn-outline-success mt-4" href="recipe-form.html?slug=${encodeURIComponent(recipe.slug)}">
            <i class="bi bi-pencil-square"></i>
            Редактирай
          </a>
        ` : ''}
      </div>
    </div>
    <div class="row g-4 mt-4">
      <section class="col-lg-4">
        <div class="content-panel">
          <h2 class="h4">Продукти</h2>
          <ul class="ingredient-list">
            ${recipe.ingredients.map((ingredient) => `<li>${escapeHtml(ingredient)}</li>`).join('')}
          </ul>
        </div>
      </section>
      <section class="col-lg-8">
        <div class="content-panel">
          <h2 class="h4">Начин на приготвяне</h2>
          <p class="mb-0 recipe-instructions">${escapeHtml(recipe.instructions)}</p>
        </div>
      </section>
    </div>
    <div class="row g-4 mt-4">
      <section class="col-lg-5">
        <div class="content-panel">
          <h2 class="h4">Оцени рецептата</h2>
          ${renderReviewFormHtml(user, currentUserReview)}
        </div>
      </section>
      <section class="col-lg-7">
        <div class="content-panel">
          <div class="section-title mb-3">
            <div>
              <p class="eyebrow mb-1">Средна оценка ${formatAverageRating(recipe.averageRating)}</p>
              <h2 class="h4">Коментари</h2>
            </div>
          </div>
          ${renderReviewsHtml(recipe.reviews)}
        </div>
      </section>
    </div>
  `;
}

function renderReviewFormHtml(user, currentUserReview) {
  if (!user) {
    return `
      <p class="text-secondary">Влез в профила си, за да оставиш оценка и коментар.</p>
      <a class="btn btn-success" href="login.html?next=${encodeURIComponent(window.location.pathname.split('/').pop() + window.location.search)}">
        Вход
      </a>
    `;
  }

  return `
    <form data-review-form>
      <div class="mb-3">
        <label class="form-label" for="rating">Оценка</label>
        <select class="form-select" id="rating" required>
          ${[5, 4, 3, 2, 1].map((rating) => `
            <option value="${rating}" ${currentUserReview?.rating === rating ? 'selected' : ''}>${rating} от 5</option>
          `).join('')}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label" for="comment">Коментар</label>
        <textarea class="form-control" id="comment" rows="4" placeholder="Как се получи рецептата?" required>${escapeHtml(currentUserReview?.comment || '')}</textarea>
      </div>
      <div class="alert d-none" data-form-alert role="alert"></div>
      <button class="btn btn-success w-100" type="submit" data-submit-button>
        ${currentUserReview ? 'Обнови оценката' : 'Публикувай оценка'}
      </button>
    </form>
  `;
}

function renderReviewsHtml(reviews) {
  if (!reviews.length) {
    return '<p class="text-secondary mb-0">Все още няма коментари. Бъди първият, който ще оцени рецептата.</p>';
  }

  return `
    <div class="review-list">
      ${reviews.map((review) => `
        <article class="review-item">
          <div class="d-flex justify-content-between gap-3">
            <strong>${escapeHtml(review.authorName)}</strong>
            <span class="text-warning"><i class="bi bi-star-fill"></i> ${review.rating}</span>
          </div>
          <p class="mb-1">${escapeHtml(review.comment)}</p>
          <small class="text-secondary">${formatDate(review.createdAt)}</small>
        </article>
      `).join('')}
    </div>
  `;
}

function bindReviewForm(recipe, user) {
  const form = document.querySelector('[data-review-form]');
  if (!form || !user) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormLoading(form, true);
    setFormAlert(form, '', 'success', true);

    try {
      await upsertRecipeReview({
        recipeId: recipe.id,
        userId: user.id,
        rating: Number(form.querySelector('#rating').value),
        comment: form.querySelector('#comment').value.trim()
      });

      setFormAlert(form, 'Оценката е запазена успешно.', 'success');
      await renderRecipeDetails();
    } catch (error) {
      console.error(error);
      setFormAlert(form, error?.message || 'Не успяхме да запазим оценката.', 'danger');
    } finally {
      setFormLoading(form, false);
    }
  });
}

function renderRecipeNotFound(container) {
  container.innerHTML = `
    <div class="content-panel empty-state">
      <i class="bi bi-search"></i>
      <h1 class="h4 mb-1">Рецептата не е намерена</h1>
      <p class="text-secondary mb-0">Върни се към всички рецепти и избери друга идея.</p>
    </div>
  `;
}

function getDifficultyLabel(value) {
  return {
    easy: 'Лесна',
    medium: 'Средна',
    hard: 'Трудна'
  }[value] || 'Лесна';
}

function formatAverageRating(value) {
  return value ? value.toFixed(1) : '0.0';
}

function formatDate(value) {
  return new Intl.DateTimeFormat('bg-BG', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value));
}
