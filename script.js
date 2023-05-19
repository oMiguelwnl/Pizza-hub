let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//Listagem das pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true); // Clona o item.

  pizzaItem.setAttribute("data-key", index); //Seleciona a key da pizza.

  // Informações das Pizzas:
  pizzaItem.querySelector(".pizza-item--img img").src = item.img; //Coloca a imagem.
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`; //Coloca a preco.
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name; //Coloca a nome.
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description; //Coloca a descrição.

  // Adiciona o evento de click:
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault(); // Bloqueia ações iniciais.

    let key = e.target.closest(".pizza-item").getAttribute("data-key"); // Identifica em qual pizza você clicou.
    //Reseta a quantidade
    modalQt = 1;
    //Indentifica qual é a pizza.
    modalKey = key;

    // Informações do Modal :
    c(".pizzaBig img").src = pizzaJson[key].img; //Adiciona a imagem ao Modal.
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name; //Adiciona o nome ao Modal.
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description; //Adiciona a descrição ao Modal.
    c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2
    )}`; //Adiciona o preco ao Modal.

    c(".pizzaInfo--size.selected").classList.remove("selected");

    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    c(".pizzaInfo--qt").innerHTML = modalQt;

    // Animações do Modal:
    c(".pizzaWindowArea").style.opacity = 0;

    c(".pizzaWindowArea").style.display = "flex"; //Mostra o modal

    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  c(".pizza-area").append(pizzaItem);
});

// Eventos do Modal
function closeModal() {
  c(".pizzaWindowArea").style.opacity = 0;

  setTimeout(() => {
    c(".pizzaWindowArea").style.display = "none";
  }, 500);
}
// Fecha o Modal
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

// Ações de Adicionar e reduzir a quantidade de pizzas:
// Adicionar
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  c(".pizzaInfo--qt").innerHTML = modalQt;
});
// Reduzir
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    c(".pizzaInfo--qt").innerHTML = modalQt;
  }
});

// Adicionar o evento de click dentro da seleção de tamanho:
cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    c(".pizzaInfo--size.selected").classList.remove("selected"); // Desmarca todos os escolhidos anteriormente.
    size.classList.add("selected"); // Adiciona o item que você clicou.
  });
});

// Carrinho das Pizzas

c(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));

  // Indentificador
  let identifier = pizzaJson[modalKey].id + "@" + size;

  // Indetifica se já existe esse item no carrinho.
  let key = cart.findIndex((item) => item.identifier == identifier);

  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }

  //Atualiza o cart
  updateCart();

  //Fecha o modal.
  closeModal();
});

// Abre a área do cart no Mobile.
c(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    c("aside").style.left = "0";
  }
});
// Fecha a área do cart no Mobile.
c(".menu-closer").addEventListener("click", () => {
  c("aside").style.left = "100vw";
});

// Cart Area
function updateCart() {
  c(".menu-openner span").innerHTML = cart.length; // Aumenta a quantidades de itens no cart mobile.

  //Mostra os itens no cart.
  if (cart.length > 0) {
    c("aside").classList.add("show");
    //Zera os itens
    c(".cart").innerHTML = "";

    //Medidas:
    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    //Informações no cart:
    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id); // Procura pelo item.
      subtotal += pizzaItem.price * cart[i].qt;

      let cartItem = c(".models .cart--item").cloneNode(true); // Clona o item.

      // Tamanho das pizzas no Cart:
      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      // Informações no cart:
      cartItem.querySelector("img").src = pizzaItem.img; // Adiciona a img ao cart.
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName; // Adiciona o nome ao cart.
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt; // Adiciona a quantidade ao cart.

      // Aumentar e Diminuir a quantidade de Pizzas dentro do cart:
      // Aumenta.
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });
      // Diminui.
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });

      c(".cart").append(cartItem); // Adiciona
    }
    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    // Fecha o cart:
    c("aside").classList.remove("show");
    c("aside").style.left = "100vw";
  }
}
