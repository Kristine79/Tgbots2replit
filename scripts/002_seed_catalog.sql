-- Seed the catalog with categories and bots ported from the original
-- artifacts/tg-bots mock-data fixture. Re-running is safe thanks to the
-- `on conflict` guards on the natural keys (`slug` / `username`).

insert into public.categories (id, name, slug, emoji) values
  (1,  'AI & Нейросети',  'ai',           '🤖'),
  (2,  'Продуктивность',  'productivity', '⚡'),
  (3,  'Развлечения',     'entertainment','🎮'),
  (4,  'Новости',          'news',         '📰'),
  (5,  'Финансы',          'finance',      '💰'),
  (6,  'Образование',      'education',    '📚'),
  (7,  'Музыка',           'music',        '🎵'),
  (8,  'Шопинг',           'shopping',     '🛍️'),
  (9,  'Путешествия',      'travel',       '✈️'),
  (10, 'Здоровье',         'health',       '💪'),
  (11, 'IT',               'it',           '💻')
on conflict (slug) do update
  set name  = excluded.name,
      emoji = excluded.emoji;

-- Ensure the sequence is ahead of any hard-coded ids we just inserted.
select setval(
  pg_get_serial_sequence('public.categories', 'id'),
  coalesce((select max(id) from public.categories), 1),
  true
);

insert into public.bots
  (username, name, description, category_id, rating, review_count,
   is_verified, is_premium, tags, monthly_users, icon_emoji, telegram_url)
