// Página: Carrinho de Compras (Cart Page)
// Script que renderiza a página do carrinho com itens e resumo
// Este script é carregado especificamente na página cart.html
import CartContext from '../contexts/CartContext.js';
import AuthContext from '../contexts/AuthContext.js';
import { URLS } from '../config/urls.js';

document.addEventListener('DOMContentLoaded', () => {
    // Carregar header dinamicamente
    function loadHeader() {
        const header = document.getElementById('main-header');
        if (!header) return;

        const authState = AuthContext.getAuthState();
        const cartState = CartContext.getCartState();
        const buttonText = authState.isAuthenticated ? `Olá, ${authState.user.firstname}` : 'Entrar / Cadastrar';
        const cartCounterOpacity = cartState.totalItems > 0 ? '1' : '0';
        header.innerHTML = `
            <nav class="nav-header">
                <a class="digital-store-header" href="${URLS.HOME}">
                    <img class="logo-digital" src="../assets/logo_digital_store.svg" alt="Logo Digital Store">
                    Digital Store
                </a>
                <div class="search-container">
                    <div class="search-container">
                        <input class="input-header" type="text" placeholder="Pesquisar produto...">
                        <img class="search-icon" src="../assets/lupa.png" alt="Ícone de pesquisa">
                    </div>
                    <div class="style-button">
                        <button class="entrar-header" id="btn-header-auth" style="width: auto; padding: 0 20px;">${buttonText}</button>
                        <div style="position: relative; display: inline-flex; align-items: center; cursor: pointer; margin-left: 10px;" onclick="window.location.href='${URLS.CART}'">
                            <img class="carrinho" src="../assets/img_carrinho.svg" alt="Ícone do Carrinho">
                            <span id="cart-counter" style="position: absolute; top: -8px; right: -10px; background-color: #C92071; color: white; font-size: 10px; font-weight: bold; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: ${cartCounterOpacity}; transition: opacity 0.3s;">${cartState.totalItems}</span>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="navigation-header">
                <ol class="ol-header">
                    <a href="${URLS.HOME}"><li>Home</li></a>
                    <a href="${URLS.PRODUCTS}"><li>Produtos</li></a>
                    <a href="${URLS.CATEGORIES}"><li>Categorias</li></a>
                    <a href="#"><li>Meus Pedidos</li></a>
                </ol>
            </div>
        `;

        // Adicionar evento ao botão de login
        const loginButton = document.getElementById('btn-header-auth');
        if (loginButton) {
            loginButton.addEventListener('click', (e) => {
                e.preventDefault();
                const estadoAtual = AuthContext.getAuthState();
                if (estadoAtual.isAuthenticated) {
                    if (confirm('Deseja sair da sua conta?')) {
                        AuthContext.logout();
                        window.location.reload();
                    }
                } else {
                    AuthContext.openAuthModal();
                }
            });
        }
    }

    // Carregar footer dinamicamente
    function loadFooter() {
        const footer = document.getElementById('main-footer');
        if (!footer) return;

        footer.innerHTML = `
            <footer>
                <div class="footer-container">
                    <div class="footer-section">
                        <h3>Sobre</h3>
                        <p>Digital Store - Sua loja de tênis favorita</p>
                    </div>
                    <div class="footer-section">
                        <h3>Contato</h3>
                        <p>Email: contato@digitalstore.com</p>
                        <p>Telefone: (11) 1234-5678</p>
                    </div>
                    <div class="footer-section">
                        <h3>Redes Sociais</h3>
                        <p>Instagram | Facebook | Twitter</p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Digital Store. Todos os direitos reservados.</p>
                </div>
            </footer>
        `;
    }

    // Função principal que renderiza a página do carrinho
    function renderCartPage() {
        const cartItemsList = document.getElementById('cart-items-list');
        const cartSummary = document.getElementById('cart-summary');

        if (!cartItemsList || !cartSummary) {
            console.error('Cart elements not found');
            return;
        }

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
            attachCartEventListeners(cart);
        } else {
            // Renderizar itens do carrinho
            const cartItemsHtml = cart.map((item, index) => `
                <div class="cart-item" data-item-index="${index}">
                    <img src="${item.image}" alt="${item.name}" />
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>Preço: R$ ${item.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="btn-quantity" data-action="decrease" data-item-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="btn-quantity" data-action="increase" data-item-index="${index}">+</button>
                        </div>
                        <p>Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button class="btn-remove-item" data-item-index="${index}">Remover</button>
                </div>
            `).join('');

            cartItemsList.innerHTML = cartItemsHtml;

            // Calcular total do carrinho
            const total = cart.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);

            // Renderizar resumo do carrinho
            cartSummary.innerHTML = `
                <div class="cart-summary">
                    <h3>Resumo do Carrinho</h3>
                    <p>Itens: ${cartState.totalItems}</p>
                    <p>Total: R$ ${total.toFixed(2)}</p>
                    <button class="btn-checkout">Ir para Checkout</button>
                </div>
            `;

            // Adicionar eventos aos botões
            attachCartEventListeners(cart);

            // Adicionar evento ao botão de checkout
            const checkoutBtn = document.querySelector('.btn-checkout');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', () => {
                    alert('Funcionalidade de checkout em desenvolvimento. Backend necessário.');
                });
            }
        }
    }

    // Função separada para adicionar eventos dos itens do carrinho
    function attachCartEventListeners(cart) {
        // Adicionar eventos aos botões de remover item
        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemIndex = parseInt(e.target.getAttribute('data-item-index'));
                const item = cart[itemIndex];
                if (item) {
                    CartContext.removeItem(item.id);
                    renderCartPage();
                }
            });
        });

        // Adicionar eventos aos botões de quantidade
        document.querySelectorAll('.btn-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const action = e.target.getAttribute('data-action');
                const itemIndex = parseInt(e.target.getAttribute('data-item-index'));
                const item = cart[itemIndex];
                
                if (item) {
                    if (action === 'increase') {
                        CartContext.updateQuantity(item.id, item.quantity + 1);
                        renderCartPage(); // update partial content if not handled by framework, but here we can just let state change triggers handle partial updates or simply call renderCartPage for the list
                    } else if (action === 'decrease' && item.quantity > 1) {
                        CartContext.updateQuantity(item.id, item.quantity - 1);
                        renderCartPage();
                    }
                }
            });
        });
    }

    function updateCartHeaderDisplay(cartState) {
        const counter = document.getElementById('cart-counter');
        if (counter) {
            counter.textContent = cartState.totalItems;
            counter.style.opacity = cartState.totalItems > 0 ? '1' : '0';
        }
    }

    let unsubscribeCart = null;
    let unsubscribeAuth = null;

    function initializeListeners() {
        unsubscribeCart = CartContext.subscribe((newCartState) => {
            updateCartHeaderDisplay(newCartState);
            // Render cart page is only necessary if items change structure or are removed, 
            // but the guide advises separating it out, let's keep renderCartPage triggered on quantity clicks directly
        });

        unsubscribeAuth = AuthContext.subscribe(() => {
            loadHeader();
        });
    }

    window.addEventListener('beforeunload', () => {
        if (unsubscribeCart) unsubscribeCart();
        if (unsubscribeAuth) unsubscribeAuth();
    });

    // Carregar header e footer
    loadHeader();
    loadFooter();
    initializeListeners();

    // Chamada inicial para renderizar a página do carrinho
    renderCartPage();
});
