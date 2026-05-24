import { addElementToCart, getCartState } from '../utils/cartService.js';

// Simulando os produtos que virão do banco de dados no futuro (Fases 1 e 2 do Plano)
const productsDB = [
    { id: 1, name: "K-Swiss V8 - Masculino", type: "Tênis", brand: "k-swiss", category: "esporte", gender: "masculino", price: 100, oldPrice: 200, discount: "30% OFF", image: "../assets/Mask group.png" },
    { id: 2, name: "Nike Air Max - Masculino", type: "Tênis", brand: "nike", category: "corrida", gender: "masculino", price: 150, oldPrice: null, discount: null, image: "../assets/Mask group.png" },
    { id: 3, name: "Puma RS-X - Feminino", type: "Tênis", brand: "puma", category: "casual", gender: "feminino", price: 120, oldPrice: 180, discount: "33% OFF", image: "../assets/Mask group.png" },
    { id: 4, name: "Adidas Ultraboost - Unisex", type: "Tênis", brand: "adidas", category: "corrida", gender: "unisex", price: 200, oldPrice: null, discount: null, image: "../assets/Mask group.png" },
    { id: 5, name: "Balenciaga Track - Masculino", type: "Tênis", brand: "balenciaga", category: "casual", gender: "masculino", price: 800, oldPrice: null, discount: null, image: "../assets/Mask group.png" },
    { id: 6, name: "K-Swiss Classic - Feminino", type: "Tênis", brand: "k-swiss", category: "casual", gender: "feminino", price: 90, oldPrice: null, discount: null, image: "../assets/Mask group.png" },
    { id: 7, name: "Nike Dunk Low - Unisex", type: "Tênis", brand: "nike", category: "casual", gender: "unisex", price: 180, oldPrice: 250, discount: "28% OFF", image: "../assets/Mask group.png" },
    { id: 8, name: "Puma Suede - Masculino", type: "Tênis", brand: "puma", category: "esporte", gender: "masculino", price: 110, oldPrice: 150, discount: "26% OFF", image: "../assets/Mask group.png" },
    { id: 9, name: "Adidas Stan Smith - Masculino", type: "Tênis", brand: "adidas", category: "casual", gender: "masculino", price: 100, oldPrice: 130, discount: "23% OFF", image: "../assets/Mask group.png" },
    { id: 10, name: "Nike Revolution 6 - Masculino", type: "Tênis", brand: "nike", category: "corrida", gender: "masculino", price: 219, oldPrice: 250, discount: "12% OFF", image: "../assets/Mask group.png" },
    { id: 11, name: "Puma Runner - Feminino", type: "Tênis", brand: "puma", category: "corrida", gender: "feminino", price: 130, oldPrice: null, discount: null, image: "../assets/Mask group.png" },
    { id: 12, name: "Balenciaga Speed - Unisex", type: "Tênis", brand: "balenciaga", category: "casual", gender: "unisex", price: 900, oldPrice: null, discount: null, image: "../assets/Mask group.png" },
    { id: 13, name: "K-Swiss Court - Masculino", type: "Tênis", brand: "k-swiss", category: "esporte", gender: "masculino", price: 105, oldPrice: null, discount: null, image: "../assets/Mask group.png" },
    { id: 14, name: "Nike Air Force - Feminino", type: "Tênis", brand: "nike", category: "casual", gender: "feminino", price: 300, oldPrice: null, discount: null, image: "../assets/Mask group.png" },
    { id: 15, name: "Adidas NMD - Unisex", type: "Tênis", brand: "adidas", category: "casual", gender: "unisex", price: 160, oldPrice: 200, discount: "20% OFF", image: "../assets/Mask group.png" },
    { id: 16, name: "Puma Smash - Masculino", type: "Tênis", brand: "puma", category: "casual", gender: "masculino", price: 95, oldPrice: 120, discount: "20% OFF", image: "../assets/Mask group.png" }
];

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("product-grid");
    const checkboxes = document.querySelectorAll(".filter-checkbox");

    // Atualiza a bolinha indicadora do carrinho no cabeçalho
    function updateCartCounter() {
        const counter = document.getElementById("cart-counter");
        if (counter) {
            const state = getCartState();
            counter.textContent = state.totalItems;
            counter.style.opacity = state.totalItems > 0 ? "1" : "0";
        }
    }

    // Função que desenha os produtos filtrados na tela
    function renderProducts(products) {
        grid.innerHTML = ""; // Limpa a grade de produtos

        if (products.length === 0) {
            grid.innerHTML = "<p style='width: 100%; text-align: center; margin-top: 50px; color: #777;'>Nenhum produto encontrado com estes filtros.</p>";
            return;
        }

        products.forEach(product => {
            // Monta as tags condicionais (só exibe desconto/preço velho se existirem)
            const discountTag = product.discount ? `<span class="products-p-off">${product.discount}</span>` : "";
            const oldPriceTag = product.oldPrice ? `<span class="products-p3"><s>$${product.oldPrice}</s></span>` : "";

            const cardHTML = `
                <div class="div-products-line-item" data-id="${product.id}">
                    <div class="div-products-line-item1">
                        ${discountTag}
                        <div class="div-products-img-div">
                            <img class="products-img" src="${product.image}" alt="${product.name}">
                        </div>
                    </div>
                    <div class="div-products-line-item2">
                        <p class="products-p1">${product.type}</p>
                        <p class="products-p2">${product.name}</p>
                        <div class="products-price">
                            ${oldPriceTag}
                            <span class="products-p4">$ ${product.price}</span>
                        </div>
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML("beforeend", cardHTML);
        });
    }

    // Função para ler os filtros marcados e aplicá-los na lista principal
    function applyFilters() {
        const selectedFilters = { brand: [], category: [], gender: [] };

        // Lê todas as caixinhas que estão marcadas no HTML
        checkboxes.forEach(cb => {
            if (cb.checked && cb.dataset.filter !== "state") { // Ignoramos "estado" para simplificar agora
                selectedFilters[cb.dataset.filter].push(cb.value);
            }
        });

        // Lê o termo de busca da URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search') ? urlParams.get('search').toLowerCase() : '';

        // Filtra a lista de produtos (Array)
        const filteredProducts = productsDB.filter(product => {
            const matchBrand = selectedFilters.brand.length === 0 || selectedFilters.brand.includes(product.brand);
            const matchCategory = selectedFilters.category.length === 0 || selectedFilters.category.includes(product.category);
            const matchGender = selectedFilters.gender.length === 0 || selectedFilters.gender.includes(product.gender);
            
            const matchSearch = searchTerm === '' || 
                                product.name.toLowerCase().includes(searchTerm) || 
                                product.type.toLowerCase().includes(searchTerm) || 
                                product.brand.toLowerCase().includes(searchTerm);

            return matchBrand && matchCategory && matchGender && matchSearch; // Só passa se bater com TODOS os grupos e com a busca
        });

        // Atualiza a tela com o resultado final
        renderProducts(filteredProducts);
    }

    // Preencher o campo de busca com o termo da URL ao carregar a página
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearchTerm = urlParams.get('search');
    if (initialSearchTerm) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = initialSearchTerm;
        }
    }

    // Ouve os cliques nos filtros
    checkboxes.forEach(cb => cb.addEventListener("change", applyFilters));
    
    // Inicializa a página com os produtos renderizados
    applyFilters();
    updateCartCounter();

    // Escuta os cliques em qualquer produto da grade para adicionar ao carrinho
    grid.addEventListener("click", (e) => {
        const card = e.target.closest(".div-products-line-item");
        if (card) {
            addElementToCart(card);
            updateCartCounter();
            alert("Produto adicionado ao carrinho com sucesso!"); 
        }
    });
});