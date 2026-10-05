/**
 * KAROL GROVE — Premium Redesign VFX and Interactive Script
 * Contains: Canvas Particles, 3D Tilt, Scroll Reveal, WhatsApp Order Builder, and Filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCanvasParticles();
  initScrollReveal();
  initTiltEffect();
  initOrderBuilder();
  initProductFilters();
  initContactForm();
  initHeroVideoLoop();
  initCinematicVideo();
  initSecretAdminTrigger();
});

/* ==========================================================================
   Mobile Nav Menu
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.classList.toggle('open');
      toggleBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !toggleBtn.contains(e.target)) {
        mobileNav.classList.remove('open');
        toggleBtn.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   Canvas Particles VFX
   ========================================================================== */
function initCanvasParticles() {
  let canvas = document.getElementById('vfx-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'vfx-canvas';
    document.body.prepend(canvas);
  }
  canvas.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; pointer-events: none !important; z-index: -9999 !important; opacity: 0.55 !important;';

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: null, y: null, radius: 180 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Load cute cartoon dry fruit images for the drizzle effect
  const imageUrls = [
    'assets/drizzle-almond.png',
    'assets/drizzle-cashew.png',
    'assets/drizzle-raisin.png',
    'assets/drizzle-walnut.png',
    'assets/drizzle-pistachio.png'
  ];

  const loadedImages = [];

  imageUrls.forEach((url, index) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      loadedImages[index] = img;
    };
    img.onerror = () => {
      console.warn('Failed to load drizzle particle image:', url);
    };
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      // Elegant, delicate size range for ambient background drizzle
      this.size = Math.random() * 12 + 16; 
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = Math.random() * 0.6 + 0.35; // Drizzles downward softly
      // 0 = Almond, 1 = Cashew, 2 = Raisin, 3 = Walnut, 4 = Pistachio
      this.type = Math.floor(Math.random() * 5);
      this.alpha = Math.random() * 0.25 + 0.35; // Ambient background translucency
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.01 - 0.005; // Gentle rotate
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.angle += this.spin;

      // Wrap-around edges for drizzle
      if (this.y > height + 40) {
        this.y = -40;
        this.x = Math.random() * width;
        this.speedY = Math.random() * 0.6 + 0.35;
      }
      if (this.x < -40) this.x = width + 40;
      if (this.x > width + 40) this.x = -40;

      // Mouse interactive push
      if (mouse.x != null && mouse.y != null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = dx / (distance || 1);
          let directionY = dy / (distance || 1);
          this.x += directionX * force * 2.5;
          this.y += directionY * force * 2.5;
        }
      }
    }

    draw() {
      // Guarantee particles NEVER disturb or overlay the hero video and headline
      const hero = document.querySelector('.hero-launch-wrapper, .hero-bg-video');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        if (this.y >= rect.top && this.y <= rect.bottom && this.x >= rect.left && this.x <= rect.right) {
          return;
        }
      }

      const img = loadedImages[this.type];
      if (!img || !img.complete || !img.naturalWidth) return;

      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const size = this.size;
      // Draw image centered
      ctx.drawImage(img, -size, -size, size * 2, size * 2);

      ctx.restore();
    }
  }

  function init() {
    particles = [];
    const count = Math.min(26, Math.floor((width * height) / 48000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, no need to track it anymore
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   3D Tilt Effect
   ========================================================================== */
function initTiltEffect() {
  const tilts = document.querySelectorAll('.tilt-card');
  if (tilts.length === 0) return;

  // Skip tilt effect on touch devices for performance and UX
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  tilts.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside element
      const y = e.clientY - rect.top;  // y coordinate inside element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation percentage (-10 to 10 degrees)
      const rotateX = ((centerY - y) / centerY) * 10; 
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });
}

/* ==========================================================================
   WhatsApp Order Builder
   ========================================================================== */
function initOrderBuilder() {
  let cart = JSON.parse(localStorage.getItem('kg_order_cart')) || [];

  // Helper to escape single quotes for onclick HTML handlers
  function escapeQuote(str) {
    return str.replace(/'/g, "\\'");
  }

  // Expose lookup function globally to find the price of an item from priceListData / local storage cache
  window.findPriceInList = function(name, variant) {
    let priceListData = [];
    const cached = localStorage.getItem('kg_prices_local');
    if (cached) {
      try {
        priceListData = JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse cached prices:', e);
      }
    }
    if (!priceListData || priceListData.length === 0) {
      priceListData = window.priceListData || [];
    }

    if (priceListData.length === 0) return null;

    const normName = name.toLowerCase().trim();
    let found = priceListData.find(item => item.name.toLowerCase() === normName);

    if (!found) {
      const aliasKey = normName.replace(/^(premium|organic|raw|pure|dried|dry|fresh)\s+/i, '')
                               .replace(/\s+(premium|organic|raw|pure|dried|dry|fresh)$/i, '');
      const nameAliases = {
        "almonds": "Premium Almonds (Badam)",
        "cashews": "Premium Cashews (Kaju) - W240",
        "pistachios": "Pistachios (Pista) - Roasted & Salted",
        "salted pistachios": "Pistachios (Pista) - Roasted & Salted",
        "walnuts": "Premium Walnuts (Akhrot) - Chile Halves",
        "dates": "Medjool Dates (Premium)",
        "dry date": "Dry Dates (Kharik) - Yellow",
        "black date": "Black Dates (Premium)",
        "raisins": "Golden Raisins (Kishmish)",
        "dried figs": "Dried Figs (Anjeer) - Premium Jumbo",
        "apricots": "Dried Apricots (Jardalu)",
        "honey": "Pure Organic Honey",
        "jaggery": "Organic Jaggery (Powder)",
        "palm sugar": "Palm Sugar",
        "palm candy": "Palm Candy (Panakarkandu)",
        "almond gum": "Almond Gum (Pisin)",
        "brown sugar": "Brown Sugar (Nattu Sakkarai)",
        "deluxe harvest mix": "Premium Festive Gift Hamper",
        "festive dry fruits box": "Dry Fruit & Nuts Gift Box (4-in-1)",
        "seed mixed": "Healthy Seeds & Mix Gift Pack",
        "nuts mixed": "Dry Fruit & Nuts Gift Box (4-in-1)",
        "karol grove deluxe harvest mix": "Premium Festive Gift Hamper",
        "dry cherry": "Dried Cranberries (Whole)",
        "dried kiwi": "Dried Cranberries (Whole)",
        "dried pineapple": "Dried Cranberries (Whole)",
        "dry strawberry": "Dried Cranberries (Whole)",
        "dry amla": "Dried Cranberries (Whole)",
        "honey amla": "Pure Organic Honey",
        "dry mango": "Dried Cranberries (Whole)",
        "dry blueberry": "Dried Blueberries",
        "dry cranberry": "Dried Cranberries (Whole)",
        "sabja seeds": "Basil Seeds (Sabja)",
        "chia seeds": "Chia Seeds (Organic)",
        "pumpkin seeds": "Pumpkin Seeds (Raw)",
        "sunflower seeds": "Sunflower Seeds (Raw)",
        "flax seeds": "Flax Seeds (Organic)",
        "watermelon seeds": "Watermelon Seeds",
      };
      const mappedRealName = nameAliases[normName] || nameAliases[aliasKey];
      if (mappedRealName) {
        found = priceListData.find(item => item.name === mappedRealName);
      }
    }

    if (!found) {
      found = priceListData.find(item => {
        const itemNorm = item.name.toLowerCase();
        return itemNorm.includes(normName) || normName.includes(itemNorm);
      });
    }

    if (!found) {
      const words = normName.split(/\s+/).filter(w => w.length > 2);
      found = priceListData.find(item => {
        const itemNorm = item.name.toLowerCase();
        return words.some(w => itemNorm.includes(w));
      });
    }

    if (!found) return null;

    const variantNorm = variant.toLowerCase().replace(/\s+/g, '');
    if (variantNorm.includes('250g')) {
      return found.price250g || null;
    } else if (variantNorm.includes('500g')) {
      return found.price500g || null;
    } else if (variantNorm.includes('1kg')) {
      return found.price1kg || null;
    } else if (variantNorm.includes('6egg')) {
      return 36;
    } else if (variantNorm.includes('12egg') || variantNorm.includes('1dozen')) {
      return 72;
    } else if (variantNorm.includes('30egg')) {
      return found.price1kg || 180;
    }

    return found.price250g || found.price500g || found.price1kg || null;
  };

  // Helper alias for internal usage
  const findPriceInList = window.findPriceInList;

  // Helper to map product names to actual asset images
  window.getProductImageUrl = function(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('almond') && !n.includes('gum')) return 'assets/product-almonds.png';
    if (n.includes('pepper cashew')) return 'assets/product-pepper-cashews.png';
    if (n.includes('chilli cashew')) return 'assets/product-chilli-cashews.png';
    if (n.includes('cashew') || n.includes('kaju')) return 'assets/product-cashews.png';
    if (n.includes('pista')) return 'assets/product-pistachios.png';
    if (n.includes('walnut') || n.includes('akhrot')) return 'assets/product-walnuts.png';
    if (n.includes('medjool')) return 'assets/product-dates-premium.png';
    if (n.includes('black date')) return 'assets/product-black-dates.png';
    if (n.includes('dry date') || n.includes('kharik')) return 'assets/product-dry-dates.png';
    if (n.includes('date')) return 'assets/product-dates.png';
    if (n.includes('fig') || n.includes('anjeer')) return 'assets/product-figs.png';
    if (n.includes('black raisin')) return 'assets/product-black-raisins.png';
    if (n.includes('raisin') || n.includes('kishmish')) return 'assets/product-raisins.png';
    if (n.includes('apricot') || n.includes('jardalu')) return 'assets/product-apricots.png';
    if (n.includes('cranberry')) return 'assets/product-dry-cranberry.png';
    if (n.includes('blueberry')) return 'assets/product-dry-blueberry.png';
    if (n.includes('cherry')) return 'assets/product-dry-cherry.png';
    if (n.includes('strawberry')) return 'assets/product-dry-strawberry.png';
    if (n.includes('kiwi')) return 'assets/product-dry-kiwi.png';
    if (n.includes('mango')) return 'assets/product-dry-mango.png';
    if (n.includes('pineapple coin')) return 'assets/product-dry-pineapple-coin.png';
    if (n.includes('pineapple')) return 'assets/product-dry-pineapple.png';
    if (n.includes('amla')) return 'assets/product-dry-amla.png';
    if (n.includes('chia')) return 'assets/product-chia-seeds.png';
    if (n.includes('pumpkin')) return 'assets/product-pumpkin-seeds.png';
    if (n.includes('sunflower')) return 'assets/product-sunflower-seeds.png';
    if (n.includes('flax')) return 'assets/product-flax-seeds.png';
    if (n.includes('watermelon')) return 'assets/product-watermelon-seeds.png';
    if (n.includes('cucumber')) return 'assets/product-cucumber-seeds.png';
    if (n.includes('sabja') || n.includes('basil')) return 'assets/product-sabja-seeds.png';
    if (n.includes('honey')) return 'assets/product-honey.png';
    if (n.includes('cardamom') || n.includes('elaichi')) return 'assets/product-cardamom.png';
    if (n.includes('pepper')) return 'assets/product-pepper.png';
    if (n.includes('hamper') || n.includes('gift') || n.includes('box')) return 'assets/product-gift-box.png';
    return 'assets/karol-grove-pouch.png';
  };
  const getProductImageUrl = window.getProductImageUrl;

  // Real-time synchronization across all product cards on the page
  window.syncAllProductCardPrices = function() {
    const cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;

    cards.forEach(card => {
      const titleEl = card.querySelector('h3');
      if (!titleEl) return;
      const productName = titleEl.textContent.trim();
      const select = card.querySelector('.variant-select');
      const imgWrap = card.querySelector('.product-img-wrapper');
      const imgEl = card.querySelector('.product-card-img');
      const descEl = card.querySelector('p');
      const descText = descEl ? descEl.textContent.trim() : '';

      // Initialize card state
      if (!card.dataset.selectedVariant) {
        card.dataset.selectedVariant = select ? select.value : '500g';
      }
      if (!card.dataset.qty) {
        card.dataset.qty = "1";
      }

      // Add Quick View badge and click listener for Mobile Product Sheet (Requirement 5)
      if (imgWrap && !imgWrap.dataset.quickViewBound) {
        imgWrap.dataset.quickViewBound = "true";
        if (!imgWrap.querySelector('.quick-view-badge')) {
          const badge = document.createElement('span');
          badge.className = 'quick-view-badge';
          badge.innerHTML = '🔍 Details';
          imgWrap.appendChild(badge);
        }
        imgWrap.addEventListener('click', () => {
          openProductQuickView(productName, card.dataset.selectedVariant, imgEl ? imgEl.src : getProductImageUrl(productName), descText);
        });
      }
      if (titleEl && !titleEl.dataset.quickViewBound) {
        titleEl.dataset.quickViewBound = "true";
        titleEl.style.cursor = 'pointer';
        titleEl.addEventListener('click', () => {
          openProductQuickView(productName, card.dataset.selectedVariant, imgEl ? imgEl.src : getProductImageUrl(productName), descText);
        });
      }

      // Update option label prices dynamically
      if (select) {
        Array.from(select.options).forEach(opt => {
          const val = opt.value;
          const price = window.findPriceInList(productName, val);
          if (price) {
            const cleanVal = val.replace(/gm$/i, 'g');
            opt.textContent = `${cleanVal} — ₹${price}`;
          }
        });
      }

      // Insert or update live price badge
      let priceTag = card.querySelector('.card-live-price-tag');
      if (!priceTag) {
        priceTag = document.createElement('div');
        priceTag.className = 'card-live-price-tag';
        const body = card.querySelector('.product-card-body');
        const selector = card.querySelector('.product-selector');
        if (body && selector) {
          body.insertBefore(priceTag, selector);
        }
      }

      // Render or bind interactive pack size selector pills [250g] [500g] [1kg] (Requirement 1)
      let pillsWrap = card.querySelector('.pack-size-pills');
      if (!pillsWrap) {
        const packWrapper = document.createElement('div');
        packWrapper.className = 'card-pack-wrapper';
        packWrapper.innerHTML = `
          <span class="card-pack-label">Pack Size:</span>
          <div class="pack-size-pills">
            <button type="button" class="pack-pill" data-variant="250g">250g</button>
            <button type="button" class="pack-pill active" data-variant="500g">500g</button>
            <button type="button" class="pack-pill" data-variant="1kg">1kg</button>
          </div>
        `;
        const selector = card.querySelector('.product-selector');
        if (selector) {
          selector.insertBefore(packWrapper, selector.firstChild);
        }
        pillsWrap = packWrapper.querySelector('.pack-size-pills');
      }

      // Bind pack size pills
      if (pillsWrap && !pillsWrap.dataset.pillsBound) {
        pillsWrap.dataset.pillsBound = "true";
        const pills = pillsWrap.querySelectorAll('.pack-pill');
        pills.forEach(pill => {
          pill.addEventListener('click', (e) => {
            e.preventDefault();
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const chosenVariant = pill.getAttribute('data-variant');
            card.dataset.selectedVariant = chosenVariant;

            // Sync with hidden/desktop select
            if (select) {
              const matchedOpt = Array.from(select.options).find(o => 
                o.value.toLowerCase().replace(/gm$/i, 'g') === chosenVariant.toLowerCase()
              );
              if (matchedOpt) {
                select.value = matchedOpt.value;
              }
            }
            updatePriceDisplay();
          });
        });
      }

      // Bind or construct Stepper + Add to Cart Row (Requirement 1)
      let actionBar = card.querySelector('.card-action-bar');
      if (!actionBar) {
        const addBtn = card.querySelector('.add-to-order-btn');
        if (addBtn) {
          actionBar = document.createElement('div');
          actionBar.className = 'card-action-bar';
          addBtn.parentNode.insertBefore(actionBar, addBtn);
          
          const stepper = document.createElement('div');
          stepper.className = 'card-qty-stepper';
          stepper.innerHTML = `
            <button type="button" class="card-qty-btn minus" aria-label="Decrease quantity">−</button>
            <span class="card-qty-val">1</span>
            <button type="button" class="card-qty-btn plus" aria-label="Increase quantity">+</button>
          `;
          actionBar.appendChild(stepper);
          actionBar.appendChild(addBtn);

          // Stepper button events
          const qtyValEl = stepper.querySelector('.card-qty-val');
          stepper.querySelector('.minus').addEventListener('click', (e) => {
            e.preventDefault();
            let q = parseInt(card.dataset.qty || '1', 10);
            if (q > 1) {
              q--;
              card.dataset.qty = q.toString();
              qtyValEl.textContent = q;
            }
          });
          stepper.querySelector('.plus').addEventListener('click', (e) => {
            e.preventDefault();
            let q = parseInt(card.dataset.qty || '1', 10);
            q++;
            card.dataset.qty = q.toString();
            qtyValEl.textContent = q;
          });
        }
      }

      const updatePriceDisplay = () => {
        const currentVariant = card.dataset.selectedVariant || (select ? select.value : '500g');
        const currentPrice = window.findPriceInList(productName, currentVariant);
        if (currentPrice) {
          const cleanVar = currentVariant.replace(/gm$/i, 'g');
          priceTag.innerHTML = `<span class="price-curr">₹</span><span class="price-val">${currentPrice}</span><span class="price-unit">/${cleanVar}</span>`;
          priceTag.style.display = 'inline-flex';
        } else {
          priceTag.style.display = 'none';
        }
      };

      updatePriceDisplay();

      if (select && !select.dataset.priceBound) {
        select.dataset.priceBound = "true";
        select.addEventListener('change', () => {
          card.dataset.selectedVariant = select.value.replace(/gm$/i, 'g');
          // Sync pills
          if (pillsWrap) {
            pillsWrap.querySelectorAll('.pack-pill').forEach(p => {
              if (p.getAttribute('data-variant') === card.dataset.selectedVariant) {
                p.classList.add('active');
              } else {
                p.classList.remove('active');
              }
            });
          }
          updatePriceDisplay();
        });
      }
    });
  };

  // Dynamic loader for prices.js — ensures fresh Git-synced prices bypass any browser/CDN cache
  function checkAndLoadPrices(callback) {
    const cached = localStorage.getItem('kg_prices_local');
    if (cached) {
      if (callback) callback();
      return;
    }

    let initialRendered = false;
    if (window.priceListData && callback) {
      callback();
      initialRendered = true;
    }

    const script = document.createElement('script');
    script.src = `assets/prices.js?t=${Date.now()}`;
    script.onload = () => {
      window.syncAllProductCardPrices();
      if (typeof renderCartItems === 'function') renderCartItems();
      if (!initialRendered && callback) callback();
    };
    script.onerror = () => {
      console.warn('Network issue fetching live prices.js, using static fallback.');
      if (!initialRendered && callback) callback();
    };
    document.head.appendChild(script);
  }

  // Initialize once prices are loaded
  checkAndLoadPrices(() => {
    createCartUI();
    updateCartCounters();
    window.syncAllProductCardPrices();
  });

  // Listen to cross-tab price updates (from Admin portal or Price List editor)
  window.addEventListener('storage', (e) => {
    if (e.key === 'kg_prices_local') {
      window.syncAllProductCardPrices();
      renderCartItems();
    }
  });

  // Listen to in-tab price updates
  window.addEventListener('kg_prices_changed', () => {
    window.syncAllProductCardPrices();
    renderCartItems();
  });

  // Connect header cart buttons and triggers
  document.querySelectorAll('.header-cart-btn, [data-toggle-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCartDrawer(true);
    });
  });

  // Attach event listeners to all Add to Order buttons
  const attachAddButtons = () => {
    const addButtons = document.querySelectorAll('.add-to-order-btn');
    addButtons.forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "true";
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = btn.closest('.product-card');
        if (!productCard) return;

        const productName = productCard.querySelector('h3').textContent.trim();
        const selectedVariant = productCard.dataset.selectedVariant || '500g';
        const qty = parseInt(productCard.dataset.qty || '1', 10);

        addToCart(productName, selectedVariant, qty);
        
        // Reset card stepper to 1
        productCard.dataset.qty = "1";
        const qtyValEl = productCard.querySelector('.card-qty-val');
        if (qtyValEl) qtyValEl.textContent = '1';

        // Visual feedback on button
        const originalText = btn.innerHTML;
        btn.innerHTML = `✨ Added (${qty})!`;
        btn.style.background = 'linear-gradient(135deg, #d8932a 0%, #b07314 100%)';
        btn.style.color = '#123020';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 1200);
      });
    });
  };
  attachAddButtons();
  window.attachAddButtons = attachAddButtons;

  // Initialize Corporate Quote Forms
  const initCorporateForms = () => {
    const forms = document.querySelectorAll('#corporateQuoteForm, .corp-quick-form');
    forms.forEach(form => {
      if (form.dataset.bound) return;
      form.dataset.bound = "true";
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const companyInput = form.querySelector('[name="company"]') || form.querySelector('#corpCompany');
        const nameInput = form.querySelector('[name="name"]') || form.querySelector('#corpName');
        const mobileInput = form.querySelector('[name="mobile"]') || form.querySelector('#corpMobile');
        const emailInput = form.querySelector('[name="email"]') || form.querySelector('#corpEmail');
        const qtyInput = form.querySelector('[name="quantity"]') || form.querySelector('#corpQty');
        const budgetInput = form.querySelector('[name="budget"]') || form.querySelector('#corpBudget');
        const notesInput = form.querySelector('[name="notes"]') || form.querySelector('#corpNotes');

        const company = companyInput ? companyInput.value.trim() : '';
        const contactName = nameInput ? nameInput.value.trim() : '';
        const mobile = mobileInput ? mobileInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const qty = qtyInput ? qtyInput.value.trim() : '';
        const budget = budgetInput ? budgetInput.value.trim() : '';
        const notes = notesInput ? notesInput.value.trim() : '';

        let msg = `Hello Karol Grove! I would like to request a quotation for Corporate Gifting:\n\n`;
        if (company) msg += `🏢 *Company / Organization:* ${company}\n`;
        if (contactName) msg += `👤 *Contact Person:* ${contactName}\n`;
        if (mobile) msg += `📱 *Mobile / WhatsApp:* ${mobile}\n`;
        if (email) msg += `📧 *Send Quotation to Gmail/Email:* ${email}\n`;
        if (budget) msg += `💰 *Selected Target Budget:* ${budget}\n`;
        if (qty) msg += `📦 *Estimated Quantity:* ${qty}\n`;
        if (notes) msg += `📝 *Notes/Requirements:* ${notes}\n`;
        msg += `\nPlease email the customized quotation and corporate catalog to ${email}. Our team will wait for your contact. Thank you!`;

        const waUrl = `https://wa.me/+918494832492?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
        
        alert(`✅ Thank you! Your quotation request for "${company || contactName}" has been received. We will send the customized quotation and catalog to your Gmail ID (${email || 'your email'}) and contact you shortly.`);
        form.reset();
      });
    });
  };
  initCorporateForms();

  // Export functions globally to allow HTML inline handlers
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.toggleCartDrawer = toggleCartDrawer;
  window.sendWhatsAppOrder = sendWhatsAppOrder;
  window.clearCart = clearCart;
  window.openProductQuickView = openProductQuickView;
  window.toggleMobileMenu = toggleMobileMenu;

  function addToCart(name, variant, qty) {
    const existing = cart.find(item => item.name === name && item.variant === variant);
    if (existing) {
      existing.quantity += qty;
      if (existing.quantity <= 0) {
        removeFromCart(name, variant);
        return;
      }
    } else {
      cart.push({ name, variant, quantity: qty });
    }
    saveCart();
  }

  function removeFromCart(name, variant) {
    cart = cart.filter(item => !(item.name === name && item.variant === variant));
    saveCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  function saveCart() {
    localStorage.setItem('kg_order_cart', JSON.stringify(cart));
    updateCartCounters();
    renderCartItems();
  }

  function updateCartCounters() {
    const badges = document.querySelectorAll('.cart-badge');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    badges.forEach(badge => {
      badge.textContent = totalCount;
      if (totalCount > 0) {
        badge.classList.add('visible');
      } else {
        badge.classList.remove('visible');
      }
    });

    // Mobile Bottom Navigation cart badge
    const bottomNavBadge = document.querySelector('.mobile-nav-cart-badge');
    if (bottomNavBadge) {
      bottomNavBadge.textContent = totalCount;
      if (totalCount > 0) {
        bottomNavBadge.classList.add('visible');
      } else {
        bottomNavBadge.classList.remove('visible');
      }
    }

    const floatingBtn = document.getElementById('floating-cart-trigger');
    if (floatingBtn) {
      if (totalCount > 0) {
        floatingBtn.classList.add('visible');
      } else {
        floatingBtn.classList.remove('visible');
      }
    }
  }

  /* --------------------------------------------------------------------------
     Mobile Sticky Bottom Navigation (Requirement 3)
     -------------------------------------------------------------------------- */
  function initMobileBottomNav() {
    if (document.getElementById('mobile-bottom-nav')) return;

    const nav = document.createElement('nav');
    nav.id = 'mobile-bottom-nav';
    nav.className = 'mobile-bottom-nav';

    const currentPath = window.location.pathname.toLowerCase();
    const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
    const isProducts = currentPath.includes('product');
    const isPrice = currentPath.includes('price');

    nav.innerHTML = `
      <a href="index.html" class="mobile-nav-item ${isHome ? 'active' : ''}">
        <span class="nav-icon">🏠</span>
        <span>Home</span>
      </a>
      <a href="products.html" class="mobile-nav-item ${isProducts ? 'active' : ''}">
        <span class="nav-icon">🛍️</span>
        <span>Shop</span>
      </a>
      <button type="button" class="mobile-nav-item" onclick="toggleCartDrawer(true)" aria-label="Open Shopping Cart">
        <span class="nav-icon">🛒</span>
        <span>Cart</span>
        <span class="mobile-nav-cart-badge cart-badge">0</span>
      </button>
      <a href="pricelist.html" class="mobile-nav-item ${isPrice ? 'active' : ''}">
        <span class="nav-icon">📜</span>
        <span>Prices</span>
      </a>
      <button type="button" class="mobile-nav-item" onclick="toggleMobileMenu(true)" aria-label="Open Navigation Menu">
        <span class="nav-icon">☰</span>
        <span>Menu</span>
      </button>
    `;
    document.body.appendChild(nav);
  }

  /* --------------------------------------------------------------------------
     Mobile Menu Drawer
     -------------------------------------------------------------------------- */
  function initMobileMenuDrawer() {
    if (document.getElementById('mobile-menu-drawer-backdrop')) return;

    const drawer = document.createElement('div');
    drawer.id = 'mobile-menu-drawer-backdrop';
    drawer.className = 'mobile-menu-drawer-backdrop';
    drawer.innerHTML = `
      <div class="mobile-menu-sheet">
        <div class="mobile-menu-header">
          <h4>Karol Grove Navigation</h4>
          <button type="button" class="sheet-close-btn" onclick="toggleMobileMenu(false)">&times;</button>
        </div>
        <div class="mobile-menu-links">
          <a href="index.html">🏠 Home</a>
          <a href="products.html">🛍️ Full Product Catalog</a>
          <a href="index.html#launch-offers">🔥 Launch Offers (Up to 40% OFF)</a>
          <a href="corporate-gifts.html">🎁 Corporate Gifting & Hampers</a>
          <a href="pricelist.html">📜 Live Price List</a>
          <a href="about.html">🌿 About Karol Grove</a>
          <a href="contact.html">📞 Contact & Store Information</a>
          <a href="https://wa.me/+918494832492" target="_blank" rel="noopener" style="background: rgba(37, 211, 102, 0.2); color: #70E39F;">💬 Chat on WhatsApp</a>
          <a href="admin.html" style="background: rgba(216, 147, 42, 0.2); color: var(--gold);">🔒 Admin Portal</a>
        </div>
      </div>
    `;
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) toggleMobileMenu(false);
    });
    document.body.appendChild(drawer);
  }

  function toggleMobileMenu(open) {
    const drawer = document.getElementById('mobile-menu-drawer-backdrop');
    if (drawer) {
      if (open) {
        drawer.classList.add('open');
      } else {
        drawer.classList.remove('open');
      }
    }
  }

  /* --------------------------------------------------------------------------
     Mobile Product Detail Sheet / Modal (Requirement 5)
     -------------------------------------------------------------------------- */
  function initMobileProductModal() {
    if (document.getElementById('mobile-product-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'mobile-product-modal';
    modal.className = 'mobile-product-modal-backdrop';
    modal.innerHTML = `
      <div class="mobile-product-sheet">
        <div class="sheet-drag-handle"></div>
        <button type="button" class="sheet-close-btn" onclick="closeProductQuickView()">&times;</button>

        <div class="modal-product-img-wrap">
          <img id="modal-p-img" src="assets/product-almonds.png" alt="Product Image">
        </div>

        <div class="modal-product-rating">
          <span>★★★★★</span> 4.9 <span class="review-count">(120+ verified reviews)</span>
        </div>

        <h3 class="modal-product-title" id="modal-p-title">Product Name</h3>
        <p class="modal-product-desc" id="modal-p-desc">Rich harvest with natural buttery flavor and wholesome nutrients.</p>

        <!-- Pack Size Selector -->
        <div class="modal-pack-section">
          <span class="modal-pack-label">SELECT PACK SIZE:</span>
          <div class="modal-pack-pills" id="modal-pack-pills-row">
            <button type="button" class="modal-pack-pill" data-variant="250g">250g</button>
            <button type="button" class="modal-pack-pill active" data-variant="500g">500g</button>
            <button type="button" class="modal-pack-pill" data-variant="1kg">1kg</button>
          </div>
        </div>

        <!-- Price & Quantity Row -->
        <div class="modal-price-qty-row">
          <div>
            <span style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; display: block;">Price</span>
            <div class="modal-price-display">
              <span class="curr">₹</span>
              <span class="amt" id="modal-p-price">0</span>
            </div>
          </div>
          <div class="card-qty-stepper" style="height: 42px;">
            <button type="button" class="card-qty-btn" id="modal-qty-minus">−</button>
            <span class="card-qty-val" id="modal-qty-val">1</span>
            <button type="button" class="card-qty-btn" id="modal-qty-plus">+</button>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="modal-cta-row">
          <button type="button" class="modal-add-cart-btn" id="modal-btn-add-cart">
            🛒 Add to Cart
          </button>
          <button type="button" class="modal-buy-now-btn" id="modal-btn-buy-now">
            ⚡ Buy Now (WhatsApp)
          </button>
        </div>

        <!-- Accordions -->
        <div class="modal-accordions">
          <div class="modal-acc-item open">
            <button type="button" class="modal-acc-header">
              <span>🌿 About the Product</span>
              <span class="acc-icon">▼</span>
            </button>
            <div class="modal-acc-body" id="modal-acc-about">
              Karol Grove premium harvests are handpicked from verified sustainable orchards. Each batch undergoes rigorous cleaning, optical sorting, and nitrogen/vacuum sealing to guarantee pure crunch and farm freshness.
            </div>
          </div>

          <div class="modal-acc-item">
            <button type="button" class="modal-acc-header">
              <span>📋 Ingredients &amp; Nutrition</span>
              <span class="acc-icon">▼</span>
            </button>
            <div class="modal-acc-body">
              <strong>Ingredients:</strong> 100% Pure, Natural Grade-A Dry Fruit/Nut.<br>
              <strong>Nutritional Value:</strong> Rich in dietary fiber, natural plant proteins, healthy monounsaturated fats, and vital minerals. 0g Trans Fats, No added sugars or chemical preservatives.
            </div>
          </div>

          <div class="modal-acc-item">
            <button type="button" class="modal-acc-header">
              <span>❄️ Storage Information</span>
              <span class="acc-icon">▼</span>
            </button>
            <div class="modal-acc-body">
              Store in a cool, dry place away from direct sunlight. Once opened, transfer contents into an airtight glass or food-grade tin container. Refrigeration is recommended during warm summer months to retain freshness for up to 9 months.
            </div>
          </div>

          <div class="modal-acc-item">
            <button type="button" class="modal-acc-header">
              <span>🚚 Delivery Information</span>
              <span class="acc-icon">▼</span>
            </button>
            <div class="modal-acc-body">
              Dispatched with vacuum-sealed tamper-proof packaging. Express Pan-India delivery within 2–4 business days. Free home delivery on orders above ₹999.
            </div>
          </div>
        </div>

      </div>
    `;

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProductQuickView();
    });

    // Accordion toggle handlers
    modal.querySelectorAll('.modal-acc-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const item = hdr.closest('.modal-acc-item');
        item.classList.toggle('open');
      });
    });

    document.body.appendChild(modal);
  }

  let activeModalProduct = { name: '', variant: '500g', qty: 1 };

  function openProductQuickView(productName, variant, imgSrc, desc) {
    initMobileProductModal();
    const modal = document.getElementById('mobile-product-modal');
    if (!modal) return;

    activeModalProduct.name = productName;
    activeModalProduct.variant = variant || '500g';
    activeModalProduct.qty = 1;

    document.getElementById('modal-p-title').textContent = productName;
    document.getElementById('modal-p-desc').textContent = desc || 'Pure, handpicked harvest vacuum sealed for maximum freshness and crunch.';
    document.getElementById('modal-p-img').src = imgSrc || getProductImageUrl(productName);
    document.getElementById('modal-qty-val').textContent = '1';

    // Update pack size pills
    const pills = modal.querySelectorAll('.modal-pack-pill');
    pills.forEach(pill => {
      const v = pill.getAttribute('data-variant');
      if (v === activeModalProduct.variant) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
      pill.onclick = () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeModalProduct.variant = v;
        updateModalPrice();
      };
    });

    const updateModalPrice = () => {
      const p = window.findPriceInList(activeModalProduct.name, activeModalProduct.variant);
      document.getElementById('modal-p-price').textContent = p ? p : 'Price on request';
    };
    updateModalPrice();

    // Steppers
    document.getElementById('modal-qty-minus').onclick = () => {
      if (activeModalProduct.qty > 1) {
        activeModalProduct.qty--;
        document.getElementById('modal-qty-val').textContent = activeModalProduct.qty;
      }
    };
    document.getElementById('modal-qty-plus').onclick = () => {
      activeModalProduct.qty++;
      document.getElementById('modal-qty-val').textContent = activeModalProduct.qty;
    };

    // Add to Cart
    document.getElementById('modal-btn-add-cart').onclick = () => {
      addToCart(activeModalProduct.name, activeModalProduct.variant, activeModalProduct.qty);
      const btn = document.getElementById('modal-btn-add-cart');
      const orig = btn.innerHTML;
      btn.innerHTML = '✨ Added!';
      setTimeout(() => {
        btn.innerHTML = orig;
        closeProductQuickView();
        toggleCartDrawer(true);
      }, 500);
    };

    // Buy Now
    document.getElementById('modal-btn-buy-now').onclick = () => {
      const p = window.findPriceInList(activeModalProduct.name, activeModalProduct.variant);
      const sub = p ? p * activeModalProduct.qty : '';
      let text = `Hello Karol Grove! I would like to instantly order:\n\n*${activeModalProduct.name}* (${activeModalProduct.variant})\nQuantity: ${activeModalProduct.qty}`;
      if (sub) text += ` @ ₹${p} = *₹${sub}*`;
      text += `\n\nPlease confirm availability and payment options. Thank you!`;
      const url = `https://wa.me/+918494832492?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      closeProductQuickView();
    };

    modal.classList.add('open');
  }

  function closeProductQuickView() {
    const modal = document.getElementById('mobile-product-modal');
    if (modal) modal.classList.remove('open');
  }

  /* --------------------------------------------------------------------------
     Clean Order Summary Modal before WhatsApp (Requirement 11)
     -------------------------------------------------------------------------- */
  function initOrderSummaryModal() {
    if (document.getElementById('order-summary-modal-backdrop')) return;

    const modal = document.createElement('div');
    modal.id = 'order-summary-modal-backdrop';
    modal.style.cssText = `
      display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      z-index: 10002; align-items: center; justify-content: center; padding: 20px;
    `;
    modal.innerHTML = `
      <div style="background: #FFFFFF; border-radius: 20px; max-width: 440px; width: 100%; padding: 24px; box-shadow: 0 15px 40px rgba(0,0,0,0.4); max-height: 85vh; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-light); padding-bottom: 12px;">
          <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--forest-deep); margin: 0;">Order Summary</h3>
          <button type="button" class="sheet-close-btn" style="position: static;" onclick="document.getElementById('order-summary-modal-backdrop').style.display='none'">&times;</button>
        </div>
        <p style="font-size: 13px; color: var(--text-secondary); margin: 0 0 14px;">Review your selected items before proceeding to WhatsApp for instant confirmation:</p>
        <div id="summary-items-list" style="overflow-y: auto; flex: 1; margin-bottom: 16px; border: 1px solid var(--border-light); border-radius: 10px; padding: 12px; background: #FAF8F5;">
          <!-- Populated dynamically -->
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding: 10px 14px; background: rgba(34, 107, 66, 0.08); border-radius: 10px;">
          <strong style="color: var(--forest-deep); font-size: 15px;">Total Order Value:</strong>
          <strong id="summary-total-price" style="color: var(--gold-deep); font-size: 20px;">₹0</strong>
        </div>
        <button type="button" id="confirm-open-whatsapp-btn" style="background: #25D366; color: #FFFFFF; border: none; border-radius: 12px; padding: 14px; font-weight: 800; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); margin-bottom: 8px;">
          <span>💬 Confirm &amp; Open WhatsApp</span> &rarr;
        </button>
        <button type="button" onclick="document.getElementById('order-summary-modal-backdrop').style.display='none'" style="background: transparent; border: none; color: var(--text-muted); font-size: 13px; font-weight: 600; cursor: pointer; padding: 8px;">
          Edit Items in Cart
        </button>
      </div>
    `;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
    document.body.appendChild(modal);
  }

}

