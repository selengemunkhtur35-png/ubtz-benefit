(function promoRuntimeBootstrap() {
  const CUSTOM_PROMO_PATH = 'assets/custom-promos.json';
  const SAFE_LOCAL_ASSET_RE = /^(?:\.\/)?(?:assets|images)\/[a-zA-Z0-9/_\-.]+$/;
  const SAFE_REMOTE_RE = /^https?:\/\//i;

  function toCleanString(value) {
    return String(value == null ? '' : value).trim();
  }

  function sanitizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function mergeById(baseItems, incomingItems) {
    const map = new Map();
    sanitizeArray(baseItems).forEach(item => {
      const id = toCleanString(item && item.id);
      if (!id) return;
      map.set(id, item);
    });
    sanitizeArray(incomingItems).forEach(item => {
      const id = toCleanString(item && item.id);
      if (!id) return;
      const prev = map.get(id) || {};
      map.set(id, { ...prev, ...item });
    });
    return Array.from(map.values());
  }

  function mergePartners(baseItems, incomingItems) {
    const map = new Map();
    sanitizeArray(baseItems).forEach(item => {
      const name = toCleanString(item && item.name).toLowerCase();
      if (!name) return;
      map.set(name, item);
    });
    sanitizeArray(incomingItems).forEach(item => {
      const name = toCleanString(item && item.name).toLowerCase();
      if (!name) return;
      map.set(name, item);
    });
    return Array.from(map.values());
  }

  function patchImageUrlGuard() {
    if (typeof window.getSafeImageUrl !== 'function') return;
    const originalGetSafeImageUrl = window.getSafeImageUrl;

    window.getSafeImageUrl = function patchedGetSafeImageUrl(value) {
      const raw = toCleanString(value);
      if (!raw) return '';

      if (SAFE_LOCAL_ASSET_RE.test(raw)) return raw;
      if (SAFE_REMOTE_RE.test(raw)) return originalGetSafeImageUrl(raw);
      return '';
    };
  }

  function appendCustomPromosToState(payload) {
    let state = null;
    try {
      if (typeof appState !== 'undefined' && appState && typeof appState === 'object') {
        state = appState;
      }
    } catch (error) {}
    if (!state && window.appState && typeof window.appState === 'object') {
      state = window.appState;
    }
    if (!state) return false;

    const parsed = payload && typeof payload === 'object' ? payload : {};

    state.discounts = mergeById(state.discounts, parsed.discounts);
    state.products = mergeById(state.products, parsed.products);
    state.productStories = mergeById(state.productStories, parsed.productStories);
    state.featuredProducts = mergeById(state.featuredProducts, parsed.featuredProducts);
    state.homePartners = mergePartners(state.homePartners, parsed.homePartners);
    return true;
  }

  async function loadCustomPromos() {
    try {
      const response = await fetch(`${CUSTOM_PROMO_PATH}?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return false;

      const payload = await response.json();
      const changed = appendCustomPromosToState(payload);
      if (changed) {
        if (typeof rerenderAfterDataChange === 'function') {
          rerenderAfterDataChange();
        } else if (typeof window.rerenderAfterDataChange === 'function') {
          window.rerenderAfterDataChange();
        }
      }
      return changed;
    } catch (error) {
      console.warn('Failed to load custom promos:', error);
      return false;
    }
  }

  patchImageUrlGuard();

  window.promoRuntime = {
    loadCustomPromos,
    appendCustomPromosToState
  };

  document.addEventListener('DOMContentLoaded', () => {
    loadCustomPromos().catch(() => {});
  });
})();
