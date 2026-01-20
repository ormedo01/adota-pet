-- =====================================================
-- SEED DATA - Dados de exemplo para testes
-- Execute após o schema.sql
-- =====================================================

-- Inserir mais ONGs de exemplo
INSERT INTO users (email, password_hash, name, user_type, cnpj, description, city, state, phone)
VALUES 
(
  'amigosanimais@ong.org',
  -- Senha: senha123 (hash bcrypt válido)
  '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW',
  'Amigos dos Animais',
  'ong',
  '23.456.789/0001-91',
  'ONG dedicada ao resgate de animais de rua',
  'Rio de Janeiro',
  'RJ',
  '(21) 98765-4321'
),
(
  'anjosdequatropatas@ong.org',
  '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW',
  'Anjos de Quatro Patas',
  'ong',
  '34.567.890/0001-92',
  'Resgate e adoção responsável de pets abandonados',
  'Belo Horizonte',
  'MG',
  '(31) 98765-4321'
);

-- Inserir alguns adotantes de exemplo
INSERT INTO users (email, password_hash, name, user_type, cpf, birth_date, phone)
VALUES 
(
  'joao.silva@email.com',
  '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW',
  'João Silva',
  'adopter',
  '123.456.789-00',
  '1990-05-15',
  '(11) 91234-5678'
),
(
  'maria.santos@email.com',
  '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW',
  'Maria Santos',
  'adopter',
  '234.567.890-11',
  '1995-08-20',
  '(21) 91234-5678'
);

-- Inserir pets de exemplo
-- Primeiro, vamos pegar o ID da primeira ONG
DO $$
DECLARE
  ong1_id UUID;
  ong2_id UUID;
  ong3_id UUID;
BEGIN
  SELECT id INTO ong1_id FROM users WHERE email = 'contato@patinhasfelizes.org';
  SELECT id INTO ong2_id FROM users WHERE email = 'amigosanimais@ong.org';
  SELECT id INTO ong3_id FROM users WHERE email = 'anjosdequatropatas@ong.org';

  -- Pets da ONG 1 (Patinhas Felizes)
  INSERT INTO pets (ong_id, name, species, breed, age_years, age_months, size, gender, description, personality, good_with_kids, good_with_pets, needs_yard, image_url, status)
  VALUES 
  (
    ong1_id,
    'Max',
    'dog',
    'Vira-lata',
    2,
    6,
    'medium',
    'male',
    'Cachorro muito carinhoso e brincalhão, foi resgatado das ruas e está pronto para um lar amoroso.',
    'Brincalhão, carinhoso, energético',
    true,
    true,
    false,
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    'available'
  ),
  (
    ong1_id,
    'Luna',
    'cat',
    'Siamês',
    1,
    3,
    'small',
    'female',
    'Gatinha dócil e silenciosa, adora carinho e precisa de um lar tranquilo.',
    'Calma, carinhosa, independente',
    true,
    true,
    false,
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    'available'
  ),
  (
    ong1_id,
    'Thor',
    'dog',
    'Labrador',
    3,
    0,
    'large',
    'male',
    'Cachorro grande e protetor, ideal para casas com quintal.',
    'Protetor, leal, calmo',
    true,
    false,
    true,
    'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400',
    'available'
  );

  -- Pets da ONG 2 (Amigos dos Animais)
  INSERT INTO pets (ong_id, name, species, breed, age_years, size, gender, description, good_with_kids, good_with_pets, image_url, status)
  VALUES 
  (
    ong2_id,
    'Mel',
    'cat',
    'Persa',
    2,
    'small',
    'female',
    'Gatinha persa super carinhosa, adora colo e mimo.',
    true,
    true,
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    'available'
  ),
  (
    ong2_id,
    'Rex',
    'dog',
    'Pastor Alemão',
    4,
    'large',
    'male',
    'Cachorro treinado e obediente, ótimo para guarda.',
    false,
    false,
    'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
    'available'
  );

  -- Pets da ONG 3 (Anjos de Quatro Patas)
  INSERT INTO pets (ong_id, name, species, breed, age_months, size, gender, description, good_with_kids, good_with_pets, image_url, status)
  VALUES 
  (
    ong3_id,
    'Mia',
    'cat',
    'Vira-lata',
    4,
    'small',
    'female',
    'Filhote de gatinha super brincalhona e curiosa.',
    true,
    true,
    'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400',
    'available'
  ),
  (
    ong3_id,
    'Bob',
    'dog',
    'Beagle',
    1,
    'small',
    'male',
    'Cachorrinho alegre e cheio de energia, perfeito para famílias ativas.',
    true,
    true,
    'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400',
    'available'
  );

END $$;

-- Inserir algumas candidaturas de exemplo
DO $$
DECLARE
  pet_max_id UUID;
  adopter_joao_id UUID;
  adopter_maria_id UUID;
BEGIN
  SELECT id INTO pet_max_id FROM pets WHERE name = 'Max' LIMIT 1;
  SELECT id INTO adopter_joao_id FROM users WHERE email = 'joao.silva@email.com';
  SELECT id INTO adopter_maria_id FROM users WHERE email = 'maria.santos@email.com';

  INSERT INTO adoption_applications (
    pet_id, adopter_id,
    full_name, email, phone, cpf, birth_date,
    address, city, state, zip_code,
    housing_type, housing_ownership, has_yard, yard_fenced,
    household_size, has_children, all_agree,
    has_current_pets, daily_hours_alone, who_cares_when_away,
    financial_readiness, monthly_budget,
    adoption_reason, what_if_moving,
    long_term_commitment, accepts_follow_up_visits,
    status
  )
  VALUES (
    pet_max_id,
    adopter_joao_id,
    'João Silva',
    'joao.silva@email.com',
    '(11) 91234-5678',
    '123.456.789-00',
    '1990-05-15',
    'Rua das Flores, 123',
    'São Paulo',
    'SP',
    '01234-567',
    'house',
    'own',
    true,
    true,
    3,
    false,
    true,
    false,
    '4-6 horas',
    'Vizinho de confiança',
    'ready',
    500.00,
    'Sempre quis ter um cachorro e agora tenho tempo e estrutura para cuidar bem dele.',
    'Levaria o pet comigo sem dúvida.',
    true,
    true,
    'pending'
  );

END $$;

-- Verificar dados inseridos
SELECT 'ONGs cadastradas:' as info, COUNT(*) as total FROM users WHERE user_type = 'ong';
SELECT 'Adotantes cadastrados:' as info, COUNT(*) as total FROM users WHERE user_type = 'adopter';
SELECT 'Pets disponíveis:' as info, COUNT(*) as total FROM pets WHERE status = 'available';
SELECT 'Candidaturas pendentes:' as info, COUNT(*) as total FROM adoption_applications WHERE status = 'pending';

-- Listar todos os pets com suas ONGs
SELECT 
  p.name as pet_name,
  p.species,
  p.size,
  p.status,
  u.name as ong_name,
  u.city
FROM pets p
JOIN users u ON u.id = p.ong_id
ORDER BY p.created_at DESC;