/* ==========================================================================
   Cinematic Brand Video Section Controls (Requirement 9)
   ========================================================================== */
function initCinematicVideo() {
  const video = document.getElementById('brand-cinematic-video');
  const playBtn = document.getElementById('cinematic-play-btn');
  if (!video || !playBtn) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');

  const togglePlay = () => {
    if (video.paused) {
      video.play().then(() => {
        playBtn.classList.add('playing');
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    } else {
      video.pause();
      playBtn.classList.remove('playing');
    }
  };

  playBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  video.addEventListener('ended', () => {
    playBtn.classList.remove('playing');
  });
}

/* ==========================================================================
   Product Filters and Search (Products Page)
   ========================================================================== */
function initProductFilters() {
  const searchInput = document.getElementById('product-search');
  const catTabs = document.querySelectorAll('.cat-tab');
  const productCards = document.querySelectorAll('.product-grid .product-card');

  if (productCards.length === 0) return;

  let activeCategory = 'all';
  let searchTerm = '';

  // Setup tab listeners
  catTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activeCategory = tab.getAttribute('data-category');
      applyFilters();
    });
  });

  // Setup explore banner buttons
  const bannerBtns = document.querySelectorAll('.banner-btn');
  bannerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCategory = btn.getAttribute('data-category');
      
      // Find the corresponding category tab and click it
      const targetTab = document.querySelector(`.cat-tab[data-category="${targetCategory}"]`);
      if (targetTab) {
        targetTab.click();
      }
      
      // Smooth scroll to the products section
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Setup search listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  function applyFilters() {
    productCards.forEach(card => {
      const parentCategory = card.closest('.product-category');
      if (!parentCategory) return;

      const categoryId = parentCategory.id;
      const productName = card.querySelector('h3').textContent.toLowerCase();
      const productBenefits = card.querySelector('p').textContent.toLowerCase();

      // Check category match
      const categoryMatch = (activeCategory === 'all' || categoryId === activeCategory);
      // Check search match
      const searchMatch = (productName.includes(searchTerm) || productBenefits.includes(searchTerm));

      if (categoryMatch && searchMatch) {
        card.style.display = '';
        card.classList.add('reveal-item');
      } else {
        card.style.display = 'none';
        card.classList.remove('reveal-item');
      }
    });

    // Hide empty category sections
    const categories = document.querySelectorAll('.product-category');
    categories.forEach(cat => {
      const visibleCards = cat.querySelectorAll('.product-grid .product-card[style=""]');
      const allCardsCount = cat.querySelectorAll('.product-grid .product-card').length;
      const hiddenCardsCount = cat.querySelectorAll('.product-grid .product-card[style*="display: none"]').length;

      if (allCardsCount === hiddenCardsCount) {
        cat.style.display = 'none';
      } else {
        cat.style.display = '';
      }
    });
  }
}

