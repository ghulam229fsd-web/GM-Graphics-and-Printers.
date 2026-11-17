const form=document.querySelector("#checkoutForm");
form?.addEventListener("submit",async e=>{
 e.preventDefault();const cart=JSON.parse(localStorage.getItem("gm_cart")||"[]");
 if(!cart.length){alert("Your cart is empty.");return;}
 const fd=new FormData(form);const payload=Object.fromEntries(fd.entries());
 payload.items=cart.map(x=>({productId:x.productId,quantity:x.quantity}));
 try{
  const result=await api("/orders",{method:"POST",body:JSON.stringify(payload)});
  localStorage.removeItem("gm_cart");
  const summary=`New order ${result.order.orderNumber}%0A${cart.map(x=>`${x.name} x ${x.quantity}`).join("%0A")}%0ATotal: Rs. ${result.order.subtotal}`;
  document.querySelector("#checkoutMessage").innerHTML=`<div class="notice">Order placed! Your order ID is <strong>${result.order.orderNumber}</strong>. We will contact you to confirm.</div><a class="btn" target="_blank" rel="noopener" href="${waLink(decodeURIComponent(summary))}">Send order on WhatsApp</a>`;
  form.reset();
 }catch(err){document.querySelector("#checkoutMessage").textContent=err.message;}
});
