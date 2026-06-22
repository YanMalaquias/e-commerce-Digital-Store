// Página: Carrinho de Compras (Cart Page)
// Script que renderiza a página do carrinho com itens e resumo
// Este script é carregado especificamente na página cart.html
import CartContext from '../contexts/CartContext.js';
import AuthContext from '../contexts/AuthContext.js';
import { URLS } from '../config/urls.js';
import { createCheckoutSession, saveCheckoutSession, getPaymentMethods, validatePaymentData, PAYMENT_METHODS, createOrder } from '../utils/checkoutService.js';
import { getUserProfile, addUserOrder } from '../utils/userService.js';
import { getCartItems, setCartItems } from '../utils/cartService.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 'CART'; // Passos possíveis: CART, CHECKOUT
    let selectedItemIds = new Set();
    let currentPaymentMethod = PAYMENT_METHODS.CARD;

    // Renderiza a visualização principal baseada no passo
    function renderView() {
        const container = document.querySelector('.cart-page-container');
        if (!container) return;

        if (currentStep === 'CART') {
            container.innerHTML = `
                <h2 style="margin-bottom: 30px;">Seu Carrinho</h2>
                <div style="display: flex; flex-direction: column; gap: 30px; width: 100%;">
                    <div style="margin-bottom: 10px;">
                        <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="select-all-items"> Selecionar Todos
                        </label>
                    </div>
                    <div style="display: flex; flex-direction: row; gap: 30px; align-items: flex-start; width: 100%; flex-wrap: wrap;">
                        <div id="cart-items-list" style="flex: 1; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); min-width: 300px;"></div>
                        <div id="cart-summary" style="width: 100%; max-width: 350px;"></div>
                    </div>
                </div>
            `;
            renderCartPage();
        } else if (currentStep === 'CHECKOUT') {
            container.innerHTML = `
                <h2 style="margin-bottom: 30px;">Checkout</h2>
                <div style="display: flex; flex-direction: row; gap: 30px; align-items: flex-start; width: 100%; flex-wrap: wrap;">
                    <div id="checkout-details" style="flex: 1; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); min-width: 300px;"></div>
                    <div id="checkout-summary" style="width: 100%; max-width: 350px;"></div>
                </div>
            `;
            renderCheckoutPage();
        }
    }

    // Função principal que renderiza a página do carrinho
    function renderCartPage() {
        const cartItemsList = document.getElementById('cart-items-list');
        const cartSummary = document.getElementById('cart-summary');
        
        if (!cartItemsList || !cartSummary) return;

        // Obter carrinho do CartContext
        const cartState = CartContext.getCartState();
        const cart = cartState.items;

        // Caso o carrinho esteja vazio
        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="empty-cart-message">
                    <p>Seu carrinho está vazio.</p>
                    <a href="${URLS.HOME}" class="btn-continue-shopping">Continuar Comprando</a>
                </div>
            `;
            cartSummary.innerHTML = '';
            document.getElementById('select-all-items').parentElement.style.display = 'none';
        } else {
            // Renderizar itens do carrinho
            const cartItemsHtml = cart.map((item, index) => {
                const uniqueId = item.id;
                const isSelected = selectedItemIds.has(uniqueId);
                return `
                <div class="cart-item" data-item-index="${index}" style="display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee;">
                    <input type="checkbox" class="item-checkbox" data-id="${uniqueId}" ${isSelected ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: contain; border-radius: 8px; background: #f5f5f5;" />
                    <div class="cart-item-details" style="flex: 1;">
                        <h3 style="margin: 0 0 5px 0; font-size: 16px;">${item.name}</h3>
                        <p style="margin: 0; color: #666; font-size: 14px;">Preço: R$ ${item.price.toFixed(2)}</p>
                        
                        <div style="display: flex; gap: 20px; margin-top: 10px; flex-wrap: wrap;">
                            <div>
                                <span style="font-size: 12px; color: #666; font-weight: bold;">Tamanho:</span>
                                <div class="variant-sizes" data-index="${index}" style="display: flex; gap: 5px; margin-top: 5px;">
                                    ${[39, 40, 41, 42, 43].map(s => `<button class="size-btn" data-val="${s}" style="padding: 2px 8px; border: 1px solid ${item.selectedSize == s ? '#c92071' : '#ddd'}; background: ${item.selectedSize == s ? '#fff0f5' : '#fff'}; color: ${item.selectedSize == s ? '#c92071' : '#333'}; border-radius: 4px; cursor: pointer; font-size: 12px; transition: 0.2s;">${s}</button>`).join('')}
                                </div>
                            </div>
                            <div>
                                <span style="font-size: 12px; color: #666; font-weight: bold;">Cor:</span>
                                <div class="variant-colors" data-index="${index}" style="display: flex; gap: 5px; margin-top: 5px;">
                                    ${['Azul', 'Vermelho', 'Cinza', 'Roxo'].map(c => `<button class="color-btn" data-val="${c}" style="padding: 2px 8px; border: 1px solid ${item.selectedColor == c ? '#c92071' : '#ddd'}; background: ${item.selectedColor == c ? '#fff0f5' : '#fff'}; color: ${item.selectedColor == c ? '#c92071' : '#333'}; border-radius: 4px; cursor: pointer; font-size: 12px; transition: 0.2s;">${c}</button>`).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="quantity-controls" style="margin-top: 15px;">
                            <button class="btn-quantity" data-action="decrease" data-id="${item.id}" style="padding: 2px 8px; border: 1px solid #ddd; background: #fff; cursor: pointer;">-</button>
                            <span style="margin: 0 10px;">${item.quantity}</span>
                            <button class="btn-quantity" data-action="increase" data-id="${item.id}" style="padding: 2px 8px; border: 1px solid #ddd; background: #fff; cursor: pointer;">+</button>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0 0 10px 0; font-weight: bold;">R$ ${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="btn-remove-item" data-id="${item.id}" style="color: #c92071; background: none; border: none; cursor: pointer; text-decoration: underline;">Remover</button>
                    </div>
                </div>
            `}).join('');

            cartItemsList.innerHTML = cartItemsHtml;

            // Calcular total dos itens selecionados
            const selectedItems = cart.filter(item => selectedItemIds.has(item.id));
            const totalSelected = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalItemsSelected = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

            // Verifica se todos os itens selecionados possuem tamanho e cor
            const allSelectedItemsHaveVariants = selectedItems.every(item => item.selectedSize && item.selectedColor);
            const isCheckoutDisabled = selectedItems.length === 0 || !allSelectedItemsHaveVariants;

            // Renderizar resumo do carrinho
            cartSummary.innerHTML = `
                <div class="cart-summary-section">
                    <div class="cart-summary">
                        <h3>Resumo do Pedido</h3>
                        <div class="summary-row">
                            <span>Itens Selecionados:</span>
                            <span>${totalItemsSelected}</span>
                        </div>
                        <div class="summary-total">
                            <span>Total:</span>
                            <span>R$ ${totalSelected.toFixed(2)}</span>
                        </div>
                        <button class="btn-checkout" id="btn-proceed-checkout" ${isCheckoutDisabled ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Continuar</button>
                    </div>
                </div>
            `;

            attachCartEventListeners(cart);
        }
    }
// Função que renderiza a página de checkout com detalhes do pedido e opções de pagamento
    function renderCheckoutPage() {
        const checkoutDetails = document.getElementById('checkout-details');
        const checkoutSummary = document.getElementById('checkout-summary');
        
        const cartState = CartContext.getCartState();
        const selectedItems = cartState.items.filter(item => selectedItemIds.has(item.id));
        const totalSelected = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const profile = getUserProfile();
        const addressText = profile.address?.street ? 
            `${profile.address.street}, ${profile.address.number} - ${profile.address.city}/${profile.address.state}` : 
            'Endereço não cadastrado. Edite no seu perfil.';

        checkoutDetails.innerHTML = `
            <div style="margin-bottom: 30px;">
                <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">Endereço de Entrega</h3>
                <p style="color: #666; margin: 0;">${addressText}</p>
            </div>
            
            <div>
                <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">Forma de Pagamento</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    ${getPaymentMethods().map(m => `
                        <button class="payment-tab ${currentPaymentMethod === m.id ? 'active' : ''}" data-method="${m.id}" 
                            style="flex: 1; padding: 10px; border: 1px solid ${currentPaymentMethod === m.id ? '#c92071' : '#ddd'}; 
                            background: ${currentPaymentMethod === m.id ? '#fff0f5' : '#fff'}; 
                            color: ${currentPaymentMethod === m.id ? '#c92071' : '#333'}; 
                            border-radius: 4px; cursor: pointer; font-weight: bold;">
                            ${m.label}
                        </button>
                    `).join('')}
                </div>
                
                <div id="payment-fields" style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                    ${renderPaymentFields(currentPaymentMethod)}
                </div>
            </div>
        `;
// Renderiza o resumo do pedido no lado direito, mostrando os itens selecionados, total e botão para confirmar o pedido
        checkoutSummary.innerHTML = `
            <div class="cart-summary-section">
                <div class="cart-summary">
                    <h3>Resumo</h3>
                    <div style="max-height: 200px; overflow-y: auto; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                        ${selectedItems.map(item => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
                                <span style="color: #666;">${item.quantity}x ${item.name}</span>
                                <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <div style="font-size: 12px; color: #999; margin-top: -8px; margin-bottom: 10px;">
                                ${item.selectedSize ? `Tam: ${item.selectedSize}` : 'Tam: Padrão'} ${item.selectedColor ? ` | Cor: ${item.selectedColor}` : ' | Cor: Padrão'}
                            </div>
                        `).join('')}
                    </div>
                    <div class="summary-total">
                        <span>Total:</span>
                        <span>R$ ${totalSelected.toFixed(2)}</span>
                    </div>
                    <button class="btn-checkout" id="btn-confirm-order" style="width: 100%; margin-top: 20px;">Confirmar Pedido</button>
                    <button id="btn-back-to-cart" style="width: 100%; padding: 12px; background: none; border: 1px solid #ddd; border-radius: 8px; margin-top: 10px; cursor: pointer; color: #666;">Voltar ao Carrinho</button>
                </div>
            </div>
        `;

        attachCheckoutEventListeners();
    }
// Função que renderiza os campos de pagamento específicos com base na forma de pagamento selecionada
    function renderPaymentFields(method) {
        if (method === PAYMENT_METHODS.CARD) {
            return `
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="text" id="cardName" placeholder="Nome impresso no cartão" style="padding: 12px; border: 1px solid #ddd; border-radius: 4px; width: 100%;" required>
                    <input type="text" id="cardNumber" placeholder="Número do cartão" style="padding: 12px; border: 1px solid #ddd; border-radius: 4px; width: 100%;" required>
                    <div style="display: flex; gap: 15px;">
                        <input type="text" id="cardExpiry" placeholder="MM/AA" style="padding: 12px; border: 1px solid #ddd; border-radius: 4px; flex: 1;" required>
                        <input type="text" id="cardCvv" placeholder="CVV" style="padding: 12px; border: 1px solid #ddd; border-radius: 4px; flex: 1;" required>
                    </div>
                </div>
            `;
        } else if (method === PAYMENT_METHODS.PIX) {
            return `
                <div style="text-align: center;">
                    <p style="margin-bottom: 15px; color: #666;">Gere o código Pix ou escaneie o QR Code após a confirmação.</p>
                    <input type="hidden" id="pixKey" value="12345678909">
                </div>
            `;
        } else if (method === PAYMENT_METHODS.BOLETO) {
            return `
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <p style="margin-bottom: 5px; color: #666;">Informe seu CPF para emissão do boleto:</p>
                    <input type="text" id="boletoCpf" placeholder="000.000.000-00" style="padding: 12px; border: 1px solid #ddd; border-radius: 4px; width: 100%;" required>
                </div>
            `;
        }
        return '';
    }
// Função que anexa os event listeners aos elementos do carrinho, como checkboxes, botões de quantidade, remoção e seleção de variações
    function attachCartEventListeners(cart) {
        // Selecionar/Deselecionar Todos
        const selectAllCheckbox = document.getElementById('select-all-items');
        if (selectAllCheckbox) {
            // Verifica se todos estão selecionados inicialmente
            selectAllCheckbox.checked = cart.length > 0 && cart.every(item => selectedItemIds.has(item.id));
            
            selectAllCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    cart.forEach(item => selectedItemIds.add(item.id));
                } else {
                    selectedItemIds.clear();
                }
                renderCartPage();
            });
        }

        // Checkboxes Individuais
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                if (e.target.checked) {
                    selectedItemIds.add(id);
                } else {
                    selectedItemIds.delete(id);
                }
                renderCartPage();
            });
        });

        // Remover item
        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                CartContext.removeItem(id);
                selectedItemIds.delete(id);
                renderCartPage();
            });
        });

        // Botões de quantidade
        document.querySelectorAll('.btn-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.target.getAttribute('data-action');
                const id = e.target.getAttribute('data-id');
                const item = cart.find(i => String(i.id) === String(id));
                
                if (item) {
                    if (action === 'increase') {
                        CartContext.updateQuantity(id, item.quantity + 1);
                    } else if (action === 'decrease' && item.quantity > 1) {
                        CartContext.updateQuantity(id, item.quantity - 1);
                    }
                    renderCartPage();
                }
            });
        });

        // Seleção de Tamanho
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const index = e.target.closest('.variant-sizes').getAttribute('data-index');
                const val = e.target.getAttribute('data-val');
                const items = getCartItems();
                if (items[index]) {
                    items[index].selectedSize = val;
                    setCartItems(items);
                    renderCartPage();
                }
            });
        });

        // Seleção de Cor
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const index = e.target.closest('.variant-colors').getAttribute('data-index');
                const val = e.target.getAttribute('data-val');
                const items = getCartItems();
                if (items[index]) {
                    items[index].selectedColor = val;
                    setCartItems(items);
                    renderCartPage();
                }
            });
        });

        // Botão de Continuar (Ir para Checkout)
        const btnProceed = document.getElementById('btn-proceed-checkout');
        if (btnProceed) {
            btnProceed.addEventListener('click', () => {
                const authState = AuthContext.getAuthState();
                if (!authState.isAuthenticated) {
                    alert('Você precisa fazer login para continuar com a compra.');
                    AuthContext.openAuthModal();
                    return;
                }
                
                const selectedItems = cart.filter(item => selectedItemIds.has(item.id));

                if (selectedItems.length === 0) {
                    alert('Por favor, selecione pelo menos um item para continuar.');
                    return;
                }
                
                // Validação de cor e tamanho
                const itemsWithoutVariants = selectedItems.filter(item => !item.selectedSize || !item.selectedColor);

                if (itemsWithoutVariants.length > 0) {
                    const itemNames = itemsWithoutVariants.map(item => item.name).join(', ');
                    alert(`Por favor, selecione o tamanho e a cor para os seguintes itens: ${itemNames}.`);
                    
                    // Adiciona um destaque visual nos itens que precisam de seleção
                    document.querySelectorAll('.cart-item').forEach(el => el.style.border = 'none');
                    itemsWithoutVariants.forEach(item => {
                        const itemElement = document.querySelector(`.cart-item[data-item-index='${cart.indexOf(item)}']`);
                        if (itemElement) itemElement.style.border = '2px solid #e53e3e';
                    });
                    return; // Impede a continuação
                }

                currentStep = 'CHECKOUT';
                renderView();
            });
        }
    }

    function attachCheckoutEventListeners() {
        // Abas de Pagamento
        document.querySelectorAll('.payment-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                currentPaymentMethod = e.target.getAttribute('data-method');
                renderCheckoutPage();
            });
        });

        // Voltar ao Carrinho
        document.getElementById('btn-back-to-cart').addEventListener('click', () => {
            currentStep = 'CART';
            renderView();
        });

        // Confirmar Pedido
        document.getElementById('btn-confirm-order').addEventListener('click', () => {
            // Coletar dados do pagamento baseado no método
            let paymentData = {};
            if (currentPaymentMethod === PAYMENT_METHODS.CARD) {
                paymentData = {
                    cardName: document.getElementById('cardName')?.value,
                    cardNumber: document.getElementById('cardNumber')?.value,
                    cardExpiry: document.getElementById('cardExpiry')?.value,
                    cardCvv: document.getElementById('cardCvv')?.value
                };
            } else if (currentPaymentMethod === PAYMENT_METHODS.PIX) {
                paymentData = { pixKey: document.getElementById('pixKey')?.value };
            } else if (currentPaymentMethod === PAYMENT_METHODS.BOLETO) {
                paymentData = { boletoCpf: document.getElementById('boletoCpf')?.value };
            }

            // Validar
            const validation = validatePaymentData(currentPaymentMethod, paymentData);
            if (!validation.valid) {
                alert(`Preencha todos os campos obrigatórios do pagamento (${validation.missingFields.join(', ')}).`);
                return;
            }

            const profile = getUserProfile();
            if (!profile.address || !profile.address.street) {
                alert('Cadastre um endereço de entrega no seu perfil antes de finalizar a compra.');
                return;
            }

            // Criar pedido
            const cartState = CartContext.getCartState();
            const selectedItems = cartState.items.filter(item => selectedItemIds.has(item.id));
            
            const order = createOrder({
                items: selectedItems,
                profile,
                paymentMethod: currentPaymentMethod,
                paymentData
            });

            // Salvar pedido e limpar itens selecionados do carrinho
            addUserOrder(order);
            
            // Remove os itens comprados do carrinho original
            selectedItems.forEach(item => {
                CartContext.removeItem(item.id);
            });
            
            selectedItemIds.clear();
            currentStep = 'CART';

            alert(`Pedido finalizado com sucesso! Número do pedido: ${order.id}`);
            window.location.href = URLS.ORDERS || '../pages/MeusPedidos.html'; // Redireciona para Meus Pedidos
        });
    }
// Função que atualiza o contador de itens no header com base no estado do carrinho
    function updateCartHeaderDisplay(cartState) {
        const counter = document.getElementById('cart-counter');
        if (counter) {
            counter.textContent = cartState.totalItems;
            counter.style.opacity = cartState.totalItems > 0 ? '1' : '0';
        }
    }

    let unsubscribeCart = null;

    function initializeListeners() {
        unsubscribeCart = CartContext.subscribe((newCartState) => {
            updateCartHeaderDisplay(newCartState);
        });
    }

    window.addEventListener('beforeunload', () => {
        if (unsubscribeCart) unsubscribeCart();
    });

    // Inicialização
    initializeListeners();
    renderView(); // Inicia o renderizador principal
});
