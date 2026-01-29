-- Seed sample listings for demonstration
-- These listings will be owned by the admin user

-- First, get the admin user id and category ids
DO $$
DECLARE
  admin_id UUID;
  cat_tech_id UUID;
  cat_dentist_id UUID;
  cat_mechanic_id UUID;
  cat_restaurant_id UUID;
  cat_lawyer_id UUID;
BEGIN
  -- Get admin user
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@encontreum.com' LIMIT 1;
  
  -- Get category ids
  SELECT id INTO cat_tech_id FROM categories WHERE slug = 'tecnologia' LIMIT 1;
  SELECT id INTO cat_dentist_id FROM categories WHERE slug = 'dentistas' LIMIT 1;
  SELECT id INTO cat_mechanic_id FROM categories WHERE slug = 'mecanicos' LIMIT 1;
  SELECT id INTO cat_restaurant_id FROM categories WHERE slug = 'restaurantes' LIMIT 1;
  SELECT id INTO cat_lawyer_id FROM categories WHERE slug = 'advogados' LIMIT 1;
  
  -- Only proceed if admin exists
  IF admin_id IS NOT NULL THEN
    -- Sample listing 1: Ping Soluções (Tech)
    INSERT INTO listings (
      owner_id, category_id, title, slug, description,
      phone_primary, phone_whatsapp, email, website,
      address_full, city, state, postal_code,
      status, plan_tier, is_verified, average_rating, review_count, view_count, contact_count,
      business_hours, seo_title, seo_description
    ) VALUES (
      admin_id,
      cat_tech_id,
      'Ping Soluções',
      'pingsolucoes',
      'Soluções completas em tecnologia para sua empresa. Desenvolvimento de software, suporte técnico, consultoria em TI e muito mais. Atendemos empresas de todos os portes.',
      '4133333333',
      '5541999999999',
      'contato@pingsolucoes.com.br',
      'https://pingsolucoes.com.br',
      'Rua das Flores, 123, Sala 45, Centro',
      'Curitiba',
      'PR',
      '80010-000',
      'active',
      'premium',
      true,
      4.8,
      24,
      1250,
      89,
      '{"monday": {"open": "08:00", "close": "18:00"}, "tuesday": {"open": "08:00", "close": "18:00"}, "wednesday": {"open": "08:00", "close": "18:00"}, "thursday": {"open": "08:00", "close": "18:00"}, "friday": {"open": "08:00", "close": "18:00"}, "saturday": null, "sunday": null}'::jsonb,
      'Ping Soluções - Tecnologia e Inovação em Curitiba',
      'Empresa de tecnologia em Curitiba especializada em desenvolvimento de software, suporte técnico e consultoria em TI.'
    ) ON CONFLICT (slug) DO NOTHING;

    -- Sample listing 2: Dr. Silva Odontologia (Dentist)
    INSERT INTO listings (
      owner_id, category_id, title, slug, description,
      phone_primary, phone_whatsapp, email, website,
      address_full, city, state, postal_code,
      status, plan_tier, is_verified, average_rating, review_count, view_count, contact_count,
      business_hours, seo_title, seo_description
    ) VALUES (
      admin_id,
      cat_dentist_id,
      'Dr. Silva Odontologia',
      'dr-silva-odontologia',
      'Clínica odontológica com mais de 15 anos de experiência. Oferecemos tratamentos de ortodontia, implantes, clareamento dental e muito mais. Ambiente moderno e equipe especializada.',
      '4132222222',
      '5541988888888',
      'contato@drsilva.com.br',
      'https://drsilvaodontologia.com.br',
      'Av. Brasil, 500, Sala 12, Batel',
      'Curitiba',
      'PR',
      '80420-000',
      'active',
      'basic',
      true,
      4.9,
      67,
      2340,
      156,
      '{"monday": {"open": "08:00", "close": "19:00"}, "tuesday": {"open": "08:00", "close": "19:00"}, "wednesday": {"open": "08:00", "close": "19:00"}, "thursday": {"open": "08:00", "close": "19:00"}, "friday": {"open": "08:00", "close": "19:00"}, "saturday": {"open": "08:00", "close": "13:00"}, "sunday": null}'::jsonb,
      'Dr. Silva Odontologia - Dentista em Curitiba',
      'Clínica odontológica em Curitiba. Ortodontia, implantes, clareamento e mais. Agende sua consulta!'
    ) ON CONFLICT (slug) DO NOTHING;

    -- Sample listing 3: Auto Center Premium (Mechanic)
    INSERT INTO listings (
      owner_id, category_id, title, slug, description,
      phone_primary, phone_whatsapp, email, website,
      address_full, city, state, postal_code,
      status, plan_tier, is_verified, average_rating, review_count, view_count, contact_count,
      business_hours, seo_title, seo_description
    ) VALUES (
      admin_id,
      cat_mechanic_id,
      'Auto Center Premium',
      'auto-center-premium',
      'Oficina mecânica completa com serviços de manutenção preventiva, troca de óleo, alinhamento, balanceamento, suspensão e muito mais. Mecânicos especializados e peças originais.',
      '4131111111',
      '5541977777777',
      'contato@autocenterpremium.com.br',
      NULL,
      'Rua XV de Novembro, 1000, Centro',
      'Curitiba',
      'PR',
      '80060-000',
      'active',
      'free',
      false,
      4.5,
      42,
      890,
      67,
      '{"monday": {"open": "07:30", "close": "18:00"}, "tuesday": {"open": "07:30", "close": "18:00"}, "wednesday": {"open": "07:30", "close": "18:00"}, "thursday": {"open": "07:30", "close": "18:00"}, "friday": {"open": "07:30", "close": "18:00"}, "saturday": {"open": "08:00", "close": "12:00"}, "sunday": null}'::jsonb,
      'Auto Center Premium - Mecânica em Curitiba',
      'Oficina mecânica em Curitiba. Manutenção preventiva, troca de óleo, alinhamento e balanceamento.'
    ) ON CONFLICT (slug) DO NOTHING;

    -- Sample listing 4: Sabor da Casa (Restaurant)
    INSERT INTO listings (
      owner_id, category_id, title, slug, description,
      phone_primary, phone_whatsapp, email, website,
      address_full, city, state, postal_code,
      status, plan_tier, is_verified, average_rating, review_count, view_count, contact_count,
      business_hours, seo_title, seo_description
    ) VALUES (
      admin_id,
      cat_restaurant_id,
      'Sabor da Casa',
      'sabor-da-casa',
      'Restaurante de comida caseira com buffet por quilo. Pratos típicos da culinária brasileira preparados com ingredientes frescos. Ambiente familiar e atendimento de qualidade.',
      '4134444444',
      '5541966666666',
      'contato@sabordacasa.com.br',
      NULL,
      'Rua Marechal Deodoro, 300, Centro',
      'Curitiba',
      'PR',
      '80010-010',
      'active',
      'premium',
      true,
      4.7,
      156,
      3200,
      234,
      '{"monday": {"open": "11:00", "close": "15:00"}, "tuesday": {"open": "11:00", "close": "15:00"}, "wednesday": {"open": "11:00", "close": "15:00"}, "thursday": {"open": "11:00", "close": "15:00"}, "friday": {"open": "11:00", "close": "15:00"}, "saturday": {"open": "11:30", "close": "15:00"}, "sunday": null}'::jsonb,
      'Sabor da Casa - Restaurante em Curitiba',
      'Restaurante de comida caseira em Curitiba. Buffet por quilo com pratos típicos brasileiros.'
    ) ON CONFLICT (slug) DO NOTHING;

    -- Sample listing 5: Advocacia Santos & Associados (Lawyer)
    INSERT INTO listings (
      owner_id, category_id, title, slug, description,
      phone_primary, phone_whatsapp, email, website,
      address_full, city, state, postal_code,
      status, plan_tier, is_verified, average_rating, review_count, view_count, contact_count,
      business_hours, seo_title, seo_description
    ) VALUES (
      admin_id,
      cat_lawyer_id,
      'Advocacia Santos & Associados',
      'advocacia-santos',
      'Escritório de advocacia especializado em direito civil, trabalhista e empresarial. Mais de 20 anos de experiência. Primeira consulta gratuita.',
      '4135555555',
      '5541955555555',
      'contato@santosadvocacia.com.br',
      'https://santosadvocacia.com.br',
      'Rua Visconde de Nácar, 800, 10º Andar, Centro',
      'Curitiba',
      'PR',
      '80410-000',
      'active',
      'basic',
      true,
      4.6,
      38,
      560,
      45,
      '{"monday": {"open": "09:00", "close": "18:00"}, "tuesday": {"open": "09:00", "close": "18:00"}, "wednesday": {"open": "09:00", "close": "18:00"}, "thursday": {"open": "09:00", "close": "18:00"}, "friday": {"open": "09:00", "close": "17:00"}, "saturday": null, "sunday": null}'::jsonb,
      'Santos & Associados - Advogados em Curitiba',
      'Escritório de advocacia em Curitiba. Direito civil, trabalhista e empresarial. Consulta gratuita.'
    ) ON CONFLICT (slug) DO NOTHING;

    RAISE NOTICE 'Sample listings created successfully!';
  ELSE
    RAISE NOTICE 'Admin user not found. Please run setup first.';
  END IF;
END $$;
