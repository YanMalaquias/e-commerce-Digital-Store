/**
 * CartContext - Contexto do Carrinho de Compras
 * Gerencia o estado do carrinho com persistência no localStorage
 * Equivalente ao CartContext do projeto React
 */
import Storage from '../core/Storage.js';
import eventBus from '../core/EventBus.js';


// Chave do localStorage para o carrinho
const CART_STORAGE_KEY = 'digital-store-cart';

// Estado inicial do carrinho
let cartState = {
    items: Storage.get(CART_STORAGE_KEY, []),
    totalItems: 0,
    totalPrice: 0
};

// Listeners para notificar mudanças no carrinho
const listeners = [];

/**
 * Calcula o total de itens e preço total
 */
function calculateTotals() {
    cartState.totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    cartState.totalPrice = cartState.items.reduce((sum, item) => {
        const price = item.priceDiscount || item.price;
        return sum + (price * item.quantity);
    }, 0);
}

/**
 * Notifica todos os listeners sobre mudanças no carrinho
 */
function notifyListeners() {
    listeners.forEach(listener => listener({ ...cartState }));
    // Emite evento global
    eventBus.emit('cart:changed', { ...cartState });
}

/**
 * Atualiza o carrinho no localStorage
 */
function persistCart() {
    Storage.set(CART_STORAGE_KEY, cartState.items);
}

/**
 * Inicializa o contexto do carrinho
 */
function initCart() {
    calculateTotals();
}

/**
 * Adiciona um item ao carrinho
 * Se o item já existir (mesmo id, tamanho e cor), incrementa a quantidade
 * @param {Object} item - Item a ser adicionado (sem quantity)
 */
function addItem(item) {
    const existing = cartState.items.find(i => 
        i.id === item.id && 
        i.selectedSize === item.selectedSize && 
        i.selectedColor === item.selectedColor
    );

    if (existing) {
        existing.quantity += 1;
    } else {
        cartState.items.push({ ...item, quantity: 1 });
    }

    calculateTotals();
    persistCart();
    notifyListeners();
}

/**
 * Remove um item do carrinho pelo id
 * @param {number} id - ID do item a ser removido
 */
function removeItem(id) {
    cartState.items = cartState.items.filter(item => item.id !== id);
    calculateTotals();
    persistCart();
    notifyListeners();
}

/**
 * Atualiza a quantidade de um item
 * @param {number} id - ID do item
 * @param {number} quantity - Nova quantidade
 */
function updateQuantity(id, quantity) {
    if (quantity <= 0) {
        removeItem(id);
        return;
    }
    // Verifica se o item existe antes de atualizar
    const item = cartState.items.find(item => item.id === id);
    if (item) {
        item.quantity = quantity;
        calculateTotals();
        persistCart();
        notifyListeners();
    }
}

/**
 * Limpa o carrinho completamente
 */
function clearCart() {
    cartState.items = [];
    calculateTotals();
    persistCart();
    notifyListeners();
}

/**
 * Registra um listener para mudanças no carrinho
 * @param {Function} listener - Função a ser chamada quando o carrinho mudar
 * @returns {Function} Função para remover o listener
 */
function subscribe(listener) {
    listeners.push(listener);
    listener({ ...cartState }); // Chama imediatamente com o estado atual

    // Retorna função para remover o listener
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
}

/**
 * Obtém o estado atual do carrinho
 * @returns {Object} Estado atual do carrinho
 */
function getCartState() {
    return { ...cartState };
}

/**
 * Alias para getCartState() - compatibilidade com cartPage.js
 * @returns {Object} Estado atual do carrinho
 */
function getCart() {
    return getCartState();
}

// Inicializa o carrinho
initCart();

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