-- Таблиця авторів
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Зв'язок книжка <-> автор (одна книжка може мати декілька авторів)
CREATE TABLE IF NOT EXISTS book_authors (
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, author_id)
);

-- Наповнення таблиці авторами
INSERT INTO authors (name) VALUES
  ('Тарас Шевченко'),
  ('Іван Багряний'),
  ('Джордж Орвелл'),
  ('Джоан Роулінг'),
  ('Антуан де Сент-Екзюпері'),
  ('Леся Українка'),
  ('Валер''ян Підмогильний'),
  ('Марія Матіос'),
  ('Джон Толкін'),
  ('Рей Бредбері'),
  ('Михайло Булгаков'),
  ('Ліна Костенко'),
  ('Ілля Ільф'),
  ('Євген Петров');

-- Книжка з двома авторами
INSERT INTO books (create_time, title, price, is_active, image) VALUES
  (CURRENT_DATE, 'Дванадцять стільців', 330, true, 'dvanadtsyat-stiltsiv.svg');

-- Прив'язка авторів до книжок
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b
JOIN authors a ON (b.title, a.name) IN (
  ('Кобзар',                             'Тарас Шевченко'),
  ('Тигролови',                          'Іван Багряний'),
  ('1984',                               'Джордж Орвелл'),
  ('Гаррі Поттер і філософський камінь', 'Джоан Роулінг'),
  ('Маленький принц',                    'Антуан де Сент-Екзюпері'),
  ('Лісова пісня',                       'Леся Українка'),
  ('Місто',                              'Валер''ян Підмогильний'),
  ('Солодка Даруся',                     'Марія Матіос'),
  ('Гобіт',                              'Джон Толкін'),
  ('451 градус за Фаренгейтом',          'Рей Бредбері'),
  ('Майстер і Маргарита',                'Михайло Булгаков'),
  ('Записки українського самашедшого',   'Ліна Костенко'),
  ('Дванадцять стільців',                'Ілля Ільф'),
  ('Дванадцять стільців',                'Євген Петров')
)
ON CONFLICT DO NOTHING;
