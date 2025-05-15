/**
 * Utilitários de segurança para proteção contra ataques comuns
 */

/**
 * Sanitiza uma string removendo caracteres potencialmente perigosos
 * para prevenir ataques XSS
 * 
 * @param input String a ser sanitizada
 * @returns String sanitizada
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remove tags HTML e scripts
  const sanitized = input
    .replace(/<(|\/|[^>\/bi]|\/[^>bi]|[^\/>][^>]+|\/[^>][^>]+)>/g, '')
    // Escape caracteres especiais
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized;
}

/**
 * Sanitiza valores numéricos para prevenir injeções
 * 
 * @param value Valor a ser sanitizado
 * @returns Número sanitizado ou null se inválido
 */
export function sanitizeNumber(value: any): number | null {
  // Verifica se é um número válido
  if (value === null || value === undefined) return null;
  
  // Converte para número
  const num = Number(value);
  
  // Verifica se é um número válido e não NaN
  if (isNaN(num)) return null;
  
  return num;
}

/**
 * Valida se um número está dentro de um intervalo permitido
 * para prevenir entrada de valores maliciosos
 * 
 * @param value Valor a ser validado
 * @param min Valor mínimo permitido
 * @param max Valor máximo permitido
 * @returns Valor dentro do intervalo ou valor padrão se inválido
 */
export function validateNumberRange(value: number, min: number, max: number, defaultValue: number): number {
  if (value === null || value === undefined || isNaN(value)) {
    return defaultValue;
  }
  
  if (value < min) return min;
  if (value > max) return max;
  
  return value;
}

/**
 * Cria validadores Zod seguros com validação de números e intervalo
 * para uso nos formulários
 * 
 * @param min Valor mínimo permitido
 * @param max Valor máximo permitido
 * @param errorMsg Mensagem de erro customizada
 * @returns Validador Zod para números com intervalo
 */
export function createSecureNumberValidator(min: number, max: number, errorMsg?: string) {
  return {
    min,
    max,
    errorMsg: errorMsg || `O valor deve estar entre ${min} e ${max}`
  };
}