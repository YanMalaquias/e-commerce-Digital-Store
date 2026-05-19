import { URLS } from '../config/urls.js';

/**
 * Componente: Card de Produto Individual
 * Cria um card de produto com imagem, nome e preço
 * @param {Object} product - Objeto contendo dados do produto
 * @param {string} product.name - Nome do produto
 * @param {string} product.image - URL da imagem do produto
 * @param {number} product.price - Preço original do produto
 * @param {number} [product.priceDiscount] - Preço com desconto (opcional)
 * @param {number} [product.id] - ID do produto (opcional, para navegação)
 * @returns {HTMLElement} Elemento HTML div representando o card do produto
 */
function createProductCard(product) {
    // Cria o container principal do card
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    
    // Adiciona cursor pointer se tiver ID para navegação
    if (product.id) {
        productCard.style.cursor = 'pointer';
        productCard.addEventListener('click', () => {
            window.location.href = URLS.PRODUCT_DETAIL(product.id);
        });
    }

    // Cria e adiciona a imagem do produto
    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.name;
    productCard.appendChild(productImage);

    // Cria e adiciona o nome do produto
    const productName = document.createElement('h3');
    productName.textContent = product.name;
    productCard.appendChild(productName);

    // Cria e adiciona o preço do produto
    const productPrice = document.createElement('p');
    if (product.priceDiscount) {
        // Se houver desconto, mostra o preço antigo riscado e o novo preço
        const oldPrice = document.createElement('span');
        oldPrice.classList.add('price');
        oldPrice.textContent = `$${product.price.toFixed(2)}`;
        productPrice.appendChild(oldPrice);

        const discountPrice = document.createElement('span');
        discountPrice.classList.add('price-discount');
        discountPrice.textContent = `$${product.priceDiscount.toFixed(2)}`;
        productPrice.appendChild(discountPrice);
    } else {
        // Se não houver desconto, mostra apenas o preço normal
        productPrice.classList.add('price-discount');
        productPrice.textContent = `$${product.price.toFixed(2)}`;
    }
    productCard.appendChild(productPrice);

    return productCard;
}

export default createProductCard;
