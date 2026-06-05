// userService.js
import Storage from '../core/Storage.js';
// Chaves legadas para compatibilidade com versões anteriores do aplicativo
const LEGACY_USER_PROFILE_KEY = 'digital-store-user-profile';
const LEGACY_USER_ORDERS_KEY = 'digital-store-user-orders';

/**
 * Estrutura padrão do perfil do usuário.
 * @returns {Object}
 */
export function getDefaultUserProfile() {
    return {
        firstname: '',
        surname: '',
        phone: '',
        email: '',
        address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: ''
        }
    };
}

/**
 * Lê a sessão autenticada atual para derivar a chave do usuário.
 * @returns {Object|null}
 */
function getCurrentAuthSession() {
    return Storage.get('auth_session', null);
}

/**
 * Normaliza um identificador de chave para uso no Storage.
 * @param {string} value
 * @returns {string}
 */
function normalizeStorageSuffix(value) {
    return String(value || 'guest')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'guest';
}

/**
 * Gera as chaves do Storage para o usuário atual.
 * @returns {{ profileKey: string, ordersKey: string, legacyProfileKey: string, legacyOrdersKey: string }}
 */
function getUserStorageKeys() {
    const session = getCurrentAuthSession();
    const user = session?.user || {};
    const suffix = normalizeStorageSuffix(user.email || user.id || 'guest');

    return {
        profileKey: `digital-store-user-profile:${suffix}`,
        ordersKey: `digital-store-user-orders:${suffix}`,
        legacyProfileKey: LEGACY_USER_PROFILE_KEY,
        legacyOrdersKey: LEGACY_USER_ORDERS_KEY
    };
}

/**
 * Retorna o perfil salvo no LocalStorage.
 * Se não houver dados, retorna a estrutura padrão.
 * @returns {Object}
 */
export function getUserProfile() {
    const keys = getUserStorageKeys();
    const profile = Storage.get(keys.profileKey, null) || Storage.get(keys.legacyProfileKey, null);
    if (!profile) return getDefaultUserProfile();

    const normalized = {
        ...getDefaultUserProfile(),
        ...profile,
        address: {
            ...getDefaultUserProfile().address,
            ...(profile.address || {})
        }
    };

    if (!Storage.has(keys.profileKey) && Storage.has(keys.legacyProfileKey)) {
        Storage.set(keys.profileKey, normalized);
    }

    return normalized;
}

/**
 * Salva o perfil do usuário no LocalStorage.
 * @param {Object} profile
 * @returns {boolean}
 */
export function saveUserProfile(profile) {
    const keys = getUserStorageKeys();
    const current = getDefaultUserProfile();

    const normalized = {
        ...current,
        ...profile,
        address: {
            ...current.address,
            ...(profile?.address || {})
        }
    };

    const saved = Storage.set(keys.profileKey, normalized);
    Storage.set(keys.legacyProfileKey, normalized);
    return saved;
}

/**
 * Atualiza parcialmente o perfil do usuário.
 * @param {Object} partialProfile
 * @returns {Object}
 */
export function updateUserProfile(partialProfile) {
    const current = getUserProfile();
    const next = {
        ...current,
        ...partialProfile,
        address: {
            ...current.address,
            ...(partialProfile?.address || {})
        }
    };

    saveUserProfile(next);
    return next;
}

/**
 * Retorna a lista de pedidos do usuário.
 * @returns {Array}
 */
export function getUserOrders() {
    const keys = getUserStorageKeys();
    const orders = Storage.get(keys.ordersKey, null) || Storage.get(keys.legacyOrdersKey, []);

    if (!Storage.has(keys.ordersKey) && Storage.has(keys.legacyOrdersKey)) {
        Storage.set(keys.ordersKey, orders);
    }

    return Array.isArray(orders) ? orders : [];
}

/**
 * Salva a lista de pedidos do usuário.
 * @param {Array} orders
 * @returns {boolean}
 */
export function saveUserOrders(orders) {
    const keys = getUserStorageKeys();
    const normalizedOrders = Array.isArray(orders) ? orders : [];
    const saved = Storage.set(keys.ordersKey, normalizedOrders);
    Storage.set(keys.legacyOrdersKey, normalizedOrders);
    return saved;
}

/**
 * Adiciona um pedido ao histórico do usuário.
 * @param {Object} order
 * @returns {Object}
 */
export function addUserOrder(order) {
    const orders = getUserOrders();
    const nextOrders = [order, ...orders];
    saveUserOrders(nextOrders);
    return order;
}

/**
 * Formata endereço completo para exibição.
 * @param {Object} profile
 * @returns {string}
 */
export function formatFullAddress(profile) {
    const address = profile?.address || {};
    const parts = [
        address.street,
        address.number,
        address.complement,
        address.neighborhood,
        address.city,
        address.state,
        address.zipCode
    ].filter(Boolean);

    return parts.join(', ');
}

/**
 * Cria uma versão simplificada do endereço para checkout.
 * @param {Object} profile
 * @returns {string}
 */
export function getCheckoutAddress(profile) {
    const formatted = formatFullAddress(profile);
    if (formatted) return formatted;

    return 'Endereço não cadastrado';
}

/**
 * Retorna um perfil com os dados públicos do usuário autenticado.
 * @param {Object} authUser
 * @returns {Object}
 */
export function getProfileFromAuthUser(authUser = {}) {
    return {
        firstname: authUser.firstname || '',
        surname: authUser.surname || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        address: authUser.address || getDefaultUserProfile().address
    };
}
