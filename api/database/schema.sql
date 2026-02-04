-- =====================================================
-- ADOTA PET - DATABASE SCHEMA
-- Sistema de Adoção de Animais
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: users
-- Armazena ONGs e Adotantes
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('adopter', 'ong', 'admin')),
  phone VARCHAR(20),
  
  -- Campos específicos para ONGs
  cnpj VARCHAR(18) UNIQUE,
  description TEXT,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(9),
  website VARCHAR(255),
  
  -- Campos específicos para Adotantes
  cpf VARCHAR(14) UNIQUE,
  birth_date DATE,
  
  -- Controle
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- Constraints
  CONSTRAINT user_ong_requires_cnpj CHECK (
    user_type != 'ong' OR cnpj IS NOT NULL
  ),
  CONSTRAINT user_adopter_requires_cpf CHECK (
    user_type != 'adopter' OR cpf IS NOT NULL
  )
);

-- Índices para otimização
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_cnpj ON users(cnpj) WHERE cnpj IS NOT NULL;
CREATE INDEX idx_users_cpf ON users(cpf) WHERE cpf IS NOT NULL;

-- =====================================================
-- TABELA: pets
-- Animais disponíveis para adoção
-- =====================================================
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ong_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Informações básicas
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL CHECK (species IN ('dog', 'cat', 'other')),
  breed VARCHAR(100),
  age_years INTEGER,
  age_months INTEGER,
  size VARCHAR(20) CHECK (size IN ('small', 'medium', 'large')),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  
  -- Descrição e características
  description TEXT,
  personality TEXT,
  health_info TEXT,
  special_needs TEXT,
  
  -- Requisitos para adoção
  good_with_kids BOOLEAN DEFAULT true,
  good_with_pets BOOLEAN DEFAULT true,
  needs_yard BOOLEAN DEFAULT false,
  
  -- Mídia
  image_url TEXT,
  additional_images TEXT[], -- Array de URLs
  
  -- Status
  status VARCHAR(20) DEFAULT 'available' CHECK (
    status IN ('available', 'in_process', 'adopted', 'unavailable')
  ),
  
  -- Controle
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT age_valid CHECK (
    (age_years IS NOT NULL AND age_years >= 0) OR
    (age_months IS NOT NULL AND age_months >= 0)
  )
);

-- Índices
CREATE INDEX idx_pets_ong ON pets(ong_id);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_size ON pets(size);

-- =====================================================
-- TABELA: adoption_applications
-- Candidaturas de adoção (formulário em 4 etapas)
-- =====================================================
CREATE TABLE adoption_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  adopter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- ETAPA 1: Dados Pessoais e Endereço
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  birth_date DATE NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(9) NOT NULL,
  
  -- ETAPA 2: Informações sobre Moradia
  housing_type VARCHAR(20) CHECK (housing_type IN ('house', 'apartment')),
  housing_ownership VARCHAR(20) CHECK (housing_ownership IN ('own', 'rent', 'family')),
  has_yard BOOLEAN,
  yard_fenced BOOLEAN,
  household_size INTEGER,
  has_children BOOLEAN,
  children_ages VARCHAR(255),
  all_agree BOOLEAN NOT NULL,
  
  -- ETAPA 3: Experiência com Pets
  has_current_pets BOOLEAN,
  current_pets_description TEXT,
  previous_pets_experience TEXT,
  daily_hours_alone VARCHAR(50),
  who_cares_when_away TEXT,
  financial_readiness VARCHAR(20) CHECK (
    financial_readiness IN ('ready', 'partially', 'learning')
  ),
  monthly_budget DECIMAL(10, 2),
  
  -- ETAPA 4: Motivação e Compromisso
  adoption_reason TEXT NOT NULL,
  what_if_moving TEXT NOT NULL,
  long_term_commitment BOOLEAN NOT NULL,
  accepts_follow_up_visits BOOLEAN NOT NULL,
  
  -- Status da candidatura
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'under_review', 'approved', 'rejected', 'cancelled')
  ),
  
  -- Feedback da ONG
  ong_notes TEXT,
  rejection_reason TEXT,
  
  -- Controle
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_active_application UNIQUE (pet_id, adopter_id, status),
  CONSTRAINT valid_commitment CHECK (
    long_term_commitment = true AND accepts_follow_up_visits = true
  )
);

-- Índices
CREATE INDEX idx_applications_pet ON adoption_applications(pet_id);
CREATE INDEX idx_applications_adopter ON adoption_applications(adopter_id);
CREATE INDEX idx_applications_status ON adoption_applications(status);
CREATE INDEX idx_applications_submitted ON adoption_applications(submitted_at DESC);

