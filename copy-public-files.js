// Script para copiar arquivos da pasta public para dist/public
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const distPublicDir = path.join(__dirname, 'dist', 'public');

// Garantir que o diretório de destino existe
if (!fs.existsSync(distPublicDir)) {
  fs.mkdirSync(distPublicDir, { recursive: true });
}

// Função para copiar arquivos recursivamente
function copyFilesRecursively(sourceDir, targetDir) {
  // Ler conteúdo do diretório
  const items = fs.readdirSync(sourceDir, { withFileTypes: true });
  
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item.name);
    const targetPath = path.join(targetDir, item.name);
    
    if (item.isDirectory()) {
      // Criar diretório no destino se não existir
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      
      // Copiar conteúdo do diretório recursivamente
      copyFilesRecursively(sourcePath, targetPath);
    } else {
      // Copiar arquivo
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Arquivo copiado: ${sourcePath} -> ${targetPath}`);
    }
  }
}

// Iniciar cópia
console.log('Copiando arquivos da pasta public para dist/public...');
copyFilesRecursively(publicDir, distPublicDir);
console.log('Cópia concluída com sucesso!');