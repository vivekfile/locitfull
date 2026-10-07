async function apiRequest(path, options = {}) {
    const response = await fetch(`${LOCIT_CONFIG.API_BASE}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        let message = "Something went wrong";

        try {
            const errorBody = await response.json();
            message = errorBody.message || message;
        } catch (error) {
            message = response.statusText || message;
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

const LocitAPI = {
    login: (identifier, password) =>
        apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ identifier, password })
        }),

    signup: (payload) =>
        apiRequest("/auth/signup", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    getProducts: () => apiRequest("/products"),

    searchProducts: (name) =>
        apiRequest(`/products/search?name=${encodeURIComponent(name)}`),

    getProductImages: (productId) =>
        apiRequest(`/product-images/product/${productId}`),

    getShops: () => apiRequest("/shops"),

    getNearbyShops: (lat, lng, radiusKm = LOCIT_CONFIG.NEARBY_RADIUS_KM) =>
        apiRequest(`/shops/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`),

    getCategories: () => apiRequest("/categories"),

    getBrands: () => apiRequest("/brands"),

    getCart: (userId) => apiRequest(`/cart-items/user/${userId}`),

    addToCart: (userId, productId, quantity = 1) =>
        apiRequest("/cart-items", {
            method: "POST",
            body: JSON.stringify({
                user: { userId },
                product: { productId },
                quantity
            })
        }),

    updateCartItem: (cartItemId, quantity) =>
        apiRequest(`/cart-items/${cartItemId}`, {
            method: "PUT",
            body: JSON.stringify({ quantity })
        }),

    removeCartItem: (cartItemId) =>
        apiRequest(`/cart-items/${cartItemId}`, {
            method: "DELETE"
        }),

    checkout: (userId) =>
        apiRequest("/orders/checkout", {
            method: "POST",
            body: JSON.stringify({ userId })
        }),

    createProduct: (product) =>
        apiRequest("/products", {
            method: "POST",
            body: JSON.stringify(product)
        }),

    createProductImage: (productId, imageUrl) =>
        apiRequest("/product-images", {
            method: "POST",
            body: JSON.stringify({
                product: { productId },
                imageUrl
            })
        }),

    createShop: (shop) =>
        apiRequest("/shops", {
            method: "POST",
            body: JSON.stringify(shop)
        }),

    getProductsByShop: (shopId) =>
        apiRequest(`/products/shop/${shopId}`)
};
