// cartService.js
import Storage from '../core/Storage.js';

const CART_STORAGE_KEY = 'digital-store-cart';

/**
 * Seletores padrão para extrair dados de um card de produto.
 * Você pode sobrescrever qualquer item desses seletores no momento da integração.
 */
export const DEFAULT_CART_SELECTORS = {
    card: '.product-card, .featured-item, .div-products-line-item, .product-info',
    id: '[data-product-id], [data-id]',
    name: '.product-name, .featured-title, .products-p2, h1, h2, h3',
    price: '.discounted-price, .products-p4, .price, .product-price',
    image: '.product-image img, .featured-image, .products-img, .main-image img, img',
    quantity: '[data-quantity]'
};

/**
 * Converte valores monetários em número.
 * Aceita strings como "R$ 219,00", "$100", "219.00" etc.
 * @param {string|number} value
 * @returns {number}
 */
function parsePrice(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (!value) return 0;

    const normalized = String(value)
        .replace(/\s/g, '')
        .replace(/[^\d,.-]/g, '')
        .replace(/\.(?=.*\.)/g, '')
        .replace(',', '.');

    const price = Number.parseFloat(normalized);
    return Number.isFinite(price) ? price : 0;
}

/**
 * Garante a estrutura mínima de um item do carrinho.
 * @param {Object} item
 * @returns {Object}
 */
export function normalizeCartItem(item = {}) {
    return {
        id: String(item.id ?? ''),
        name: String(item.name ?? '').trim(),
        price: parsePrice(item.price),
        image: String(item.image ?? '').trim(),
        quantity: Math.max(1, Number(item.quantity ?? 1) || 1),
        selectedSize: item.selectedSize ?? null,
        selectedColor: item.selectedColor ?? null
    };
}

/**
 * Gera uma chave única para o item considerando variações.
 * Isso evita misturar o mesmo produto com tamanhos/cores diferentes.
 * @param {Object} item
 * @returns {string}
 */
export function getCartItemKey(item) {
    const normalized = normalizeCartItem(item);
    return [
        normalized.id,
        normalized.selectedSize || 'no-size',
        normalized.selectedColor || 'no-color'
    ].join('::');
}

/**
 * Retorna todos os itens do carrinho.
 * @returns {Array}
 */
export function getCartItems() {
    return Storage.get(CART_STORAGE_KEY, []);
}

/**
 * Persiste o carrinho no LocalStorage.
 * @param {Array} items
 * @returns {boolean}
 */
export function setCartItems(items) {
    return Storage.set(CART_STORAGE_KEY, items);
}

/**
 * Remove completamente o carrinho.
 * @returns {boolean}
 */
export function clearCartItems() {
    return Storage.remove(CART_STORAGE_KEY);
}

/**
 * Calcula totais do carrinho.
 * @param {Array} items
 * @returns {{ totalItems: number, totalPrice: number }}
 */
export function calculateCartTotals(items = []) {
    return items.reduce((acc, item) => {
        const quantity = Math.max(1, Number(item.quantity ?? 1) || 1);
        const price = parsePrice(item.price);
        acc.totalItems += quantity;
        acc.totalPrice += price * quantity;
        return acc;
    }, { totalItems: 0, totalPrice: 0 });
}

