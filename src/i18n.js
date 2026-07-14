const LANGUAGE_KEY = 'vkusno-language';
const SUPPORTED_LANGUAGES = ['bg', 'en'];
const originalTextByNode = new WeakMap();

const translations = {
  en: {
    'Нови рецепти всеки ден': 'New recipes every day',
    'Добави рецепта': 'Add recipe',
    'Вход': 'Sign in',
    'Регистрация': 'Register',
    'Рецепти': 'Recipes',
    'Категории': 'Categories',
    'Популярни': 'Popular',
    'Топ рецепти': 'Top recipes',
    'Профил': 'Profile',
    'Админ': 'Admin',
    'Изход': 'Sign out',
    'Кулинарен портал на български': 'Bulgarian culinary portal',
    'Рецепти, идеи и вдъхновение за вкусна домашна кухня.': 'Recipes, ideas and inspiration for delicious home cooking.',
    'Търси по име или описание, избери категория и открий нови рецепти от общността на Вкусно.bg.': 'Search by name or description, choose a category and discover new recipes from the Vkusno.bg community.',
    'Търсене': 'Search',
    'Търси': 'Search',
    'Търси по име или описание': 'Search by name or description',
    'Прясно добавени': 'Freshly added',
    'Нови рецепти': 'New recipes',
    'Сподели твоя': 'Share yours',
    'Популярни днес': 'Popular today',
    'Вкусно.bg': 'Vkusno.bg',
    'Кулинарен портал с български рецепти, категории и любими домашни идеи.': 'A culinary portal with Bulgarian recipes, categories and favorite home ideas.',
    'Навигация': 'Navigation',
    'Салати, супи, основни ястия, постни рецепти, десерти, печива и още домашни идеи.': 'Salads, soups, main dishes, meatless recipes, desserts, pastries and more home ideas.',
    'Домашни рецепти за всеки ден': 'Home recipes for every day',
    'Всички': 'All',
    'Салати': 'Salads',
    'Супи': 'Soups',
    'Основни ястия': 'Main dishes',
    'Постни ястия': 'Meatless dishes',
    'Традиционни': 'Traditional',
    'Десерти': 'Desserts',
    'Закуски': 'Breakfast',
    'Печива': 'Pastries',
    'Към рецепти': 'Back to recipes',
    'Потребителски профил': 'User profile',
    'Вход в профила': 'Sign in to your account',
    'Демо форма за потребители, които искат да запазват и публикуват рецепти.': 'Demo form for users who want to save and publish recipes.',
    'Имейл': 'Email',
    'Парола': 'Password',
    'Запомни ме': 'Remember me',
    'Забравена парола': 'Forgot password',
    'Ново участие': 'Join the community',
    'Създай профил': 'Create account',
    'Регистрация за автори, които искат да публикуват домашни рецепти.': 'Registration for authors who want to publish homemade recipes.',
    'Име': 'Name',
    'Съгласен съм с условията': 'I agree to the terms',
    'Форма за добавяне и редакция на рецепта във Вкусно.bg.': 'Form for adding and editing a recipe in Vkusno.bg.',
    'Нова публикация': 'New publication',
    'Име на рецептата': 'Recipe name',
    'Например: Пълнени чушки с ориз': 'Example: Stuffed peppers with rice',
    'Кратко описание': 'Short description',
    'Едно-две изречения, които описват вкуса и повода.': 'One or two sentences describing the taste and occasion.',
    'Продукти': 'Ingredients',
    'Всеки продукт на нов ред': 'Each ingredient on a new line',
    'Начин на приготвяне': 'Preparation method',
    'Опиши стъпките ясно и последователно.': 'Describe the steps clearly and in order.',
    'Данни за рецептата': 'Recipe details',
    'Подготовка': 'Prep',
    'Готвене': 'Cooking',
    'Порции': 'Servings',
    'Трудност': 'Difficulty',
    'Лесна': 'Easy',
    'Средна': 'Medium',
    'Трудна': 'Hard',
    'Снимка': 'Image',
    'Качи снимка': 'Upload image',
    'При редакция избери файл само ако искаш да смениш снимката.': 'When editing, choose a file only if you want to replace the image.',
    'Публикувай': 'Publish',
    'Изтрий рецептата': 'Delete recipe',
    'Кулинарен портал за домашни рецепти': 'Culinary portal for homemade recipes',
    'Потребител': 'User',
    'Зареждаме профила...': 'Loading profile...',
    'Статистика': 'Statistics',
    'рецепти': 'recipes',
    'роля': 'role',
    'Нова рецепта': 'New recipe',
    'Редакция на профил': 'Edit profile',
    'Профилна снимка': 'Profile image',
    'Снимката се качва в bucket avatars, в папка с твоя user id.': 'The image is uploaded to the avatars bucket in a folder with your user id.',
    'Запази профила': 'Save profile',
    'Авторски рецепти': 'Author recipes',
    'Моите рецепти': 'My recipes',
    'Административен изглед': 'Admin view',
    'Към сайта': 'Back to site',
    'Управление': 'Management',
    'Административен панел': 'Admin panel',
    'Всички рецепти': 'All recipes',
    'Публикувани': 'Published',
    'Потребители': 'Users',
    'Роли': 'Roles',
    'Каталог': 'Catalog',
    'Рецепта': 'Recipe',
    'Автор': 'Author',
    'Статус': 'Status',
    'Действия': 'Actions',
    'Таксономия': 'Taxonomy',
    'Описание': 'Description',
    'Подредба': 'Sort order',
    'Запази категория': 'Save category',
    'Нова категория': 'New category',
    'Зареждане...': 'Loading...',
    'Няма намерени рецепти': 'No recipes found',
    'Пробвай с друга дума или избери различна категория.': 'Try another word or choose a different category.',
    'Все още няма популярни рецепти.': 'There are no popular recipes yet.',
    'Не успяхме да заредим рецептите': 'We could not load the recipes',
    'Провери Supabase настройките и опитай отново.': 'Check the Supabase settings and try again.',
    'Категориите не са заредени.': 'Categories are not loaded.',
    'Популярните рецепти не са заредени.': 'Popular recipes are not loaded.',
    'Влез в профила си, за да оставиш оценка и коментар.': 'Sign in to leave a rating and comment.',
    'Оцени рецептата': 'Rate this recipe',
    'Оценка': 'Rating',
    'Коментар': 'Comment',
    'Как се получи рецептата?': 'How did the recipe turn out?',
    'Публикувай оценка': 'Publish review',
    'Обнови оценката': 'Update review',
    'Коментари': 'Comments',
    'Все още няма коментари. Бъди първият, който ще оцени рецептата.': 'There are no comments yet. Be the first to rate this recipe.',
    'Рецептата не е намерена': 'Recipe not found',
    'Върни се към всички рецепти и избери друга идея.': 'Go back to all recipes and choose another idea.',
    'Не успяхме да заредим рецептата': 'We could not load the recipe',
    'Провери връзката със Supabase и опитай отново.': 'Check the Supabase connection and try again.',
    'Всички рецепти': 'All recipes',
    'Редактирай': 'Edit',
    'Редакция': 'Edit',
    'Редактирай рецепта': 'Edit recipe',
    'Запази промените': 'Save changes',
    'Моля, изчакай...': 'Please wait...',
    'Успешен вход. Пренасочваме към профила...': 'Signed in successfully. Redirecting to your profile...',
    'Профилът е създаден. Пренасочваме...': 'The profile was created. Redirecting...',
    'Регистрацията е успешна. Провери имейла си, за да потвърдиш профила.': 'Registration was successful. Check your email to confirm your account.',
    'Възникна грешка. Опитай отново.': 'An error occurred. Try again.',
    'Supabase не е конфигуриран. Провери env променливите.': 'Supabase is not configured. Check the env variables.',
    'Supabase не е конфигуриран. Провери VITE_SUPABASE_URL и VITE_SUPABASE_PUBLISHABLE_KEY.': 'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    'Профилът е обновен успешно.': 'The profile was updated successfully.',
    'Не успяхме да заредим административните данни.': 'We could not load the admin data.',
    'Не успяхме да обновим ролята.': 'We could not update the role.',
    'Не успяхме да обновим рецептата.': 'We could not update the recipe.',
    'Не успяхме да запазим категорията.': 'We could not save the category.',
    'Рецептата не е намерена или нямаш достъп до нея.': 'The recipe was not found or you do not have access to it.',
    'Само авторът или администратор може да редактира тази рецепта.': 'Only the author or an admin can edit this recipe.',
    'Не успяхме да заредим формата.': 'We could not load the form.',
    'Избери поне една категория.': 'Choose at least one category.',
    'Рецептата е запазена успешно.': 'The recipe was saved successfully.',
    'Не успяхме да запазим рецептата.': 'We could not save the recipe.',
    'Сигурни ли сте, че искате да изтриете тази рецепта?': 'Are you sure you want to delete this recipe?',
    'Не успяхме да изтрием рецептата.': 'We could not delete the recipe.',
    'Оценката е запазена успешно.': 'The review was saved successfully.',
    'Не успяхме да запазим оценката.': 'We could not save the review.',
    'Автор:': 'Author:',
    'Средна оценка': 'Average rating',
    'мин': 'min',
    'порции': 'servings',
    'Администратор': 'Administrator'
  }
};

