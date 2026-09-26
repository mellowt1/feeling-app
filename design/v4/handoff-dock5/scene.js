<script>
(() => {
  // Florida dock, new look (Feeling 67): fit the 390-wide scene to the screen, like By the fire.
  const sc = document.getElementById('dk-scene');
  if (!sc) return;
  const fit = () => sc.style.setProperty('--dk-k', ((sc.parentElement.clientWidth || window.innerWidth) / 390).toFixed(4));
  window.addEventListener('resize', fit); document.addEventListener('placechange', fit); fit();
})();
</script>
