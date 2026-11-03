/* Progressive enhancement: default content is readable before any JS executes. */
(() => {
 const names={commercial:'index.html',animation:'animation.html',brand:'brand.html',marketing:'marketing.html'};
 const initial=document.body.dataset.direction || 'commercial';
 const cache=new Map([[initial,{body:document.body.innerHTML,title:document.title}]]);
 let generation=0, observer;
 const desired=()=>Object.hasOwn(names,new URLSearchParams(location.search).get('view'))?new URLSearchParams(location.search).get('view'):'commercial';
 function media(){
  observer?.disconnect();
  const video=document.querySelector('video[data-src]');if(!video)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save=navigator.connection?.saveData;
  const load=()=>{if(!video.getAttribute('src'))video.src=video.dataset.src;};
  video.addEventListener('pointerdown',load,{once:true});
  video.addEventListener('keydown',load,{once:true});
  if(!reduced&&!save){observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){load();video.play().catch(()=>{});}else video.pause();}},{threshold:.25});observer.observe(video);}
 }
 function metadata(key,title){
  document.title=title;
  document.querySelector('meta[property="og:title"]').content=title;
  document.querySelector('meta[name="twitter:title"]').content=title;
  document.querySelector('meta[property="og:url"]').content='https://shuxia98.github.io/resume3/?view='+key;
 }
 async function render(key,push=false){
  const token=++generation;
  try{
   if(!cache.has(key)){const r=await fetch('views/'+key+'.json?v=nav-20261103');if(!r.ok)throw Error(r.status);cache.set(key,await r.json());}
   if(token!==generation)return;
   const view=cache.get(key);document.querySelector('video')?.pause();
   document.body.innerHTML=view.body;document.body.dataset.direction=key;document.body.classList.remove('modal-open');
   metadata(key,view.title);wireProjects();media();
   if(push){history.pushState({},'', '?view='+key);window.scrollTo(0,0);}
   else if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }catch{location.assign(names[key]);}
 }
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="?view="]');
  if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;
  const key=new URL(a.href).searchParams.get('view');if(!Object.hasOwn(names,key))return;
  e.preventDefault();render(key,true);
 });
 window.addEventListener('popstate',()=>render(desired()));
 // Actual legacy HTML files remain available for external bookmarks and no-JS use.
 const target=location.search?desired():initial;
 if(target!==initial)render(target);else media();
})();
