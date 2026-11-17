const productGrid=document.querySelector("#productGrid");
async function loadProducts(){
 if(!productGrid)return;
 const params=new URLSearchParams();
 const q=document.querySelector("#search")?.value;const category=document.querySelector("#category")?.value;
 const min=document.querySelector("#minPrice")?.value;const max=document.querySelector("#maxPrice")?.value;const sort=document.querySelector("#sort")?.value;
 if(q)params.set("q",q);if(category)params.set("category",category);if(min)params.set("min",min);if(max)params.set("max",max);if(sort)params.set("sort",sort);
 try{
  const {products}=await api(`/products?${params}`);
  productGrid.innerHTML=products.length?products.map(p=>`<article class="card"><img loading="lazy" src="${p.image||'https://placehold.co/640x420/eaf3ff/0756b8?text=GM+Printing'}" alt="${escapeHtml(p.name)}"><div class="card-body"><small class="muted">${escapeHtml(p.category)}</small><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||"Custom printing by GM Graphics & Printers.")}</p><div class="price">${money(p.discountPrice??p.price)}</div><div class="actions"><button class="btn small" onclick="addToCart('${p._id}')">Add to Cart</button><a class="btn small outline" href="product-details.html?id=${p._id}">Details</a></div></div></article>`).join(""):'<div class="empty">No products found. Please try another search.</div>';
 }catch(e){productGrid.innerHTML=`<p class="notice">${escapeHtml(e.message)}</p>`;}
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function addToCart(id){
 try{const {product}=await api(`/products/${id}`);const cart=JSON.parse(localStorage.getItem("gm_cart")||"[]");const found=cart.find(x=>x.productId===id);if(found)found.quantity++;else cart.push({productId:id,name:product.name,price:product.discountPrice??product.price,image:product.image,quantity:1});localStorage.setItem("gm_cart",JSON.stringify(cart));alert("Added to cart.");}catch(e){alert(e.message);}
}
document.addEventListener("DOMContentLoaded",()=>{["search","category","minPrice","maxPrice","sort"].forEach(id=>document.getElementById(id)?.addEventListener("input",loadProducts));loadProducts();});