const titleTranslations = {
  en: {
    'Вкусно.bg | Рецепти за всеки ден': 'Vkusno.bg | Recipes for every day',
    'Вход | Вкусно.bg': 'Sign in | Vkusno.bg',
    'Регистрация | Вкусно.bg': 'Register | Vkusno.bg',
    'Рецепта | Вкусно.bg': 'Recipe | Vkusno.bg',
    'Добави рецепта | Вкусно.bg': 'Add recipe | Vkusno.bg',
    'Профил | Вкусно.bg': 'Profile | Vkusno.bg',
    'Админ | Вкусно.bg': 'Admin | Vkusno.bg'
  }
};

let currentLanguage = getStoredLanguage();
let observer = null;
let pendingApply = false;
let originalDocumentTitle = document.title;
let lastTranslatedDocumentTitle = null;

export function initI18n() {
  document.documentElement.lang = currentLanguage;
  renderLanguageSwitcher();
  bindLanguageSwitcher();
  applyTranslations();
  startTranslationObserver();
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(language) {
  currentLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'bg';
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage;
  updateLanguageSwitcher();
  applyTranslations();
}

export function t(value) {
  return translateText(value, currentLanguage);
}

export function applyTranslations(root = document.body) {
  if (!root) return;

  translateDocumentTitle();
  translateAttributes(root);
  translateTextNodes(root);
}

function getStoredLanguage() {
  const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
  return SUPPORTED_LANGUAGES.includes(storedLanguage) ? storedLanguage : 'bg';
}

function renderLanguageSwitcher() {
  document.querySelectorAll('.site-navbar').forEach((navbar) => {
    if (navbar.querySelector('[data-language-switcher]')) return;

    const switcher = document.createElement('div');
    switcher.className = 'language-switcher ms-lg-3 my-2 my-lg-0';
    switcher.dataset.languageSwitcher = '';
    switcher.innerHTML = `
      <button class="language-option" type="button" data-language-option="bg" aria-label="Български">BG</button>
      <button class="language-option" type="button" data-language-option="en" aria-label="English">EN</button>
    `;

    const target = navbar.querySelector('.navbar-collapse') || navbar.querySelector('.container') || navbar;
    const authNav = target.querySelector('[data-auth-nav]');
    if (authNav) {
      target.insertBefore(switcher, authNav);
    } else {
      target.appendChild(switcher);
    }
  });

  updateLanguageSwitcher();
}

function bindLanguageSwitcher() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-language-option]');
    if (!button) return;

    setLanguage(button.dataset.languageOption);
  });
}

