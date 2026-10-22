const $=(s,r=document)=>r.querySelector(s),app=$('#app');
const fmt=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const KEY='lapausa_carrito',prod=id=>PRODUCTOS.find(p=>p.id===id);
let cart=[];try{cart=(JSON.parse(localStorage.getItem(KEY))||[]).filter(i=>prod(i.id)&&i.qty>0)}catch(e){}
let buyer={nombre:'',entrega:'',zona:'',nota:''},F={color:'',talle:'',tipo:''},st=null,err='';
const stockOf=(p,c,t)=>p.disponible===false?0:(p.stock?.[c]?.[t]??0);
const inCart=(id,c,t)=>cart.filter(i=>i.id===id&&i.color===c&&i.talle===t).reduce((a,i)=>a+i.qty,0);
const hasStock=p=>p.colores.some(c=>p.talles.some(t=>stockOf(p,c,t)>0));
const total=()=>cart.reduce((a,i)=>a+prod(i.id).precio*i.qty,0);
const count=()=>cart.reduce((a,i)=>a+i.qty,0);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}$('#badge').textContent=count()};
const dark=h=>parseInt(h.slice(1,3),16)*.3+parseInt(h.slice(3,5),16)*.6+parseInt(h.slice(5,7),16)*.1<110;
const shirt=(hex,mark)=>`<svg viewBox="0 0 200 250" role="img" aria-label="Ilustración de referencia de remera"><rect width="200" height="250" fill="#E2D8C4"/><path transform="translate(0,18)" d="M70 20l-50 28 18 38 22-10v124h80V76l22 10 18-38-50-28c-6 14-18 22-30 22S76 34 70 20z" fill="${hex}" stroke="rgba(0,0,0,.15)"/>${mark?`<text x="100" y="128" text-anchor="middle" font-size="8" letter-spacing="2" fill="${dark(hex)?'#fff':'#222'}" opacity=".7">la pausa</text>`:''}</svg>`;
const pic=(p,c,i=0)=>{const f=p.fotos?.[c]?.[i];return f?`<img src="${f}" alt="${p.nombre} color ${COLORES[c].n}" loading="lazy" decoding="async">`:shirt(COLORES[c].hex,i===0)};
const hasPhoto=(p,c)=>!!p.fotos?.[c]?.length;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)};
const card=p=>{const ag=!hasStock(p);return `<a class="card" href="#/producto/${p.id}"><div class="ph">${pic(p,p.colores[0])}${ag?'<span class="tag">Agotado</span>':''}</div><h3>${p.nombre}</h3><p>${fmt(p.precio)}</p><div class="dots">${p.colores.map(c=>`<i title="${COLORES[c].n}" style="background:${COLORES[c].hex}"></i>`).join('')}</div></a>`};
function home(){document.title='La Pausa — Remeras de algodón con estampa DTF';
 app.innerHTML=`<section class="hero"><div><h1>Menos, pero mejor.</h1><p>Remeras de algodón unisex en colores neutros, con estampas sutiles hechas en DTF. Para usar todos los días.</p><a class="btn" href="#/tienda">Explorar colección</a></div><div><div class="ph">${shirt('#E6DDCB',true)}</div><p class="ref">Imagen de referencia, no es un producto real.</p></div></section>
 <section class="sec"><h2>Destacados</h2><div class="grid">${PRODUCTOS.filter(p=>p.destacado).map(card).join('')}</div></section>
 <section class="sec two"><h2>Una pausa en el ruido</h2><p class="philo">Pocas prendas, bien pensadas. Algodón, colores que combinan con todo y gráficas discretas que no gritan. Cada remera se estampa y se prepara a pedido.</p></section>
 <section class="sec two"><div><h2>Hablemos</h2></div><div><p class="note" style="margin-bottom:16px">Consultas, medidas o pedidos especiales: escribinos.</p><a class="btn" href="${wa('Hola La Pausa! Quería hacer una consulta.')}" target="_blank" rel="noopener">WhatsApp</a> <a class="btn alt" href="https://instagram.com/${CONFIG.instagram}" target="_blank" rel="noopener">Instagram</a></div></section>`}
