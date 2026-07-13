with seed_users as (
  select id, email
  from auth.users
  where email in ('demo@example.com', 'admin@example.com', 'test@test.com')
),
seed_profiles(email, display_name, bio, avatar_path) as (
  values
    ('demo@example.com', 'Демо Готвач', 'Обича бързи домашни рецепти с ясни стъпки.', 'avatars/demo.jpg'),
    ('admin@example.com', 'Админ Вкусно', 'Редактор на кулинарния портал Вкусно.bg.', 'avatars/admin.jpg'),
    ('test@test.com', 'Тест Потребител', 'Пробва рецепти и оставя честни оценки.', 'avatars/test.jpg')
)
insert into public.profiles (id, display_name, bio, avatar_path)
select u.id, p.display_name, p.bio, p.avatar_path
from seed_profiles p
join seed_users u on u.email = p.email
on conflict (id) do update
set
  display_name = excluded.display_name,
  bio = excluded.bio,
  avatar_path = excluded.avatar_path;

with seed_users as (
  select id, email
  from auth.users
  where email in ('demo@example.com', 'admin@example.com', 'test@test.com')
),
seed_roles(email, role) as (
  values
    ('demo@example.com', 'user'),
    ('admin@example.com', 'admin'),
    ('test@test.com', 'user')
)
insert into public.user_roles (user_id, role)
select u.id, r.role
from seed_roles r
join seed_users u on u.email = r.email
on conflict (user_id) do update
set role = excluded.role;

insert into public.categories (name, slug, description, sort_order)
values
  ('Салати', 'salati', 'Свежи сезонни салати и гарнитури.', 10),
  ('Супи', 'supi', 'Топли и студени супи за всеки сезон.', 20),
  ('Основни ястия', 'osnovni-yastia', 'Засищащи рецепти за обяд и вечеря.', 30),
  ('Постни ястия', 'postni-yastia', 'Идеи без месо с много вкус.', 40),
  ('Традиционни', 'tradicionni', 'Домашна кухня с познати български вкусове.', 50),
  ('Десерти', 'deserti', 'Сладкиши, кремове и плодови десерти.', 60),
  ('Закуски', 'zakuski', 'Бързи сутрешни идеи и солени закуски.', 70),
  ('Печива', 'pechiva', 'Хляб, питки, баници и тестени рецепти.', 80)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

