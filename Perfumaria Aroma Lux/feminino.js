







// =========================================================
// 1. DADOS E VARIÁVEIS GLOBAIS
// =========================================================

// Variável Global: Carrega o carrinho do Local Storage ou inicia vazio
let shoppingCart = JSON.parse(localStorage.getItem('aromaluxCart')) || []; 

const productsCatalog = [

    { id: 'M001', name: 'Bella Flora', category: 'Amadeirados', price:  189.90, notes: 'uma ode à feminilidade e à beleza que floresce na delicadeza', image: "img/Bella flora.png", isBestSeller: true, isSale: false },
    { id: 'M002', name: 'Fleur de Soie', category: 'Amadeirados', price: 150.00, notes: 'Cedro, Sândalo, Patchouli.', image: 'img/Fleur de Soie.png', isBestSeller: false, isSale: false },
    { id: 'M003', name: 'Floratta Doce', category: 'Amadeirados', price: 187.00, oldPrice: 220.00, notes: 'Pinheiro, Musgo de Carvalho, Âmbar.', image: 'img/Floratta Doce!.png', isBestSeller: false, isSale: true },

    { id: 'M004', name: 'Mar Profundo EDC', category: 'Frescos', price: 80.00, notes: 'Notas Marinhas, Sálvia, Limão Siciliano.', image: 'img/splendour gold.png', isBestSeller: false, isSale: false },
];

/**
 * Atualiza o contador de itens no cabeçalho em qualquer página.
 */
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        // Soma a quantidade de todos os itens no carrinho
        const totalItems = shoppingCart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

/**
 * Salva o carrinho no Local Storage E atualiza o contador.
 */
function saveCart() {
    localStorage.setItem('aromaluxCart', JSON.stringify(shoppingCart));
    updateCartCount(); // CHAVE: Atualiza o contador após salvar
}

/**
 * Adiciona um produto ao carrinho.
 * @param {string} productId - O ID único do produto.
 */
function addToCart(productId) {
    const product = productsCatalog.find(p => p.id === productId); 
    
    if (product) {
        const existingItem = shoppingCart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            shoppingCart.push({ 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                quantity: 1 
            });
        }
        
        saveCart(); // Salva e atualiza o contador
        alert(`✅ ${product.name} adicionado ao carrinho!`);
    }
}


// =========================================================
// 3. FUNÇÃO DE RENDERIZAÇÃO DE PRODUTOS (PÁGINA MASCULINO)
// =========================================================

/**
 * Renderiza os cards de produto em um container HTML específico.
 */
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; 

    const productsHtml = products.map(product => {
        // Regras de Negócio para tags visuais
        const bestSellerTag = product.isBestSeller ? `<span class="tag-best-seller">MAIS VENDIDO</span>` : '';
        const saleTag = product.isSale ? `<span class="tag-sale">-15% OFF</span>` : '';
        const oldPriceHtml = product.oldPrice ? `<p class="price-old">R$ ${product.oldPrice.toFixed(2).replace('.', ',')}</p>` : '';
        const currentPriceHtml = `<p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>`;

        return `
            <div class="product-card">
                ${bestSellerTag}
                ${saleTag}
                <img src="${product.image}" alt="Perfume ${product.name}" class="product-img">
                <h3>${product.name}</h3>
                <p>Notas: ${product.notes}</p>
                ${oldPriceHtml}
                ${currentPriceHtml}
                <button class="btn-add-cart" data-product-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        `;
    }).join('');

    container.innerHTML = productsHtml;

    // Adiciona o event listener a cada botão renderizado
    container.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

/**
 * Inicializa a renderização específica da página Masculino.
 */
function initMasculinoPage() {
    const amadeirados = productsCatalog.filter(p => p.category === 'Amadeirados');
    renderProducts(amadeirados, 'amadeirados-grid');

    const frescos = productsCatalog.filter(p => p.category === 'Frescos');
    renderProducts(frescos, 'frescos-grid');
}


// =========================================================
// 4. EVENTO PRINCIPAL DE CARREGAMENTO DO DOCUMENTO
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // ESSENCIAL: Garante que o contador do carrinho seja atualizado no carregamento de QUALQUER página.
    updateCartCount(); 
    
    // Inicia a renderização da página Masculino se estiver nela
    if (document.getElementById('amadeirados-grid')) {
        initMasculinoPage();
    }

});









