/* Sincronización del progreso con Firebase (inicio de sesión con Google + Firestore).
   El progreso se sigue guardando en el navegador (localStorage). Si iniciás sesión, además se guarda
   en Firestore en progreso/{uid} y se combina entre dispositivos (celular y compu).
   Si Firebase no está disponible (archivo local o vista previa), esto no hace nada. */
(function () {
  const firebaseConfig = {
    apiKey: 'AIzaSyAR2PHgq86GCqvEM3tHuE1XFDVwXafm6K4',
    authDomain: 'economia2-ce284.firebaseapp.com',
    projectId: 'economia2-ce284',
    storageBucket: 'economia2-ce284.firebasestorage.app',
    messagingSenderId: '451393568081',
    appId: '1:451393568081:web:92afffd1706f4177e2a770',
  };

  const btn = document.getElementById('syncBtn');
  const fb = window.firebase;
  const usable = fb && fb.initializeApp && /^https?:$/.test(location.protocol);
  if (!usable) { if (btn) btn.hidden = true; return; }

  const app = fb.initializeApp(firebaseConfig);
  const auth = fb.auth(app), db = fb.firestore(app);
  const Store = App.Store;
  let user = null, ready = false, timer = null, saving = false;

  /* ---------- combinar el progreso de dos dispositivos ---------- */
  function merge(local, remote) {
    const r = Object.assign({}, remote, local);
    const maps = (k) => Object.assign({}, remote[k] || {}, local[k] || {});
    r.cards = maps('cards');
    Object.keys(r.cards).forEach((k) => { r.cards[k] = Math.max((local.cards || {})[k] || 0, (remote.cards || {})[k] || 0); });
    r.lessons = maps('lessons');
    Object.keys(r.lessons).forEach((k) => { r.lessons[k] = !!((local.lessons || {})[k] || (remote.lessons || {})[k]); });
    r.quiz = maps('quiz');
    Object.keys(r.quiz).forEach((k) => { r.quiz[k] = Math.max((local.quiz || {})[k] || 0, (remote.quiz || {})[k] || 0); });
    r.ex = maps('ex');
    Object.keys(r.ex).forEach((k) => { if ((local.ex || {})[k] === 'ok' || (remote.ex || {})[k] === 'ok') r.ex[k] = 'ok'; });
    r.feed = maps('feed');
    Object.keys(r.feed).forEach((k) => { r.feed[k] = Math.max((local.feed || {})[k] || 0, (remote.feed || {})[k] || 0); });
    // preferencias de cada dispositivo: se quedan las locales
    ['theme', 'all', 'last'].forEach((k) => { if (k in local) r[k] = local[k]; });
    return r;
  }

  const ref = () => db.collection('progreso').doc(user.uid);
  function push() {
    if (!user || !ready || saving) return;
    saving = true;
    const d = Object.assign({}, Store.d); delete d.theme; delete d.all; delete d.last;
    ref().set({ data: JSON.stringify(d), updatedAt: fb.firestore.FieldValue.serverTimestamp() })
      .catch((e) => console.warn('No se pudo guardar en la nube:', e.code || e))
      .finally(() => { saving = false; });
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(push, 2500); }

  // cada vez que la app guarda en el navegador, también programamos el guardado en la nube
  const localSave = Store.save.bind(Store);
  Store.save = function () { localSave(); schedule(); };
  window.addEventListener('pagehide', push);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') push(); });

  async function pull() {
    try {
      const snap = await ref().get();
      if (snap.exists) {
        const remote = JSON.parse(snap.data().data || '{}');
        Store.d = Object.assign(Store.d, merge(Store.d, remote));
        localSave();
      }
      ready = true;
      push();
      window.dispatchEvent(new HashChangeEvent('hashchange')); // redibuja con el progreso combinado
    } catch (e) {
      console.warn('No se pudo leer el progreso de la nube:', e.code || e);
      ready = true;
    }
  }

  /* ---------- interfaz ---------- */
  function paint() {
    if (!btn) return;
    btn.hidden = false;
    if (user) {
      const name = (user.displayName || user.email || 'Tu cuenta').split(' ')[0];
      btn.textContent = '';
      const s = document.createElement('span'); s.className = 'sync-dot'; s.setAttribute('aria-hidden', 'true');
      btn.appendChild(s); btn.appendChild(document.createTextNode(name));
      btn.title = 'Progreso sincronizado. Tocá para cerrar sesión.';
      btn.classList.add('synced');
    } else {
      btn.innerHTML = 'Entrar<span class="lg"> con Google</span>';
      btn.title = 'Iniciá sesión para tener tu progreso en el celular y en la compu.';
      btn.classList.remove('synced');
    }
  }
  let confirmUntil = 0;
  btn && btn.addEventListener('click', async () => {
    if (user) {
      // sin confirm(): el primer toque pide confirmar, el segundo cierra la sesión
      if (Date.now() < confirmUntil) { push(); await auth.signOut(); return; }
      confirmUntil = Date.now() + 4000;
      btn.textContent = '¿Cerrar sesión? Tocá de nuevo';
      setTimeout(() => { if (Date.now() >= confirmUntil) paint(); }, 4100);
      return;
    }
    const provider = new fb.auth.GoogleAuthProvider();
    try { await auth.signInWithPopup(provider); }
    catch (e) {
      if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) await auth.signInWithRedirect(provider);
      else if (e && e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') console.warn('No se pudo iniciar sesión:', e.code || e);
    }
  });

  auth.onAuthStateChanged((u) => {
    user = u; ready = false; paint();
    if (u) pull();
  });
  paint();
})();
