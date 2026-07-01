// ====== Navegação entre telas ======
function goTo(screenId){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo(0,0);
}

// Botões simples com data-next (continuar / voltar)
document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => goTo(btn.dataset.next));
});

// ====== Construção do muro de pedra (20 blocos) ======
const wallBricksEl = document.getElementById('wall-bricks');
const shiftClasses = ['shift-a', 'shift-b', 'shift-c'];

function montarMuro(){
  wallBricksEl.innerHTML = '';
  for (let i = 0; i < 20; i++){
    const brick = document.createElement('div');
    brick.className = 'brick ' + shiftClasses[Math.floor(Math.random() * shiftClasses.length)];
    brick.style.transitionDelay = (Math.random() * 0.15) + 's';
    wallBricksEl.appendChild(brick);
  }
}

function resetCracks(){
  document.querySelectorAll('.crack').forEach(c => c.classList.remove('show'));
}

// ====== Etapa 1: escolher muro ======
document.querySelectorAll('.muro-card').forEach(card => {
  card.addEventListener('click', () => {
    const muro = card.dataset.muro;
    document.getElementById('wall-title').textContent = muro.toUpperCase();
    document.getElementById('wall-label').textContent = muro.toUpperCase();
    tentativas = 0;
    resetCracks();
    montarMuro();
    goTo('screen-wall');
  });
});

// ====== Etapa 2: tentar quebrar o muro ======
let tentativas = 0;
const wallVisual = document.getElementById('wall-visual');
wallVisual.addEventListener('click', () => {
  if (wallVisual.classList.contains('breaking')) return;
  tentativas++;
  wallVisual.classList.remove('shaking');
  void wallVisual.offsetWidth; // reinicia a animação
  wallVisual.classList.add('shaking');

  const crack = document.querySelector('.crack-' + tentativas);
  if (crack) crack.classList.add('show');

  if (tentativas >= 3){
    wallVisual.classList.add('breaking');
    const bricks = wallBricksEl.querySelectorAll('.brick');
    bricks.forEach(brick => {
      const x = (Math.random() - 0.5) * 220;
      const y = 160 + Math.random() * 140;
      const rot = (Math.random() - 0.5) * 220;
      brick.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      brick.style.opacity = '0';
    });
    setTimeout(() => {
      wallVisual.classList.remove('breaking');
      goTo('screen-question');
    }, 650);
  }
});

// ====== Etapa 3: tocar em TETELESTAI ======
document.getElementById('btn-tetelestai').addEventListener('click', () => {
  goTo('screen-reveal');
});

// ====== Mural da Cruz (armazenado localmente no navegador) ======
const muralKey = 'tetelestai-mural';

function carregarMural(){
  const lista = JSON.parse(localStorage.getItem(muralKey) || '[]');
  const cloud = document.getElementById('mural-cloud');
  cloud.innerHTML = '';
  if (lista.length === 0){
    cloud.innerHTML = '<span class="empty">Seja o primeiro a entregar algo ao pé da cruz.</span>';
    return;
  }
  lista.slice(-40).forEach(item => {
    const span = document.createElement('span');
    span.textContent = item;
    cloud.appendChild(span);
  });
}

document.getElementById('btn-entregar').addEventListener('click', () => {
  const input = document.getElementById('mural-input');
  const texto = input.value.trim();
  if (!texto) return;
  const lista = JSON.parse(localStorage.getItem(muralKey) || '[]');
  lista.push(texto);
  localStorage.setItem(muralKey, JSON.stringify(lista));
  input.value = '';
  carregarMural();
});

// Reinicia o app quando volta ao início (reseta tentativas do muro)
document.querySelectorAll('[data-next="screen-home"]').forEach(btn => {
  btn.addEventListener('click', () => { tentativas = 0; });
});

carregarMural();