values
  ('ChatGPT_Bot',                'ChatGPT',                         'Мощный AI-ассистент от OpenAI. Отвечает на вопросы, пишет тексты, помогает с кодом и анализирует данные.', 1, 4.9, 125400, true,  false, array['GPT-4','Чат','Код','Текст'],        15000000, '🧠', 'https://t.me/ChatGPT_Bot'),
  ('MidJourney_Bot',             'Midjourney AI Art',               'Создавай потрясающие AI-изображения по текстовому описанию. Фотореализм, арт, иллюстрации.',              1, 4.8,  89200, true,  true,  array['Изображения','AI Art','Творчество'], 8500000, '🎨', 'https://t.me/MidJourney_Bot'),
  ('GrammarlyBot',               'Grammarly',                       'Проверяет грамматику, орфографию и стиль текста. Поддерживает русский и английский языки.',                2, 4.7,  45600, true,  false, array['Текст','Грамматика','Редактор'],     5200000, '✏️', 'https://t.me/GrammarlyBot'),
  ('NotionAI_Bot',               'Notion AI',                       'AI-помощник для заметок и задач. Суммаризирует, переводит, создаёт планы и структурирует информацию.',       2, 4.6,  32100, true,  true,  array['Заметки','AI','Задачи'],             3800000, '📝', 'https://t.me/NotionAI_Bot'),
  ('Meme_Generator_Bot',         'Meme Factory',                    'Генерируй мемы за секунды! Тысячи шаблонов, редактор текста и готовые мемы для любого случая.',             3, 4.5,  67800, false, false, array['Мемы','Юмор','Картинки'],            7200000, '😂', 'https://t.me/Meme_Generator_Bot'),
  ('QuizBot',                    'Quiz Master',                     'Викторины на любую тему: история, наука, кино, спорт. Играй один или с друзьями в группе.',                  3, 4.4,  28900, false, false, array['Викторина','Игра','Знания'],         4100000, '🧩', 'https://t.me/QuizBot'),
  ('BBCNewsBot',                 'BBC News',                        'Свежие новости от BBC. Мировые события, политика, технологии и спорт каждый час.',                           4, 4.7,  54300, true,  false, array['Мировые новости','BBC','Политика'],  9800000, '📡', 'https://t.me/BBCNewsBot'),
  ('TechCrunchBot',              'TechCrunch Daily',                'Новости технологий, стартапов и IT-индустрии от TechCrunch. Обновляется несколько раз в день.',              4, 4.5,  31200, true,  false, array['Технологии','Стартапы','IT'],        5600000, '💻', 'https://t.me/TechCrunchBot'),
  ('CryptoSignalsBot',           'Crypto Signals Pro',              'Торговые сигналы для криптовалют. Анализ рынка, уведомления о ценах и прогнозы от AI.',                       5, 4.3,  21600, false, true,  array['Крипто','Торговля','Сигналы'],       2900000, '📈', 'https://t.me/CryptoSignalsBot'),
  ('InvestHelperBot',            'Invest Helper',                   'Анализ акций и ETF, новости фондового рынка, калькулятор доходности и портфельный трекер.',                  5, 4.4,  18700, true,  false, array['Акции','Инвестиции','Аналитика'],    2200000, '💹', 'https://t.me/InvestHelperBot'),
  ('DuolingoBot',                'Duolingo',                        'Учи иностранные языки в игровом формате. 40+ языков, ежедневные уроки и мотивационная система.',              6, 4.8,  98400, true,  false, array['Языки','Обучение','Игра'],           12000000,'🦉', 'https://t.me/DuolingoBot'),
  ('KhanAcademyBot',             'Khan Academy',                    'Бесплатные видеоуроки по математике, физике, химии и другим предметам. От школьника до студента.',           6, 4.6,  43200, true,  false, array['Математика','Наука','Видеоуроки'],   6700000, '🎓', 'https://t.me/KhanAcademyBot'),
  ('SpotifyBot',                 'Spotify',                         'Управляй Spotify прямо из Telegram. Ищи треки, создавай плейлисты и делись музыкой с друзьями.',              7, 4.5,  56700, true,  false, array['Музыка','Плейлист','Стриминг'],      8900000, '🎧', 'https://t.me/SpotifyBot'),
  ('SoundHoundBot',              'SoundHound',                      'Определяй музыку по мелодии или голосу. Отправь аудио и узнай название трека мгновенно.',                     7, 4.4,  23400, false, false, array['Распознавание','Музыка','Поиск'],    3300000, '🎵', 'https://t.me/SoundHoundBot'),
  ('AliExpressBot',              'AliExpress',                      'Поиск товаров на AliExpress, отслеживание заказов и уведомления о скидках и акциях.',                         8, 4.2,  78900, true,  false, array['Шопинг','Скидки','Доставка'],        11000000,'🛒', 'https://t.me/AliExpressBot'),
  ('PriceTrackerBot',            'Price Tracker',                   'Следи за ценами на товары в магазинах. Уведомления при снижении цены на Amazon, Ozon, Wildberries.',          8, 4.5,  34100, false, false, array['Цены','Скидки','Мониторинг'],        4500000, '🏷️', 'https://t.me/PriceTrackerBot'),
  ('SkyscannerBot',              'Skyscanner',                      'Поиск дешёвых авиабилетов и отелей. Сравнение цен, уведомления и бронирование прямо в Telegram.',            9, 4.6,  41800, true,  false, array['Авиабилеты','Отели','Путешествия'],  6200000, '✈️', 'https://t.me/SkyscannerBot'),
  ('WeatherBot',                 'Weather Pro',                     'Точный прогноз погоды на 7 дней для любого города мира. Часовые обновления и погодные предупреждения.',      9, 4.3,  62400, false, false, array['Погода','Прогноз','Города'],         8700000, '🌤️', 'https://t.me/WeatherBot'),
  ('FitnessPlanBot',             'AI Fitness Coach',                'Персональный фитнес-план от AI. Тренировки, питание, трекинг прогресса и мотивационные напоминания.',         10,4.5,  29600, false, true,  array['Фитнес','Тренировки','AI'],          3900000, '🏋️', 'https://t.me/FitnessPlanBot'),
  ('MeditationBot',              'Calm & Meditate',                 'Медитации, дыхательные упражнения и техники снятия стресса. Для начинающих и опытных практиков.',             10,4.7,  38200, true,  false, array['Медитация','Здоровье','Стресс'],     5100000, '🧘', 'https://t.me/MeditationBot'),
  ('ClaudeAIBot',                'Claude AI',                       'AI-ассистент от Anthropic с расширенным контекстом. Анализирует длинные документы и пишет подробные тексты.', 1, 4.8,  67300, true,  false, array['Claude','Документы','Анализ'],       9200000, '✨', 'https://t.me/ClaudeAIBot'),
  ('PerplexityBot',              'Perplexity AI',                   'AI-поисковик нового поколения. Ищет актуальную информацию в интернете и даёт ответы с источниками.',          1, 4.7,  48900, true,  false, array['Поиск','AI','Источники'],            7100000, '🔍', 'https://t.me/PerplexityBot'),
  ('TranslatorBot',              'DeepL Translator',                'Лучший переводчик с AI. Поддерживает 30+ языков, сохраняет контекст и стиль речи при переводе.',              2, 4.8, 112000, true,  false, array['Перевод','Языки','DeepL'],           18000000,'🌐', 'https://t.me/TranslatorBot'),
  ('PDFBot',                     'PDF Manager',                     'Конвертируй, объединяй, сжимай и редактируй PDF прямо в Telegram. Быстро и без регистрации.',                 2, 4.6,  87300, false, false, array['PDF','Конвертация','Документы'],     10500000,'📄', 'https://t.me/PDFBot'),
  ('alertokens_bot',             'Alert tokens',                    'Уведомления о движении токенов и криптовалют. Следите за изменениями цен в реальном времени.',                11,5.0,     12, false, true,  array['Криптовалюта','Уведомления','Токены'],  1000, '🔔', 'https://t.me/alertokens_bot'),
  ('WifiFreeMap_bot',            'Карта WI-FI Калужской области',   'Интерактивная карта бесплатных точек Wi-Fi в Калужской области. Найди ближайший интернет.',                  9, 4.9,    150, true,  true,  array['Wi-Fi','Калуга','Карта'],                500, '📶', 'https://t.me/WifiFreeMap_bot'),
  ('barcodegeneratorfree_bot',   'Генератор QR кодов',              'Создавайте QR-коды и штрих-коды бесплатно. Поддержка всех популярных форматов.',                              11,4.8,      4, true,  false, array['QR','Штрих-код','Генератор'],            500, '📱', 'https://t.me/barcodegeneratorfree_bot'),
  ('cheapQuickVpn_bot',          'Быстрый VPN',                     'Быстрый и надёжный VPN-сервис. Обходите блокировки и защищайте свою конфиденциальность.',                    1, 4.5,      0, true,  false, array['VPN','Безопасность','AI'],               100, '🔒', 'https://t.me/cheapQuickVpn_bot'),
  ('qrcodeauto_bot',             'CarQR - цифровая визитка для авто','Создайте QR-код для вашего автомобиля. Делитесь контактами владельца мгновенно.',                          1, 4.5,      0, false, false, array['Авто','QR','Визитка'],                    50, '🚗', 'https://t.me/qrcodeauto_bot'),
  ('avtovikupkaluga_bot',        'Автовыкуп Калуга, Тула, Обнинск', 'Быстрый выкуп автомобилей в Калужской области. Выгодные цены, оформление за 1 день.',                         8, 4.5,    298, false, false, array['Авто','Выкуп','Калуга'],                 300, '🚘', 'https://t.me/avtovikupkaluga_bot')
on conflict (username) do update
  set name          = excluded.name,
      description   = excluded.description,
      category_id   = excluded.category_id,
      rating        = excluded.rating,
      review_count  = excluded.review_count,
      is_verified   = excluded.is_verified,
      is_premium    = excluded.is_premium,
      tags          = excluded.tags,
      monthly_users = excluded.monthly_users,
      icon_emoji    = excluded.icon_emoji,
      telegram_url  = excluded.telegram_url;
