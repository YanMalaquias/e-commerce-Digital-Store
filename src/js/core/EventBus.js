/**
 * EventBus - Sistema de eventos para comunicação entre componentes
 * Permite que componentes se comuniquem sem acoplamento direto
 * Padrão Observer/Publisher-Subscriber
 */
class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * Registra um listener para um evento
     * @param {string} event - Nome do evento
     * @param {Function} callback - Função a ser executada quando o evento ocorrer
     * @returns {Function} Função para remover o listener
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);

        // Retorna função para remover o listener
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        };
    }

    /**
     * Remove um listener específico de um evento
     * @param {string} event - Nome do evento
     * @param {Function} callback - Função a ser removida
     */
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    /**
     * Emite um evento, executando todos os listeners registrados
     * @param {string} event - Nome do evento
     * @param {*} data - Dados a serem passados para os listeners
     */
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }

    /**
     * Remove todos os listeners de um evento específico
     * @param {string} event - Nome do evento
     */
    clear(event) {
        if (event) {
            this.events[event] = [];
        } else {
            this.events = {};
        }
    }

    /**
     * Alias para o método on - para compatibilidade com código existente
     * @param {string} event - Nome do evento
     * @param {Function} callback - Função a ser executada
     */
    subscribe(event, callback) {
        return this.on(event, callback);
    }

    /**
     * Alias para o método emit - para compatibilidade com código existente
     * @param {string} event - Nome do evento
     * @param {*} data - Dados a serem passados
     */
    publish(event, data) {
        this.emit(event, data);
    }
}

// Exporta uma instância única do EventBus (Singleton)
export const eventBus = new EventBus();
export default eventBus;
