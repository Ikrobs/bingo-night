export const STORAGE_KEY = "bingo-game-state";
export const POLL_MS = 1200;

export function emptyState(total) {
  return {
    total: total || 75,
    drawn: [],
    status: "idle",
    updatedAt: Date.now(),
  };
}

export async function loadState() {
  try {
    if (window.storage?.get) {
      const res = await window.storage.get(STORAGE_KEY, true);
      return res && res.value ? JSON.parse(res.value) : null;
    }
    const res = localStorage.getItem(STORAGE_KEY);
    return res ? JSON.parse(res) : null;
  } catch {
    return null;
  }
}

export async function saveState(state) {
  try {
    if (window.storage?.set) {
      await window.storage.set(STORAGE_KEY, JSON.stringify(state), true);
      return true;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
