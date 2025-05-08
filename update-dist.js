import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtém o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório de destino
const distDir = path.join(__dirname, 'dist', 'public');

// Verifica se o diretório existe
if (!fs.existsSync(distDir)) {
  console.error('O diretório dist/public não existe!');
  process.exit(1);
}

// Lista de arquivos para verificar e atualizar
const filesToCheck = [
  'index.html'
];

// Faz a substituição em todos os arquivos listados
for (const file of filesToCheck) {
  const filePath = path.join(distDir, file);
  
  if (fs.existsSync(filePath)) {
    // Lê o conteúdo do arquivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Substitui todas as ocorrências de simulei.site por simuladorfinanciamento.com
    content = content.replace(/simulei\.site/g, 'simuladorfinanciamento.com');
    
    // Substitui todas as ocorrências de simuladorfinanciamento.com.br por simuladorfinanciamento.com
    content = content.replace(/simuladorfinanciamento\.com\.br/g, 'simuladorfinanciamento.com');
    
    // Escreve o conteúdo modificado de volta para o arquivo
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Arquivo ${file} atualizado com sucesso.`);
  } else {
    console.log(`Arquivo ${file} não encontrado.`);
  }
}

console.log('Processo de atualização concluído.');