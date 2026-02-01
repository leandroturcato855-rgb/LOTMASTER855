-- Tabela de Perfis de Usuário
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'vendedor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Bolões (para gerenciar múltiplos bolões)
CREATE TABLE bolões (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('aberto', 'encerrado', 'concluido')),
  data_inicio TIMESTAMPTZ DEFAULT NOW(),
  data_sorteio TIMESTAMPTZ,
  numeros_sorteados INTEGER[], -- Array de 15 números
  premios JSONB DEFAULT '{"10": 0, "9": 0, "8": 0, "0": 0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Apostas
CREATE TABLE apostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bolao_id UUID REFERENCES bolões(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id), -- NULL para casual
  vendedor_id UUID REFERENCES auth.users(id), -- Quem registrou a aposta
  player_name TEXT NOT NULL,
  numbers INTEGER[] NOT NULL, -- Array de 10 números
  game_number INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'validada')),
  hits INTEGER[], -- Números que acertou
  score INTEGER, -- Quantidade de acertos
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Ranking Público (para compatibilidade e histórico rápido)
CREATE TABLE public_ranking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bolao_id UUID REFERENCES bolões(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  pontos INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bolões ENABLE ROW LEVEL SECURITY;
ALTER TABLE apostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_ranking ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
CREATE POLICY "Perfis visíveis por todos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Admins podem editar perfis" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para Bolões
CREATE POLICY "Bolões visíveis por todos" ON bolões FOR SELECT USING (true);
CREATE POLICY "Admins podem gerenciar bolões" ON bolões FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para Apostas
CREATE POLICY "Apostas visíveis por todos" ON apostas FOR SELECT USING (true);
CREATE POLICY "Vendedores podem inserir suas apostas" ON apostas FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor'))
);
CREATE POLICY "Vendedores podem ver suas apostas" ON apostas FOR SELECT USING (
  vendedor_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins podem gerenciar todas as apostas" ON apostas FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para Public Ranking
CREATE POLICY "Ranking visível por todos" ON public_ranking FOR SELECT USING (true);
CREATE POLICY "Admins podem gerenciar ranking" ON public_ranking FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
