import Storage from '../core/Storage.js';
import {
    calculateCartTotals,
    getCartItemKey,
    normalizeCartItem
} from './cartService.js';

const CHECKOUT_SESSION_KEY = 'digital-store-checkout-session';

export const PAYMENT_METHODS = {
    CARD: 'card',
    PIX: 'pix',
    BOLETO: 'boleto'
};

/**
 * Retorna os métodos de pagamento suportados.
 * @returns {Array<{id: string, label: string}>}
 */
export function getPaymentMethods() {
    return [
        { id: PAYMENT_METHODS.CARD, label: 'Cartão de Crédito' },
        { id: PAYMENT_METHODS.PIX, label: 'Pix' },
        { id: PAYMENT_METHODS.BOLETO, label: 'Boleto' }
    ];
}

/**
 * Retorna uma sessão de checkout persistida.
 * @returns {Object|null}
 */
export function getCheckoutSession() {
    return Storage.get(CHECKOUT_SESSION_KEY, null);
}

/**
 * Salva a sessão atual de checkout.
 * @param {Object} session
 * @returns {boolean}
 */
export function saveCheckoutSession(session) {
    return Storage.set(CHECKOUT_SESSION_KEY, session);
}

/**
 * Remove a sessão atual de checkout.
 * @returns {boolean}
 */
export function clearCheckoutSession() {
    return Storage.remove(CHECKOUT_SESSION_KEY);
}

/**
 * Filtra os itens do carrinho pelos ids chaves selecionados.
 * @param {Array} items
 * @param {Array<string>} selectedKeys
 * @returns {Array}
 */
export function getSelectedCartItems(items = [], selectedKeys = []) {
    const keySet = new Set(selectedKeys);
    return items.filter(item => keySet.has(getCartItemKey(item)));
}

/**
 * Normaliza uma lista de itens do checkout.
 * @param {Array} items
 * @returns {Array}
 */
export function normalizeCheckoutItems(items = []) {
    return items.map(item => normalizeCartItem(item));
}

/**
 * Calcula o resumo financeiro do checkout.
 * @param {Array} items
 * @returns {{ totalItems: number, totalPrice: number }}
 */
export function calculateCheckoutTotals(items = []) {
    return calculateCartTotals(normalizeCheckoutItems(items));
}

/**
 * Prepara os dados de uma sessão de checkout.
 * @param {Object} params
 * @param {Array} params.selectedItems
 * @param {Object} params.profile
 * @returns {Object}
 */
export function createCheckoutSession({ selectedItems = [], profile = {} } = {}) {
    const items = normalizeCheckoutItems(selectedItems);
    const totals = calculateCheckoutTotals(items);

    return {
        id: `CHK-${Date.now()}`,
        createdAt: new Date().toISOString(),
        items,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice,
        profile
    };
}

/**
 * Verifica se os dados mínimos do perfil existem para finalizar a compra.
 * @param {Object} profile
 * @returns {{ valid: boolean, missingFields: Array<string> }}
 */
export function validateCheckoutProfile(profile = {}) {
    const missingFields = [];

    if (!profile.firstname) missingFields.push('firstname');
    if (!profile.email) missingFields.push('email');

    const address = profile.address || {};
    if (!address.street) missingFields.push('address.street');
    if (!address.number) missingFields.push('address.number');
    if (!address.city) missingFields.push('address.city');
    if (!address.state) missingFields.push('address.state');
    if (!address.zipCode) missingFields.push('address.zipCode');

    return {
        valid: missingFields.length === 0,
        missingFields
    };
}

/**
 * Valida os campos específicos do método de pagamento.
 * @param {string} method
 * @param {Object} data
 * @returns {{ valid: boolean, missingFields: Array<string> }}
 */
export function validatePaymentData(method, data = {}) {
    const missingFields = [];

    if (method === PAYMENT_METHODS.CARD) {
        if (!data.cardName) missingFields.push('cardName');
        if (!data.cardNumber) missingFields.push('cardNumber');
        if (!data.cardExpiry) missingFields.push('cardExpiry');
        if (!data.cardCvv) missingFields.push('cardCvv');
    }

    if (method === PAYMENT_METHODS.PIX) {
        if (!data.pixKey) missingFields.push('pixKey');
    }

    if (method === PAYMENT_METHODS.BOLETO) {
        if (!data.boletoCpf) missingFields.push('boletoCpf');
    }

    return {
        valid: missingFields.length === 0,
        missingFields
    };
}

/**
 * Cria um pedido finalizado com status "Processando".
 * @param {Object} params
 * @param {Array} params.items
 * @param {Object} params.profile
 * @param {string} params.paymentMethod
 * @param {Object} params.paymentData
 * @returns {Object}
 */
export function createOrder({
    items = [],
    profile = {},
    paymentMethod = PAYMENT_METHODS.CARD,
    paymentData = {}
} = {}) {
    const normalizedItems = normalizeCheckoutItems(items);
    const totals = calculateCheckoutTotals(normalizedItems);

    return {
        id: `PED-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'Processando',
        paymentMethod,
        paymentData,
        profile,
        shippingAddress: profile.address || {},
        items: normalizedItems,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice
    };
}

/**
 * Monta os dados públicos do resumo do checkout.
 * @param {Object} session
 * @returns {{ items: Array, totalItems: number, totalPrice: number, profile: Object }}
 */
export function getCheckoutSummary(session = {}) {
    const items = normalizeCheckoutItems(session.items || []);
    const totals = calculateCheckoutTotals(items);

    return {
        items,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice,
        profile: session.profile || {}
    };
}
