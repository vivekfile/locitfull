document.addEventListener("DOMContentLoaded", async () => {
    const user = requireAuth();
    if (!user) {
        return;
    }

    updateAccountLabel();
    await refreshCartCount();

    const productContainer = document.querySelector(".best-selling-product-container");
    const nearbyContainer = document.querySelector(".shop-container");
    const searchInput = document.querySelector(".search-bar input");
    const locationLabel = document.querySelector(".location p");

    if (locationLabel) {
        locationLabel.textContent = LOCIT_CONFIG.DEFAULT_LOCATION.label;
    }

    if (productContainer) {
        try {
            await loadProductsIntoContainer(
                productContainer,
                createProductCard,
                addProductToCart,
                8
            );
        } catch (error) {
            productContainer.innerHTML = `<p>Could not load products: ${error.message}</p>`;
        }
    }

    if (nearbyContainer) {
        try {
            await renderNearbyShops(nearbyContainer);
        } catch (error) {
            console.error(error);
        }
    }

    if (searchInput) {
        let searchTimeout;

        searchInput.addEventListener("input", () => {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(async () => {
                if (!productContainer) {
                    return;
                }

                try {
                    await searchAndRenderProducts(
                        productContainer,
                        searchInput.value,
                        createProductCard,
                        addProductToCart
                    );
                } catch (error) {
                    productContainer.innerHTML = `<p>Search failed: ${error.message}</p>`;
                }
            }, 350);
        });
    }

    const startSellingBtn = document.querySelector(".start-selling-btn a");
    if (startSellingBtn) {
        startSellingBtn.href = "/seller-page/seller-dashboard.html";
    }

    const cartLink = document.querySelector("#cart-button a");
    if (cartLink) {
        cartLink.href = "/cart/item-cart1.html";
    }

    const viewAllLink = document.querySelector(".best-selling-products a");
    if (viewAllLink) {
        viewAllLink.href = "/cart/fetcheddata.html";
    }
});

async function renderNearbyShops(container) {
    const shops = await LocitAPI.getNearbyShops(
        LOCIT_CONFIG.DEFAULT_LOCATION.lat,
        LOCIT_CONFIG.DEFAULT_LOCATION.lng
    );

    if (!shops.length) {
        return;
    }

    container.innerHTML = "";

    shops.slice(0, 6).forEach((shop) => {
        const card = document.createElement("div");
        card.className = "shop-card";
        card.innerHTML = `
            <img src="/assets/super-market-store.png" alt="${shop.shopName}">
            <div class="shop-info">
                <p>${shop.shopName}</p>
                <p>${shop.distanceKm.toFixed(1)} km away</p>
            </div>
        `;
        container.appendChild(card);
    });
}