/* ==========================================================================
   Contact Form Custom Logic
   ========================================================================== */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea');
  
  // Custom Floating Label animation handler (adds class on focus/has value)
  inputs.forEach(input => {
    // Add logic if label wrapping or styling is needed
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      if (input.value.trim() !== '') {
        input.parentElement.classList.add('has-value');
      } else {
        input.parentElement.classList.remove('has-value');
      }
    });
    // Check initially
    if (input.value.trim() !== '') {
      input.parentElement.classList.add('has-value');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message &rarr;';
    
    // Show sending/loading state
    if (submitBtn) {
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;
    }
    
    const formData = new FormData(form);
    
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        // Create custom success feedback VFX
        const formCard = form.closest('.contact-form-card');
        if (formCard) {
          formCard.innerHTML = `
            <div class="form-success-animation text-center" style="padding: 40px 10px;">
              <div class="success-icon-wrap" style="width: 80px; height: 80px; background: rgba(31, 92, 61, 0.15); color: var(--forest-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 40px; animation: scaleUpPulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;">
                ✓
              </div>
              <h3 style="font-family: var(--font-display); font-size: 26px; color: var(--forest-deep); margin-bottom: 12px;">Message Received!</h3>
              <p style="color: var(--charcoal-soft); font-size: 16px; max-width: 320px; margin: 0 auto 28px;">
                Thank you for reaching out to Karol Grove. We have received your inquiry and our team will get back to you shortly.
              </p>
              <button class="btn btn-primary" onclick="window.location.reload();">Send Another Message</button>
            </div>
          `;
        }
      } else {
        console.error(json);
        alert(json.message || 'Something went wrong. Please try again.');
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      }
    })
    .catch((error) => {
      console.error(error);
      alert('Form submission failed. Please check your internet connection and try again.');
      if (submitBtn) {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  });
}

