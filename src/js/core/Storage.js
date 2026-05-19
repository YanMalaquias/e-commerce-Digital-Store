/**
 * Storage - Abstração do localStorage
 * Fornece métodos seguros para ler e escrever dados no localStorage
 * com tratamento de erros e serialização automática
 */
class Storage {
    /**
     * Salva dados no localStorage
     * @param {string} key - Chave para identificar os dados
     * @param {*} value - Valor a ser salvo (será serializado como JSON)
     * @returns {boolean} Sucesso da operação
     */
    static set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error(`Erro ao salvar no localStorage (chave: ${key}):`, error);
            return false;
        }
    }

    /**
     * Recupera dados do localStorage
     * @param {string} key - Chave dos dados a serem recuperados
     * @param {*} defaultValue - Valor padrão caso a chave não exista
     * @returns {*} Dados recuperados ou valor padrão
     */
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            return JSON.parse(item);
        } catch (error) {
            console.error(`Erro ao ler do localStorage (chave: ${key}):`, error);
            return defaultValue;
        }
    }

    /**
     * Remove dados do localStorage
     * @param {string} key - Chave dos dados a serem removidos
     * @returns {boolean} Sucesso da operação
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Erro ao remover do localStorage (chave: ${key}):`, error);
            return false;
        }
    }

    /**
     * Limpa todos os dados do localStorage
     * @returns {boolean} Sucesso da operação
     */
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }

    /**
     * Verifica se uma chave existe no localStorage
     * @param {string} key - Chave a ser verificada
     * @returns {boolean} True se a chave existe
     */
    static has(key) {
        return localStorage.getItem(key) !== null;
    }
}

export default Storage;