with seed_users as (
  select id, email
  from auth.users
  where email in ('demo@example.com', 'admin@example.com', 'test@test.com')
),
seed_recipes(
  author_email,
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
  is_published,
  is_featured
) as (
  values
    (
      'demo@example.com',
      'Лятна салата с домати и печен нахут',
      'lyatna-salata-domati-pechen-nahut',
      'Хрупкава салата с сочни домати, печен нахут и лек лимонов дресинг.',
      array['3 домата', '1 краставица', '1 консерва нахут', '2 с.л. зехтин', '1 с.л. лимонов сок', 'магданоз', 'сол'],
      'Отцедете нахута и го запечете със зехтин и щипка сол за 15 минути. Нарежете доматите и краставицата. Смесете зеленчуците с печения нахут, лимоновия сок и магданоза. Поднесете веднага.',
      15,
      15,
      4,
      'easy',
      'recipes/lyatna-salata.jpg',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
      true,
      true
    ),
    (
      'admin@example.com',
      'Крем супа от моркови и червена леща',
      'krem-supa-morkovi-chervena-leshta',
      'Гъста супа с мек вкус, подходяща за делнична вечеря.',
      array['500 г моркови', '120 г червена леща', '1 глава лук', '1 картоф', '1 л зеленчуков бульон', 'кимион', 'сол'],
      'Задушете лука, добавете морковите, картофа и лещата. Залейте с бульона и варете до омекване. Пасирайте до гладък крем и овкусете с кимион и сол.',
      10,
      30,
      4,
      'easy',
      'recipes/krem-supa-morkovi.jpg',
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
      true,
      true
    ),
    (
      'test@test.com',
      'Пилешко с гъби и мащерка на тиган',
      'pileshko-gabi-mashterka-tigan',
      'Сочно пилешко филе с ароматни гъби и лек сос.',
      array['600 г пилешко филе', '300 г гъби', '1 глава лук', '100 мл сметана', 'мащерка', 'черен пипер', 'сол'],
      'Запечатайте пилешкото на силен огън. Извадете го и задушете лука и гъбите. Върнете месото, добавете сметаната и мащерката. Гответе до сгъстяване на соса.',
      15,
      25,
      4,
      'medium',
      'recipes/pileshko-gabi.jpg',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
      true,
      false
    ),
    (
      'demo@example.com',
      'Постни пълнени чушки с булгур',
      'postni-palneni-chushki-bulgur',
      'Печени чушки с булгур, зеленчуци и пресен магданоз.',
      array['8 чушки', '1 ч.ч. булгур', '1 морков', '1 глава лук', '2 домата', 'магданоз', 'чубрица'],
      'Накиснете булгура за 10 минути. Задушете лука и моркова, добавете доматите и булгура. Напълнете чушките и печете с малко вода до омекване.',
      25,
      45,
      4,
      'medium',
      'recipes/postni-chushki.jpg',
      'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1200&q=80',
      true,
      true
    ),
    (
      'admin@example.com',
      'Домашна баница със спанак и сирене',
      'domashna-banitsa-spanak-sirene',
      'Златиста баница с богата плънка и хрупкави кори.',
      array['1 пакет кори', '300 г спанак', '250 г сирене', '3 яйца', '150 г кисело мляко', '80 мл олио'],
      'Задушете спанака и го охладете. Смесете със сирене, яйца и кисело мляко. Наредете корите с плънката, полейте с олио и печете до златисто.',
      20,
      35,
      6,
      'medium',
      'recipes/banitsa-spanak.jpg',
      'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=1200&q=80',
      true,
      true
    ),
    (
      'test@test.com',
      'Кисело мляко с мед, орехи и печени сливи',
      'kiselo-mlyako-med-orehi-pecheni-slivi',
      'Лек десерт с плодове, мед и ядки.',
      array['400 г кисело мляко', '6 сливи', '2 с.л. мед', '50 г орехи', 'канела'],
      'Разполовете сливите и ги запечете с малко мед и канела. Разпределете киселото мляко в купички, добавете сливите и поръсете с орехи.',
      10,
      15,
      4,
      'easy',
      'recipes/mlyako-slivi.jpg',
      'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=1200&q=80',
      true,
      false
    ),
    (
      'demo@example.com',
      'Омлет със сирене и пресен лук',
      'omlet-sirene-presen-luk',
      'Бърза закуска с пухкава текстура и свеж вкус.',
      array['4 яйца', '80 г сирене', '2 стръка пресен лук', '1 с.л. масло', 'черен пипер'],
      'Разбийте яйцата с натрошеното сирене. Запържете пресния лук в масло, добавете яйцата и гответе на умерен огън до стягане.',
      5,
      8,
      2,
      'easy',
      'recipes/omlet-sirene.jpg',
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
      true,
      false
    ),
    (
      'admin@example.com',
      'Свинско със зеле и пушен пипер',
      'svinsko-zele-pushen-piper',
      'Бавно печено ястие с кисело зеле и плътен аромат.',
      array['700 г свинско месо', '1 кг кисело зеле', '1 глава лук', '1 с.л. пушен пипер', 'дафинов лист', 'олио'],
      'Запечатайте месото, добавете лука и зелето. Овкусете с пушен пипер и дафинов лист. Печете покрито, после открийте за златиста коричка.',
      20,
      90,
      6,
      'hard',
      'recipes/svinsko-zele.jpg',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      true,
      false
    ),
    (
      'test@test.com',
      'Печени картофи с чесново кисело мляко',
      'pecheni-kartofi-chesnovo-mlyako',
      'Хрупкави картофи със свеж чеснов сос.',
      array['1 кг картофи', '3 с.л. зехтин', '200 г кисело мляко', '2 скилидки чесън', 'копър', 'сол'],
      'Нарежете картофите и ги овкусете със зехтин и сол. Изпечете до хрупкавост. Смесете киселото мляко с чесън и копър и сервирайте като сос.',
      15,
      40,
      4,
      'easy',
      'recipes/pecheni-kartofi.jpg',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80',
      true,
      false
    ),
    (
      'demo@example.com',
      'Ябълков кекс с овесени ядки',
      'yabalkov-keks-oveseni-yadki',
      'Сочен кекс с ябълки, овесени ядки и канела.',
      array['3 ябълки', '2 яйца', '160 г кафява захар', '180 г брашно', '80 г овесени ядки', '100 мл олио', 'канела'],
      'Разбийте яйцата със захарта. Добавете олиото, брашното и овесените ядки. Разбъркайте с настърганите ябълки и канела. Печете до суха клечка.',
      20,
      45,
      8,
      'medium',
      'recipes/yabalkov-keks.jpg',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
      true,
      true
    )
)
insert into public.recipes (
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
  is_published,
  is_featured
)
select
  u.id,
  r.title,
  r.slug,
  r.description,
  r.ingredients,
  r.instructions,
  r.prep_minutes,
  r.cook_minutes,
  r.servings,
  r.difficulty,
  r.cover_image_path,
  r.external_image_url,
  r.is_published,
  r.is_featured
