const PRODUCT_KEY = 'akgun_products';
const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || 'http://localhost:3001';
const WHATSAPP_NUMBER = '905052242448';
const seedProducts = [
  {id:1,name:'16 mm Damla Sulama Borusu',category:'Damla Sulama',price:2450,stock:86,image:'assets/product-drip-pipe.png',description:'UV dayanımlı, uzun ömürlü ve tarımsal kullanıma uygun damla sulama borusu.',features:'16 mm çap|UV dayanımlı gövde|Düşük basınçta verimli çalışma'},
  {id:2,name:'Mini Yağmurlama Başlığı',category:'Yağmurlama Sistemleri',price:189,stock:240,image:'assets/product-sprinkler.png',description:'Tarla, sera ve bahçe uygulamalarında dengeli su dağılımı sağlayan başlık.',features:'Ayarlanabilir debi|Geniş sulama açısı|Kolay montaj'},
  {id:3,name:'2 İnç Plastik Disk Filtre',category:'Filtre Sistemleri',price:1850,stock:34,image:'assets/product-filter.png',description:'Sulama hattını tortu ve parçacıklara karşı koruyan, temizlenebilir disk filtre.',features:'2 inç bağlantı|Kolay temizleme|Yüksek filtrasyon kapasitesi'},
  {id:4,name:'PVC Küresel Vana 63 mm',category:'Vana ve Ek Parçalar',price:420,stock:65,image:'assets/product-valve.png',description:'Sulama hatlarında güvenilir akış kontrolü sunan dayanıklı PVC küresel vana.',features:'63 mm çap|Sızdırmaz yapı|Korozyona dayanıklı'},
  {id:5,name:'Otomatik Sulama Kontrol Ünitesi',category:'Otomasyon',price:7250,stock:12,image:'assets/product-controller.png',description:'Sulama programlarını otomatik yöneten, su ve zaman tasarrufu sağlayan kontrol ünitesi.',features:'Programlanabilir zamanlama|Çoklu bölge desteği|Kolay kullanım'},
  {id:6,name:'Gübre Tankı 100 Litre',category:'Gübreleme Sistemleri',price:4900,stock:8,image:'assets/product-fertilizer-tank.png',description:'Gübrenin sulama hattına kontrollü ve homojen biçimde verilmesini sağlar.',features:'100 litre kapasite|Basınca dayanıklı|Kolay bağlantı'}
];
const additionalProducts=[
  {id:7,name:'Damlama Hattı Bağlantı Seti',category:'Damla Sulama',stock:45,image:'assets/gallery-products.png',description:'Damla sulama hatlarında hızlı ve güvenilir bağlantı için pratik set.',features:'Kolay montaj|Dayanıklı gövde|Sızdırmaz bağlantı'},
  {id:8,name:'Ayarlanabilir Bahçe Sprinkleri',category:'Yağmurlama Sistemleri',stock:32,image:'assets/gallery-products.png',description:'Bahçe ve küçük tarla uygulamalarında ayarlanabilir sulama çözümü.',features:'Ayarlanabilir açı|Dengeli dağılım|Kolay kullanım'},
  {id:9,name:'Hidrosiklon Kum Ayırıcı',category:'Filtre Sistemleri',stock:14,image:'assets/gallery-products.png',description:'Sulama suyundaki kum ve ağır parçacıkları sistemden ayırır.',features:'Yüksek kapasite|Düşük bakım|Dayanıklı yapı'},
  {id:10,name:'PVC Kelebek Vana',category:'Vana ve Ek Parçalar',stock:28,image:'assets/gallery-products.png',description:'Ana sulama hatlarında kontrollü ve güvenilir akış yönetimi.',features:'Kolay kontrol|Sızdırmazlık|Uzun ömür'},
  {id:11,name:'Dijital Basınç Kontrol Cihazı',category:'Otomasyon',stock:9,image:'assets/gallery-products.png',description:'Sulama hattı basıncını izlemek ve yönetmek için dijital çözüm.',features:'Dijital ekran|Hassas ölçüm|Kolay kurulum'},
  {id:12,name:'Venturi Gübre Enjektörü',category:'Gübreleme Sistemleri',stock:17,image:'assets/gallery-products.png',description:'Sıvı gübrenin sulama hattına kontrollü biçimde verilmesini sağlar.',features:'Ayarlanabilir debi|Kolay bağlantı|Bakım gerektirmeyen yapı'},
  {id:13,name:'16 mm Hat Sonu Tapası',category:'Damla Sulama',stock:180,image:'assets/gallery-products.png',description:'Damla sulama borularının hat sonunu güvenle kapatır.',features:'16 mm uyumlu|Kolay sökme|Tekrar kullanılabilir'},
  {id:14,name:'Metal Yağmurlama Sehpası',category:'Yağmurlama Sistemleri',stock:24,image:'assets/gallery-products.png',description:'Yağmurlama başlıkları için dengeli ve dayanıklı taşıyıcı sehpa.',features:'Galvaniz gövde|Dengeli taban|Saha kullanımına uygun'},
  {id:15,name:'Manometreli Filtre Seti',category:'Filtre Sistemleri',stock:11,image:'assets/gallery-products.png',description:'Filtre basıncını takip etmeyi kolaylaştıran hazır bağlantı seti.',features:'Basınç göstergesi|Hazır bağlantı|Kolay bakım'}
];

