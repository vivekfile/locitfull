const DEFAULT_PRODUCT_IMAGE = "/assets/logo.png";

const productImageCache = new Map();

async function getProductImageUrl(productId) {
    if (productImageCache.has(productId)) {
        return productImageCache.get(productId);
    }

    try {
        const images = await LocitAPI.getProductImages(productId);

        if (images.length > 0) {
            productImageCache.set(productId, images[0].imageUrl);
            return images[0].imageUrl;
        }
    } catch (error) {
        console.warn("Could not load image for product", productId, error);
    }

    productImageCache.set(productId, DEFAULT_PRODUCT_IMAGE);
    return DEFAULT_PRODUCT_IMAGE;
}

function formatPrice(price) {
    return `₹${Number(price).toFixed(0)}`;
}

function createProductCard(product, imageUrl, onAddToCart) {
    const card = document.createElement("div");
    card.className = "best-selling-item-card";
    card.innerHTML = `
        <div class="card-image">
            <img src="${imageUrl}" alt="${product.productName}">
        </div>
        <div class="card-des">
            <p>${product.productName}</p>
            <p>${product.shop ? product.shop.shopName : "Nearby shop"}</p>
            <p>${formatPrice(product.price)}</p>
            <div class="addBtn" data-product-id="${product.productId}">
                <p>+&nbsp;&nbsp;Add</p>
            </div>
        </div>
    `;

    card.querySelector(".addBtn").addEventListener("click", () => {
        onAddToCart(product.productId);
    });

    return card;
}

function createCatalogCard(product, imageUrl, onAddToCart) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.productName}">
        <div class="card-content">
            <div class="title">${product.productName}</div>
            <div class="description">${product.description || product.shop?.shopName || "Local product"}</div>
            <div class="price">${formatPrice(product.price)}</div>
            <div class="rating">${product.shop?.city || "Hisar"}</div>
            <button class="btn" data-product-id="${product.productId}">Add To Cart</button>
        </div>
    `;

    card.querySelector(".btn").addEventListener("click", () => {
        onAddToCart(product.productId);
    });

    return card;
}

async function renderProductCards(container, products, cardFactory, onAddToCart) {
    container.innerHTML = "";

    if (!products.length) {
        container.innerHTML = "<p>No products available from nearby shops yet.</p>";
        return;
    }

    for (const product of products) {
        const imageUrl = await getProductImageUrl(product.productId);
        container.appendChild(cardFactory(product, imageUrl, onAddToCart));
    }
}

async function loadProductsIntoContainer(container, cardFactory, onAddToCart, limit) {
    const products = await LocitAPI.getProducts();
    const availableProducts = products.filter((product) => product.isAvailable !== false);
    const displayProducts = typeof limit === "number"
        ? availableProducts.slice(0, limit)
        : availableProducts;

    await renderProductCards(container, displayProducts, cardFactory, onAddToCart);
}

async function searchAndRenderProducts(container, query, cardFactory, onAddToCart) {
    const products = query.trim()
        ? await LocitAPI.searchProducts(query.trim())
        : await LocitAPI.getProducts();

    await renderProductCards(
        container,
        products.filter((product) => product.isAvailable !== false),
        cardFactory,
        onAddToCart
    );
}
