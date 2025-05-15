/**
 * Utilitário para proteção contra ataques de força bruta e abuse em formulários
 * 
 * Implementa limitação de taxa (rate limiting) no lado do cliente
 * para prevenir submissões excessivas de formulários.
 */

interface RateLimiterOptions {
  maxAttempts: number;
  timeWindowMs: number;
  storageKey: string;
}

export class RateLimiter {
  private options: RateLimiterOptions;
  
  constructor(options: Partial<RateLimiterOptions> = {}) {
    this.options = {
      maxAttempts: options.maxAttempts || 5,         // Máximo de tentativas permitidas
      timeWindowMs: options.timeWindowMs || 60000,   // Janela de tempo (1 minuto)
      storageKey: options.storageKey || 'rate_limiter_data',
    };
  }
  
  /**
   * Registra uma tentativa de submissão e verifica se o usuário excedeu o limite
   * 
   * @param identifier Identificador opcional para diferentes formulários
   * @returns Um objeto indicando se o limite foi excedido e quanto tempo resta até desbloquear
   */
  public checkLimit(identifier: string = 'default'): { 
    limited: boolean; 
    remainingTime: number;
    attempts: number;
    maxAttempts: number;
  } {
    const now = Date.now();
    const storageKey = `${this.options.storageKey}_${identifier}`;
    
    // Recupera dados do armazenamento local
    const storedData = localStorage.getItem(storageKey);
    let data = storedData ? JSON.parse(storedData) : { attempts: 0, timestamp: now };
    
    // Verificar se a janela de tempo expirou (reset)
    if (now - data.timestamp > this.options.timeWindowMs) {
      data = { attempts: 0, timestamp: now };
    }
    
    // Incrementa tentativas
    data.attempts += 1;
    
    // Salva dados atualizados
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    // Calcula tempo restante
    const remainingTime = Math.max(0, this.options.timeWindowMs - (now - data.timestamp));
    
    // Verifica se o limite foi excedido
    const limited = data.attempts > this.options.maxAttempts;
    
    return {
      limited,
      remainingTime,
      attempts: data.attempts,
      maxAttempts: this.options.maxAttempts
    };
  }
  
  /**
   * Reinicia o contador para um determinado identificador
   * 
   * @param identifier Identificador do formulário
   */
  public reset(identifier: string = 'default'): void {
    const storageKey = `${this.options.storageKey}_${identifier}`;
    localStorage.removeItem(storageKey);
  }
}