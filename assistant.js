import * as THREE from './vendor/three.module.js';

const openButton=document.querySelector('#assistant-open');
const closeButton=document.querySelector('#assistant-close');
const panel=document.querySelector('#assistant-panel');
const answer=document.querySelector('#assistant-answer');
const resultLink=document.querySelector('#assistant-result-link');
const form=document.querySelector('#assistant-form');
const input=document.querySelector('#assistant-input');

const responses={
  format:{text:'Если нужно быстро представить одну услугу или запустить рекламу — подойдёт одностраничный сайт. Для компании с несколькими направлениями лучше сайт с отдельными смысловыми разделами. Если задача связана с цифрами, отчётами и ручными таблицами — стоит обсудить индивидуальный сервис аналитики.',href:'#services',label:'Сравнить форматы ↓'},
  portfolio:{text:'В портфолио пять живых проектов: шиномонтаж, аналитика маркетплейсов, пекарня, стоматология и фотостудия. Каждый сайт можно открыть и проверить.',href:'#works',label:'Смотреть портфолио ↓'},
  time:{text:'Одностраничный сайт обычно готов к первому показу через 1–2 дня после согласования задачи и получения материалов. Для более сложной работы срок фиксируется до старта.',href:'#process',label:'Посмотреть формат работы ↓'},
  materials:{text:'Пришлите ТЗ или список пожеланий, описание компании, услуги и цены, логотип, фотографии, контакты и примеры сайтов, которые нравятся. Если ТЗ нет — Георгий поможет собрать его вопросами.',href:'#process',label:'Что происходит дальше ↓'},
  software:{text:'Можно разработать индивидуальный инструмент для аналитики продаж и маркетплейсов под конкретного селлера: нужные показатели, отчёты, остатки и рабочие сценарии.',href:'projects/sellerflow/',label:'Открыть пример SellerFlow ↗'},
  price:{text:'Ориентир для одностраничного сайта — от 10 000 ₽. Точная стоимость зависит от объёма, материалов и функций; Георгий назовёт её после короткого обсуждения.',href:'https://t.me/partythisdoor',label:'Уточнить стоимость в Telegram ↗'},
  contact:{text:'Напишите Георгию напрямую — без менеджеров. Телефон: +7 915 139-15-81, Telegram: @partythisdoor.',href:'https://wa.me/79151391581',label:'Написать в WhatsApp ↗'},
  default:{text:'Я могу подсказать по срокам, стоимости, материалам, портфолио и разработке аналитики для селлеров. Если вопрос индивидуальный — лучше написать Георгию напрямую.',href:'https://t.me/partythisdoor',label:'Задать вопрос Георгию ↗'}
};
function showResponse(key){const item=responses[key]||responses.default;answer.textContent=item.text;resultLink.innerHTML='';const link=document.createElement('a');link.href=item.href;link.textContent=item.label;if(item.href.startsWith('http')){link.target='_blank';link.rel='noopener'}resultLink.append(link)}
function detectQuestion(value){const q=value.toLowerCase();if(/портф|работ|пример|кейс/.test(q))return'portfolio';if(/срок|долго|дней|быстро|время/.test(q))return'time';if(/тз|материал|присл|нужно|фото|логотип/.test(q))return'materials';if(/маркет|селлер|аналит|софт|продаж/.test(q))return'software';if(/цен|стои|руб|бюджет|сколько денег/.test(q))return'price';if(/связ|телефон|ватс|whats|телег|напис/.test(q))return'contact';return'default'}
function toggle(show){panel.hidden=!show;openButton.setAttribute('aria-expanded',String(show));if(show)setTimeout(()=>input.focus(),0)}
let ignoreClick=false;
openButton.addEventListener('click',()=>{if(ignoreClick){ignoreClick=false;return}toggle(panel.hidden)});closeButton.addEventListener('click',()=>toggle(false));
document.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>showResponse(button.dataset.question)));
form.addEventListener('submit',event=>{event.preventDefault();const value=input.value.trim();if(value)showResponse(detectQuestion(value))});
document.addEventListener('keydown',event=>{if(event.key==='Escape')toggle(false)});