function loadProducts(){
  const saved=JSON.parse(localStorage.getItem(PRODUCT_KEY)||'null');
  if(!saved?.length){localStorage.setItem(PRODUCT_KEY,JSON.stringify(seedProducts));return seedProducts}
  return saved.map(p=>{const base=seedProducts.find(x=>x.id===p.id)||{};return {...base,...p,image:p.image||base.image||'assets/gallery-products.png'}});
}
let products=loadProducts();
const campaignSection=document.createElement('section');campaignSection.className='campaign-showcase';campaignSection.innerHTML='<div class="campaign-heading"><div><span>SEZON FIRSATLARI</span><h2>Kampanyalı ürünler</h2><p>Avantajlı ürünlerimizi keşfedin, projenize özel teklifinizi hemen alın.</p></div><a href="https://wa.me/905052242448" target="_blank" rel="noopener">Kampanya bilgisi al →</a></div><div class="campaign-grid" id="campaignGrid"></div>';document.querySelector('.catalog').before(campaignSection);
function renderCampaigns(){const list=products.filter(p=>p.campaign);campaignSection.hidden=!list.length;if(!list.length)return;document.querySelector('#campaignGrid').innerHTML=list.slice(0,4).map((p,index)=>`<article class="campaign-card" data-campaign-id="${p.id}" tabindex="0" aria-label="${p.name} ürününü incele"><div class="campaign-image"><img src="${p.campaignImage||p.image||'assets/gallery-products.png'}" alt="${p.name}" loading="lazy"><span>KAMPANYALI</span></div><div class="campaign-copy"><small>${p.category}</small><h3>${p.name}</h3><button type="button"><span>İNCELE</span><b>→</b></button></div><i>0${index+1}</i></article>`).join('')}
if(!localStorage.getItem('akgun_catalog_expanded')){const existingIds=new Set(products.map(p=>p.id));products.push(...additionalProducts.filter(p=>!existingIds.has(p.id)));localStorage.setItem(PRODUCT_KEY,JSON.stringify(products));localStorage.setItem('akgun_catalog_expanded','1')}
const grid=document.querySelector('#productGrid'),cats=document.querySelector('#categories'),filter=document.querySelector('#categoryFilter'),search=document.querySelector('#search'),sort=document.querySelector('#sortProducts');
sort.querySelectorAll('[value^="price-"]').forEach(option=>option.remove());
let activeCategory='all';
let currentPage=1;const pageSize=6;const pagination=document.createElement('nav');pagination.className='product-pagination';pagination.setAttribute('aria-label','Ürün sayfaları');grid.after(pagination);

document.body.insertAdjacentHTML('beforeend',`<div class="product-modal" id="productModal" aria-hidden="true"><div class="modal-backdrop" data-close></div><section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modalName"><button class="modal-close" data-close aria-label="Kapat">×</button><div class="modal-image"><img id="modalImage" alt=""></div><div class="modal-copy"><small>ÜRÜN DETAYI</small><h2 id="modalName"></h2><p id="modalDescription"></p><ul id="modalFeatures"></ul><span id="modalStock" class="stock-badge"></span><div class="modal-actions"><div class="quantity"><button data-qty="minus">−</button><output id="modalQty">1</output><button data-qty="plus">+</button></div><a id="modalWhatsapp" target="_blank" rel="noopener">WHATSAPP'TAN BİLGİ AL</a></div><div class="modal-category"><b>Kategori:</b> <span id="modalCategory"></span></div></div></section></div>`);
const modal=document.querySelector('#productModal');let selectedProduct=null,quantity=1;

function whatsappUrl(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
function openProduct(product){
  selectedProduct=product;quantity=1;
  modal.querySelector('#modalImage').src=product.image||'assets/gallery-products.png';modal.querySelector('#modalImage').alt=product.name;
  modal.querySelector('#modalName').textContent=product.name;
  modal.querySelector('#modalDescription').textContent=product.description||'Bu ürün hakkında ayrıntılı bilgi almak için bize ulaşın.';
  modal.querySelector('#modalFeatures').innerHTML=(product.features||'Profesyonel kullanım|Güvenilir ürün').split('|').map(x=>`<li>${x}</li>`).join('');
  modal.querySelector('#modalStock').textContent=product.stock>0?`✓ Stokta ${product.stock} adet`:'Stok bilgisi için arayın';modal.querySelector('#modalCategory').textContent=product.category;
  updateQuantity();modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');modal.querySelector('.modal-close').focus();
}
function updateQuantity(){modal.querySelector('#modalQty').textContent=quantity;modal.querySelector('#modalWhatsapp').href=whatsappUrl(`Merhaba, bu ürün hakkında bilgi almak istiyorum.\n\nÜrün: ${selectedProduct.name}\nAdet: ${quantity}\n\nUygunluk ve teslimat bilgileri için dönüş yapabilir misiniz?`)}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}

