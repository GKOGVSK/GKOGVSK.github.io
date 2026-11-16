const menuBtn=document.querySelector('.menu-btn');const links=document.querySelectorAll('.nav-links a');menuBtn.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'Закрыть':'Меню'});links.forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('menu-open');menuBtn.setAttribute('aria-expanded','false');menuBtn.textContent='Меню'}));const frames=document.querySelectorAll('.browser');function fitFrames(){frames.forEach(box=>{box.querySelector('iframe').style.transform=`scale(${box.clientWidth/1000})`})}new ResizeObserver(fitFrames).observe(document.body);fitFrames();

// Выстраиваем страницу в порядке, в котором клиент принимает решение:
// сначала понимает предложение, затем смотрит доказательства и процесс.
const pageMain=document.querySelector('main');
const servicesSection=document.querySelector('#services');
const worksSection=document.querySelector('#works');
const analyticsSection=document.querySelector('.analytics-callout');
if(pageMain&&servicesSection&&worksSection&&analyticsSection){
  pageMain.insertBefore(servicesSection,worksSection);
  pageMain.insertBefore(analyticsSection,worksSection);
  servicesSection.querySelector('.section-index').textContent='01 / Что делаю';
  worksSection.querySelector('.section-index').textContent='02 / Портфолио';
}
if(location.hash)requestAnimationFrame(()=>document.querySelector(location.hash)?.scrollIntoView());

const navMenu=document.querySelector('.nav-links');
const servicesLink=navMenu?.querySelector('a[href="#services"]');
const worksLink=navMenu?.querySelector('a[href="#works"]');
if(navMenu&&servicesLink&&worksLink)navMenu.insertBefore(servicesLink,worksLink);

const servicesTitle=document.querySelector('#services-title');
const servicesDesc=document.querySelector('#services .section-desc');
if(servicesTitle)servicesTitle.innerHTML='Сайт или сервис.<br><i>Под конкретную задачу.</i>';
if(servicesDesc)servicesDesc.textContent='Определяю цель, проектирую структуру и довожу решение до запуска. Объём, стоимость и срок фиксируем до начала работы.';
const offerCopy=[
  'Одностраничник, лендинг или сайт-карточка на 1–2 страницы. Структура, текст, индивидуальный дизайн и мобильная версия — в одном проекте.',
  'Сайт для компании, магазина или специалиста любого направления. Услуги, преимущества, кейсы и контакты выстраиваются в понятный маршрут для клиента.',
  'Сервис аналитики для селлеров, предпринимателей и магазинов любого направления. Показатели и сценарии настраиваются под реальные процессы бизнеса.'
];
document.querySelectorAll('.offer-card p').forEach((item,index)=>{if(offerCopy[index])item.textContent=offerCopy[index]});

const trustItems=document.querySelectorAll('.trust-item');
if(trustItems[2]){
  trustItems[2].querySelector('strong').textContent='Адаптивно';
  trustItems[2].querySelector('span').textContent='Телефон, планшет и компьютер';
}
if(trustItems[3])trustItems[3].querySelector('span').textContent='Под ваш бизнес и показатели';

const analyticsLabel=document.querySelector('.analytics-lead>span');
if(analyticsLabel)analyticsLabel.textContent='Сервисы аналитики / бизнес любого направления';
const analyticsDemo=document.querySelector('.analytics-actions a:first-child');
if(analyticsDemo)analyticsDemo.textContent='Открыть SellerFlow ↗';

const steps=document.querySelector('.steps');
if(steps)steps.innerHTML=`
  <article class="step"><strong>01 / Задача и материалы</strong><h3>Разбираемся, что нужно</h3><p>Обсуждаем бизнес, аудиторию и цель. Вы присылаете тексты, логотип, фотографии, цены и примеры. Если ТЗ нет — собираю его вопросами.</p></article>
  <article class="step"><strong>02 / Объём и оплата</strong><h3>Фиксируем договорённости</h3><p>Утверждаем структуру, обязательные блоки, стоимость, срок и удобный порядок оплаты. После подтверждения ставлю проект в работу.</p></article>
  <article class="step"><strong>03 / Разработка</strong><h3>Собираю рабочую версию</h3><p>Проектирую страницу, выстраиваю подачу, делаю дизайн и адаптацию. Одностраничник обычно готов к показу через 1–2 дня.</p></article>
  <article class="step"><strong>04 / Проверка и правки</strong><h3>Смотрим результат</h3><p>Вы получаете ссылку и передаёте согласованные правки одним списком. Я вношу изменения и повторно проверяю все основные сценарии.</p></article>
  <article class="step"><strong>05 / Запуск</strong><h3>Публикую и передаю</h3><p>Подключаю контакты, размещаю финальную версию и проверяю сайт на компьютере и телефоне. Вы получаете готовую рабочую ссылку.</p></article>`;

const quickQuestions=document.querySelector('.assistant-quick');
if(quickQuestions){
  const formatButton=document.createElement('button');
  formatButton.type='button';formatButton.dataset.question='format';formatButton.textContent='Что мне подойдёт?';
  const priceButton=document.createElement('button');
  priceButton.type='button';priceButton.dataset.question='price';priceButton.textContent='Стоимость';
  quickQuestions.append(formatButton,priceButton);
}
