/**
 * Utilitário para monitoramento de segurança e detecção de atividades suspeitas
 * 
 * Implementa funções para detectar comportamentos potencialmente maliciosos
 * e registrar eventos de segurança para análise posterior.
 */

// Tipos de eventos de segurança que podem ser monitorados
type SecurityEventType = 
  | 'form_submission'      // Envio de formulário
  | 'rate_limit_exceeded'  // Limite de taxa excedido
  | 'invalid_input'        // Entrada inválida detectada
  | 'sanitization_applied' // Sanitização aplicada
  | 'suspicious_pattern'   // Padrão suspeito detectado
  | 'csrf_token_mismatch'  // Token CSRF inválido
  | 'debugging_attempt';   // Tentativa de depuração/manipulação

interface SecurityEvent {
  type: SecurityEventType;
  timestamp: number;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high';
}

// Padrões suspeitos a serem detectados
const SUSPICIOUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // XSS simples
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,                      // SQL Injection simples
  /((\/|%2f)(bin|etc|usr|boot))/i,                      // Path traversal
  /(exec|system|passthru|eval|shell_exec)/i             // Comandos do sistema
];

class SecurityMonitoring {
  private events: SecurityEvent[] = [];
  private maxEvents: number = 100; // Limite de eventos para prevenir excesso de memória
  
  /**
   * Registra um evento de segurança
   */
  public logEvent(type: SecurityEventType, details: Record<string, any>, severity: 'low' | 'medium' | 'high' = 'low'): void {
    const event: SecurityEvent = {
      type,
      timestamp: Date.now(),
      details,
      severity
    };
    
    this.events.push(event);
    
    // Limita o número de eventos armazenados
    if (this.events.length > this.maxEvents) {
      this.events.shift(); // Remove o evento mais antigo
    }
    
    // Registra eventos de alta severidade no console para depuração
    if (severity === 'high') {
      console.warn('Security event detected:', event);
    }
  }
  
  /**
   * Detecta padrões suspeitos em uma entrada
   */
  public detectSuspiciousPatterns(input: string): boolean {
    if (!input || typeof input !== 'string') return false;
    
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(input)) {
        this.logEvent('suspicious_pattern', { 
          input, 
          pattern: pattern.toString() 
        }, 'high');
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Verifica se há múltiplas submissões do mesmo IP ou usuário
   * baseado em eventos recentes
   */
  public checkMultipleSubmissions(identifier: string, timeframeMs: number = 60000): boolean {
    const now = Date.now();
    const recentSubmissions = this.events.filter(event => 
      event.type === 'form_submission' && 
      event.details.identifier === identifier &&
      now - event.timestamp < timeframeMs
    );
    
    // Se houver mais de 5 submissões recentes do mesmo identificador, considera suspeito
    if (recentSubmissions.length > 5) {
      this.logEvent('rate_limit_exceeded', { 
        identifier, 
        count: recentSubmissions.length,
        timeframe: timeframeMs
      }, 'medium');
      return true;
    }
    
    return false;
  }
  
  /**
   * Verifica se parece uma tentativa de depuração ou manipulação
   */
  public detectDebuggingAttempt(): boolean {
    // Verifica se as ferramentas de desenvolvedor estão abertas
    const devToolsOpen = 
      window.outerHeight - window.innerHeight > 200 || 
      window.outerWidth - window.innerWidth > 200;
    
    if (devToolsOpen) {
      this.logEvent('debugging_attempt', { 
        reason: 'size_difference' 
      }, 'low');
      return true;
    }
    
    return false;
  }
  
  /**
   * Retorna eventos de segurança recentes por tipo
   */
  public getRecentEvents(type?: SecurityEventType, count: number = 10): SecurityEvent[] {
    let events = this.events;
    
    if (type) {
      events = events.filter(event => event.type === type);
    }
    
    return events
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }
}

// Instância global do monitor de segurança
export const securityMonitor = new SecurityMonitoring();