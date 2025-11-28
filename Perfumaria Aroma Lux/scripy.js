document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Configuração do Carrossel (Apenas para a página index.html)
    const carouselContainer = document.querySelector('.carousel-container');

    if (carouselContainer) {
        const carouselSlide = document.querySelector('.carousel-slide');
        const slides = document.querySelectorAll('.slide-item');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentIndex = 0;
        const totalSlides = slides.length;

        function moveToSlide(index) {
            const offset = -index * 100;
            carouselSlide.style.transform = `translateX(${offset}vw)`;
            currentIndex = index;
        }

        nextBtn.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= totalSlides) {
                nextIndex = 0; 
            }
            moveToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = totalSlides - 1; 
            }
            moveToSlide(prevIndex);
        });

        // Autoplay (opcional, ativa após 5 segundos)
        setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= totalSlides) {
                nextIndex = 0; 
            }
            moveToSlide(nextIndex);
        }, 5000); 
    }

    // 2. Interatividade de Adicionar ao Carrinho (Simulação em todas as páginas)
    const addCartButtons = document.querySelectorAll('.btn-add-cart, .btn-primary');
    addCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Verifica se o botão é um dos botões de compra ou de kit/oferta
            if (e.target.textContent.includes('Comprar') || 
                e.target.textContent.includes('Adicionar') || 
                e.target.textContent.includes('Oferta') ||
                e.target.textContent.includes('Ver Coleção')) {
                
                // Pega o nome do produto no card, se existir
                const productCard = e.target.closest('.product-card') || e.target.closest('.large-card');
                let productName = 'Item';

                if (productCard) {
                    const titleElement = productCard.querySelector('h3');
                    if (titleElement) {
                         productName = titleElement.textContent;
                    }
                }
                
                // Simulação: Apenas mostra que o item foi adicionado
                if (productName !== 'Item') { // Evita alerta se for um botão genérico
                    alert(`"${productName}" foi adicionado ao seu carrinho!`);
                }
            }
        });
    });
});