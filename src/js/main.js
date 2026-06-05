document.addEventListener('DOMContentLoaded', () => {
    // Adicionar classe 'active' quando clica em tamanho
    document.querySelectorAll('.sizes .size').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.sizes .size').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Adicionar classe 'active' quando clica em cor
    document.querySelectorAll('.colors .color').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.colors .color').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
// Funções auxiliares para obter as opções selecionadas
    function getSelectedSize() {
        const sizeButton = document.querySelector('.sizes .size.active');
        return sizeButton ? sizeButton.dataset.size : null;
    }
// Função para obter a cor selecionada
    function getSelectedColor() {
        const colorButton = document.querySelector('.colors .color.active');
        return colorButton ? colorButton.dataset.color : null;
    }
// Função para obter o elemento do contador do carrinho
    function getCartCounterElement() {
        return document.getElementById('cart-counter');
    }
// Função para atualizar o contador do carrinho
    function updateCartCounter(cartState) {
        const cartCounter = getCartCounterElement();
        if (!cartCounter) return;

        cartCounter.textContent = cartState.totalItems;
        cartCounter.style.opacity = cartState.totalItems > 0 ? '1' : '0';
    }
// Função para aplicar feedback visual ao clicar no botão de compra
    function applyBuyFeedback(button) {
        const originalText = button.textContent;
        const originalBackground = button.style.backgroundColor;
        const originalColor = button.style.color;

        button.textContent = 'Adicionado!';
        button.style.backgroundColor = '#C92071';
        button.style.color = '#fff';

        window.setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalBackground;
            button.style.color = originalColor;
        }, 1000);
    }
// Carregar os módulos do carrinho e configurar os eventos relacionados
    Promise.all([
        import('./contexts/CartContext.js'),
        import('./utils/cartService.js')
    ]).then(([cartModule, serviceModule]) => {
        const CartContext = cartModule.default;
        const { extractCartItemFromElement, DEFAULT_CART_SELECTORS } = serviceModule;
// Inscrever a função de atualização do contador para ser chamada sempre que o estado do carrinho mudar
        CartContext.subscribe(updateCartCounter);
        updateCartCounter(CartContext.getCartState());
// Função para lidar com o clique no botão de compra
        function handleBuyClick(button, event) {
            event.preventDefault();
// Encontrar o elemento do produto mais próximo ao botão clicado
            const productCard = button.closest('.featured-item, .div-products-line-item, .product-card, .product-info, .details');
            if (!productCard) return;

            const baseItem = extractCartItemFromElement(productCard, DEFAULT_CART_SELECTORS);
            if (!baseItem) return;

            CartContext.addItem({
                ...baseItem,
                selectedSize: getSelectedSize(),
                selectedColor: getSelectedColor()
            });

            applyBuyFeedback(button);
        }
// Configurar o evento de clique para os botões de compra usando delegação de eventos
        document.addEventListener('click', (event) => {
            const buyButton = event.target.closest('.buy-button, .featured-button');
            if (!buyButton) return;
            handleBuyClick(buyButton, event);
        });
    }).catch(err => {
        console.error('Erro ao carregar módulos do carrinho:', err);
    });

    // Filtro/Busca de Produtos
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.querySelector('.search-icon');

    function executeGlobalSearch() {
        if (!searchInput) return;
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;

        // Determinar o caminho correto para a página de produtos dependendo de onde estamos
        const isRoot = !window.location.pathname.includes('/src/pages/');
        const targetUrl = isRoot ? 'src/pages/ProductListdesign.html' : 'ProductListdesign.html';

        window.location.href = `${targetUrl}?search=${encodeURIComponent(searchTerm)}`;
    }

    if (searchInput) {
        // Redirecionar ao pressionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeGlobalSearch();
            }
        });

        // Filtragem em tempo real na página atual
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            const featuredItems = document.querySelectorAll('.featured-item');
            const productItems = document.querySelectorAll('.div-products-line-item');

            featuredItems.forEach(item => {
                const title = item.querySelector('.featured-title');
                if (title) {
                    const titleText = title.textContent.toLowerCase();
                    item.style.display = titleText.includes(searchTerm) ? 'block' : 'none';
                }
            });
            // Filtragem para a seção de produtos
            productItems.forEach(item => {
                const title = item.querySelector('.products-p2');
                const category = item.querySelector('.products-p1');
                if (title && category) {
                    const titleText = title.textContent.toLowerCase();
                    const categoryText = category.textContent.toLowerCase();

                    item.style.display = (titleText.includes(searchTerm) || categoryText.includes(searchTerm)) ? 'flex' : 'none';
                }
            });
        });
    }
    // Configurar o clique no ícone de busca para executar a pesquisa
    if (searchIcon) {
        searchIcon.style.cursor = 'pointer';
        searchIcon.addEventListener('click', executeGlobalSearch);
    }

    // Scroll suave ao clicar no botão "Ver Ofertas"
    const btnScroll = document.getElementById('btn-scroll');
    const secaoProdutos = document.getElementById('secao-produtos');

    if (btnScroll && secaoProdutos) {
        btnScroll.addEventListener('click', (e) => {
            e.preventDefault();
            secaoProdutos.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Gerador e copiador de cupom
    const btnCupom = document.getElementById('btn-cupom');

    if (btnCupom) {
        btnCupom.addEventListener('click', (e) => {
            e.preventDefault();

            const cupom = 'AIRJORDAN20';
// Tenta copiar o cupom para a área de transferência
            navigator.clipboard.writeText(cupom).then(() => {
                alert(`Parabéns! O cupom de 20% OFF (${cupom}) foi ativado e copiado para sua área de transferência!`);

                btnCupom.textContent = 'Cupom Resgatado';
                btnCupom.style.backgroundColor = '#28a745';
                btnCupom.style.pointerEvents = 'none';
            }).catch(err => {
                console.error('Erro ao copiar o cupom: ', err);
                alert(`O seu cupom é: ${cupom}`);
            });
        });
    }
});
