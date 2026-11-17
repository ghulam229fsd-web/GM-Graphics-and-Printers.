const adminLogin=document.querySelector("#adminLogin"),adminApp=document.querySelector("#adminApp");
async function adminInit(){
 if(!adminApp)return;
 if(!token()){adminLogin.hidden=false;adminApp.hidden=true;return;}
 try{const {user}=await api("/auth/me");if(user.role!=="admin")throw new Error("Admin access required");adminLogin.hidden=true;adminApp.hidden=false;await loadAdmin();}
 catch(e){localStorage.removeItem("gm_token");adminLogin.hidden=false;adminApp.hidden=true;}
}
async function loadAdmin(){
 const [{stats},{orders},{products}]=await Promise.all([api("/dashboard/stats"),api("/orders"),api("/products?all=true")]);
 document.querySelector("#stats").innerHTML=Object.entries(stats).map(([k,v])=>`<div class="stat"><span>${k.replace(/([A-Z])/g," $1")}</span><strong>${k==="totalRevenue"?money(v):v}</strong></div>`).join("");
 document.querySelector("#ordersTable").innerHTML=orders.map(o=>`<tr><td>${o.orderNumber}</td><td>${o.customerName}</td><td>${money(o.subtotal)}</td><td><select onchange="updateStatus('${o._id}',this.value)">${["Pending","Confirmed","Processing","Ready for Pickup","Shipped","Delivered","Cancelled"].map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join("");
 document.querySelector("#productsTable").innerHTML=products.map(p=>`<tr><td>${p.name}</td><td>${p.category}</td><td>${money(p.price)}</td><td>${p.stock}</td><td><button class="btn small" onclick="deleteProduct('${p._id}')">Delete</button></td></tr>`).join("");
}
async function updateStatus(id,status){try{await api(`/orders/${id}/status`,{method:"PATCH",body:JSON.stringify({status})});alert("Order status updated.");}catch(e){alert(e.message);}}
async function deleteProduct(id){if(!confirm("Delete this product?"))return;try{await api(`/products/${id}`,{method:"DELETE"});await loadAdmin();}catch(e){alert(e.message);}}
adminLogin?.addEventListener("submit",async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(adminLogin).entries());try{const r=await api("/auth/login",{method:"POST",body:JSON.stringify(data)});if(r.user.role!=="admin")throw new Error("This account is not an admin.");localStorage.setItem("gm_token",r.token);await adminInit();}catch(err){document.querySelector("#adminMessage").textContent=err.message;}});
document.querySelector("#productForm")?.addEventListener("submit",async e=>{e.preventDefault();try{await api("/products",{method:"POST",body:new FormData(e.target)});e.target.reset();await loadAdmin();alert("Product created.");}catch(err){alert(err.message);}});
document.querySelector("#logout")?.addEventListener("click",()=>{localStorage.removeItem("gm_token");localStorage.removeItem("gm_user");location.reload();});
document.addEventListener("DOMContentLoaded",adminInit);