function tienda(){document.title='Colección — La Pausa';
 const L=PRODUCTOS.filter(p=>(!F.color||p.colores.includes(F.color))&&(!F.talle||p.talles.includes(F.talle))&&(!F.tipo||p.tipo===F.tipo));
 const sel=(k,arr,lab,nm)=>`<label>${lab}<select data-f="${k}"><option value="">Todos</option>${arr.map(v=>`<option value="${v}" ${F[k]===v?'selected':''}>${nm?COLORES[v].n:v}</option>`).join('')}</select></label>`;
 const u=f=>[...new Set(PRODUCTOS.flatMap(f))];
 app.innerHTML=`<h1 style="font-size:clamp(36px,6vw,64px);padding-top:40px">Colección</h1><div class="filters">${sel('color',u(p=>p.colores),'Color',1)}${sel('talle',u(p=>p.talles),'Talle')}${sel('tipo',u(p=>[p.tipo]),'Tipo de diseño')}</div>${L.length?`<div class="grid">${L.map(card).join('')}</div>`:'<p class="note">No hay remeras con esa combinación. Probá quitar algún filtro.</p>'}<p class="ref" style="margin-top:24px">Modelos, precios y stock de demostración.</p>`}
function producto(id){const p=prod(id);if(!p)return home();
 if(!st||st.id!==id)st={id,color:p.colores.find(c=>p.talles.some(t=>stockOf(p,c,t)>0))||p.colores[0],talle:'',diseno:p.disenos[0]||'',qty:1,img:0};
 document.title=`${p.nombre} — La Pausa`;
 const n=Math.max(p.fotos?.[st.color]?.length||0,1),left=st.talle?stockOf(p,st.color,st.talle)-inCart(p.id,st.color,st.talle):null;
 app.innerHTML=`<div class="prod"><div><div class="card"><div class="ph">${pic(p,st.color,st.img)}</div></div>${n>1?`<div class="thumbs">${[...Array(n)].map((_,i)=>`<button data-act="img" data-v="${i}" class="${i===st.img?'on':''}" aria-label="Foto ${i+1}">${pic(p,st.color,i)}</button>`).join('')}</div>`:''}${hasPhoto(p,st.color)?'':'<p class="ref">Ilustración de referencia: todavía no hay foto real de este color.</p>'}</div>
 <div><a class="note" href="#/tienda">← Colección</a><h1 style="margin-top:12px">${p.nombre}</h1><p class="price">${fmt(p.precio)}</p><p>${p.descripcion}</p>
 <div class="opt"><b>Color: ${COLORES[st.color].n}</b><div class="chips">${p.colores.map(c=>`<button class="sw ${c===st.color?'on':''}" data-act="color" data-v="${c}" style="background:${COLORES[c].hex}" aria-label="${COLORES[c].n}" aria-pressed="${c===st.color}"></button>`).join('')}</div></div>
 <div class="opt"><b>Talle</b><div class="chips">${p.talles.map(t=>`<button class="chip ${t===st.talle?'on':''}" data-act="talle" data-v="${t}" ${stockOf(p,st.color,t)<1?'disabled title="Agotado"':''}>${t}</button>`).join('')}</div></div>
 ${p.disenos.length?`<div class="opt"><b>Diseño / ubicación</b><div class="chips">${p.disenos.map(d=>`<button class="chip ${d===st.diseno?'on':''}" data-act="diseno" data-v="${d}">${d}</button>`).join('')}</div></div>`:''}
 <div class="opt"><b>Cantidad</b><div class="qty"><button data-act="q" data-d="-1" aria-label="Menos">−</button><span>${st.qty}</span><button data-act="q" data-d="1" aria-label="Más">+</button></div>${left!==null?`<span class="note"> ${left>0?`Quedan ${left}`:'Sin stock en este talle'}</span>`:''}</div>
 <button class="btn" data-act="add" ${hasStock(p)?'':'disabled'}>${hasStock(p)?'Agregar al carrito':'Agotado'}</button><p class="msg" id="pm" role="alert"></p>
 <p class="note">${CONFIG.preparacion}</p>
 <div style="margin-top:24px"><details><summary>Composición y estampado</summary><p>Algodón (completar % real). Estampado DTF: tinta flexible y duradera, aplicada con calor.</p></details><details><summary>Cuidados</summary><p>Lavar del revés en agua fría, no usar lavandina, planchar del revés sin vapor sobre la estampa.</p></details></div></div></div>`}
