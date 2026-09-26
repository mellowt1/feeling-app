<script>
(() => {
  // By the fire (Feeling 66): fit the 390-wide room to the screen, and now and then a soft lightning flash in the window.
  // No thunder: calm first. Nothing runs while another place is open or the app is hidden.
  const root = document.documentElement, sc = document.getElementById('hh-scene');
  if (!sc) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fit = () => sc.style.setProperty('--hh-k', ((sc.parentElement.clientWidth || window.innerWidth) / 390).toFixed(4));
  window.addEventListener('resize', fit); fit();
  document.addEventListener('placechange', fit);
  const pane = sc.querySelector('.hh-flash'), room = sc.querySelector('.hh-roomflash');
  const on = () => root.getAttribute('data-place') === 'hearth' && !document.hidden && !reduce && !document.body.classList.contains('dock');
  function flash() {
    if (on()) {
      const beats = [[0, .75, .07], [110, 0, 0], [230, .45, .04], [340, 0, 0]];
      for (const [t, a, b] of beats) setTimeout(() => { pane.style.opacity = a; room.style.opacity = b; }, t);
    }
    setTimeout(flash, 14000 + Math.random() * 16000);
  }
  setTimeout(flash, 6000 + Math.random() * 6000);
})();
</script>
