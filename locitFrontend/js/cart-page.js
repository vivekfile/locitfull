document.addEventListener("DOMContentLoaded", async () => {
    const user = requireAuth();
    if (!user) {
        return;
    }

    updateAccountLabel();
    await refreshCartCount();

    const cartTable = document.querySelector(".cart-list table");
    if (cartTable) {
        const bodies = Array.from(cartTable.querySelectorAll("tbody"));
        bodies.slice(1).forEach((body) => body.remove());
        if (bodies[0]) {
            bodies[0].id = "cartTableBody";
        }
    }

    const cartTableBody = document.getElementById("cartTableBody");
    const cartCountLabel = document.querySelector(".cart-head-left span");
    const totalAmountElement = document.getElementById("total-amount");
    const checkoutButton = document.querySelector(".checkout-btn button");
    const continueShopping = document.querySelector(".cart-head-right");

    if (continueShopping) {
        continueShopping.style.cursor = "pointer";
        continueShopping.addEventListener("click", () => {
            window.location.href = "/main/mainpage.html";
        });
    }

    await renderCartPage(user.userId, cartTableBody, cartCountLabel, totalAmountElement);

    if (checkoutButton) {
        checkoutButton.addEventListener("click", async () => {
            try {
                checkoutButton.disabled = true;
                checkoutButton.textContent = "Placing order...";

                const orders = await LocitAPI.checkout(user.userId);

                alert(`Order placed successfully! ${orders.length} shop order(s) created.`);
                window.location.href = "/main/mainpage.html";
            } catch (error) {
                alert(error.message);
                checkoutButton.disabled = false;
                checkoutButton.textContent = "Proceed to Checkout";
            }
        });
    }
});

async function renderCartPage(userId, tableBody, countLabel, totalAmountElement) {
    if (!tableBody) {
        return;
    }

    const cartItems = await LocitAPI.getCart(userId);
    tableBody.innerHTML = "";

    if (countLabel) {
        countLabel.textContent = `(${cartItems.length} Items)`;
    }

    if (!cartItems.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    <p>Your cart is empty. Browse products from nearby shops.</p>
                </td>
            </tr>
        `;

        if (totalAmountElement) {
            totalAmountElement.textContent = "₹0";
        }

        return;
    }

    let totalAmount = 0;

    for (const item of cartItems) {
        const product = item.product;
        const shop = product.shop;
        const lineTotal = product.price * item.quantity;
        totalAmount += lineTotal;

        const imageUrl = await getProductImageUrl(product.productId);
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="cart-product-detail">
                    <div class="cart-product-image">
                        <img src="${imageUrl}" alt="${product.productName}">
                    </div>
                    <div class="cart-product-des">
                        <p>${product.productName}</p>
                        <p>${product.description || "Local product"}</p>
                        <div class="instock"><p>In Stock</p></div>
                    </div>
                </div>
            </td>
            <td>
                <div class="cart-shop-details">
                    <div class="cart-shop-about">
                        <p>${shop?.shopName || "Nearby shop"}</p>
                        <p>${shop?.city || "Hisar"}</p>
                    </div>
                </div>
            </td>
            <td>
                <div class="cart-item-price">
                    <p>${formatPrice(product.price)}</p>
                </div>
            </td>
            <td>
                <div class="cart-item-quantity">
                    <div class="quantity-adjust">
                        <p class="minusBtn" data-cart-item-id="${item.cartItemId}">-</p>
                        <p class="actual-qualtity">${item.quantity}</p>
                        <p class="addBtn" data-cart-item-id="${item.cartItemId}">+</p>
                    </div>
                </div>
            </td>
            <td>
                <div class="cart-item-total">
                    <p>${formatPrice(lineTotal)}</p>
                    <button class="remove-cart-item" data-cart-item-id="${item.cartItemId}">Remove</button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    }

    if (totalAmountElement) {
        totalAmountElement.textContent = formatPrice(totalAmount);
    }

    tableBody.querySelectorAll(".minusBtn").forEach((button) => {
        button.addEventListener("click", async () => {
            const cartItemId = Number(button.dataset.cartItemId);
            const quantityElement = button.parentElement.querySelector(".actual-qualtity");
            const nextQuantity = Number(quantityElement.textContent) - 1;

            await updateCartQuantity(cartItemId, nextQuantity);
            await refreshCartCount();
            await renderCartPage(userId, tableBody, countLabel, totalAmountElement);
        });
    });

    tableBody.querySelectorAll(".addBtn").forEach((button) => {
        button.addEventListener("click", async () => {
            const cartItemId = Number(button.dataset.cartItemId);
            const quantityElement = button.parentElement.querySelector(".actual-qualtity");
            const nextQuantity = Number(quantityElement.textContent) + 1;

            await updateCartQuantity(cartItemId, nextQuantity);
            await refreshCartCount();
            await renderCartPage(userId, tableBody, countLabel, totalAmountElement);
        });
    });

    tableBody.querySelectorAll(".remove-cart-item").forEach((button) => {
        button.addEventListener("click", async () => {
            await LocitAPI.removeCartItem(Number(button.dataset.cartItemId));
            await refreshCartCount();
            await renderCartPage(userId, tableBody, countLabel, totalAmountElement);
        });
    });
}
