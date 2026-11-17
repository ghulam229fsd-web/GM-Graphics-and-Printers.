const money = n => `Rs. ${Number(n||0).toLocaleString("en-PK")}`;
const token = () => localStorage.getItem("gm_token");
const api = async (path, options={}) => {
  const headers = { ...(options.headers||{}) };
  if (!(options.body instanceof FormData)) headers["Content-Type"]="application/json";
  if (token()) headers.Authorization=`Bearer ${token()}`;
  const response=await fetch(`${API_BASE}${path}`,{...options,headers});
  const data=await response.json().catch(()=>({message:"Unexpected server response"}));
  if(!response.ok) throw new Error(data.message||"Request failed");
  return data;
};
const waLink = message => `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;
document.addEventListener("DOMContentLoaded",()=>{
 const menu=document.querySelector(".menu"),links=document.querySelector(".navlinks");
 menu?.addEventListener("click",()=>links.classList.toggle("open"));
 document.querySelectorAll("[data-wa]").forEach(el=>el.href=waLink(el.dataset.wa||"Hello GM Graphics & Printers"));
});
