import { useState, useCallback, useEffect } from 'react';
import { useCsrfProtection } from './use-csrf-protection';
import { RateLimiter } from '../utils/rate-limiter';
import { sanitizeInput, sanitizeNumber } from '../utils/security';
import { securityMonitor } from '../utils/security-monitoring';
import { useToast } from './use-toast';

// Configurações padrão para o rate limiter
const DEFAULT_RATE_LIMITER_OPTIONS = {
  maxAttempts: 10,        // 10 submissões
  timeWindowMs: 60000,    // em 1 minuto
};

interface UseSecureFormOptions {
  formId?: string;
  rateLimiterOptions?: {
    maxAttempts?: number;
    timeWindowMs?: number;
  };
}

/**
 * Hook para criar formulários seguros com proteções contra ataques
 * 
 * Inclui:
 * - Proteção CSRF
 * - Rate limiting (limitação de taxa)
 * - Sanitização de inputs
 */
export function useSecureForm(options: UseSecureFormOptions = {}) {
  const { formId = 'default_form', rateLimiterOptions } = options;
  
  // Inicializa estados e hooks
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [limitData, setLimitData] = useState<{attempts: number, maxAttempts: number, remainingTime: number}>({
    attempts: 0,
    maxAttempts: rateLimiterOptions?.maxAttempts || DEFAULT_RATE_LIMITER_OPTIONS.maxAttempts,
    remainingTime: 0
  });
  
  const { toast } = useToast();
  const { csrfToken, CsrfInput } = useCsrfProtection();
  
  // Inicializa rate limiter
  const rateLimiter = new RateLimiter({
    maxAttempts: rateLimiterOptions?.maxAttempts || DEFAULT_RATE_LIMITER_OPTIONS.maxAttempts,
    timeWindowMs: rateLimiterOptions?.timeWindowMs || DEFAULT_RATE_LIMITER_OPTIONS.timeWindowMs,
    storageKey: 'form_rate_limiter'
  });
  
  /**
   * Sanitiza todos os valores de um objeto de forma recursiva
   */
  const sanitizeValues = useCallback((values: Record<string, any>): Record<string, any> => {
    // Criamos um novo objeto para não modificar o original
    const sanitized: Record<string, any> = {};
    
    // Para cada propriedade no objeto original
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        const value = values[key];
        
        // Aplicamos a sanitização adequada com base no tipo
        if (typeof value === 'string') {
          sanitized[key] = sanitizeInput(value);
        } else if (typeof value === 'number') {
          sanitized[key] = sanitizeNumber(value);
        } else if (value instanceof Date) {
          // Mantemos datas intactas
          sanitized[key] = value;
        } else if (Array.isArray(value)) {
          // Processamos cada item do array
          sanitized[key] = value.map(item => {
            if (typeof item === 'object' && item !== null) {
              return sanitizeValues(item);
            } else if (typeof item === 'string') {
              return sanitizeInput(item);
            } else {
              return item;
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          // Processamos objetos aninhados recursivamente
          sanitized[key] = sanitizeValues(value);
        } else {
          // Para outros tipos (boolean, undefined, etc), mantemos o valor original
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  }, []);
  
  /**
   * Wrapper para a função de submissão que adiciona proteções
   */
  // Verifica e monitora atividades suspeitas
  useEffect(() => {
    // Detecta tentativas de depuração a cada 10 segundos
    const intervalId = setInterval(() => {
      const isDebugging = securityMonitor.detectDebuggingAttempt();
      if (isDebugging) {
        // Esta verificação é apenas para registrar, não para bloquear usuários legítimos
        console.log('Ferramentas de desenvolvedor detectadas - esta é uma verificação informativa');
      }
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const secureSubmit = useCallback(
    (onSubmit: (values: Record<string, any>) => void | Promise<void>, values: Record<string, any>) => {
      // Verifica rate limiting
      const limitCheck = rateLimiter.checkLimit(formId);
      setLimitData({
        attempts: limitCheck.attempts,
        maxAttempts: limitCheck.maxAttempts,
        remainingTime: limitCheck.remainingTime
      });
      
      if (limitCheck.limited) {
        setIsLimited(true);
        const segundosRestantes = Math.ceil(limitCheck.remainingTime / 1000);
        
        // Registra o evento de segurança
        securityMonitor.logEvent('rate_limit_exceeded', {
          formId,
          attempts: limitCheck.attempts,
          maxAttempts: limitCheck.maxAttempts,
        }, 'medium');
        
        toast({
          title: "Excesso de solicitações",
          description: `Muitas tentativas em um curto período. Tente novamente em ${segundosRestantes} segundos.`,
          variant: "destructive"
        });
        
        return;
      }
      
      // Processa o envio do formulário
      setIsSubmitting(true);
      
      try {
        // Verifica padrões suspeitos nos valores de texto
        let hasSuspiciousPattern = false;
        
        Object.keys(values).forEach(key => {
          if (typeof values[key] === 'string' && values[key].length > 0) {
            if (securityMonitor.detectSuspiciousPatterns(values[key])) {
              hasSuspiciousPattern = true;
            }
          }
        });
        
        // Se detectou padrões suspeitos, rejeita a submissão
        if (hasSuspiciousPattern) {
          setIsSubmitting(false);
          
          toast({
            title: "Entrada inválida detectada",
            description: "Por favor, verifique os dados inseridos e tente novamente.",
            variant: "destructive"
          });
          
          return;
        }
        
        // Sanitiza os valores para prevenir XSS
        const sanitizedValues = sanitizeValues(values);
        
        // Registra evento de sanitização se valores foram alterados
        if (JSON.stringify(values) !== JSON.stringify(sanitizedValues)) {
          securityMonitor.logEvent('sanitization_applied', {
            formId,
            fields: Object.keys(values).filter(k => 
              values[k] !== sanitizedValues[k] && 
              typeof values[k] === 'string'
            )
          }, 'low');
        }
        
        // Adiciona o token CSRF aos valores
        const secureValues = {
          ...sanitizedValues,
          csrfToken
        };
        
        // Registra evento de submissão do formulário
        securityMonitor.logEvent('form_submission', {
          formId,
          timestamp: new Date().toISOString(),
          identifier: formId
        }, 'low');
        
        // Executa a função de submissão original
        const result = onSubmit(secureValues);
        
        // Se for uma promessa, adiciona then/catch
        if (result instanceof Promise) {
          result
            .then(() => {
              setIsSubmitting(false);
            })
            .catch(error => {
              console.error("Erro na submissão do formulário:", error);
              setIsSubmitting(false);
              
              toast({
                title: "Erro ao processar solicitação",
                description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
                variant: "destructive"
              });
            });
        } else {
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error("Erro na submissão do formulário:", error);
        setIsSubmitting(false);
        
        securityMonitor.logEvent('invalid_input', {
          formId,
          error: error instanceof Error ? error.message : 'Unknown error'
        }, 'medium');
        
        toast({
          title: "Erro ao processar solicitação",
          description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
          variant: "destructive"
        });
      }
    }, 
    [csrfToken, formId, sanitizeValues, toast]
  );
  
  /**
   * Reseta o contador de rate limiting (usar quando o usuário fizer login, por exemplo)
   */
  const resetRateLimit = useCallback(() => {
    rateLimiter.reset(formId);
    setIsLimited(false);
    setLimitData({
      attempts: 0,
      maxAttempts: rateLimiterOptions?.maxAttempts || DEFAULT_RATE_LIMITER_OPTIONS.maxAttempts,
      remainingTime: 0
    });
  }, [formId, rateLimiterOptions?.maxAttempts]);
  
  return {
    secureSubmit,
    isSubmitting,
    isLimited,
    limitData,
    resetRateLimit,
    CsrfInput,
    csrfToken
  };
}