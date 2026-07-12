import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css';
import { isSupabaseConfigured } from './config/supabase.js';

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

document.addEventListener('DOMContentLoaded', () => {
  setActiveNavigation();
  renderCategoryPills();
  renderCategoryList();
  renderRecipeCards(recipes);
  renderTopRecipes();
  renderRecipeDetails();
  renderProfileRecipes();
  renderAdminRows();
  bindSearch();
  bindDemoForms();
  bindRecipeForm();
});

function setActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
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

function renderRecipeDetails() {
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

function renderProfileRecipes() {
  const container = document.querySelector('[data-profile-recipes]');
  if (!container) return;

  container.innerHTML = recipes.slice(0, 3).map((recipe) => `
    <a class="list-group-item list-group-item-action d-flex align-items-center gap-3" href="recipe.html?id=${recipe.id}">
      <img src="${recipe.image}" alt="" class="profile-recipe-thumb">
      <span class="flex-grow-1">
        <strong class="d-block">${recipe.title}</strong>
        <small class="text-secondary">${recipe.category} · ${recipe.time} мин</small>
      </span>
      <i class="bi bi-chevron-right"></i>
    </a>
  `).join('');
}

function renderAdminRows() {
  const tbody = document.querySelector('[data-admin-recipes]');
  if (!tbody) return;

  tbody.innerHTML = recipes.map((recipe) => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-3">
          <img src="${recipe.image}" alt="" class="admin-thumb">
          <span>${recipe.title}</span>
        </div>
      </td>
      <td>${recipe.category}</td>
      <td>${recipe.author}</td>
      <td><span class="badge text-bg-success">Публикувана</span></td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-secondary" type="button" aria-label="Редакция"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" type="button" aria-label="Изтриване"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');
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

function bindRecipeForm() {
  const form = document.querySelector('[data-recipe-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = form.querySelector('#title').value.trim();
    const alert = form.querySelector('[data-form-alert]');
    if (alert) {
      alert.textContent = title ? `Рецептата "${title}" е подготвена за публикуване.` : 'Рецептата е подготвена за публикуване.';
      alert.classList.remove('d-none');
    }
  });
}
