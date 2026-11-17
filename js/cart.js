const cartRoot=document.querySelector("#cartRoot");
function getCart(){return JSON.parse(localStorage.getItem("gm_cart")||"[]");}
function saveCart(c){localStorage.setItem("gm_cart",JSON.stringify(c));renderCart();}
function renderCart(){
 if(!cartRoot)return;const cart=getCart();
 if(!cart.length){cartRoot.innerHTML='<div class="empty">Your cart is empty. <a href="products.html">Browse products</a></div>';return;}
 const total=cart.reduce((s,x)=>s+x.price*x.quantity,0);
 cartRoot.innerHTML=cart.map((x,i)=>`<div class="cart-row"><div><strong>${x.name}</strong><div class="muted">${money(x.price)} each</div></div><div class="qty"><button onclick="changeQty(${i},-1)">−</button>${x.quantity}<button onclick="changeQty(${i},1)">+</button></div><div class="line-total">${money(x.price*x.quantity)} <button class="btn small outline" onclick="removeItem(${i})">Remove</button></div></div>`).join("")+`<div class="panel" style="margin-top:20px;text-align:right"><h2>Total: ${money(total)}</h2><a class="btn" href="checkout.html">Proceed to Checkout</a></div>`;
}
function changeQty(i,d){const c=getCart();c[i].quantity=Math.max(1,c[i].quantity+d);saveCart(c);}
function removeItem(i){const c=getCart();c.splice(i,1);saveCart(c);}
document.addEventListener("DOMContentLoaded",renderCart);
