
// FOODFAT - DATA

const food = [
    {
        id: 1,
        name: "ข้าวผัดกุ้ง",
        price: 65,
        category: "rice",
        image: "AW_NEW-KFC-LOGO-2019-1024x724.jpg"
    },
    {
        id: 2,
        name: "กะเพราไก่",
        price: 55,
        category: "rice",
        image: "AW_NEW-KFC-LOGO-2019-1024x724.jpg"
    },
    {
        id: 3,
        name: "สปาเก็ตตี้",
        price: 75,
        category: "rice",
        image: "AW_NEW-KFC-LOGO-2019-1024x724.jpg"
    },
    {
        id: 4,
        name: "KFC",
        price: 95,
        category: "rice",
        image: "AW_NEW-KFC-LOGO-2019-1024x724.jpg"
    },
    {
        id: 5,
        name: "ราเมง",
        price: 125,
        category: "noodle",
        image: "AW_NEW-KFC-LOGO-2019-1024x724.jpg"
    },
    {
        id: 6,
        name: "แกงเขียวหวาน",
        price: 35,
        category: "rice",
        image: "AW_NEW-KFC-LOGO-2019-1024x724.jpg"
    },
    {
        id: 7,
        name: "ชาเย็น",
        price: 30,
        category: "drink",
        image: "AW_NEW-KFC-LOGO-2019-1024x724.jpg"
    }
];

let cart = [];
let activeCategory = "all";
let searchKeyword = "";
let toastTimer;



// TOAST


function showToast(message) {
    const toast = document.getElementById("foodfat-toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}



// DISPLAY FOOD


function displayFood(foodList) {
    const foodListElement = document.getElementById("food-list");
    const menuCount = document.getElementById("menu-count");

    if (!foodListElement) return;

    if (menuCount) {
        menuCount.textContent = `${foodList.length} เมนู`;
    }

    if (foodList.length === 0) {
        foodListElement.innerHTML = `
            <p class="empty-message">
                ไม่พบเมนูอาหารที่ค้นหา
            </p>
        `;
        return;
    }

    foodListElement.innerHTML = foodList.map(item => `
        <article class="food-card">

            <img
                src="${item.image}"
                alt="${item.name}"
                loading="lazy"
                onerror="this.onerror=null; this.alt='ไม่สามารถโหลดรูปภาพได้';"
            >

            <div class="food-info">

                <h3>${item.name}</h3>

                <p class="food-price">
                    ${item.price} บาท
                </p>

                <button
                    class="add-button"
                    type="button"
                    data-food-id="${item.id}"
                >
                    + เพิ่มลงตะกร้า
                </button>

            </div>

        </article>
    `).join("");
}



// FILTER AND SEARCH


function updateFoodList() {
    const results = food.filter(item => {
        const matchesCategory =
            activeCategory === "all" ||
            item.category === activeCategory;

        const matchesSearch =
            item.name.toLowerCase().includes(searchKeyword);

        return matchesCategory && matchesSearch;
    });

    displayFood(results);
}

document.querySelectorAll(".category-button").forEach(button => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.category;

        document.querySelectorAll(".category-button").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        updateFoodList();
    });
});

const searchForm = document.getElementById("search-form");

if (searchForm) {
    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        const searchInput = document.getElementById("search-input");

        searchKeyword = searchInput.value.trim().toLowerCase();

        updateFoodList();
    });
}



// ADD TO CART


document.getElementById("food-list").addEventListener("click", event => {
    const button = event.target.closest("[data-food-id]");

    if (!button) return;

    const foodId = Number(button.dataset.foodId);

    addToCart(foodId);
});

function addToCart(foodId) {
    const selectedFood = food.find(item => item.id === foodId);

    if (!selectedFood) return;

    cart.push(selectedFood);

    updateCartCount();
    showToast(`เพิ่ม ${selectedFood.name} ลงตะกร้าแล้ว`);
}



// CART COUNT


function updateCartCount() {
    const cartCount = document.getElementById("cart-count");

    if (!cartCount) return;

    cartCount.textContent = cart.length;

    cartCount.classList.remove("cart-updated");

    void cartCount.offsetWidth;

    cartCount.classList.add("cart-updated");
}



// SHOW CART


const cartDialog = document.getElementById("cart-dialog");

document.querySelector(".cart-button").addEventListener("click", showCart);

function showCart() {
    renderCart();

    if (cartDialog && !cartDialog.open) {
        cartDialog.showModal();
    }
}



// RENDER CART


function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout-button");

    if (!cartItems || !cartTotal || !checkoutButton) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-message">
                ตะกร้าของคุณยังว่างอยู่
            </p>
        `;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">

                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">${item.price} บาท</p>
                </div>

                <button
                    type="button"
                    class="remove-item"
                    data-remove-index="${index}"
                >
                    ลบ
                </button>

            </div>
        `).join("");
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    cartTotal.textContent = `${total} บาท`;
    checkoutButton.disabled = cart.length === 0;
}



// REMOVE CART ITEM


document.getElementById("cart-items").addEventListener("click", event => {
    const button = event.target.closest("[data-remove-index]");

    if (!button) return;

    const index = Number(button.dataset.removeIndex);

    if (!Number.isInteger(index) || index < 0 || index >= cart.length) {
        return;
    }

    const removedItem = cart.splice(index, 1)[0];

    updateCartCount();
    renderCart();

    showToast(`ลบ ${removedItem.name} แล้ว`);
});



// CLOSE CART


document.getElementById("close-cart").addEventListener("click", () => {
    cartDialog.close();
});

cartDialog.addEventListener("click", event => {
    if (event.target === cartDialog) {
        cartDialog.close();
    }
});



// CHECKOUT DEMO


document.getElementById("checkout-button").addEventListener("click", () => {
    if (cart.length === 0) return;

    showToast("ระบบชำระเงินยังไม่เปิดให้บริการ");

    // เวอร์ชันนี้ยังไม่ได้เชื่อมต่อระบบสั่งซื้อจริง
});



// RECOMMEND FOOD BY BUDGET

document.getElementById("budget-form").addEventListener("submit", event => {
    event.preventDefault();

    const budgetInput = document.getElementById("budget-input");
    const result = document.getElementById("recommendation-result");

    const budget = Number(budgetInput.value);

    if (!Number.isFinite(budget) || budget <= 0) {
        result.textContent = "กรุณากรอกงบประมาณมากกว่า 0 บาท";
        return;
    }

    const affordableFoods = food.filter(item => item.price <= budget);

    if (affordableFoods.length === 0) {
        result.textContent = `ยังไม่มีเมนูในงบประมาณ ${budget} บาท`;
        return;
    }

    const randomIndex = Math.floor(Math.random() * affordableFoods.length);
    const selectedFood = affordableFoods[randomIndex];

    result.textContent =
        `✨ แนะนำ ${selectedFood.name} ราคา ${selectedFood.price} บาท ` +
        `เหมาะกับงบประมาณ ${budget} บาท`;

    result.classList.remove("show-result");

    void result.offsetWidth;

    result.classList.add("show-result");
});


// START WEBSITE


updateFoodList();
updateCartCount();