function info(){document.title='Info y preguntas — La Pausa';
 const q=[['Envíos y retiros',`${CONFIG.retiro} Los envíos se cotizan por WhatsApp según tu zona.`],['Medios de pago',CONFIG.pagos],['Tiempos de preparación',CONFIG.preparacion],['Cambios y devoluciones','Completar con tu política real (por ejemplo: cambio de talle dentro de X días, con la prenda sin uso).'],['Cuidados de las prendas','Lavar del revés en agua fría, no usar lavandina, planchar del revés sin vapor sobre la estampa.'],['¿Cómo compro?','Elegí color, talle y diseño, agregá al carrito y tocá “Finalizar pedido por WhatsApp”. Te llega el resumen listo para enviar; el pedido se confirma recién cuando te respondemos.'],['¿Hacen estampas personalizadas?','Sí, consultanos por WhatsApp con tu idea.']];
 app.innerHTML=`<h1 style="font-size:clamp(36px,6vw,64px);padding:40px 0 24px">Info y preguntas</h1><div style="max-width:760px">${q.map(([a,b])=>`<details><summary>${a}</summary><p>${b}</p></details>`).join('')}</div><div class="sec"><a class="btn" href="${wa('Hola La Pausa! Tengo una consulta.')}" target="_blank" rel="noopener">Escribir por WhatsApp</a> <a class="btn alt" href="https://instagram.com/${CONFIG.instagram}" target="_blank" rel="noopener">Instagram</a></div>`}
const wa=t=>`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;
function route(){const[,r,a]=location.hash.slice(1).split('/');({tienda,info,producto:()=>producto(a)}[r]||home)();window.scrollTo(0,0)}
function renderCart(){const c=$('#cart');
 const body=cart.length?cart.map((i,k)=>{const p=prod(i.id);return `<div class="it"><div class="ph">${pic(p,i.color)}</div><div><b style="font-weight:400">${p.nombre}</b><br><span class="note">${COLORES[i.color].n} · ${i.talle}${i.diseno?' · '+i.diseno:''}</span><div class="row"><div class="qty"><button data-act="dec" data-k="${k}" aria-label="Menos">−</button><span>${i.qty}</span><button data-act="inc" data-k="${k}" aria-label="Más">+</button></div><span>${fmt(p.precio*i.qty)}</span></div><button class="lk" data-act="del" data-k="${k}">Quitar</button></div></div>`}).join(''):'<p class="note" style="padding:24px 0">Tu carrito está vacío. Explorá la colección para empezar.</p>';
 c.innerHTML=`<div class="ch"><h2>Carrito</h2><button class="lk" data-act="close">Cerrar</button></div><div class="cb">${body}</div>${cart.length?`<div class="cf"><div class="tot"><span>Total</span><b style="font-weight:400">${fmt(total())}</b></div>
 <label class="f">Tu nombre<input data-b="nombre" value="${buyer.nombre.replace(/"/g,'&quot;')}" autocomplete="name"></label>
 <label class="f">Entrega<select data-b="entrega"><option value="">Elegí una opción</option>${['Retiro','Envío'].map(o=>`<option ${buyer.entrega===o?'selected':''}>${o}</option>`).join('')}</select></label>
 ${buyer.entrega==='Envío'?`<label class="f">Localidad y código postal<input data-b="zona" value="${buyer.zona.replace(/"/g,'&quot;')}"></label>`:''}
 <p class="err" role="alert">${err}</p><button class="btn" style="width:100%" data-act="send">Finalizar pedido por WhatsApp</button><button class="lk" style="margin-top:10px" data-act="close">Seguir comprando</button><p class="note" style="margin-top:8px">El pedido se confirma cuando te respondamos. El costo de envío se informa por chat.</p></div>`:`<div class="cf"><a class="btn" href="#/tienda" data-act="close">Explorar colección</a></div>`}`}