// Drag the whole character around the viewport and remember the visitor's preferred spot.
const assistant=document.querySelector('.assistant');
let drag=null;
function clampPosition(left,top){const width=assistant.offsetWidth,height=assistant.offsetHeight;return{left:Math.max(8,Math.min(innerWidth-width-8,left)),top:Math.max(8,Math.min(innerHeight-height-8,top))}}
function place(left,top,remember=false){const pos=clampPosition(left,top);assistant.style.left=`${pos.left}px`;assistant.style.top=`${pos.top}px`;assistant.style.right='auto';assistant.style.bottom='auto';assistant.classList.toggle('panel-below',pos.top<410);if(remember)localStorage.setItem('george-bot-position',JSON.stringify(pos))}
try{const saved=JSON.parse(localStorage.getItem('george-bot-position'));if(innerWidth>680&&saved&&Number.isFinite(saved.left)&&Number.isFinite(saved.top))requestAnimationFrame(()=>place(saved.left,saved.top))}catch{}
openButton.addEventListener('pointerdown',event=>{if(event.button!==undefined&&event.button!==0)return;const rect=assistant.getBoundingClientRect();drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:rect.left,top:rect.top,moved:false};openButton.setPointerCapture?.(event.pointerId);assistant.classList.add('dragging')});
openButton.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.id)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.hypot(dx,dy)>5){drag.moved=true;ignoreClick=true;place(drag.left+dx,drag.top+dy)}});
function finishDrag(event){if(!drag||event.pointerId!==drag.id)return;const wasMoved=drag.moved;drag=null;assistant.classList.remove('dragging');if(wasMoved){const rect=assistant.getBoundingClientRect();place(rect.left,rect.top,true)}}
openButton.addEventListener('pointerup',finishDrag);openButton.addEventListener('pointercancel',finishDrag);window.addEventListener('resize',()=>{if(innerWidth<=680){assistant.style.left='';assistant.style.top='';assistant.style.right='';assistant.style.bottom='';assistant.classList.remove('panel-below');return}if(assistant.style.left){const rect=assistant.getBoundingClientRect();place(rect.left,rect.top)}});

const canvas=document.querySelector('#assistant-canvas');
const stage=document.querySelector('.assistant-stage');
try{
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(32,1,.1,20);camera.position.set(0,1.1,4.2);camera.lookAt(0,1.05,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x352b24,3));const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-2,4,3);scene.add(key);const rim=new THREE.DirectionalLight(0xd7ff57,3);rim.position.set(3,2,-2);scene.add(rim);
  const mat={skin:new THREE.MeshStandardMaterial({color:0xe3aa87,roughness:.82}),hair:new THREE.MeshStandardMaterial({color:0x2a1b16,roughness:.92}),black:new THREE.MeshStandardMaterial({color:0x181715,roughness:.8}),acid:new THREE.MeshStandardMaterial({color:0xd7ff57,roughness:.6}),white:new THREE.MeshStandardMaterial({color:0xfffdf8,roughness:.7}),eye:new THREE.MeshStandardMaterial({color:0x171512,roughness:.6})};
  const person=new THREE.Group();scene.add(person);
  function oval(material,x,y,z,sx,sy,sz,parent=person){const m=new THREE.Mesh(new THREE.SphereGeometry(1,22,16),material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m}
  oval(mat.black,0,.83,0,.42,.48,.29);oval(mat.acid,0,.9,.294,.12,.08,.018);oval(mat.black,-.17,.32,0,.13,.36,.13);oval(mat.black,.17,.32,0,.13,.36,.13);oval(mat.white,-.17,.04,.1,.19,.09,.24);oval(mat.white,.17,.04,.1,.19,.09,.24);
  const leftArm=oval(mat.black,-.42,.85,0,.12,.38,.12);leftArm.rotation.z=-.28;const rightArm=oval(mat.black,.42,.85,0,.12,.38,.12);rightArm.rotation.z=.28;
  const head=new THREE.Group();head.position.set(0,1.58,0);person.add(head);oval(mat.skin,0,0,0,.43,.46,.35,head);oval(mat.hair,0,.33,-.02,.42,.18,.34,head);oval(mat.hair,0,-.23,.1,.34,.24,.28,head);oval(mat.hair,-.32,-.08,.12,.09,.22,.15,head);oval(mat.hair,.32,-.08,.12,.09,.22,.15,head);
  oval(mat.hair,-.15,.13,.335,.12,.035,.02,head).rotation.z=-.13;oval(mat.hair,.15,.13,.335,.12,.035,.02,head).rotation.z=.13;
  oval(mat.white,-.15,.04,.355,.075,.06,.02,head);oval(mat.white,.15,.04,.355,.075,.06,.02,head);const lp=oval(mat.eye,-.15,.04,.38,.027,.032,.012,head);const rp=oval(mat.eye,.15,.04,.38,.027,.032,.012,head);oval(mat.skin,0,-.05,.37,.08,.09,.06,head);oval(mat.hair,0,-.13,.355,.18,.05,.025,head);oval(mat.white,0,-.2,.35,.12,.025,.013,head);
  let px=0,py=0;openButton.addEventListener('pointermove',event=>{const r=openButton.getBoundingClientRect();px=(event.clientX-r.left)/r.width-.5;py=(event.clientY-r.top)/r.height-.5});openButton.addEventListener('pointerleave',()=>{px=0;py=0});
  function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(stage);resize();
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');function render(now){const t=now/1000;if(!reduce.matches){person.position.y=Math.sin(t*2.1)*.035;person.rotation.y=Math.sin(t*.75)*.1;head.rotation.y+=(px*.55-head.rotation.y)*.08;head.rotation.x+=(-py*.3+Math.sin(t*1.7)*.04-head.rotation.x)*.08;rightArm.rotation.z=.28+Math.sin(t*1.4)*.08;lp.position.x=-.15+px*.03;rp.position.x=.15+px*.03}renderer.render(scene,camera);requestAnimationFrame(render)}requestAnimationFrame(render);
}catch(error){document.querySelector('.assistant-fallback').style.display='grid';canvas.style.display='none';console.warn('3D assistant unavailable',error)}