from seed_recipes r
join seed_users u on u.email = r.author_email
on conflict (slug) do update
set
  author_id = excluded.author_id,
  title = excluded.title,
  description = excluded.description,
  ingredients = excluded.ingredients,
  instructions = excluded.instructions,
  prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes,
  servings = excluded.servings,
  difficulty = excluded.difficulty,
  cover_image_path = excluded.cover_image_path,
  external_image_url = excluded.external_image_url,
  is_published = excluded.is_published,
  is_featured = excluded.is_featured;

with recipe_category_pairs(recipe_slug, category_slug) as (
  values
    ('lyatna-salata-domati-pechen-nahut', 'salati'),
    ('lyatna-salata-domati-pechen-nahut', 'postni-yastia'),
    ('krem-supa-morkovi-chervena-leshta', 'supi'),
    ('krem-supa-morkovi-chervena-leshta', 'postni-yastia'),
    ('pileshko-gabi-mashterka-tigan', 'osnovni-yastia'),
    ('postni-palneni-chushki-bulgur', 'postni-yastia'),
    ('postni-palneni-chushki-bulgur', 'tradicionni'),
    ('domashna-banitsa-spanak-sirene', 'pechiva'),
    ('domashna-banitsa-spanak-sirene', 'tradicionni'),
    ('kiselo-mlyako-med-orehi-pecheni-slivi', 'deserti'),
    ('omlet-sirene-presen-luk', 'zakuski'),
    ('svinsko-zele-pushen-piper', 'osnovni-yastia'),
    ('svinsko-zele-pushen-piper', 'tradicionni'),
    ('pecheni-kartofi-chesnovo-mlyako', 'postni-yastia'),
    ('yabalkov-keks-oveseni-yadki', 'deserti'),
    ('yabalkov-keks-oveseni-yadki', 'pechiva')
)
insert into public.recipe_categories (recipe_id, category_id)
select r.id, c.id
from recipe_category_pairs p
join public.recipes r on r.slug = p.recipe_slug
join public.categories c on c.slug = p.category_slug
on conflict (recipe_id, category_id) do nothing;

with seed_users as (
  select id, email
  from auth.users
  where email in ('demo@example.com', 'admin@example.com', 'test@test.com')
),
seed_reviews(email, recipe_slug, rating, comment) as (
  values
    ('demo@example.com', 'krem-supa-morkovi-chervena-leshta', 5, 'Стана много нежна и ароматна, чудесна за вечеря.'),
    ('admin@example.com', 'lyatna-salata-domati-pechen-nahut', 5, 'Печеният нахут дава страхотна хрупкавост.'),
    ('test@test.com', 'domashna-banitsa-spanak-sirene', 4, 'Добра плънка, следващия път ще добавя малко повече спанак.'),
    ('demo@example.com', 'svinsko-zele-pushen-piper', 5, 'Пушеният пипер променя всичко към по-добро.'),
    ('admin@example.com', 'yabalkov-keks-oveseni-yadki', 5, 'Сочен и балансиран, без да е прекалено сладък.'),
    ('test@test.com', 'pecheni-kartofi-chesnovo-mlyako', 4, 'Лесно и вкусно, сосът е задължителен.')
)
insert into public.reviews (user_id, recipe_id, rating, comment)
select u.id, r.id, sr.rating, sr.comment
from seed_reviews sr
join seed_users u on u.email = sr.email
join public.recipes r on r.slug = sr.recipe_slug
on conflict (recipe_id, user_id) do update
set
  rating = excluded.rating,
  comment = excluded.comment;

with seed_users as (
  select id, email
  from auth.users
  where email in ('demo@example.com', 'admin@example.com', 'test@test.com')
),
seed_favorites(email, recipe_slug) as (
  values
    ('demo@example.com', 'domashna-banitsa-spanak-sirene'),
    ('demo@example.com', 'krem-supa-morkovi-chervena-leshta'),
    ('admin@example.com', 'lyatna-salata-domati-pechen-nahut'),
    ('admin@example.com', 'yabalkov-keks-oveseni-yadki'),
    ('test@test.com', 'pecheni-kartofi-chesnovo-mlyako'),
    ('test@test.com', 'postni-palneni-chushki-bulgur')
)
insert into public.favorites (user_id, recipe_id)
select u.id, r.id
from seed_favorites sf
join seed_users u on u.email = sf.email
join public.recipes r on r.slug = sf.recipe_slug
on conflict (user_id, recipe_id) do nothing;
