import { supabase } from './supabase.js';

export const auth = {
  user: null,
  profile: null,
  loading: true,
};

async function loadProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) {
    console.error('No se pudo cargar el perfil:', error.message);
    auth.profile = null;
    return;
  }
  auth.profile = data;
}

export function isLoggedIn() {
  return Boolean(auth.user);
}

export function isAdmin() {
  return auth.profile?.rol === 'admin';
}

export async function initAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  auth.user = session?.user ?? null;
  if (auth.user) await loadProfile(auth.user.id);
  auth.loading = false;

  supabase.auth.onAuthStateChange(async (_event, session) => {
    auth.user = session?.user ?? null;
    if (auth.user) await loadProfile(auth.user.id);
    else auth.profile = null;
  });
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  auth.user = data.user;
  if (data.user) await loadProfile(data.user.id);
}

export async function register({ nombre, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre, name: nombre } },
  });
  if (error) throw error;
  auth.user = data.user;
  if (data.user) await loadProfile(data.user.id);
}

export async function logout() {
  await supabase.auth.signOut();
  auth.user = null;
  auth.profile = null;
}

export async function updateProfile({ nombre, email }) {
  if (!auth.user) return;
  const updates = {};
  if (nombre) updates.nombre = nombre;
  if (email) updates.email = email;
  if (Object.keys(updates).length) {
    const { error } = await supabase.from('profiles').update(updates).eq('id', auth.user.id);
    if (error) throw error;
  }
  if (email && email !== auth.user.email) {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) throw error;
  }
  await loadProfile(auth.user.id);
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

export async function deleteAccount() {
  const { error } = await supabase.rpc('delete_own_account');
  if (error) throw error;
  await logout();
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${window.location.pathname}#/reset-password`,
  });
  if (error) throw error;
}
