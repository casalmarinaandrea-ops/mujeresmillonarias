const diaryPages = [
  { src: "assets/diario_1.png", caption: "Página 1 de 8 · Portada" },
  { src: "assets/diario_2.png", caption: "Página 2 de 8 · Cómo utilizar este diario" },
  { src: "assets/diario_3.png", caption: "Página 3 de 8 · Consejos de uso" },
  { src: "assets/diario_4.png", caption: "Página 4 de 8 · Meta del mes" },
  { src: "assets/diario_5.png", caption: "Página 5 de 8 · Afirmaciones y positividad" },
  { src: "assets/diario_6.png", caption: "Página 6 de 8 · Tareas del día" },
  { src: "assets/diario_7.png", caption: "Página 7 de 8 · Cómo me siento" },
  { src: "assets/diario_8.png", caption: "Página 8 de 8 · Análisis semanal" }
];

const products = [
  {
    id: 1,
    name: "Diario de Gratitud",
    price: 40000,
    image: "assets/diario_1.png",
    description: "Diario de gratitud con todas las páginas para agradecer, escribir afirmaciones, ordenar metas, registrar tareas y revisar tu semana."
  },
  {
    id: 2,
    name: "Taza Mujeres Millonarias",
    price: 20000,
    image: "assets/taza.png",
    description: "Taza inspiracional con diseño lila y dorado. Ideal para acompañar tu café, té o rutina de journaling."
  },
  {
    id: 3,
    name: "Vela de Lavanda",
    price: 25000,
    image: "assets/vela.png",
    description: "Vela aromática con aroma a lavanda, ideal para crear un ambiente de calma, gratitud y manifestación."
  },
  {
    id: 4,
    name: "Plancha de Stickers",
    price: 5000,
    image: "assets/stickers.png",
    description: "Stickers para termo, computadora, agenda o cuaderno con frases de poder, abundancia y amor propio."
  },
  {
    id: 5,
    name: "Box Mujeres Millonarias",
    price: 41000,
    image: "assets/box.png",
    description: "Box especial Mujeres Millonarias con estética premium para regalar o regalarte una experiencia de abundancia."
  }
];

let currentPage = 0;
let cart = [];

const BACKEND_URL = "https://mujeresmillonarias.onrender.com";

const formatARS = value => new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
}).format(value);

function updateDiaryPage() {
  const page = diaryPages[currentPage];
  document.getElementById("diaryPage").src = page.src;
  document.getElementById("galleryCaption").textContent = page.caption;

  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentPage);
  });
}

function renderDots() {
  const dots = document.getElementById("dots");
  dots.innerHTML = diaryPages.map((_, index) => `
    <button class="dot ${index === currentPage ? "active" : ""}" onclick="goToPage(${index})" aria-label="Ir a página ${index + 1}"></button>
  `).join("");
}

function goToPage(index) {
  currentPage = index;
  updateDiaryPage();
}

document.getElementById("prevPage").addEventListener("click", () => {
  currentPage = (currentPage - 1 + diaryPages.length) % diaryPages.length;
  updateDiaryPage();
});

document.getElementById("nextPage").addEventListener("click", () => {
  currentPage = (currentPage + 1) % diaryPages.length;
  updateDiaryPage();
});

function renderProducts() {
  const container = document.getElementById("productList");

  container.innerHTML = products.map(product => `
    <article class="product">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price">${formatARS(product.price)}</div>
      <label class="qty">
        Cantidad:
        <input id="qty-${product.id}" type="number" min="1" value="1">
      </label>
      <button class="btn primary" onclick="addToCart(${product.id})">Agregar al carrito</button>
    </article>
  `).join("");
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const quantity = Math.max(1, parseInt(document.getElementById(`qty-${productId}`).value || "1", 10));

  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ ...product, quantity });

  renderCart();
  document.getElementById("carrito").scrollIntoView({ behavior: "smooth" });
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatARS(total);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty">Tu carrito está vacío.</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-row">
      <strong>${item.name}</strong>
      <span>x ${item.quantity}</span>
      <span>${formatARS(item.price * item.quantity)}</span>
      <button onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join("");
}

const modal = document.getElementById("customerModal");

function openModal() {
  modal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("show");
  document.body.classList.remove("modal-open");
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  openModal();
});

document.getElementById("closeModal").addEventListener("click", closeModal);

modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});

document.getElementById("customerForm").addEventListener("submit", async event => {
  event.preventDefault();

  const customer = {
    nombre: document.getElementById("firstName").value.trim(),
    apellido: document.getElementById("lastName").value.trim(),
    mail: document.getElementById("email").value.trim(),
    celular: document.getElementById("phone").value.trim(),
    direccion: {
      calle: document.getElementById("street").value.trim(),
      numero: document.getElementById("number").value.trim(),
      localidad: document.getElementById("city").value.trim(),
      codigoPostal: document.getElementById("zip").value.trim()
    }
  };

  const order = {
    customer,
    cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };

  try {
    const response = await fetch(`${BACKEND_URL}/crear-preferencia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });

    const data = await response.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert("No se pudo iniciar el pago. Revisá Render o Mercado Pago.");
      console.error(data);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al conectar con Mercado Pago.");
  }
});

renderDots();
updateDiaryPage();
renderProducts();
renderCart();