function renderCategories(){
  const categories=['Tümü',...new Set(products.map(p=>p.category))];cats.innerHTML='';filter.innerHTML='<option value="all">Tümü</option>';
  categories.forEach((category,index)=>{const value=index?'category':'all';const count=index?products.filter(p=>p.category===category).length:products.length;const b=document.createElement('button');b.className=`category-item ${activeCategory===(index?category:'all')?'active':''}`;b.innerHTML=`<span>${category}</span><b>${count}</b>`;b.onclick=()=>{activeCategory=index?category:'all';filter.value=activeCategory;renderCategories();render()};cats.appendChild(b);if(index)filter.add(new Option(category,category))});filter.value=activeCategory;
}
function render(){
  const q=search.value.toLocaleLowerCase('tr');let list=products.filter(p=>(activeCategory==='all'||p.category===activeCategory)&&p.name.toLocaleLowerCase('tr').includes(q));
  if(sort.value==='name')list.sort((a,b)=>a.name.localeCompare(b.name,'tr'));if(sort.value==='stock')list.sort((a,b)=>b.stock-a.stock);
  const pageCount=Math.max(1,Math.ceil(list.length/pageSize));currentPage=Math.min(currentPage,pageCount);const pageItems=list.slice((currentPage-1)*pageSize,currentPage*pageSize);
  document.querySelector('#resultCount').textContent=`${products.length} üründen ${list.length} ürün gösteriliyor`;
  grid.innerHTML=pageItems.map(p=>`<article class="product-card" data-id="${p.id}" tabindex="0" aria-label="${p.name} ürününü incele"><div class="product-visual"><img src="${p.image||'assets/gallery-products.png'}" alt="${p.name}" loading="lazy"><small>${p.campaign?'KAMPANYALI':p.stock>0?'STOKTA':'SORUNUZ'}</small></div><div class="product-info"><small>${p.category}</small><h4>${p.name}</h4><div class="product-action"><button type="button" aria-label="${p.name} ürününü incele"><span>İNCELE</span><i>→</i></button></div></div></article>`).join('')||'<p class="empty-result">Aramanızla eşleşen ürün bulunamadı.</p>';
  pagination.innerHTML=pageCount>1?`<button data-page="${currentPage-1}" aria-label="Önceki sayfa" ${currentPage===1?'disabled':''}>←</button><strong><span>${currentPage}</span> / ${pageCount}</strong><button data-page="${currentPage+1}" aria-label="Sonraki sayfa" ${currentPage===pageCount?'disabled':''}>→</button>`:'';
}
campaignSection.addEventListener('click',event=>{const card=event.target.closest('[data-campaign-id]');if(card)openProduct(products.find(p=>p.id===Number(card.dataset.campaignId))) });
campaignSection.addEventListener('keydown',event=>{const card=event.target.closest('[data-campaign-id]');if(card&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openProduct(products.find(p=>p.id===Number(card.dataset.campaignId)))}});
pagination.addEventListener('click',e=>{const page=Number(e.target.dataset.page);if(page){currentPage=page;render();grid.scrollIntoView({behavior:'smooth',block:'start'})}});
grid.addEventListener('click',e=>{const card=e.target.closest('[data-id]');if(card)openProduct(products.find(p=>p.id===Number(card.dataset.id)))});
grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('[data-id]')){e.preventDefault();openProduct(products.find(p=>p.id===Number(e.target.closest('[data-id]').dataset.id)))}});
modal.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeModal();if(e.target.dataset.qty){quantity=e.target.dataset.qty==='plus'?Math.min(quantity+1,Math.max(selectedProduct.stock,1)):Math.max(1,quantity-1);updateQuantity()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal()});
search.addEventListener('input',()=>{currentPage=1;render()});filter.addEventListener('change',()=>{activeCategory=filter.value;currentPage=1;renderCategories();render()});sort.addEventListener('change',()=>{currentPage=1;render()});
renderCategories();render();
fetch(`${API_BASE_URL}/api/products`).then(response=>{if(!response.ok)throw new Error('API unavailable');return response.json()}).then(remoteProducts=>{if(!Array.isArray(remoteProducts)||!remoteProducts.length)return;products=remoteProducts;localStorage.setItem(PRODUCT_KEY,JSON.stringify(products));renderCategories();render();renderCampaigns()}).catch(()=>{});renderCampaigns();
