-- ============================================================
-- SEED: Businesses (Lintang Bakso + Kompetitor)
-- ============================================================
INSERT INTO businesses (name, is_main, rating, lat, lng, address) VALUES
  ('Lintang Bakso',    TRUE,  4.5, -7.2500, 112.7500, 'Surabaya, Jawa Timur'),
  ('Bakso Pak Djo',    FALSE, 4.2, -7.2575, 112.7521, 'Surabaya, Jawa Timur'),
  ('Bakso Solo Roso',  FALSE, 4.1, -7.2610, 112.7480, 'Surabaya, Jawa Timur'),
  ('Bakso Cak Bejo',   FALSE, 3.9, -7.2630, 112.7560, 'Surabaya, Jawa Timur'),
  ('Bakso Malang Asli',FALSE, 4.3, -7.2490, 112.7540, 'Surabaya, Jawa Timur')
ON CONFLICT DO NOTHING;
