<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UserNavbar from '@/components/UserNavbar.vue';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { profile, user, updateProfile, updatePassword, deleteAccount, logout } = useAuth();

const nombre = ref(profile.value?.nombre || '');
const email = ref(profile.value?.email || user.value?.email || '');
const password = ref('');
const passwordConfirmation = ref('');
const mensaje = ref('');
const errorMessage = ref('');

const guardarPerfil = async () => {
  errorMessage.value = '';
  try {
    await updateProfile({ nombre: nombre.value, email: email.value });
    mensaje.value = 'Perfil actualizado.';
  } catch (e) {
    errorMessage.value = e.message;
  }
};

const guardarPassword = async () => {
  errorMessage.value = '';
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }
  try {
    await updatePassword(password.value);
    password.value = '';
    passwordConfirmation.value = '';
    mensaje.value = 'Contraseña actualizada.';
  } catch (e) {
    errorMessage.value = e.message;
  }
};

const borrarCuenta = async () => {
  if (!confirm('¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
  try {
    await deleteAccount();
    await logout();
    router.push('/');
  } catch (e) {
    errorMessage.value = e.message;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <UserNavbar />
    <main class="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Perfil</h1>
      <p v-if="mensaje" class="text-green-700">{{ mensaje }}</p>
      <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>

      <section class="rounded-xl bg-white p-8 shadow space-y-4">
        <h2 class="text-xl font-bold">Información</h2>
        <input v-model="nombre" class="w-full rounded-lg border-gray-300" placeholder="Nombre">
        <input v-model="email" type="email" class="w-full rounded-lg border-gray-300" placeholder="Correo">
        <button @click="guardarPerfil" class="rounded-full bg-[#168a1a] px-5 py-2 font-semibold text-white">Guardar</button>
      </section>

      <section class="rounded-xl bg-white p-8 shadow space-y-4">
        <h2 class="text-xl font-bold">Contraseña</h2>
        <input v-model="password" type="password" class="w-full rounded-lg border-gray-300" placeholder="Nueva contraseña">
        <input v-model="passwordConfirmation" type="password" class="w-full rounded-lg border-gray-300" placeholder="Confirmar">
        <button @click="guardarPassword" class="rounded-full bg-[#0b6fb3] px-5 py-2 font-semibold text-white">Actualizar contraseña</button>
      </section>

      <section class="rounded-xl bg-white p-8 shadow">
        <h2 class="text-xl font-bold text-red-700">Eliminar cuenta</h2>
        <button @click="borrarCuenta" class="mt-4 rounded-full bg-red-600 px-5 py-2 font-semibold text-white">Eliminar cuenta</button>
      </section>
    </main>
  </div>
</template>
