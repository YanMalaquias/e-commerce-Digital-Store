// ProfilePage.js
import AuthContext from '../contexts/AuthContext.js';
import CartContext from '../contexts/CartContext.js';
import { URLS } from '../config/urls.js';
import { getUserProfile, getUserOrders, updateUserProfile, formatFullAddress } from '../utils/userService.js';
// Página de perfil do usuário, incluindo visualização e edição de dados pessoais e histórico de pedidos
document.addEventListener('DOMContentLoaded', () => {
    // 1. CARREGAMENTO DINÂMICO DE HEADER E FOOTER
    
    function loadHeader() {
        const header = document.getElementById('main-header');
        if (!header) return;
        // Obtém os estados atuais de autenticação e carrinho para renderizar o header corretamente
        const authState = AuthContext.getAuthState();
        const cartState = CartContext.getCartState();
        const buttonText = authState.isAuthenticated ? `Olá, ${authState.user.firstname}` : 'Entrar / Cadastrar';
        const cartCounterOpacity = cartState.totalItems > 0 ? '1' : '0';
        // Renderiza o header com base no estado de autenticação e carrinho
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
                    <a href="${URLS.CATEGORIES}"><li>Categorias</li></a>
                    <a href="${URLS.ORDERS}"><li>Meus Pedidos</li></a>
                </ol>
            </div>
        `;
        // Configura o evento de clique para o botão de login/logout
        const loginButton = document.getElementById('btn-header-auth');
        if (loginButton) {
            loginButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (authState.isAuthenticated) {
                    if (confirm('Deseja sair da sua conta?')) {
                        AuthContext.logout();
                        window.location.href = URLS.HOME;
                    }
                } else {
                    AuthContext.openAuthModal();
                }
            });
        }
    }

        
    // 2. RENDERIZAÇÃO DO CONTEÚDO PRINCIPAL (ABAS DE PERFIL E PEDIDOS)
    function renderProfilePage() {
        const authState = AuthContext.getAuthState();
        const mainContainer = document.querySelector('.pedidos-container');

        if (!mainContainer) return;

        if (!authState.isAuthenticated) {
            mainContainer.innerHTML = `
                <div style="text-align: center; padding: 50px 20px;">
                    <h2 style="margin-bottom: 20px;">Faça login para ver seu perfil e pedidos</h2>
                    <button id="btn-login-profile" style="background-color: #C92071; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer;">Entrar / Cadastrar</button>
                </div>
            `;
            document.getElementById('btn-login-profile')?.addEventListener('click', () => {
                AuthContext.openAuthModal();
            });
            return;
        }

        // Se estiver autenticado, renderizar estrutura de abas
        mainContainer.innerHTML = `
            <div style="display: flex; gap: 30px; flex-wrap: wrap;">
                <!-- Sidebar de Navegação -->
                <aside style="width: 250px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); align-self: flex-start;">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="margin-bottom: 10px;">
                            <a href="#meus-dados" id="tab-dados" style="text-decoration: none; color: #C92071; font-weight: bold; display: block; padding: 10px; border-radius: 4px; background: #fdf2f8;">Meus Dados</a>
                        </li>
                        <li>
                            <a href="#meus-pedidos" id="tab-pedidos" style="text-decoration: none; color: #333; display: block; padding: 10px; border-radius: 4px; transition: background 0.3s;">Meus Pedidos</a>
                        </li>
                    </ul>
                </aside>

                <!-- Conteúdo das Abas -->
                <div id="tab-content" style="flex: 1; min-width: 300px;">
                    <!-- Renderizado dinamicamente -->
                </div>
            </div>
        `;

        // Eventos das abas
        const tabDados = document.getElementById('tab-dados');
        const tabPedidos = document.getElementById('tab-pedidos');

        function resetTabs() {
            tabDados.style.color = '#333';
            tabDados.style.background = 'transparent';
            tabDados.style.fontWeight = 'normal';
            tabPedidos.style.color = '#333';
            tabPedidos.style.background = 'transparent';
            tabPedidos.style.fontWeight = 'normal';
        }
        // Configura os eventos de clique para alternar entre as abas
        tabDados.addEventListener('click', (e) => {
            e.preventDefault();
            resetTabs();
            tabDados.style.color = '#C92071';
            tabDados.style.background = '#fdf2f8';
            tabDados.style.fontWeight = 'bold';
            renderDadosTab();
        });
// Configura os eventos de clique para alternar entre as abas
        tabPedidos.addEventListener('click', (e) => {
            e.preventDefault();
            resetTabs();
            tabPedidos.style.color = '#C92071';
            tabPedidos.style.background = '#fdf2f8';
            tabPedidos.style.fontWeight = 'bold';
            renderPedidosTab();
        });

        // Iniciar na aba de pedidos (já que a url é MeusPedidos.html)
        tabPedidos.click();
    }

        
        // 3. ABA: MEUS DADOS
    function renderDadosTab() {
        const content = document.getElementById('tab-content');
        if (!content) return;
        // Obtém os dados do perfil do usuário para preencher o formulário
        const profile = getUserProfile();

        content.innerHTML = `
            <div style="background: #fff; padding: 60px; border-radius: 8px; box-shadow: 5px 23px 130px rgba(0,0,0,0.05);">
                <h2 style="margin-bottom: 20px; font-size: 30px;">Minhas Informações</h2>
                <form id="form-profile">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; color: #666;">Nome</label>
                            <input type="text" id="prof-firstname" value="${profile.firstname || ''}" style="width: 100%; padding: 9px; border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; color: #666;">Sobrenome</label>
                            <input type="text" id="prof-surname" value="${profile.surname || ''}" style="width: 100%; padding: 9px; border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; color: #666;">E-mail</label>
                            <input type="email" id="prof-email" value="${profile.email || ''}" style="width: 100%; padding: 9px; border: 1px solid #ddd; border-radius: 4px; background-color: #eeeeee; cursor: not-allowed;" readonly title="O e-mail de login não pode ser alterado.">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; color: #666;">Telefone</label>
                            <input type="text" id="prof-phone" value="${profile.phone || ''}" placeholder="(00) 00000-0000" style="width: 100%; padding: 9px; border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;">
                        </div>
                        <div style="grid-column: 1 / -1;"><h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Endereço de Entrega</h3></div>
                        <div style="grid-column: 1 / 3;">
                            <label style="display: block; margin-bottom: 5px; color: #666;">Rua / Logradouro</label>
                            <input type="text" id="addr-street" value="${profile.address?.street || ''}" style="width: 100%; padding: 9px; border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; color: #666;">Número</label>
                            <input type="text" id="addr-number" value="${profile.address?.number || ''}" style="width: 100%; padding: 9px; border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; color: #666;">Bairro</label>
                            <input type="text" id="addr-neighborhood" value="${profile.address?.neighborhood || ''}" style="width: 100%; padding: 9px; border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; color: #666;">Cidade</label>
                            <input type="text" id="addr-city" value="${profile.address?.city || ''}" style="width: 100%; padding: 9px; border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; color: #666;">Estado</label>
                            <input type="text" id="addr-state" value="${profile.address?.state || ''}" placeholder="Ex: SP" style="width: 100%; padding: 9px; border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; color: #666;">CEP</label>
                            <input type="text" id="addr-zipCode" value="${profile.address?.zipCode || ''}" placeholder="00000-000" style="width: 100%; padding: 9px; border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;">
                        </div>
                    </div>
                    <button type="submit" style="background-color: #C92071; color: #fff; border: none; padding: 9px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 30px; width: 100%; max-width: 250px;">Salvar Alterações</button>
                </form>
            </div>
        `;
        // Configura o evento de submissão do formulário para atualizar os dados do perfil
        document.getElementById('form-profile').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newProfile = {
                firstname: document.getElementById('prof-firstname').value,
                surname: document.getElementById('prof-surname').value,
                phone: document.getElementById('prof-phone').value,
                address: {
                    street: document.getElementById('addr-street').value,
                    number: document.getElementById('addr-number').value,
                    neighborhood: document.getElementById('addr-neighborhood').value,
                    city: document.getElementById('addr-city').value,
                    state: document.getElementById('addr-state').value,
                    zipCode: document.getElementById('addr-zipCode').value
                }
            };

            updateUserProfile(newProfile);
            alert('Perfil atualizado com sucesso!');
        });
    }

     
    // 4. ABA: MEUS PEDIDOS - Exibe o histórico de pedidos do usuário ou uma mensagem caso não haja pedidos
    function renderPedidosTab() {
        const content = document.getElementById('tab-content');
        if (!content) return;

        const orders = getUserOrders();
// Se não houver pedidos, exibe uma mensagem amigável incentivando a explorar a loja
        if (orders.length === 0) {
            content.innerHTML = `
                <div style="background: #fff; padding: 40px; border-radius: 8px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                    <h2 style="margin-bottom: 20px;">Você ainda não possui pedidos!</h2>
                    <p style="color: #666; margin-bottom: 30px;">Que tal dar uma olhada em nossos produtos?</p>
                    <a href="${URLS.HOME}" style="background-color: #C92071; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">Explorar Loja</a>
                </div>
            `;
            return;
        }
// Se houver pedidos, renderiza cada um com detalhes como número do pedido, data, status, total e itens comprados
        const ordersHtml = orders.map(order => {
            const date = new Date(order.createdAt).toLocaleDateString('pt-BR');
            return `
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <span style="display: block; font-size: 12px; color: #666;">Número do Pedido</span>
                            <strong style="font-size: 16px;">${order.id}</strong>
                        </div>
                        <div>
                            <span style="display: block; font-size: 12px; color: #666;">Data da Compra</span>
                            <strong>${date}</strong>
                        </div>
                        <div>
                            <span style="display: block; font-size: 12px; color: #666;">Status</span>
                            <strong style="color: #C92071;">${order.status}</strong>
                        </div>
                        <div>
                            <span style="display: block; font-size: 12px; color: #666;">Total</span>
                            <strong>R$ ${order.totalPrice.toFixed(2)}</strong>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${order.items.map(item => `
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 4px; background: #f5f5f5;">
                                <div style="flex: 1;">
                                    <h4 style="margin: 0; font-size: 14px;">${item.name}</h4>
                                    <p style="margin: 0; color: #666; font-size: 12px;">Qtd: ${item.quantity} | R$ ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        content.innerHTML = `
            <h2 style="margin-bottom: 20px; font-size: 24px;">Meus Pedidos</h2>
            ${ordersHtml}
        `;
    }

    
    // 5. INICIALIZAÇÃO E LISTENERS
    
    function updateCartHeaderDisplay(cartState) {
        const counter = document.getElementById('cart-counter');
        if (counter) {
            counter.textContent = cartState.totalItems;
            counter.style.opacity = cartState.totalItems > 0 ? '1' : '0';
        }
    }
// Variáveis para armazenar as funções de cancelamento dos listeners
    let unsubscribeCart = null;
    let unsubscribeAuth = null;

    function initializeListeners() {
        unsubscribeCart = CartContext.subscribe((newCartState) => {
            updateCartHeaderDisplay(newCartState);
        });

        unsubscribeAuth = AuthContext.subscribe(() => {
            loadHeader();
            renderProfilePage(); // Re-renderiza a página caso o status de login mude
        });
    }
// Limpa os listeners ao sair da página para evitar vazamentos de memória
    window.addEventListener('beforeunload', () => {
        if (unsubscribeCart) unsubscribeCart();
        if (unsubscribeAuth) unsubscribeAuth();
    });

    // Iniciar
    loadHeader();
    initializeListeners();
    renderProfilePage();
});
