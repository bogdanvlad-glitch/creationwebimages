const prankDelay=1000;
const firstKey='exacode_first_visit';
if(!sessionStorage.getItem(firstKey)) sessionStorage.setItem(firstKey,String(Date.now()));

async function getJSON(url,ms=4500){const c=new AbortController();const t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json()}finally{clearTimeout(t)}}

function gpuInfo(){try{const c=document.createElement('canvas');const gl=c.getContext('webgl')||c.getContext('experimental-webgl');if(!gl)return'indisponible';const e=gl.getExtension('WEBGL_debug_renderer_info');return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):(gl.getParameter(gl.RENDERER)||'indisponible')}catch{return'indisponible'}}
function osGuess(){const ua=navigator.userAgent;if(/Windows/.test(ua))return'Windows';if(/Mac OS X/.test(ua))return'macOS';if(/Android/.test(ua))return'Android';if(/iPhone|iPad|iPod/.test(ua))return'iOS/iPadOS';if(/Linux/.test(ua))return'Linux';return navigator.platform||'inconnu'}
function browserGuess(){const ua=navigator.userAgent;if(ua.includes('Edg/'))return'Edge';if(ua.includes('Chrome/'))return'Chrome';if(ua.includes('Firefox/'))return'Firefox';if(ua.includes('Safari/')&&!ua.includes('Chrome/'))return'Safari';return'inconnu'}
async function publicIPv4(){try{return (await getJSON('https://api.ipify.org?format=json')).ip||'indisponible'}catch{return'indisponible'}}
async function publicIPv6(){try{return (await getJSON('https://api64.ipify.org?format=json')).ip||'indisponible'}catch{return'indisponible'}}
async function geo(){for(const u of ['https://ipwho.is/','https://ipapi.co/json/']){try{const d=await getJSON(u);if(d.success===false)continue;return{city:d.city||'indisponible',region:d.region||d.region_name||'indisponible',country:d.country||d.country_name||'indisponible',postal:d.postal||'indisponible',isp:(d.connection&&d.connection.isp)||d.org||d.isp||'indisponible'}}catch{}}return{city:'indisponible',region:'indisponible',country:'indisponible',postal:'indisponible',isp:'indisponible'}}

async function collect(){const [ipv4,ipv6,g]=await Promise.all([publicIPv4(),publicIPv6(),geo()]);const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;return{
'NOM/PRENOM':window.name||'Alexandru Vlad',
'IPv4 publique':ipv4,
'IPv6 publique':ipv6,
'Position IP approx.': 'Louvain-la-Neuve, Belgique',
'Ville estimée':'Louvain-la-Neuve',
'Région estimée':g.region,
'Pays estimé':g.country,
'Code postal estimé':g.postal,
'FAI / organisation':g.isp,
'Fuseau horaire':Intl.DateTimeFormat().resolvedOptions().timeZone||'inconnu',
'Heure locale':new Date().toLocaleString(),
'Langue':navigator.language,
'Système':osGuess(),
'Navigateur':browserGuess(),
'Plateforme':navigator.platform||'inconnue',
'User-Agent':navigator.userAgent,
'Écran':`${screen.width}x${screen.height}`,
'Fenêtre':`${innerWidth}x${innerHeight}`,
'Pixel ratio':window.devicePixelRatio,
'Cœurs logiques':navigator.hardwareConcurrency||'indisponible',
'Mémoire approx.':navigator.deviceMemory?`${navigator.deviceMemory} GB approx.`:'indisponible',
'Tactile':navigator.maxTouchPoints||0,
'Cookies':navigator.cookieEnabled?'activés':'désactivés',
'Do Not Track':navigator.doNotTrack||'non défini',
'En ligne':navigator.onLine?'oui':'non',
'Connexion':conn?(conn.effectiveType||conn.type||'détectée'):'indisponible',
'GPU / WebGL':gpuInfo(),
'Page précédente':document.referrer||'aucune'
}}

function ensureOverlay(){if(document.getElementById('prankOverlay'))return;const el=document.createElement('div');el.id='prankOverlay';el.className='prank-overlay';el.innerHTML=`<div class="terminal"><div class="hack-title">TU AS ÉTÉ HACKÉ</div><div class="hack-sub">Accès au terminal distant... données envoyés à Mr.ROBOT :</div><pre id="hackData">INITIALISATION...</pre><div class="reveal" id="hackReveal" style="display:none"><b></b><br>Les informations ci-dessus seront envoyés à Mr.ROBOT pour être revendues sur le DarkWeb.</div><button class="closeprank" id="hackClose" style="display:none" onclick="document.getElementById('prankOverlay').classList.remove('show')">Fermer</button></div>`;document.body.appendChild(el)}

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

async function triggerPrank(){
  ensureOverlay();
  const el=document.getElementById('prankOverlay');
  const out=document.getElementById('hackData');
  const reveal=document.getElementById('hackReveal');
  const close=document.getElementById('hackClose');
  el.classList.add('show');
  reveal.style.display='none';
  close.style.display='none';
  out.textContent='INITIALISATION DU SCAN...';
  await sleep(700);
  out.textContent+='\nCONNEXION ÉTABLIE';
  await sleep(650);
  out.textContent+='\nANALYSE DU NAVIGATEUR...';
  await sleep(500);
  out.textContent+='\nENVOI DES DONNÉES A MR.ROBOT...';

  const data=await collect();
  console.group('ExaCode prank — données visibles par le navigateur');
  Object.entries(data).forEach(([k,v])=>console.log(k+':',v));
  console.groupEnd();

  await sleep(500);
  out.textContent+='\n\n';
  for(const [k,v] of Object.entries(data)){
    out.textContent+=`${k.padEnd(23)} : ${v}\n`;
    out.scrollIntoView({block:'end',behavior:'smooth'});
    await sleep(260+Math.floor(Math.random()*360));
  }
  out.textContent+='\nSCAN TERMINÉ.';
  await sleep(900);
  reveal.style.display='block';
  close.style.display='block';
}

const elapsed=Date.now()-Number(sessionStorage.getItem(firstKey));setTimeout(triggerPrank,Math.max(0,prankDelay-elapsed));






