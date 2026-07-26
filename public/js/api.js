// Tiny FISHKO API client for the frontend.
// Swap your localStorage calls for these (they return Promises).
const API = (location.origin.includes('http') ? '' : 'http://localhost:8080') + '/api';

async function req(path, opts = {}) {
  const token = localStorage.getItem('fk_admin_token');
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
  return res.json();
}

const FishkoAPI = {
  // products
  listProducts: () => req('/products'),
  saveProduct: (p) => req('/products', { method: 'POST', body: p }),
  updateProduct: (id, p) => req('/products/' + id, { method: 'PUT', body: p }),
  deleteProduct: (id) => req('/products/' + id, { method: 'DELETE' }),
  // orders
  placeOrder: (o) => req('/orders', { method: 'POST', body: o }),
  listOrders: () => req('/orders'),
  // subscribers + broadcast
  addSubscriber: (phone) => req('/subscribers', { method: 'POST', body: { phone } }),
  listSubscribers: () => req('/subscribers'),
  broadcast: (title, message) => req('/subscribers/broadcast', { method: 'POST', body: { title, message } }),
  // admin auth
  adminLogin: async (password) => {
    const { token } = await req('/auth/login', { method: 'POST', body: { password } });
    localStorage.setItem('fk_admin_token', token);
    return token;
  },
  // image upload (pass a File)
  uploadImage: async (file) => {
    const fd = new FormData(); fd.append('image', file);
    const res = await fetch(API + '/upload', { method: 'POST', headers: { Authorization: 'Bearer ' + localStorage.getItem('fk_admin_token') }, body: fd });
    return res.json();
  },
};
window.FishkoAPI = FishkoAPI;
