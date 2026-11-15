(() => {
  const top=document.querySelector('.ts-top');
  if(!top)return;
  const title=document.querySelector('.ts-brand h1');
  if(title)title.textContent='SellerFlow Demo';
  const actions=document.createElement('div');
  actions.className='live-actions';
  actions.innerHTML='<div class="live-status demo-status" role="status">ДЕМО · только вымышленные данные</div>';
  top.append(actions);
})();