function setOpen(o){document.body.classList.toggle('open',o);$('#cart').setAttribute('aria-hidden',!o);if(o){err='';renderCart()}}
function add(){const p=prod(st.id),m=$('#pm');
 if(!st.talle){m.textContent='Elegí un talle para continuar.';return}
 const left=stockOf(p,st.color,st.talle)-inCart(p.id,st.color,st.talle);
 if(st.qty>left){m.textContent=left>0?`Solo podés agregar ${left} más de este talle.`:'No hay más stock de este talle.';return}
 const it=cart.find(i=>i.id===p.id&&i.color===st.color&&i.talle===st.talle&&i.diseno===st.diseno);
 it?it.qty+=st.qty:cart.push({id:p.id,color:st.color,talle:st.talle,diseno:st.diseno,qty:st.qty});
 save();st.qty=1;producto(p.id);toast('Agregado al carrito');renderCart()}
function send(){err='';
 if(!buyer.nombre.trim())err='Ingresá tu nombre.';else if(!buyer.entrega)err='Elegí retiro o envío.';else if(buyer.entrega==='Envío'&&!buyer.zona.trim())err='Indicá tu localidad y código postal.';
 const bad=cart.find(i=>i.qty>stockOf(prod(i.id),i.color,i.talle));if(!err&&bad)err=`Ya no hay stock suficiente de ${prod(bad.id).nombre} (${COLORES[bad.color].n}, ${bad.talle}). Ajustá la cantidad.`;
 if(err)return renderCart();
 const l=cart.map((i,k)=>{const p=prod(i.id);return `${k+1}. ${p.nombre} | ${COLORES[i.color].n} | Talle ${i.talle}${i.diseno?' | '+i.diseno:''}\n   ${i.qty} x ${fmt(p.precio)} = ${fmt(p.precio*i.qty)}`}).join('\n');
 const msg=`Hola La Pausa! Quiero hacer este pedido:\n\n${l}\n\nTotal: ${fmt(total())}\nNombre: ${buyer.nombre.trim()}\nEntrega: ${buyer.entrega}${buyer.entrega==='Envío'?' ('+buyer.zona.trim()+')':''}\n\nQuedo atenta/o a la confirmación de stock, envío y pago.`;
 window.open(wa(msg),'_blank','noopener')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,v=b.dataset.v,k=+b.dataset.k,p=st&&prod(st.id);
 if(a==='open')setOpen(true);else if(a==='close')setOpen(false);
 else if(a==='color'){st.color=v;st.talle='';st.img=0;producto(st.id)}
 else if(a==='talle'){st.talle=v;st.qty=1;producto(st.id)}
 else if(a==='diseno'){st.diseno=v;producto(st.id)}
 else if(a==='img'){st.img=+v;producto(st.id)}
 else if(a==='q'){st.qty=Math.max(1,st.qty+ +b.dataset.d);if(st.talle)st.qty=Math.min(st.qty,Math.max(1,stockOf(p,st.color,st.talle)-inCart(p.id,st.color,st.talle)));producto(st.id)}
 else if(a==='add')add();
 else if(a==='inc'){const i=cart[k];if(i.qty<stockOf(prod(i.id),i.color,i.talle))i.qty++;else toast('No hay más stock de este talle');save();renderCart()}
 else if(a==='dec'){cart[k].qty--;if(cart[k].qty<1)cart.splice(k,1);save();renderCart()}
 else if(a==='del'){cart.splice(k,1);save();renderCart()}
 else if(a==='send')send()});
document.addEventListener('change',e=>{const f=e.target.dataset.f,b=e.target.dataset.b;if(f){F[f]=e.target.value;tienda()}if(b){buyer[b]=e.target.value;if(b==='entrega')renderCart()}});
document.addEventListener('input',e=>{const b=e.target.dataset.b;if(b&&b!=='entrega')buyer[b]=e.target.value});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
$('#ft').innerHTML=`<span>La Pausa — Menos, pero mejor.</span><a href="https://instagram.com/${CONFIG.instagram}" target="_blank" rel="noopener">@${CONFIG.instagram}</a><a href="${wa('Hola La Pausa!')}" target="_blank" rel="noopener">WhatsApp</a><a href="#/info">Envíos, pagos y cambios</a>`;
window.addEventListener('hashchange',route);save();route();
