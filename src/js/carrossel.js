// carrossel.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página carregada.');
// Seleciona os elementos do carrossel
  const carouselTrack = document.querySelector('.carousel-track');
  const images = Array.from(document.querySelectorAll('.carousel-track img')); 
  const indicators = document.querySelectorAll('.indicator');
  const carouselContainer = document.querySelector('.carousel-images');
// Variáveis para controle do estado do carrossel
  let currentIndex = 0;
  let autoSlideInterval;
  let carouselTimeout = null;

  // Cria clones da primeira e última imagem para o efeito de loop infinito suave
  const firstClone = images[0].cloneNode(true);
  const lastClone = images[images.length - 1].cloneNode(true);
  
  firstClone.dataset.clone = "true";
  lastClone.dataset.clone = "true";

  carouselTrack.appendChild(firstClone);
  carouselTrack.insertBefore(lastClone, images[0]);

  const totalOriginalImages = images.length;
  // Começamos em -100% porque inserimos o clone da última imagem antes da primeira real
  carouselTrack.style.transform = `translateX(-100%)`; 

  // Atualiza as "bolinhas" indicadoras
  function updateIndicators() {
    indicators.forEach((indicator, i) => {
      // Usamos modulação para garantir que se o índice passar do limite (pelo clone), a bolinha certa acenda
      const activeIndex = (currentIndex + totalOriginalImages) % totalOriginalImages;
      if (i === activeIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // Faz a transição para a próxima imagem
  function moveCarousel() {
    carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    // O +1 compensa o fato de termos uma imagem clone antes do índice 0 real
    carouselTrack.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
    updateIndicators();
  }

  function resetCarouselPosition() {
    // Se o carrossel avançou até o clone da primeira imagem (no final real)
    if (currentIndex >= totalOriginalImages) { 
      carouselTrack.style.transition = 'none'; // Tira a animação
      currentIndex = 0; // Volta para o primeiro índice real
      carouselTrack.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
    } 
    // Se o carrossel voltou até o clone da última imagem (no início real)
    else if (currentIndex < 0) { 
      carouselTrack.style.transition = 'none';
      currentIndex = totalOriginalImages - 1; // Volta para o último índice real
      carouselTrack.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
    }
  }

  // Listener com timeout fallback
  carouselTrack.addEventListener('transitionend', () => {
    clearTimeout(carouselTimeout);
    resetCarouselPosition();
  });

  // Se transitionend não dispara em 1 segundo, forçar
  carouselTrack.addEventListener('click', () => {
      carouselTimeout = setTimeout(resetCarouselPosition, 1000);
  });



  // Função para passar automaticamente
  function autoSlide() {
    currentIndex++; // incrementa e move!
    moveCarousel();
  }

  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(autoSlide, 4000); // 4 segundos
  }

  // Clicar nos indicadores
  indicators.forEach((indicator, i) => {
    indicator.addEventListener('click', () => {
      currentIndex = i;
      moveCarousel();
    });
  });

  // Pausa ao passar o mouse por cima do carrossel
  carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  // Volta a rodar quando tira o mouse
  carouselContainer.addEventListener('mouseleave', startAutoSlide);

  startAutoSlide();
});
