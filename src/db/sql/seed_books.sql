-- Колонка під обкладинку (файл у public/images)
ALTER TABLE books ADD COLUMN IF NOT EXISTS image VARCHAR(255);

-- Наповнення таблиці книжками
INSERT INTO books (create_time, title, price, is_active, image) VALUES
  (CURRENT_DATE, 'Кобзар',                             250, true,  'kobzar.svg'),
  (CURRENT_DATE, 'Тигролови',                          320, true,  'tigrolovy.svg'),
  (CURRENT_DATE, '1984',                               400, true,  '1984.svg'),
  (CURRENT_DATE, 'Гаррі Поттер і філософський камінь', 450, false, 'harry-potter.svg'),
  (CURRENT_DATE, 'Маленький принц',                    280, true,  'little-prince.svg'),
  (CURRENT_DATE, 'Лісова пісня',                       210, true,  'lisova-pisnya.svg'),
  (CURRENT_DATE, 'Місто',                              265, true,  'misto.svg'),
  (CURRENT_DATE, 'Солодка Даруся',                     340, true,  'solodka-darusya.svg'),
  (CURRENT_DATE, 'Гобіт',                              380, true,  'hobbit.svg'),
  (CURRENT_DATE, '451 градус за Фаренгейтом',          295, true,  '451.svg'),
  (CURRENT_DATE, 'Майстер і Маргарита',                360, false, 'majster-margarita.svg'),
  (CURRENT_DATE, 'Записки українського самашедшого',   310, true,  'zapysky-kurkulia.svg');
