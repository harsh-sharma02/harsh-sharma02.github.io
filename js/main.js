document.getElementById('year').textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fineCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var cursor = document.getElementById('cursor');
  var gridLayer = document.querySelector('.hero-grid-layer');
  var sbCoord = document.getElementById('sb-coord');
  var heroEl = document.querySelector('.hero');
  var rafId = null, mouseX = 0, mouseY = 0;

  function onMove(e){
    mouseX = e.clientX; mouseY = e.clientY;
    if(!rafId){ rafId = requestAnimationFrame(applyMove); }
  }
  function applyMove(){
    rafId = null;
    if(fineCursor && cursor){
      cursor.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
    }
    if(sbCoord){
      var mx = (mouseX / window.innerWidth * 420 - 60).toFixed(2);
      var my = (( 1 - mouseY / window.innerHeight) * 300 - 20).toFixed(2);
      sbCoord.textContent = 'X ' + mx + '  Y ' + my;
    }
    if(gridLayer && !reduceMotion && heroEl){
      var r = heroEl.getBoundingClientRect();
      if(mouseY > r.top && mouseY < r.bottom){
        var px = (mouseX / window.innerWidth - 0.5) * 20;
        var py = (mouseY / window.innerHeight - 0.5) * 20;
        gridLayer.style.transform = 'translate(' + px + 'px,' + py + 'px)';
      }
    }
  }
  window.addEventListener('mousemove', onMove, { passive: true });

  var rulerFill = document.getElementById('ruler-fill');
  var sbScroll = document.getElementById('sb-scroll');
  function onScroll(){
    var h = document.documentElement;
    var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    pct = Math.max(0, Math.min(100, pct));
    if(rulerFill) rulerFill.style.width = pct + '%';
    if(sbScroll) sbScroll.textContent = Math.round(pct) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  var sbSection = document.getElementById('sb-section');
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('[data-section]');
  var sectionObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var name = entry.target.getAttribute('data-section');
        if(sbSection) sbSection.textContent = name.toUpperCase();
        var id = entry.target.id;
        navLinks.forEach(function(a){
          a.classList.toggle('active', a.getAttribute('data-nav') === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(function(s){ sectionObserver.observe(s); });

  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  var circuitPaths = document.querySelectorAll('.circuit-path');
  var circuitObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        circuitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  circuitPaths.forEach(function(p){ circuitObserver.observe(p); });

  var meters = document.querySelectorAll('.meter-fill');
  var meterObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var lvl = entry.target.getAttribute('data-level') || 0;
        entry.target.style.width = lvl + '%';
        meterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  meters.forEach(function(m){ meterObserver.observe(m); });

  var tLine = document.querySelector('.timeline-line');
  if(tLine){
    var tLineObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          tLineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    tLineObserver.observe(tLine);
  }

  if(fineCursor && !reduceMotion){
    document.querySelectorAll('.sheet').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateX(' + (py * -6) + 'deg) rotateY(' + (px * 6) + 'deg) translateY(-2px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = 'rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  var timeEl = document.getElementById('local-time');
  function tick(){
    if(!timeEl) return;
    var d = new Date();
    var hh = String(d.getHours()).padStart(2,'0');
    var mm = String(d.getMinutes()).padStart(2,'0');
    var ss = String(d.getSeconds()).padStart(2,'0');
    timeEl.textContent = hh + ':' + mm + ':' + ss;
  }
  tick();
  setInterval(tick, 1000);
