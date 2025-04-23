<?php
/**
 * Classe para armazenamento em memória
 * Equivalente ao MemStorage do arquivo storage.ts
 */
class Storage {
    private $users = [];
    private $currentId = 1;

    /**
     * Obtém um usuário pelo ID
     * 
     * @param int $id ID do usuário
     * @return array|null Dados do usuário ou null se não encontrado
     */
    public function getUser($id) {
        return isset($this->users[$id]) ? $this->users[$id] : null;
    }

    /**
     * Obtém um usuário pelo nome de usuário
     * 
     * @param string $username Nome de usuário
     * @return array|null Dados do usuário ou null se não encontrado
     */
    public function getUserByUsername($username) {
        foreach ($this->users as $user) {
            if ($user['username'] === $username) {
                return $user;
            }
        }
        return null;
    }

    /**
     * Cria um novo usuário
     * 
     * @param array $userData Dados do usuário a ser criado
     * @return array Dados do usuário com o ID atribuído
     */
    public function createUser($userData) {
        $id = $this->currentId++;
        $user = array_merge(['id' => $id], $userData);
        $this->users[$id] = $user;
        return $user;
    }
}

// Criar a instância global de armazenamento
$storage = new Storage();