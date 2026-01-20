-- Script para atualizar apenas os password_hash dos usuários de exemplo
-- Execute este script no SQL Editor do Supabase para corrigir as senhas

-- Atualizar senha da ONG Patinhas Felizes
UPDATE users 
SET password_hash = '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW'
WHERE email = 'contato@patinhasfelizes.org';

-- Atualizar senha das outras ONGs
UPDATE users 
SET password_hash = '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW'
WHERE email IN ('amigosanimais@ong.org', 'anjosdequatropatas@ong.org');

-- Atualizar senha dos adotantes
UPDATE users 
SET password_hash = '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW'
WHERE email IN ('joao.silva@email.com', 'maria.santos@email.com');

-- Verificar quantos usuários foram atualizados
SELECT email, name, user_type, 
       CASE 
         WHEN password_hash = '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW' 
         THEN 'Hash correto ✅' 
         ELSE 'Hash incorreto ❌' 
       END as status_hash
FROM users
ORDER BY created_at;
