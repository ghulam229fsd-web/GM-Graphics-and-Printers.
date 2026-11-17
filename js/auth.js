const authForm=document.querySelector("#authForm");
authForm?.addEventListener("submit",async e=>{
 e.preventDefault();const data=Object.fromEntries(new FormData(authForm).entries());
 try{
  const endpoint=authForm.dataset.mode==="register"?"/auth/register":"/auth/login";
  const result=await api(endpoint,{method:"POST",body:JSON.stringify(data)});
  localStorage.setItem("gm_token",result.token);localStorage.setItem("gm_user",JSON.stringify(result.user));
  location.href=result.user.role==="admin"?"admin.html":"my-orders.html";
 }catch(err){document.querySelector("#authMessage").textContent=err.message;}
});
