   // =========================================================
        // 1. DADOS E VARIÁVEIS GLOBAIS
        // =========================================================

        let shoppingCart = JSON.parse(localStorage.getItem('aromaluxCart')) || []; 
        let currentDiscount = 0; // Armazena o valor do desconto em R$

        const productsCatalog = [
            // Masculino
            { id: 'M001', name: 'Vetor Intense EDP', category: 'Amadeirados', price: 30.00, notes: 'Couro, Pimenta Negra, Vetiver.', image: "https://placehold.co/80x80/8b5cf6/ffffff?text=Vetor", isBestSeller: true, isSale: false },
            { id: 'M002', name: 'Cedro Real Parfum', category: 'Amadeirados', price: 450.00, notes: 'Cedro, Sândalo, Patchouli.', image: 'https://placehold.co/80x80/1f2937/ffffff?text=Cedro', isBestSeller: false, isSale: false },
            { id: 'M003', name: 'Explorador EDT', category: 'Amadeirados', price: 187.00, oldPrice: 220.00, notes: 'Pinheiro, Musgo de Carvalho, Âmbar.', image: 'https://placehold.co/80x80/4f46e5/ffffff?text=Exp', isBestSeller: false, isSale: true },
            // Feminino
            { id: 'F001', name: 'Bella Flora ', category: 'Florais', price: 689.00, notes: 'Rosas de Maio, Peônia Branca, Baunilha.', image: "https://placehold.co/80x80/f472b6/ffffff?text=Bella", isBestSeller: true, isSale: false },
            { id: 'F002', name: 'Fleur de Soie', category: 'Florais', price: 150.00, notes: 'Rosas de Maio, Peônia Branca, Baunilha.', image: "https://placehold.co/80x80/f472b6/ffffff?text=Bella", isBestSeller: true, isSale: false },
            { id: 'F003', name: 'Floratta Doce', category: 'Florais', price: 187.00, notes: 'Rosas de Maio, Peônia Branca, Baunilha.', image: "https://placehold.co/80x80/f472b6/ffffff?text=Bella", isBestSeller: true, isSale: false },
            { id: 'F004', name: 'Mar Profundo EDC', category: 'Florais', price: 80.00, notes: 'Rosas de Maio, Peônia Branca, Baunilha.', image: "https://placehold.co/80x80/f472b6/ffffff?text=Bella", isBestSeller: true, isSale: false },
        ];

        // Cupons disponíveis (simulação)
        const availableCoupons = {
            'AROMALUX15': 0.15, // 15% de desconto
            'FRETEGRATIS': 0.00,
        };

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
                    shoppingCart.push({ 
                        id: product.id, 
                        name: product.name, 
                        price: product.price, 
                        quantity: 1 
                    });
                }
                
                saveCart(); 
                // Usando console.log em vez de alert para não interromper a UI
                console.log(`✅ ${product.name} adicionado ao carrinho!`); 
            }
        }


        // =========================================================
        // 3. FUNÇÕES DE CONTROLE DO CARRINHO
        // =========================================================

        function removeItemFromCart(productId) {
            shoppingCart = shoppingCart.filter(item => item.id !== productId);
            saveCart();
            // Recalcula totais após remoção
            calculateAndRenderTotals();
        }

        function increaseQuantity(productId) {
            const item = shoppingCart.find(item => item.id === productId);
            if (item) {
                item.quantity += 1;
                saveCart();
                calculateAndRenderTotals();
            }
        }

        function decreaseQuantity(productId) {
            const item = shoppingCart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                saveCart();
                calculateAndRenderTotals();
            } else if (item && item.quantity === 1) {
                removeItemFromCart(productId);
            }
        }


        // =========================================================
        // 4. FUNÇÕES DE RENDERIZAÇÃO E CÁLCULO
        // =========================================================

        /**
         * Renderiza um único item do carrinho.
         */
        function renderCartItem(item, container) {
            // Busca os dados completos no productsCatalog (incluindo o caminho da imagem)
            const productData = productsCatalog.find(p => p.id === item.id);
            
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
                        <h4 class="text-gray-900">${item.name}</h4>
                        
                        <p class="text-sm text-gray-600">Preço Unit.: R$ ${precoUnitarioFormatado}</p>
                        
                        <div class="cart-item-controls">
                            <button class="btn-qty-minus bg-gray-200 hover:bg-gray-300 text-gray-700" data-id="${item.id}">-</button>
                            <span class="item-quantity px-2 font-medium">${item.quantity}</span>
                            <button class="btn-qty-plus bg-gray-200 hover:bg-gray-300 text-gray-700" data-id="${item.id}">+</button>
                            <button class="btn-remove bg-red-500 hover:bg-red-600 text-white border-none">Remover</button>
                        </div>
                    </div>
                    <p class="cart-item-total text-purple-700">R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', itemHtml);
        }

        /**
         * Calcula o subtotal, aplica descontos e frete.
         */
        function calculateAndRenderTotals() {
            const subtotalElement = document.getElementById('subtotal');
            const discountElement = document.getElementById('discount-amount');
            const shippingElement = document.getElementById('shipping-cost');
            const finalTotalElement = document.getElementById('final-total');

            // 1. Calcular Subtotal
            const subtotal = shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            // 2. Aplicar Desconto (Cupom)
            // currentDiscount é definido pela função applyCouponToCheckout()
            const totalAposCupom = subtotal - currentDiscount; 
            
            // 3. Aplicar Frete (Simulação: Frete grátis acima de R$ 500)
            const shippingCost = subtotal >= 100 ? 0 : 35.00; 

            // 4. Calcular Total Final (após cupom e frete)
            let finalTotal = totalAposCupom + shippingCost;
            
            // 5. Aplicar Desconto de Pagamento (Pix/Boleto, 10% OFF no total)
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
            let paymentDiscount = 0;

            if (finalTotal > 0 && (paymentMethod === 'pix' || paymentMethod === 'boleto')) {
                paymentDiscount = finalTotal * 0.10;
                finalTotal -= paymentDiscount;
            }
            
            // 6. Atualizar TELA
            subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            discountElement.textContent = `- R$ ${(currentDiscount + paymentDiscount).toFixed(2).replace('.', ',')}`;
            shippingElement.textContent = shippingCost === 0 ? 'GRÁTIS' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`;
            finalTotalElement.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
        }


        /**
         * Lê o carrinho e renderiza todos os itens na página.
         */
        function renderCartItems() {
            const cartContainer = document.getElementById('cart-items-container');
            
            if (!cartContainer) return; 

            cartContainer.innerHTML = ''; 

            if (shoppingCart.length === 0) {
                cartContainer.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio. Adicione um perfume!</p>';
                document.getElementById('subtotal').textContent = 'R$ 0,00'; // Atualiza o subtotal
                document.getElementById('final-total').textContent = 'R$ 0,00'; // Atualiza o total
                return;
            }

            shoppingCart.forEach(item => {
                renderCartItem(item, cartContainer);
            });
            
            // Recalcula totais na renderização inicial
            calculateAndRenderTotals();
            setupCartControls(cartContainer);
        }

        /**
         * Configura os event listeners para os botões de controle (aumentar, diminuir, remover).
         */
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
        // 5. FUNÇÕES DE CHECKOUT E UI
        // =========================================================

        function applyCouponToCheckout() {
            const input = document.getElementById('checkoutCupomInput');
            const status = document.getElementById('cupom-status');
            const couponCode = input.value.toUpperCase().trim();

            if (availableCoupons.hasOwnProperty(couponCode) && availableCoupons[couponCode] > 0) {
                // Aplica a porcentagem de desconto sobre o subtotal
                const subtotal = shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0);
                const discountPercentage = availableCoupons[couponCode];
                currentDiscount = subtotal * discountPercentage;

                status.textContent = `Cupom '${couponCode}' aplicado! (${(discountPercentage * 100).toFixed(0)}% OFF)`;
                status.classList.remove('text-gray-500', 'text-red-500');
                status.classList.add('text-green-600');
            } else if (couponCode === 'FRETEGRATIS') {
                 // Esta simulação não usa um cupom de frete, mas poderia ser implementado
                 status.textContent = `Cupom de frete aplicado com sucesso!`;
                 currentDiscount = 0; // Neste caso, o desconto é no frete, não no valor.
                 status.classList.add('text-green-600');
            } else {
                currentDiscount = 0;
                status.textContent = 'Cupom inválido ou expirado.';
                status.classList.remove('text-gray-500', 'text-green-600');
                status.classList.add('text-red-500');
            }

            calculateAndRenderTotals();
        }

        function finalizeOrder() {
            const cartItemsContainer = document.getElementById('cart-items-container');
            const successMessage = document.getElementById('checkout-success');
            
            if (shoppingCart.length === 0) {
                 // Usando console.log em vez de alert
                console.log("Seu carrinho está vazio. Adicione produtos antes de finalizar.");
                return; 
            }

            // Simulação de processamento de pedido
            // 1. Limpa o carrinho
            shoppingCart = [];
            saveCart(); 
            
            // 2. Atualiza UI
            renderCartItems(); // Renderiza o carrinho vazio
            successMessage.classList.remove('hidden'); // Exibe mensagem de sucesso
            
            // 3. Opcional: Esconde a mensagem de sucesso após alguns segundos
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 8000);
        }

        function toggleCardForm() {
            const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
            const cardFormArea = document.getElementById('card-form-area');
            
            // Garante que o cálculo dos totais seja refeito ao mudar a forma de pagamento (desconto de 10% para Pix/Boleto)
            paymentOptions.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.value === 'credito' || e.target.value === 'debito') {
                        cardFormArea.classList.remove('hidden');
                    } else {
                        cardFormArea.classList.add('hidden');
                    }
                    calculateAndRenderTotals(); // Recalcula totais e desconto de pagamento
                });
            });
        }


        // =========================================================
        // 6. EVENTO PRINCIPAL DE CARREGAMENTO DO DOCUMENTO
        // =========================================================

        document.addEventListener('DOMContentLoaded', () => {
            updateCartCount(); 
            renderCartItems(); 
            toggleCardForm();
            
            // Adiciona alguns produtos de teste ao LocalStorage se estiver vazio
            if (shoppingCart.length === 0) {
                shoppingCart[0].quantity = 1; // Simula 2 unidades de Vetor
                saveCart();
            }
        });