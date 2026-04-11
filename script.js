// ── CURSOR ──
// Custom cursor graphics removed to keep the interaction simple and use the browser default pointer.

// ── SCROLL PROGRESS ──
const bar=document.getElementById('progress');
window.addEventListener('scroll',()=>{
  const pct=(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight))*100;
  bar.style.width=pct+'%';
});

// ── NAVBAR ──
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>60));

// ── MOBILE MENU ──
document.getElementById('hamburger').addEventListener('click',()=>document.getElementById('mobileMenu').classList.add('open'));
document.getElementById('mobileClose').addEventListener('click',closeMobileMenu);
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open')}

// ── SCROLL REVEAL ──
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ── ACTIVE NAV ──
const secObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    const a=document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
    if(a)a.classList.toggle('active',e.isIntersecting);
  });
},{threshold:0.4});
document.querySelectorAll('section[id]').forEach(s=>secObs.observe(s));

// ── THREE.JS SCENE ──
(function(){
  const canvas=document.getElementById('three-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(window.innerWidth,window.innerHeight);

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,.1,100);
  camera.position.set(0,0,5);

  // Particles
  const count=2200;
  const geo=new THREE.BufferGeometry();
  const pos=new Float32Array(count*3);
  const col=new Float32Array(count*3);
  const colors=[[0,0.83,1],[0.47,0.22,0.95],[0.06,0.72,0.51]];
  for(let i=0;i<count;i++){
    pos[i*3]=(Math.random()-0.5)*14;
    pos[i*3+1]=(Math.random()-0.5)*14;
    pos[i*3+2]=(Math.random()-0.5)*14;
    const c=colors[Math.floor(Math.random()*colors.length)];
    col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2];
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({size:.04,vertexColors:true,transparent:true,opacity:.6,sizeAttenuation:true});
  const points=new THREE.Points(geo,mat);
  scene.add(points);

  // Floating wireframe torus
  const tGeo=new THREE.TorusGeometry(1.6,0.5,12,48);
  const tMat=new THREE.MeshBasicMaterial({color:0x00d4ff,wireframe:true,transparent:true,opacity:.05});
  const torus=new THREE.Mesh(tGeo,tMat);
  torus.position.set(3,0,-2);
  scene.add(torus);

  // Floating icosahedron
  const iGeo=new THREE.IcosahedronGeometry(0.9,1);
  const iMat=new THREE.MeshBasicMaterial({color:0x7c3aed,wireframe:true,transparent:true,opacity:.07});
  const ico=new THREE.Mesh(iGeo,iMat);
  ico.position.set(-3.5,1,-1);
  scene.add(ico);

  // Second torus ring
  const t2Geo=new THREE.TorusGeometry(0.9,0.25,8,32);
  const t2Mat=new THREE.MeshBasicMaterial({color:0x10b981,wireframe:true,transparent:true,opacity:.06});
  const torus2=new THREE.Mesh(t2Geo,t2Mat);
  torus2.position.set(-2,-2.5,-3);
  scene.add(torus2);

  let mx2=0,my2=0;
  document.addEventListener('mousemove',e=>{
    mx2=(e.clientX/window.innerWidth-0.5)*0.8;
    my2=-(e.clientY/window.innerHeight-0.5)*0.8;
  });

  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });

  let t=0;
  (function animate(){
    requestAnimationFrame(animate);
    t+=0.005;
    points.rotation.y=t*0.06;
    points.rotation.x=t*0.03;
    torus.rotation.x=t*0.4;
    torus.rotation.y=t*0.25;
    ico.rotation.y=t*0.5;
    ico.rotation.x=t*0.3;
    torus2.rotation.z=t*0.35;
    torus2.rotation.x=t*0.2;
    camera.position.x+=(mx2-camera.position.x)*0.04;
    camera.position.y+=(my2-camera.position.y)*0.04;
    camera.lookAt(scene.position);
    renderer.render(scene,camera);
  })();
})();

// ── COUNTER ANIMATION ──
function animCounter(el,target,suffix,isFloat){
  let s=0;const dur=1800;
  const step=ts=>{
    if(!s)s=ts;
    const p=Math.min((ts-s)/dur,1);
    const e=1-Math.pow(1-p,3);
    const v=isFloat?(e*target).toFixed(2):Math.floor(e*target);
    el.innerHTML=v+`<span>${suffix}</span>`;
    if(p<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const sObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    document.querySelectorAll('.stat-num[data-target]').forEach(el=>{
      const t=parseFloat(el.dataset.target);
      const sf=el.dataset.suffix;
      const fl=el.dataset.float==='true';
      animCounter(el,t,sf,fl);
    });
    sObs.disconnect();
  });
},{threshold:0.5});
const hs=document.querySelector('.hero-stats');
if(hs)sObs.observe(hs);
