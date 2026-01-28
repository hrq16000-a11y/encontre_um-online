-- Script para promover um usuário existente a admin
-- Primeiro, o usuário precisa se cadastrar normalmente em /auth/cadastro
-- Depois, execute este script alterando o email abaixo

-- Opção 1: Promover usuário existente a admin pelo email
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'SEU_EMAIL_AQUI@exemplo.com'
);

-- Verificar usuários e seus roles
SELECT 
  p.id,
  u.email,
  p.full_name,
  p.role,
  p.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;
