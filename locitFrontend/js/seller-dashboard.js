document.addEventListener("DOMContentLoaded", async () => {
    const user = requireAuth("/auth/login.html");
    if (!user) {
        return;
    }

    const userName = document.getElementById("user-name");
    if (userName) {
        userName.textContent = user.name;
    }

    await loadSellerDashboard(user);
    bindProductForm(user);
});

async function loadSellerDashboard(user) {
    try {
        const shops = await LocitAPI.getShops();
        const sellerShops = shops.filter(
            (shop) => shop.seller && shop.seller.userId === user.userId
        );

        let productCount = 0;

        for (const shop of sellerShops) {
            const products = await LocitAPI.getProductsByShop(shop.shopId);
            productCount += products.length;
        }

        const productStat = document.querySelector(".stats-grid .stat-card:nth-child(3) h2");
        if (productStat) {
            productStat.textContent = String(productCount);
        }
    } catch (error) {
        console.error("Could not load seller stats", error);
    }
}

function bindProductForm(user) {
    const publishButton = document.querySelector(".seller-listings + .seller-details .upgrade-btn button")
        || document.querySelector(".seller-details button");

    const categorySelect = document.getElementById("productCategory");
    const productNameInput = document.getElementById("productName");
    const priceInput = document.getElementById("productPrice");
    const descriptionInput = document.getElementById("productDescription");
    const shopNameInput = document.querySelector('.seller-details input[placeholder="Enter your shop name"]')
        || document.querySelector('.seller-details input[type="text"]');
    const addressInput = document.querySelector('.seller-details input[placeholder="Enter shop address"]');
    const cityInput = document.querySelector('.seller-details input[placeholder="Enter city"]');
    const pincodeInput = document.querySelector('.seller-details input[placeholder="Enter pincode"]');

    populateCategories(categorySelect);

    const actionButton = document.querySelector(".seller-listings").closest(".content-seller")
        ? createPublishButton()
        : null;

    if (actionButton) {
        actionButton.addEventListener("click", async () => {
            await publishProduct(user, {
                categorySelect,
                productNameInput,
                priceInput,
                descriptionInput,
                shopNameInput,
                addressInput,
                cityInput,
                pincodeInput
            });
        });
    }
}

function createPublishButton() {
    let buttonContainer = document.getElementById("publishProductContainer");

    if (!buttonContainer) {
        buttonContainer = document.createElement("div");
        buttonContainer.id = "publishProductContainer";
        buttonContainer.style.marginTop = "20px";

        const button = document.createElement("button");
        button.id = "publishProductBtn";
        button.textContent = "Publish Product";
        button.style.padding = "12px 20px";
        button.style.cursor = "pointer";

        buttonContainer.appendChild(button);

        const listings = document.querySelector(".seller-listings");
        listings.parentElement.insertBefore(buttonContainer, listings.nextSibling);
    }

    return document.getElementById("publishProductBtn");
}

async function populateCategories(categorySelect) {
    if (!categorySelect) {
        return;
    }

    try {
        const categories = await LocitAPI.getCategories();
        categorySelect.innerHTML = "";

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.categoryId;
            option.textContent = category.categoryName;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

async function publishProduct(user, fields) {
    const {
        categorySelect,
        productNameInput,
        priceInput,
        descriptionInput,
        shopNameInput,
        addressInput,
        cityInput,
        pincodeInput
    } = fields;

    const productName = productNameInput?.value.trim();
    const price = Number(priceInput?.value);
    const description = descriptionInput?.value.trim();
    const categoryId = Number(categorySelect?.value || 1);

    if (!productName || !price) {
        alert("Product name and price are required.");
        return;
    }

    try {
        let shop = await ensureSellerShop(user, {
            shopNameInput,
            addressInput,
            cityInput,
            pincodeInput
        });

        const brands = await LocitAPI.getBrands();
        const brand = brands.find((item) => item.category?.categoryId === categoryId) || brands[0];

        if (!brand) {
            throw new Error("No brand found for this category. Run database seed script first.");
        }

        const product = await LocitAPI.createProduct({
            shop: { shopId: shop.shopId },
            category: { categoryId },
            brand: { brandId: brand.brandId },
            productName,
            description,
            price,
            stock: 20,
            isAvailable: true
        });

        await LocitAPI.createProductImage(
            product.productId,
            "/assets/logo.png"
        );

        alert("Product published successfully!");
        productNameInput.value = "";
        priceInput.value = "";
        descriptionInput.value = "";
    } catch (error) {
        alert(error.message);
    }
}

async function ensureSellerShop(user, fields) {
    const shops = await LocitAPI.getShops();
    const existingShop = shops.find(
        (shop) => shop.seller && shop.seller.userId === user.userId
    );

    if (existingShop) {
        return existingShop;
    }

    const shopName = fields.shopNameInput?.value.trim() || `${user.name}'s Shop`;
    const address = fields.addressInput?.value.trim() || "Sector 15";
    const city = fields.cityInput?.value.trim() || "Hisar";
    const pincode = fields.pincodeInput?.value.trim() || "125001";

    return LocitAPI.createShop({
        seller: { userId: user.userId },
        shopName,
        description: "Local shop on Locit",
        address,
        city,
        state: "Haryana",
        pincode,
        latitude: LOCIT_CONFIG.DEFAULT_LOCATION.lat,
        longitude: LOCIT_CONFIG.DEFAULT_LOCATION.lng
    });
}
