async function refreshCartCount() {
    const user = getCurrentUser();
    const cartCountElement = document.getElementById("cartCount");

    if (!cartCountElement) {
        return;
    }

    if (!user) {
        cartCountElement.textContent = "0";
        return;
    }

    try {
        const cartItems = await LocitAPI.getCart(user.userId);
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = String(totalItems);
    } catch (error) {
        console.error(error);
        cartCountElement.textContent = "0";
    }
}

async function addProductToCart(productId, quantity = 1) {
    const user = requireAuth();

    if (!user) {
        return;
    }

    await LocitAPI.addToCart(user.userId, productId, quantity);
    await refreshCartCount();
    showToast("Added to cart");
}

async function updateCartQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
        await LocitAPI.removeCartItem(cartItemId);
        return;
    }

    await LocitAPI.updateCartItem(cartItemId, quantity);
}

function showToast(message) {
    let toast = document.getElementById("locitToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "locitToast";
        toast.style.position = "fixed";
        toast.style.bottom = "24px";
        toast.style.right = "24px";
        toast.style.background = "#111";
        toast.style.color = "#fff";
        toast.style.padding = "12px 18px";
        toast.style.borderRadius = "8px";
        toast.style.zIndex = "9999";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
        toast.style.display = "none";
    }, 1800);
}
