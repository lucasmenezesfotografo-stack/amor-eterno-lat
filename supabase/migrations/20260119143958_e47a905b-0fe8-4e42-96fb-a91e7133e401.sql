-- Criar enum para status de pagamento
CREATE TYPE public.payment_status AS ENUM ('active', 'expired', 'cancelled');

-- Criar tabela de assinaturas/pagamentos
CREATE TABLE public.gift_page_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  gift_page_id UUID REFERENCES public.gift_pages(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status payment_status NOT NULL DEFAULT 'active',
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 year'),
  UNIQUE(gift_page_id)
);

-- Habilitar RLS
ALTER TABLE public.gift_page_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Anyone can view subscriptions" ON public.gift_page_subscriptions FOR SELECT USING (true);
CREATE POLICY "System can insert subscriptions" ON public.gift_page_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update subscriptions" ON public.gift_page_subscriptions FOR UPDATE USING (true);

-- Criar tabela de códigos de ativação para influenciadores
CREATE TABLE public.activation_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  uses_remaining INTEGER DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT DEFAULT 'admin'
);

-- Habilitar RLS
ALTER TABLE public.activation_codes ENABLE ROW LEVEL SECURITY;

-- Apenas admin pode ver códigos (via service role)
CREATE POLICY "Public can validate codes" ON public.activation_codes FOR SELECT USING (true);

-- Tabela para rastrear uso dos códigos
CREATE TABLE public.activation_code_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activation_code_id UUID REFERENCES public.activation_codes(id) ON DELETE CASCADE NOT NULL,
  gift_page_id UUID REFERENCES public.gift_pages(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(gift_page_id)
);

-- Habilitar RLS
ALTER TABLE public.activation_code_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view usage" ON public.activation_code_usage FOR SELECT USING (true);
CREATE POLICY "Anyone can insert usage" ON public.activation_code_usage FOR INSERT WITH CHECK (true);

-- Adicionar coluna is_active na gift_pages para controlar se está no ar
ALTER TABLE public.gift_pages ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT false;