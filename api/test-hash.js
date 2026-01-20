const bcrypt = require('bcrypt');

async function testHash() {
  const password = 'senha123';
  
  // Gerar novo hash
  const newHash = await bcrypt.hash(password, 10);
  console.log('Novo hash gerado:', newHash);
  
  // Testar hash do seed
  const seedHash = '$2b$10$rKzVgJvF8xN8K4Hx3.NVkeZqFYfY.8ooLr0FoE8eA7.GBnYfKHQke';
  const isValidSeed = await bcrypt.compare(password, seedHash);
  console.log('Hash do seed é válido?', isValidSeed);
  
  // Testar novo hash
  const isValidNew = await bcrypt.compare(password, newHash);
  console.log('Novo hash é válido?', isValidNew);
}

testHash();
