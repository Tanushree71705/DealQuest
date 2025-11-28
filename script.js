let allProducts = [];

const brandsMap = {};

Promise.all([
  fetch("data/amazon.json").then(res => res.json()),
  fetch("data/flipkart.json").then(res => res.json()),
  fetch("data/reliance.json").then(res => res.json())
]).then(([amazon, flipkart, reliance]) => {
  amazon.forEach(p => p.source = 'Amazon');
  flipkart.forEach(p => p.source = 'Flipkart');
  reliance.forEach(p => p.source = 'Reliance');

  allProducts = [...amazon, ...flipkart, ...reliance];
  groupByBrand();
  displayBrands();
});


function groupByBrand() {
  allProducts.forEach(product => {
    const [brand, model] = product.name.split(" ", 2);
    const brandKey = brand.toLowerCase();
    if (!brandsMap[brandKey]) brandsMap[brandKey] = {};
    if (!brandsMap[brandKey][product.name]) brandsMap[brandKey][product.name] = [];
    brandsMap[brandKey][product.name].push(product);
  });
}

function displayBrands(filterText = "", sortBy = "") {
  const container = document.getElementById('brand-container');
  container.innerHTML = "";

  Object.entries(brandsMap).forEach(([brand, models]) => {
    if (filterText && !brand.includes(filterText)) return;

    const brandSection = document.createElement("div");
    brandSection.className = "brand-section";

    const header = document.createElement("div");
    header.className = "brand-header";
    header.innerText = brand.charAt(0).toUpperCase() + brand.slice(1);
    header.onclick = () => {
      const content = brandSection.querySelector(".model-container");
      content.style.display = content.style.display === "none" ? "block" : "none";
    };

    const modelContainer = document.createElement("div");
    modelContainer.className = "model-container";
    modelContainer.style.display = "none";

    Object.entries(models).forEach(([modelName, items]) => {
      if (filterText && !modelName.toLowerCase().includes(filterText)) return;

      if (sortBy) {
  if (sortBy.includes("price")) {
    items.sort((a, b) => sortBy === "price-asc" ? a.price - b.price : b.price - a.price);
  } else if (sortBy === "reviews") {
    items.sort((a, b) => b.reviews - a.reviews);
  } else if (sortBy === "cashback") {
    items.sort((a, b) => b.cashback - a.cashback);
  }
}


      const modelDiv = document.createElement("div");
      modelDiv.className = "model";
      modelDiv.innerHTML = `<h3>${modelName}</h3>`;

      const row = document.createElement("div");
      row.className = "product-row";

      items.forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";
       card.innerHTML = `
  <a href="${item.link}" target="_blank">
    <img src="${item.image}" alt="${item.name}" onerror="this.src='fallback.jpg'">
    <p><strong>${item.name}</strong></p>
  </a>
  <p><strong>${item.source}</strong></p>
  <p>Price: ₹${item.price}</p>
  <p>Reviews: ⭐ ${item.reviews}</p>
  <p>Cashback: ${item.cashbackType === "percent" ? item.cashback + "%" : "₹" + item.cashback}</p>

`;


        row.appendChild(card);
      });

      modelDiv.appendChild(row);
      modelContainer.appendChild(modelDiv);
    });

    brandSection.appendChild(header);
    brandSection.appendChild(modelContainer);
    container.appendChild(brandSection);
  });
}

function filterData() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const sortBy = document.getElementById('sortOption').value;
  displayBrands(search, sortBy);
}