/* ==========================================================================
   Seamless Hero Video Loop & Auto-Play Guarantee
   ========================================================================== */
function initHeroVideoLoop() {
  const heroVideo = document.querySelector('.hero-bg-video');
  if (!heroVideo) return;

  // Guarantee browser autoplay compatibility
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.playsInline = true;
  heroVideo.setAttribute('playsinline', '');
  heroVideo.setAttribute('muted', '');

  const startPlayback = () => {
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.warn('Autoplay waiting for user gesture:', e);
        const resumeOnTouchOrScroll = () => {
          heroVideo.play().catch(() => {});
          window.removeEventListener('click', resumeOnTouchOrScroll);
          window.removeEventListener('scroll', resumeOnTouchOrScroll);
          window.removeEventListener('touchstart', resumeOnTouchOrScroll);
        };
        window.addEventListener('click', resumeOnTouchOrScroll, { passive: true });
        window.addEventListener('scroll', resumeOnTouchOrScroll, { passive: true });
        window.addEventListener('touchstart', resumeOnTouchOrScroll, { passive: true });
      });
    }
  };

  startPlayback();

  // Ensure seamless looping without pause or frozen trailing frames.
  heroVideo.addEventListener('timeupdate', () => {
    if (heroVideo.currentTime >= 9.92 || (heroVideo.duration && heroVideo.currentTime >= heroVideo.duration - 0.15)) {
      heroVideo.currentTime = 0;
      heroVideo.play().catch(() => {});
    }
  });
}

/* ==========================================================================
   Method 3: Secret Triple-Click Admin Trigger
   ========================================================================== */
function initSecretAdminTrigger() {
  let clickCount = 0;
  let clickResetTimer = null;

  function handleSecretClick(e) {
    clickCount++;
    clearTimeout(clickResetTimer);

    if (clickCount >= 3) {
      clickCount = 0;
      if (typeof window.openAdminLogin === 'function') {
        window.openAdminLogin();
      } else {
        window.location.href = 'pricelist.html?admin';
      }
    } else {
      clickResetTimer = setTimeout(() => {
        clickCount = 0;
      }, 1500);
    }
  }

  // Bind to footer bottom bar & copyright text
  const copyrightElements = document.querySelectorAll(
    '.footer-v2-bottom, .footer-v2-bottom div, .footer-bottom, .footer-copyright, .site-footer-v2 .footer-v2-bottom div'
  );

  copyrightElements.forEach((el) => {
    el.addEventListener('click', handleSecretClick);
    el.style.userSelect = 'none';
  });
}

