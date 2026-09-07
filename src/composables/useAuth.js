import { computed, ref } from 'vue';
import { supabase } from '@/lib/supabase';

const user = ref(null);
const profile = ref(null);
const loading = ref(true);
let started = false;

async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('No se pudo cargar el perfil:', error.message);
    profile.value = null;
    return;
  }

  profile.value = data;
}

export async function initAuth() {
  if (started) return;
  started = true;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  user.value = session?.user ?? null;

  if (user.value) {
    await loadProfile(user.value.id);
  }

  loading.value = false;

  supabase.auth.onAuthStateChange(async (_event, session) => {
    user.value = session?.user ?? null;

    if (user.value) {
      await loadProfile(user.value.id);
    } else {
      profile.value = null;
    }
  });
}

export function useAuth() {
  const isLoggedIn = computed(() => Boolean(user.value));
  const isAdmin = computed(() => profile.value?.rol === 'admin');

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    user.value = data.user;
    if (data.user) await loadProfile(data.user.id);
  }

  async function register({ nombre, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, name: nombre },
      },
    });
    if (error) throw error;
    user.value = data.user;
    if (data.user) await loadProfile(data.user.id);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function updateProfile({ nombre, email }) {
    if (!user.value) return;

    const updates = {};
    if (nombre) updates.nombre = nombre;
    if (email) updates.email = email;

    if (Object.keys(updates).length) {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.value.id);
      if (error) throw error;
    }

    if (email && email !== user.value.email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
    }

    await loadProfile(user.value.id);
  }

  async function updatePassword(password) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }

  async function deleteAccount() {
    const { error } = await supabase.rpc('delete_own_account');
    if (error) throw error;
    await supabase.auth.signOut();
  }

  return {
    user,
    profile,
    loading,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    deleteAccount,
  };
}
