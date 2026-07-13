const difficultyLabels = {
  easy: 'Лесна',
  medium: 'Средна',
  hard: 'Трудна'
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function renderRecipeCard(recipe) {
  const category = recipe.categories[0]?.name || 'Рецепта';
  const imageUrl = recipe.imageUrl || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80';
  const totalMinutes = recipe.totalMinutes || recipe.prepMinutes || recipe.cookMinutes;
  const difficulty = difficultyLabels[recipe.difficulty] || 'Лесна';

  return `
    <article class="col">
      <div class="card recipe-card h-100">
        <img src="${escapeHtml(imageUrl)}" class="card-img-top" alt="${escapeHtml(recipe.title)}">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
            <span class="badge text-bg-light border">${escapeHtml(category)}</span>
            ${recipe.isFeatured ? '<span class="badge text-bg-warning"><i class="bi bi-star-fill"></i> Топ</span>' : ''}
          </div>
          <h2 class="h5 card-title">${escapeHtml(recipe.title)}</h2>
          <p class="card-text text-secondary">${escapeHtml(recipe.description)}</p>
          <div class="recipe-meta mt-auto">
            <span><i class="bi bi-clock"></i> ${totalMinutes} мин</span>
            <span><i class="bi bi-people"></i> ${recipe.servings} порции</span>
            <span><i class="bi bi-bar-chart"></i> ${difficulty}</span>
          </div>
          <a href="recipe.html?id=${recipe.id}" class="btn btn-outline-success mt-3">
            Виж рецептата
          </a>
        </div>
      </div>
    </article>
  `;
}

export function renderPopularRecipeItem(recipe, index) {
  const totalMinutes = recipe.totalMinutes || recipe.prepMinutes || recipe.cookMinutes;

  return `
    <a class="top-recipe" href="recipe.html?id=${recipe.id}">
      <span class="top-recipe-rank">${index + 1}</span>
      <span class="top-recipe-body">
        <strong>${escapeHtml(recipe.title)}</strong>
        <small><i class="bi bi-clock"></i> ${totalMinutes} мин · ${escapeHtml(recipe.categories[0]?.name || 'Рецепта')}</small>
      </span>
    </a>
  `;
}
