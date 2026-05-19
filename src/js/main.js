document.addEventListener('DOMContentLoaded', () => {

    // Adicionar classe 'active' quando clica em tamanho
    document.querySelectorAll('.sizes .size').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sizes .size').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Adicionar classe 'active' quando clica em cor
    document.querySelectorAll('.colors .color').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.colors .color').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Funções para recuperar seleções
    function getSelectedSize() {
        const sizeButton = document.querySelector('.sizes .size.active');
        return sizeButton ? sizeButton.dataset.size : null;
    }

    function getSelectedColor() {
        const colorButton = document.querySelector('.colors .color.active');
        return colorButton ? colorButton.dataset.color : null;
    }

    // ------------------------------------------------------------------------
    // FUNÇÃO 1: Integração com CartContext para carrinho funcional
    // ------------------------------------------------------------------------
    // Import dinâmico do CartContext (para funcionar com ES Modules)
    import('../js/contexts/CartContext.js').then((module) => {
    const CartContext = module.CartContext || module.default;
    
    // PRIMEIRO: Capture o elemento do DOM
    const cartCounter = document.getElementById('cart-counter');
        
    // Atualiza o contador quando o carrinho mudar
    CartContext.subscribe((cartState) => {
            if (cartCounter) {
                cartCounter.textContent = cartState.totalItems;
                cartCounter.style.opacity = cartState.totalItems > 0 ? '1' : '0';
            }
        });

        // Delegação de eventos para os botões de compra
        function handleBuyClick(e) {
            e.preventDefault();
            const button = this;
            
            // Encontra o produto mais próximo
            const productCard = button.closest('.featured-item, .div-products-line-item, .product-card, .product-info');
            if (productCard) {
                const titleElement = productCard.querySelector('.featured-title, .products-p2, .product-name, h1');
                const priceElement = productCard.querySelector('.products-p4, .discounted-price, .price');
                const imageElement = productCard.querySelector('.featured-image, .products-img, .product-image img, .main-image img');
                // Verifica se os elementos existem antes de prosseguir
                if (titleElement && priceElement) {
                    const priceText = priceElement.childNodes[0]?.textContent || priceElement.textContent; // Handle cases where .price has span child
                    const product = {
                        id: titleElement.textContent.trim().replace(/\s+/g, '-').toLowerCase(), // ID baseado no nome para deduplicação
                        name: titleElement.textContent.trim(),
                        price: parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.')),
                        image: imageElement ? imageElement.src : '',
                        quantity: 1,
                        selectedSize: getSelectedSize(),
                        selectedColor: getSelectedColor()
                    };
                    
                    CartContext.addItem(product);
                    
                    // Efeito visual no botão
                    const originalText = button.textContent;
                    button.textContent = "Adicionado!";
                    button.style.backgroundColor = "#C92071";
                    button.style.color = "#fff";
                    // volta ao estado original após 1 segundo
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.backgroundColor = "";
                        button.style.color = "";
                    }, 1000);
                }
            }
        }

        document.addEventListener('click', (e) => {
            if (e.target.closest('.buy-button, .featured-button')) {
                handleBuyClick.call(e.target.closest('.buy-button, .featured-button'), e);
            }
        });

        // Adiciona link ao ícone do carrinho
        const cartIcon = document.querySelector('.carrinho')?.parentElement;
        if (cartIcon) {
            cartIcon.style.cursor = 'pointer';
            let cartEventListener = () => {
                import('../js/config/urls.js').then(({ URLS }) => {
                    window.location.href = URLS.CART;
                });
            };
            cartIcon.addEventListener('click', cartEventListener);
        }
    }).catch(err => {
        console.error('Erro ao carregar CartContext:', err);
    });

    // ------------------------------------------------------------------------
    // FUNÇÃO 3: Filtro/Busca de Produtos
    // ------------------------------------------------------------------------
    const searchInput = document.getElementById('search-input');
    const featuredItems = document.querySelectorAll('.featured-item');
    const productItems = document.querySelectorAll('.div-products-line-item');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            // Filtra na seção de Coleções em Destaque
            featuredItems.forEach(item => {
                const title = item.querySelector('.featured-title');
                if (title) {
                    const titleText = title.textContent.toLowerCase();
                    if (titleText.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });

            // Filtra na seção de Produtos em Alta
            productItems.forEach(item => {
                const title = item.querySelector('.products-p2');
                const category = item.querySelector('.products-p1');
                if (title && category) {
                    const titleText = title.textContent.toLowerCase();
                    const categoryText = category.textContent.toLowerCase();
            
                    if (titleText.includes(searchTerm) || categoryText.includes(searchTerm)) {
                        item.style.display = 'flex'; // Mantém o flexbox para não quebrar o layout
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    }

    // ------------------------------------------------------------------------
    // FUNÇÃO 4: Scroll Suave ao clicar no botão "Ver Ofertas"
    // ------------------------------------------------------------------------
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

    // ------------------------------------------------------------------------
    // FUNÇÃO 5: Gerador e Copiador de Cupom (Oferta Especial)
    // ------------------------------------------------------------------------
    const btnCupom = document.getElementById('btn-cupom');

    if (btnCupom) {
        btnCupom.addEventListener('click', (e) => {
            e.preventDefault();
            
            // O código do cupom que vamos gerar
            const cupom = "AIRJORDAN20";

            // Usando a API de Clipboard para copiar para o teclado do usuário
            navigator.clipboard.writeText(cupom).then(() => {
                alert(`Parabéns! O cupom de 20% OFF (${cupom}) foi ativado e copiado para sua área de transferência!`);
                
                // Muda o botão para mostrar que já foi resgatado
                btnCupom.textContent = "Cupom Resgatado";
                btnCupom.style.backgroundColor = "#28a745"; // Cor verde
                btnCupom.style.pointerEvents = "none"; // Desativa novos cliques
            }).catch(err => {
                console.error("Erro ao copiar o cupom: ", err);
                alert(`O seu cupom é: ${cupom}`);
            });
        });
    }

});
