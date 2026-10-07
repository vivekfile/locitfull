const productContainer = document.getElementById("productContainer");
const loader = document.getElementById("loader");

document.addEventListener("DOMContentLoaded", async () => {
    const user = requireAuth();
    if (!user) {
        return;
    }

    await fetchProducts();
});

async function fetchProducts() {
    try {
        await loadProductsIntoContainer(
            productContainer,
            createCatalogCard,
            addProductToCart
        );
    } catch (error) {
        productContainer.innerHTML = `<p>Could not load products: ${error.message}</p>`;
    } finally {
        if (loader) {
            loader.style.display = "none";
        }
    }
}