function updateLanguageSwitcher() {
  document.querySelectorAll('[data-language-option]').forEach((button) => {
    const isActive = button.dataset.languageOption === currentLanguage;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function startTranslationObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(() => {
    if (pendingApply) return;
    pendingApply = true;

    window.requestAnimationFrame(() => {
      pendingApply = false;
      applyTranslations();
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function translateDocumentTitle() {
  if (currentLanguage === 'bg') {
    if (document.title === lastTranslatedDocumentTitle) {
      document.title = originalDocumentTitle;
    } else {
      originalDocumentTitle = document.title;
    }

    lastTranslatedDocumentTitle = null;
    return;
  }

  if (document.title !== lastTranslatedDocumentTitle) {
    originalDocumentTitle = document.title;
  }

  const translatedTitle = titleTranslations[currentLanguage]?.[originalDocumentTitle]
    || translateText(originalDocumentTitle, currentLanguage);

  document.title = translatedTitle;
  lastTranslatedDocumentTitle = translatedTitle;
}

function translateAttributes(root) {
  const selector = '[placeholder], [aria-label], [title], [alt]';
  const elements = root.matches?.(selector)
    ? [root, ...root.querySelectorAll?.(selector) || []]
    : [...root.querySelectorAll?.(selector) || []];

  elements.forEach((element) => {
    ['placeholder', 'aria-label', 'title', 'alt'].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;

      const originalKey = `i18nOriginal${toDatasetKey(attribute)}`;
      if (!element.dataset[originalKey]) {
        element.dataset[originalKey] = element.getAttribute(attribute);
      }

      const originalValue = element.dataset[originalKey];
      element.setAttribute(attribute, currentLanguage === 'bg' ? originalValue : translateText(originalValue, currentLanguage));
    });
  });
}

function translateTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }

      if (!node.nodeValue.trim()) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    }
  });

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!originalTextByNode.has(node)) {
      originalTextByNode.set(node, node.nodeValue);
    }

    const originalValue = originalTextByNode.get(node);
    node.nodeValue = currentLanguage === 'bg'
      ? originalValue
      : preserveWhitespace(originalValue, translateText(originalValue.trim(), currentLanguage));
  }
}

function translateText(value, language) {
  if (language === 'bg' || !value) {
    return value;
  }

  const dictionary = translations[language] || {};
  const normalizedValue = value.trim();
  const exactMatch = dictionary[normalizedValue];
  if (exactMatch) {
    return exactMatch;
  }

  return normalizedValue
    .replace(/\b(\d+)\s*мин\b/g, '$1 min')
    .replace(/\b(\d+)\s*порции\b/g, '$1 servings')
    .replace(/^(\d+)\s*от\s*5$/g, '$1 of 5')
    .replace(/\bАвтор:/g, 'Author:')
    .replace(/\bСредна оценка\b/g, 'Average rating');
}

function preserveWhitespace(originalValue, translatedValue) {
  return originalValue.replace(originalValue.trim(), translatedValue);
}

function toDatasetKey(attribute) {
  return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
