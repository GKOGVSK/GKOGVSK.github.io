(() => {
  const title=document.querySelector('.ts-brand h1');
  if(title)title.textContent='SellerFlow Analytics';
  const top=document.querySelector('.ts-top');
  if(!top)return;

  const actions=document.createElement('div');
  actions.className='live-actions';
  actions.innerHTML='<div class="live-status" role="status"><span>Проверяю данные…</span></div><button class="live-refresh" type="button">Проверить</button>';
  top.append(actions);
  const status=actions.querySelector('.live-status');
  const statusText=status.querySelector('span');
  const refresh=actions.querySelector('.live-refresh');
  let initialStamp='';

  const fmtDate=(value)=>new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Europe/Moscow'}).format(new Date(value));
  const fmtTime=(value)=>new Intl.DateTimeFormat('ru-RU',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Moscow'}).format(new Date(value));
  async function check(autoReload=false,manual=false){
    try{
      const response=await fetch('data.json?check='+Date.now(),{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();
      const stamp=data.generated||'';
      if(!initialStamp)initialStamp=stamp;
      status.classList.remove('is-stale');
      statusText.textContent=stamp?'Данные от '+fmtDate(stamp)+' · обновлено в '+fmtTime(stamp):'Время обновления неизвестно';
      if(autoReload&&stamp&&stamp!==initialStamp&&sessionStorage.getItem('sellerflow-stamp')!==stamp){
        sessionStorage.setItem('sellerflow-stamp',stamp);
        location.reload();
      }
    }catch(error){
      status.classList.add('is-stale');
      statusText.innerHTML='Нет связи с источником<small>Повторим автоматически</small>';
    }
  }
  refresh.addEventListener('click',async()=>{refresh.disabled=true;refresh.textContent='Проверяю…';await check(true,true);refresh.disabled=false;refresh.textContent='Проверить'});
  check(false);
  setInterval(()=>{if(!document.hidden)check(true)},60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check(true)});
})();
