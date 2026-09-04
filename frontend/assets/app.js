for(const href of ['assets/local.css','assets/brand.css','assets/layout-fixes.css','assets/product-cards.css','assets/whatsapp-cards.css','assets/onepage.css?v=11','assets/pagination.css?v=3','assets/logo.css','assets/brand-assets.css?v=2','assets/extras.css','assets/campaigns.css?v=9','assets/credits.css?v=5']){const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link)}

document.querySelectorAll('.brand-logo,.footer-brand-logo').forEach(img=>img.src='assets/akgun-logo-hd.png');
const favicon=document.createElement('link');favicon.rel='icon';favicon.type='image/png';favicon.href='assets/akgun-logo-hd.png';document.head.appendChild(favicon);
const siteFooter=document.querySelector('footer');if(siteFooter){const credit=document.createElement('small');credit.className='creator-credit';credit.textContent=atob('Q3JlYXRlZCBieSBSYXVsIEJhYmFraGFub3Y=');siteFooter.appendChild(credit)}
const instagramUrl='https://www.instagram.com/akgunsulama?utm_source=qr&igsi=Y2xvenRkb2xlczkw';if(siteFooter){const instagram=document.createElement('a');instagram.className='instagram-link';instagram.href=instagramUrl;instagram.target='_blank';instagram.rel='noopener noreferrer';instagram.setAttribute('aria-label','Akgün Sulama Instagram hesabı');instagram.innerHTML='<span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle class="instagram-dot" cx="17.4" cy="6.8" r="1"/></svg></span><b>Instagram</b><i>↗</i>';siteFooter.appendChild(instagram)}

const nav=document.querySelector('#siteNav');
nav.querySelector('[data-page="gallery"]')?.remove();
const menuToggle=document.querySelector('#menuToggle');
menuToggle.addEventListener('click',()=>nav.classList.toggle('open'));
const sectionIds={home:'home',products:'products',solutions:'solutions',gallery:'gallery',contact:'contact'};
document.querySelector('.hero').id='home';
document.querySelectorAll('#siteNav a').forEach(link=>{
  link.href=`#${sectionIds[link.dataset.page]}`;
  link.addEventListener('click',()=>nav.classList.remove('open'));
});
document.querySelectorAll('a[href="index.html?sayfa=urunler"]').forEach(link=>link.href='#products');
document.querySelectorAll('a[href="#products"],a[href="#contact"]').forEach(link=>link.addEventListener('click',event=>{
  const target=document.querySelector(link.getAttribute('href'));if(target){event.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'})}
}));
const observedSections=[...document.querySelectorAll('#home,#products,#solutions,#gallery,#contact')];
const setActive=id=>document.querySelectorAll('#siteNav a').forEach(link=>link.classList.toggle('active',sectionIds[link.dataset.page]===id));
setActive('home');
const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)setActive(entry.target.id)}),{rootMargin:'-35% 0px -55%'});observedSections.forEach(section=>navObserver.observe(section));
const legacyPage={urunler:'products',cozumler:'solutions',uygulamalar:'gallery',iletisim:'contact'}[new URLSearchParams(location.search).get('sayfa')];
if(legacyPage)setTimeout(()=>document.querySelector(`#${legacyPage}`)?.scrollIntoView({behavior:'smooth'}),100);

document.querySelector('#quoteForm').addEventListener('submit',event=>{event.preventDefault();const f=new FormData(event.currentTarget);const message=`Merhaba, sulama projem için teklif almak istiyorum.\n\nAd: ${f.get('name')}\nTelefon: ${f.get('phone')}\nKonum: ${f.get('location')}\nArazi: ${f.get('area')||'Belirtilmedi'}\nSulama türü: ${f.get('type')}\nYetiştirilen ürün: ${f.get('crop')||'Belirtilmedi'}\nNot: ${f.get('note')||'Yok'}`;window.open(`https://wa.me/905052242448?text=${encodeURIComponent(message)}`,'_blank','noopener')});

const catalogScript=document.createElement('script');catalogScript.src='assets/catalog.js?v=10';document.body.appendChild(catalogScript);
