export let cart =[];
    
    function saveTostorage() {
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    
    export function addtocart(productId){
        let matchingItem;
        cart.forEach((cartItem) => {
          if (productId === cartItem.productId) {
            matchingItem = cartItem;
          }
        });
      
        if (matchingItem) {
          matchingItem.quantity += 1;
        } else {
          cart.push({
            productId: productId,
            quantity: 1
          });
        }
        saveTostorage();
      }
      
      export function removefromcart(productId) {
        const updatedCart = cart.filter(item => item.productId !== productId);
        cart.length = 0;
        cart.push(...updatedCart);
    
        saveTostorage();
    }