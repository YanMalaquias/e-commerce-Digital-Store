/**
 * CartContext - Contexto do Carrinho de Compras
 * Gerencia o estado do carrinho com persistência no localStorage
 * Equivalente ao CartContext do projeto React
 */
import eventBus from '../core/EventBus.js';
import {
    addItemToCart,
    clearCartItems,
    getCartState as readCartState,
    removeItemFromCart,
    updateCartItemQuantity
} from '../utils/cartService.js';

// Listeners para notificar mudanças no carrinho
const listeners = [];

/**
 * Notifica todos os listeners sobre mudanças no carrinho
 * @param {Object} state
 */
function notifyListeners(state) {
    const snapshot = { ...state };
    listeners.forEach(listener => listener(snapshot));
    eventBus.publish('cart:changed', snapshot);
}

/**
 * Obtém o estado atual do carrinho
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
function getCartState() {
    return readCartState();
}

/**
 * Alias para getCartState() - compatibilidade com código existente
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
function getCart() {
    return getCartState();
}

/**
 * Adiciona um item ao carrinho
 * @param {Object} item
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
function addItem(item) {
    const state = addItemToCart(item);
    notifyListeners(state);
    return state;
}

/**
 * Remove um item do carrinho pelo id
 * @param {string|number} id
 * @param {{ selectedSize?: string|null, selectedColor?: string|null }} [options]
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
function removeItem(id, options = {}) {
    const state = removeItemFromCart(id, options);
    notifyListeners(state);
    return state;
}

/**
 * Atualiza a quantidade de um item
 * @param {string|number} id
 * @param {number} quantity
 * @param {{ selectedSize?: string|null, selectedColor?: string|null }} [options]
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
function updateQuantity(id, quantity, options = {}) {
    const state = updateCartItemQuantity(id, quantity, options);
    notifyListeners(state);
    return state;
}

/**
 * Limpa o carrinho completamente
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
function clearCart() {
    const state = clearCartItems() ? { items: [], totalItems: 0, totalPrice: 0 } : getCartState();
    notifyListeners(state);
    return state;
}

/**
 * Registra um listener para mudanças no carrinho
 * @param {Function} listener - Função a ser chamada quando o carrinho mudar
 * @returns {Function} Função para remover o listener
 */
function subscribe(listener) {
    listeners.push(listener);
    listener(getCartState());

    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
}

// Exporta a API do contexto do carrinho
const CartContext = {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subscribe,
    getCartState,
    getCart
};

export default CartContext;
