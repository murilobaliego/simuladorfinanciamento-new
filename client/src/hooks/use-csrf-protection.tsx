import { useState, useCallback, useEffect } from 'react';

/**
 * Hook para proteção contra CSRF (Cross-Site Request Forgery)
 * 
 * Gera um token CSRF e o mantém em estado entre renderizações.
 * Este token pode ser incluído em formulários como um campo oculto.
 */
export function useCsrfProtection() {
  // Estado para armazenar o token CSRF
  const [csrfToken, setCsrfToken] = useState<string>('');
  
  // Gera um token CSRF aleatório
  const generateCsrfToken = useCallback(() => {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    const token = Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    setCsrfToken(token);
    return token;
  }, []);
  
  // Inicializa o token na montagem do componente
  useEffect(() => {
    generateCsrfToken();
  }, [generateCsrfToken]);
  
  // Retorna o token e função para regenerá-lo
  return {
    csrfToken,
    generateCsrfToken,
    
    // Input oculto que pode ser adicionado a formulários
    CsrfInput: useCallback(() => (
      <input type="hidden" name="csrf_token" value={csrfToken} />
    ), [csrfToken])
  };
}