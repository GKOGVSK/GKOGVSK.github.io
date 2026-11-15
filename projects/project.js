const projectName=location.pathname.split('/').filter(Boolean).pop()||'';
document.body.classList.add(`project-${projectName}`);
document.querySelectorAll('[data-scroll]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'})}}));
const themeStyles=document.createElement('style');
themeStyles.textContent=`
.project-pitstop .demo-bar{background:#dfff3f;color:#151713}.project-pitstop .demo-bar:before{color:#151713}.project-pitstop .contact-strip{border-radius:8px 42px 8px 42px}
.project-sellerflow .demo-bar{background:#7058ff;color:#fff}.project-sellerflow .demo-bar:before{color:#d8d1ff}.project-sellerflow .contact-strip{border-radius:24px}.project-sellerflow .credit{color:#514a67}
.project-linen{overflow-x:hidden}.project-linen .demo-bar{background:#4a2e20;color:#f3e9d4}.project-linen .demo-bar:before{color:#e6bd76}.project-linen .contact-strip{border-radius:70px 12px 70px 12px}
.project-lumen .demo-bar{background:#c7e4e5;color:#173d49}.project-lumen .demo-bar:before{color:#173d49}.project-lumen .contact-strip{border-radius:50px 12px}
.project-studio .demo-bar{background:#f7f0e6;color:#151312}.project-studio .demo-bar:before{color:#ff775d}.project-studio .contact-strip{border-radius:4px}
`;
document.head.append(themeStyles);