-- =====================================================
-- TABELA: favorites
-- Pets favoritados pelos adotantes
-- =====================================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Um usuário só pode favoritar um pet uma vez
  CONSTRAINT unique_favorite UNIQUE (user_id, pet_id)
);

-- Índices
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_pet ON favorites(pet_id);

-- =====================================================
-- TABELA: messages
-- Sistema de mensagens entre ONGs e Adotantes
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES adoption_applications(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
  
  -- Nota: Validação de que sender_id é parte da candidatura
  -- será feita no backend da API (NestJS)
);

-- Índices
CREATE INDEX idx_messages_application ON messages(application_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View: Estatísticas da ONG
CREATE OR REPLACE VIEW ong_statistics AS
SELECT 
  u.id as ong_id,
  u.name as ong_name,
  COUNT(DISTINCT p.id) as total_pets,
  COUNT(DISTINCT CASE WHEN p.status = 'available' THEN p.id END) as available_pets,
  COUNT(DISTINCT CASE WHEN p.status = 'adopted' THEN p.id END) as adopted_pets,
  COUNT(DISTINCT aa.id) as total_applications,
  COUNT(DISTINCT CASE WHEN aa.status = 'pending' THEN aa.id END) as pending_applications,
  COUNT(DISTINCT CASE WHEN aa.status = 'approved' THEN aa.id END) as approved_applications
FROM users u
LEFT JOIN pets p ON p.ong_id = u.id
LEFT JOIN adoption_applications aa ON aa.pet_id = p.id
WHERE u.user_type = 'ong'
GROUP BY u.id, u.name;

-- View: Pets com informações da ONG
CREATE OR REPLACE VIEW pets_with_ong AS
SELECT 
  p.*,
  u.name as ong_name,
  u.city as ong_city,
  u.state as ong_state,
  u.phone as ong_phone,
  (SELECT COUNT(*) FROM adoption_applications WHERE pet_id = p.id AND status = 'pending') as pending_applications_count
FROM pets p
JOIN users u ON u.id = p.ong_id
WHERE p.status IN ('available', 'in_process');

-- View: Candidaturas com detalhes
CREATE OR REPLACE VIEW applications_detailed AS
SELECT 
  aa.*,
  p.name as pet_name,
  p.species as pet_species,
  p.image_url as pet_image,
  ong.name as ong_name,
  ong.phone as ong_phone,
  ong.email as ong_email,
  adopter.name as adopter_name,
  adopter.email as adopter_email
FROM adoption_applications aa
JOIN pets p ON p.id = aa.pet_id
JOIN users ong ON ong.id = p.ong_id
JOIN users adopter ON adopter.id = aa.adopter_id;

-- =====================================================
-- FUNCTIONS E TRIGGERS
-- =====================================================

-- Function: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON adoption_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Atualizar status do pet quando aprovado
CREATE OR REPLACE FUNCTION update_pet_status_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE pets 
    SET status = 'in_process'
    WHERE id = NEW.pet_id;
    
    -- Marcar reviewed_at
    NEW.reviewed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pet_status BEFORE UPDATE ON adoption_applications
  FOR EACH ROW EXECUTE FUNCTION update_pet_status_on_approval();

-- =====================================================
-- DADOS INICIAIS (SEED)
-- =====================================================

-- Inserir ONG de exemplo
INSERT INTO users (email, password_hash, name, user_type, cnpj, description, city, state, phone)
VALUES (
  'contato@patinhasfelizes.org',
  -- Senha: senha123 (hash bcrypt válido)
  '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW',
  'ONG Patinhas Felizes',
  'ong',
  '12.345.678/0001-90',
  'ONG dedicada ao resgate e adoção responsável de animais abandonados',
  'São Paulo',
  'SP',
  '(11) 98765-4321'
);

-- Comentários sobre o schema
COMMENT ON TABLE users IS 'Armazena tanto ONGs quanto Adotantes';
COMMENT ON TABLE pets IS 'Animais disponíveis para adoção cadastrados pelas ONGs';
COMMENT ON TABLE adoption_applications IS 'Formulários de candidatura de adoção em 4 etapas';
COMMENT ON TABLE favorites IS 'Pets favoritados pelos usuários adotantes';
COMMENT ON TABLE messages IS 'Sistema de mensagens entre ONGs e Adotantes sobre candidaturas';

-- =====================================================
-- PERMISSÕES E SEGURANÇA (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso serão configuradas no Supabase Dashboard
-- ou via código quando integrar com Supabase Auth
