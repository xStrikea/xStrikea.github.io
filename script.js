const container = document.getElementById('productContainer');
const pagination = document.getElementById('pagination');
let perPage = 9;

if (window.innerWidth >= 768 && window.innerWidth < 1400) perPage = 15;
else if (window.innerWidth >= 1400) perPage = 20;

let currentPage = 1;
let products = [];

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    renderPage(currentPage);
    renderPagination();
    runAnimations();
  });

function renderPage(page) {
  container.innerHTML = '';
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const items = products.slice(start, end);

  items.forEach(item => {
    const card = document.createElement('a');
    card.href = item.url;
    card.target = "_blank";
    card.className = 'product-card';

    const creatorHTML = item.creator === 'xSpecter'
      ? `<div style="display:inline-flex;align-items:center;gap:4px;"><span>${item.creator}</span><img src="image/official.png" alt="Official" style="width:1em;height:1em;"></div>`
      : `<span>${item.creator}</span>`;

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="info">
        <h3>${item.name}</h3>
        <p>By ${creatorHTML}</p>
        <span>${item.os_or_code}</span>
      </div>`;
    container.appendChild(card);
  });

  gsap.fromTo('.product-card', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" });
}

function renderPagination() {
  pagination.innerHTML = '';
  const totalPages = Math.ceil(products.length / perPage);

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '<';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => changePage(currentPage - 1);
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.toggle('active', i === currentPage);
    btn.onclick = () => changePage(i);
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => changePage(currentPage + 1);
  pagination.appendChild(nextBtn);

  gsap.fromTo('.pagination', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
}

function changePage(page) {
  currentPage = page;
  renderPage(page);
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function runAnimations() {
  gsap.to('.navbar', { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
  gsap.to('.hero', { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
  gsap.to('.divider', { opacity: 1, scaleX: 1, duration: 0.8, delay: 0.8 });
  gsap.to('.contribute', { opacity: 1, y: 0, duration: 0.8, delay: 1 });
}

// Resize adaptive pagination with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth < 768) perPage = 6;
    else if (window.innerWidth < 1400) perPage = 15;
    else perPage = 20;
    currentPage = 1;
    renderPage(currentPage);
    renderPagination();
  }, 200);
});
