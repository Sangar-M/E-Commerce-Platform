// Import required functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDocs, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { products } from "./products.js";

import { removefromcart } from "./data/cart.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-woQRg2fXWllybcb18WbH8sm9xM8lhs0",
    authDomain: "software-engg-demo.firebaseapp.com",
    projectId: "software-engg-demo",
    storageBucket: "software-engg-demo.appspot.com",
    messagingSenderId: "192224404210",
    appId: "1:192224404210:web:b7093878fc8ef03a85666b"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication state
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User authenticated:", user.uid);
            const cartItemsContainer = document.querySelector('.js-order-summary');
            const cartItemsSnapshot = await getDocs(collection(db, `cart-${user.uid}`));
            const cartItems = cartItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            cartItems.forEach((item) => {
                const prodId = item.id;
                let matchingProduct;
                products.forEach((product) => {
                    if (product.id === prodId) {
                        matchingProduct = product;
                    }
                });
                const itemContainer = document.createElement('div');
                itemContainer.classList.add('cart-item');
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).replace(',', '');
                itemContainer.innerHTML = `
                    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                        <div class="delivery-date">
                            Order date: ${formattedDate}
                        </div>
                        <div class="cart-item-details-grid">
                            <img class="product-image" src="${matchingProduct.image}">
                            <div class="cart-item-details">
                                <div class="product-name">
                                    ${item.name}
                                </div>
                                <div class="product-price">
                                    ${item.price}
                                </div>
                                <div class="product-quantity">
                                    <span>
                                        Quantity: <span class="quantity-label">${item.quantity}</span>
                                    </span>
                                    <br>
                                    <span class="update-quantity-link link-primary">
                                        Update
                                    </span>
                                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                                        Delete
                                    </span>
                                </div>
                            </div>
                            <div class="delivery-options">
                                <!-- Add your delivery options here -->
                            </div>
                        </div>
                    </div>
                `;

                cartItemsContainer.appendChild(itemContainer);
            });
            document.querySelectorAll('.js-delete-link').forEach((link) => {
                link.addEventListener('click', async () => {
                    const productId = link.dataset.productId;
                    removefromcart(productId);
                    const productRef = doc(db, `cart-${user.uid}`, productId);
                    await deleteDoc(productRef);
                    const container = document.querySelector(`.js-cart-item-container-${productId}`);
                    container.remove();
                });
            });
        } else {
            console.log("User not authenticated.");
        }
    });
});