/**
 * Retorna o estado completo do carrinho já pronto para uso em tela.
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
export function getCartState() {
    const items = getCartItems();
    const totals = calculateCartTotals(items);

    return {
        items,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice
    };
}

/**
 * Adiciona um item ao carrinho.
 * Se o item já existir com a mesma variação, soma a quantidade.
 * @param {Object} item
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
export function addItemToCart(item) {
    const normalized = normalizeCartItem(item);

    if (!normalized.id || !normalized.name) {
        console.warn('Item inválido enviado para o carrinho:', item);
        return getCartState();
    }

    const items = getCartItems();
    const itemKey = getCartItemKey(normalized);
    const existingIndex = items.findIndex(current => getCartItemKey(current) === itemKey);

    if (existingIndex >= 0) {
        items[existingIndex].quantity = Math.max(
            1,
            Number(items[existingIndex].quantity ?? 1) + normalized.quantity
        );
    } else {
        items.push(normalized);
    }

    setCartItems(items);
    return getCartState();
}

/**
 * Remove um item do carrinho.
 * Se receber variações, remove apenas o item exato.
 * Se não receber variações, remove todos os itens com o mesmo id.
 * @param {string|number} id
 * @param {{ selectedSize?: string|null, selectedColor?: string|null }} [options]
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
export function removeItemFromCart(id, options = {}) {
    const items = getCartItems();
    const hasVariantFilter = options.selectedSize !== undefined || options.selectedColor !== undefined;

    const nextItems = items.filter(item => {
        if (String(item.id) !== String(id)) return true;
        if (!hasVariantFilter) return false;

        const sameSize = (options.selectedSize ?? null) === (item.selectedSize ?? null);
        const sameColor = (options.selectedColor ?? null) === (item.selectedColor ?? null);
        return !(sameSize && sameColor);
    });

    setCartItems(nextItems);
    return getCartState();
}

/**
 * Atualiza a quantidade de um item específico.
 * Se quantity for 0 ou menor, remove o item.
 * @param {string|number} id
 * @param {number} quantity
 * @param {{ selectedSize?: string|null, selectedColor?: string|null }} [options]
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
export function updateCartItemQuantity(id, quantity, options = {}) {
    const safeQuantity = Number(quantity);

    if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) {
        return removeItemFromCart(id, options);
    }

    const items = getCartItems();
    const nextItems = items.map(item => {
        const sameId = String(item.id) === String(id);
        const sameSize = options.selectedSize === undefined || (options.selectedSize ?? null) === (item.selectedSize ?? null);
        const sameColor = options.selectedColor === undefined || (options.selectedColor ?? null) === (item.selectedColor ?? null);

        if (sameId && sameSize && sameColor) {
            return { ...item, quantity: safeQuantity };
        }

        return item;
    });

    setCartItems(nextItems);
    return getCartState();
}

/**
 * Procura elementos dentro de um container usando o primeiro seletor válido.
 * @param {Element} container
 * @param {string|string[]} selectors
 * @returns {Element|null}
 */
function findElement(container, selectors) {
    const list = Array.isArray(selectors) ? selectors : String(selectors).split(',');
    for (const selector of list) {
        const trimmed = selector.trim();
        if (!trimmed) continue;
        const element = container.querySelector(trimmed);
        if (element) return element;
    }
    return null;
}

/**
 * Extrai dados de produto a partir do DOM.
 * Não depende de um HTML fixo: basta informar seletor do card e,
 * se necessário, sobrescrever os seletores dos campos.
 * @param {Element} sourceElement
 * @param {Object} [selectors]
 * @returns {Object|null}
 */
export function extractCartItemFromElement(sourceElement, selectors = {}) {
    if (!sourceElement) return null;

    const config = { ...DEFAULT_CART_SELECTORS, ...selectors };
    const card = sourceElement.matches?.(config.card)
        ? sourceElement
        : sourceElement.closest?.(config.card) || sourceElement;

    if (!card) return null;

    const idElement = findElement(card, config.id);
    const nameElement = findElement(card, config.name);
    const priceElement = findElement(card, config.price);
    const imageElement = findElement(card, config.image);
    const quantityElement = findElement(card, config.quantity);

    const rawName = nameElement?.textContent?.trim() || '';
    const rawPrice = priceElement?.childNodes?.[0]?.textContent?.trim()
        || priceElement?.textContent?.trim()
        || '';
    const rawImage = imageElement?.getAttribute('src') || imageElement?.src || '';

    return normalizeCartItem({
        id: idElement?.dataset?.productId
            || idElement?.dataset?.id
            || card.dataset?.productId
            || card.dataset?.id
            || rawName.toLowerCase().replace(/\s+/g, '-'),
        name: rawName,
        price: parsePrice(rawPrice),
        image: rawImage,
        quantity: Number(quantityElement?.dataset?.quantity ?? 1) || 1,
        selectedSize: card.dataset?.selectedSize ?? null,
        selectedColor: card.dataset?.selectedColor ?? null
    });
}

/**
 * Atalho para adicionar ao carrinho direto a partir de um elemento do DOM.
 * @param {Element} sourceElement
 * @param {Object} [selectors]
 * @returns {{ items: Array, totalItems: number, totalPrice: number }}
 */
export function addElementToCart(sourceElement, selectors = {}) {
    const item = extractCartItemFromElement(sourceElement, selectors);
    if (!item) return getCartState();
    return addItemToCart(item);
}
