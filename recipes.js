async function loadRecipes(){const res=await fetch('data/recipes.json');const data=await res.json();window._recipes=data;renderRecipes(data);}
function renderRecipes(list){const grid=document.getElementById('recipesGrid');grid.innerHTML='';list.forEach(r=>{const card=document.createElement('div');card.className='card';card.innerHTML=`
<img src="${r.image}" alt="${r.name}"><div class="card-body">
<span class="badge">${r.category}</span><span class="time">⏱ ${r.time}</span>
<h3 class="mt-2">${r.name}</h3><p>${r.desc}</p>
<button class="btn mt-2" data-id="${r.id}">View Recipe</button></div>`;grid.appendChild(card);});grid.querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',openModal));}
function openModal(e){const id=e.target.dataset.id;const r=window._recipes.find(x=>x.id===id);const modal=document.getElementById('recipeModal');document.getElementById('modalTitle').textContent=r.name+' • '+r.time;const nutriRows=Object.entries(r.nutrition).map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join('');document.getElementById('modalContent').innerHTML=`
<img src="${r.image}" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px" alt="${r.name}">
<p class="mt-2"><strong>Time:</strong> ${r.time}</p>
<h4 class="mt-3">Ingredients</h4><ul>${r.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul>
<h4 class="mt-3">Steps</h4><ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
<h4 class="mt-3">Nutrition</h4><table class="table">${nutriRows}</table>`;modal.classList.add('open');}
document.getElementById('modalClose').addEventListener('click',()=>document.getElementById('recipeModal').classList.remove('open'));
document.getElementById('recipeModal').addEventListener('click',(e)=>{if(e.target.id==='recipeModal')e.currentTarget.classList.remove('open');});
function applyFilters(){const q=document.getElementById('recipeSearch').value.toLowerCase();const cat=document.getElementById('recipeCategory').value;const list=window._recipes.filter(r=>(cat==='all'||r.category===cat)&&r.name.toLowerCase().includes(q));renderRecipes(list);}
document.getElementById('recipeSearch').addEventListener('input',applyFilters);
document.getElementById('recipeCategory').addEventListener('change',applyFilters);
loadRecipes();