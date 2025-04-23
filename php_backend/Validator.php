<?php
/**
 * Classe para validação dos dados de entrada
 * Implementa validações similares às realizadas pelo Zod no Node.js
 */
class Validator {
    /**
     * Valida os dados básicos de um cálculo de financiamento
     * 
     * @param array $data Dados a serem validados
     * @return array Dados validados ou exceção em caso de erro
     * @throws Exception
     */
    public static function validarCalculadora($data) {
        $errors = [];
        
        if (!isset($data['valorFinanciado']) || !is_numeric($data['valorFinanciado']) || $data['valorFinanciado'] <= 0) {
            $errors[] = "O valor financiado deve ser positivo";
        }
        
        if (!isset($data['taxaJuros']) || !is_numeric($data['taxaJuros']) || $data['taxaJuros'] <= 0) {
            $errors[] = "A taxa de juros deve ser positiva";
        }
        
        if (!isset($data['numParcelas']) || !is_numeric($data['numParcelas']) || $data['numParcelas'] <= 0 || !is_int((int)$data['numParcelas'])) {
            $errors[] = "O número de parcelas deve ser um inteiro positivo";
        }
        
        if (!empty($errors)) {
            throw new Exception(json_encode(['errors' => $errors]));
        }
        
        // Retorna os dados convertidos para tipos numéricos
        return [
            'valorFinanciado' => (float)$data['valorFinanciado'],
            'taxaJuros' => (float)$data['taxaJuros'],
            'numParcelas' => (int)$data['numParcelas']
        ];
    }
    
    /**
     * Valida os dados para financiamento imobiliário com sistema
     * 
     * @param array $data Dados a serem validados
     * @return array Dados validados ou exceção em caso de erro
     * @throws Exception
     */
    public static function validarImobiliario($data) {
        // Primeiro valida os campos básicos
        $validatedData = self::validarCalculadora($data);
        
        // Adiciona validação para o sistema de amortização
        if (!isset($data['sistema']) || !in_array($data['sistema'], ['price', 'sac'])) {
            throw new Exception(json_encode([
                'errors' => ["O sistema de amortização deve ser 'price' ou 'sac'"]
            ]));
        }
        
        $validatedData['sistema'] = $data['sistema'];
        return $validatedData;
    }
    
    /**
     * Valida os dados para crédito consignado
     * 
     * @param array $data Dados a serem validados
     * @return array Dados validados ou exceção em caso de erro
     * @throws Exception
     */
    public static function validarConsignado($data) {
        // Primeiro valida os campos básicos
        $validatedData = self::validarCalculadora($data);
        
        // Adiciona validação para o tipo de consignado
        if (!isset($data['tipoConsignado']) || !in_array($data['tipoConsignado'], ['inss', 'servidor', 'militar'])) {
            throw new Exception(json_encode([
                'errors' => ["O tipo de consignado deve ser 'inss', 'servidor' ou 'militar'"]
            ]));
        }
        
        $validatedData['tipoConsignado'] = $data['tipoConsignado'];
        return $validatedData;
    }
}