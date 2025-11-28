        function aplicarCupom() {
            const cupom = document.getElementById('cupomInput').value;
            // A regra de negócio ARONALUX15 é validada aqui
            if (cupom === 'AROMALUX15') {
                alert(`Cupom ${cupom} aplicado com sucesso! Desconto de 15% será calculado no carrinho.`);
            } else if (cupom.length > 0) {
                alert(`Cupom ${cupom} inválido. Verifique o código.`);
            } else {
                alert('Por favor, digite o código do cupom.');
            }
        }
// =========================================================
// 1. DADOS E VARIÁVEIS GLOBAIS
// =========================================================

// Variável Global: Carrega o carrinho do Local Storage ou inicia vazio
let shoppingCart = JSON.parse(localStorage.getItem('aromaluxCart')) || []; 

const productsCatalog = [
    // Amadeirados Masculinos
    { id: 'M001', name: 'Unissex Lux', category: 'Amadeirados', price: 280.00, notes: 'Couro, Pimenta Negra, Vetiver.', image: "img/Unissex Lux.jpeg", isBestSeller: true, isSale: false },
    { id: 'M002', name: 'Aroma lux', category: 'Amadeirados', price: 300.00, notes: 'Compre 1 e leve outro com 50% de desconto', image: 'img/Aroma lux.jpeg', isBestSeller: false, isSale: false },
    { id: 'M003', name: 'Good Girl', category: 'Amadeirados', price: 270.00, oldPrice: 220.00, notes: 'Pinheiro, Musgo de Carvalho, Âmbar.', image: 'img/Good Girl.jpeg', isBestSeller: false, isSale: true },
];

// =========================================================
// 2. FUNÇÕES DE ARMAZENAMENTO E ATUALIZAÇÃO
// =========================================================

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = shoppingCart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

function saveCart() {
    localStorage.setItem('aromaluxCart', JSON.stringify(shoppingCart));
    updateCartCount();
    if (document.getElementById('cart-items-container')) {
        renderCartItems(); 
    }
}

function addToCart(productId) {
    const product = productsCatalog.find(p => p.id === productId); 
    
    if (product) {
        const existingItem = shoppingCart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // Se o preço fosse dinâmico, buscaríamos ele aqui, mas como é estático, ok:
            shoppingCart.push({ 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                quantity: 1 
            });
        }
        
        saveCart(); 
        alert(`✅ ${product.name} adicionado ao carrinho!`);
    } else {
        console.error(`Produto com ID ${productId} não encontrado no catálogo.`);
    }
}


// =========================================================
// 3. FUNÇÕES DE CONTROLE DO CARRINHO (Manipulação de Itens)
// =========================================================

function removeItemFromCart(productId) {
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    saveCart();
}

function increaseQuantity(productId) {
    const item = shoppingCart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        saveCart();
    }
}

function decreaseQuantity(productId) {
    const item = shoppingCart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCart();
    } else if (item && item.quantity === 1) {
        removeItemFromCart(productId);
    }
}


// =========================================================
// 4. FUNÇÕES DE RENDERIZAÇÃO DO CARRINHO (SOLUÇÃO DE IMAGEM/PREÇO)
// =========================================================

/**
 * Renderiza um único item do carrinho.
 */
function renderCartItem(item, container) {
    // CHAVE: Busca os dados completos, INCLUINDO o path da imagem no catálogo
    const productData = productsCatalog.find(p => p.id === item.id);
    
    // Se o produto não for encontrado no catálogo (ex: item descontinuado), não renderiza e evita erros.
    if (!productData) {
        console.warn(`Item ID ${item.id} no carrinho, mas não encontrado no catálogo.`);
        return; 
    }

    const itemTotal = item.price * item.quantity;
    const precoUnitarioFormatado = item.price.toFixed(2).replace('.', ',');

    const itemHtml = `
        <div class="cart-item" data-item-id="${item.id}">
            
            <img src="${productData.image}" alt="${item.name}" class="cart-item-img">
            
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                
                <p>Preço Unit.: R$ ${precoUnitarioFormatado}</p>
                
                <div class="cart-item-controls">
                    <button class="btn-qty-minus" data-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="btn-qty-plus" data-id="${item.id}">+</button>
                    <button class="btn-remove" data-id="${item.id}">Remover</button>
                </div>
            </div>
            <p class="cart-item-total">Total: R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', itemHtml);
}


function renderCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartContainer || !cartTotalElement) return; 

    cartContainer.innerHTML = ''; 

    if (shoppingCart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio. Adicione um perfume!</p>';
        cartTotalElement.textContent = 'R$ 0,00';
        return;
    }

    let totalGeral = 0;

    shoppingCart.forEach(item => {
        renderCartItem(item, cartContainer);
        totalGeral += item.price * item.quantity;
    });

    cartTotalElement.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    setupCartControls(cartContainer);
}


function setupCartControls(container) {
    container.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            removeItemFromCart(e.currentTarget.getAttribute('data-id'));
        });
    });

    container.querySelectorAll('.btn-qty-plus').forEach(button => {
        button.addEventListener('click', (e) => {
            increaseQuantity(e.currentTarget.getAttribute('data-id'));
        });
    });

    container.querySelectorAll('.btn-qty-minus').forEach(button => {
        button.addEventListener('click', (e) => {
            decreaseQuantity(e.currentTarget.getAttribute('data-id'));
        });
    });
}


// =========================================================
// 5. FUNÇÃO DE RENDERIZAÇÃO DE PRODUTOS (PÁGINA CATÁLOGO)
// =========================================================

function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; 

    const productsHtml = products.map(product => {
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

    container.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            addToCart(event.currentTarget.getAttribute('data-product-id'));
        });
    });
}

function initMasculinoPage() {
    const amadeirados = productsCatalog.filter(p => p.category === 'Amadeirados');
    renderProducts(amadeirados, 'amadeirados-grid');

    const frescos = productsCatalog.filter(p => p.category === 'Frescos');
    renderProducts(frescos, 'frescos-grid');
}


// =========================================================
// 6. EVENTO PRINCIPAL DE CARREGAMENTO DO DOCUMENTO
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); 
    
    // Inicializa a renderização da página Masculino
    if (document.getElementById('amadeirados-grid')) {
        initMasculinoPage();
    }

    // Inicializa a renderização da página do Carrinho
    if (document.getElementById('cart-items-container')) {
        renderCartItems(); 
    }
});
        