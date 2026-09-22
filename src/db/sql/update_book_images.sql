UPDATE books AS b
SET image = images.filename
FROM (VALUES
  ('kobzar.jpg', 'kobzar.svg'),
  ('lisova-pisnya.jpg', 'lisova-pisnya.svg'),
  ('zahar-berkut.jpg', 'lake.webp'),
  ('tigrolovy.jpg', 'tigrolovy.svg'),
  ('marusya-churai.jpg', 'sun.webp'),
  ('kaidasheva-simya.jpg', 'lake.webp'),
  ('chorna-rada.jpg', 'sun.webp'),
  ('eneida.jpg', 'lake.webp'),
  ('100-years.jpg', 'sun.webp'),
  ('1984.jpg', '1984.svg'),
  ('animal-farm.jpg', 'lake.webp'),
  ('little-prince.jpg', 'little-prince.svg'),
  ('hp1.jpg', 'harry-potter.svg'),
  ('hobbit.jpg', 'hobbit.svg'),
  ('lotr.jpg', 'sun.webp'),
  ('dune.jpg', 'lake.webp'),
  ('451.jpg', '451.svg'),
  ('sherlock.jpg', 'sun.webp'),
  ('alchemist.jpg', 'lake.webp'),
  ('master-margarita.jpg', 'majster-margarita.svg')
) AS images(old_filename, filename)
WHERE b.image = images.old_filename;
