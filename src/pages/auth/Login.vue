<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import GuestLayout from '@/components/GuestLayout.vue';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import Checkbox from '@/components/Checkbox.vue';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { login, isAdmin } = useAuth();
const email = ref('');
const password = ref('');
const remember = ref(false);
const processing = ref(false);
const errorMessage = ref('');

const submit = async () => {
  processing.value = true;
  errorMessage.value = '';
  try {
    await login(email.value, password.value);
    router.push(isAdmin.value ? '/admin/dashboard' : '/usuario/panel');
  } catch (e) {
    errorMessage.value = e.message || 'No se pudo iniciar sesión.';
  } finally {
    processing.value = false;
  }
};
</script>

<template>
  <GuestLayout>
    <form @submit.prevent="submit">
      <div>
        <InputLabel for="email" value="Email" />
        <TextInput id="email" type="email" class="mt-1" v-model="email" required autofocus autocomplete="username" />
      </div>
      <div class="mt-4">
        <InputLabel for="password" value="Password" />
        <TextInput id="password" type="password" class="mt-1" v-model="password" required autocomplete="current-password" />
      </div>
      <div class="mt-4 block">
        <label class="flex items-center">
          <Checkbox name="remember" v-model:checked="remember" />
          <span class="ms-2 text-sm text-gray-600">Remember me</span>
        </label>
      </div>
      <InputError class="mt-2" :message="errorMessage" />
      <div class="mt-4 flex items-center justify-end gap-4">
        <RouterLink to="/forgot-password" class="rounded-md text-sm text-gray-600 underline hover:text-gray-900">Forgot your password?</RouterLink>
        <RouterLink to="/register" class="rounded-md text-sm text-gray-600 underline hover:text-gray-900">Don't have an account?</RouterLink>
        <PrimaryButton :disabled="processing" :class="{ 'opacity-25': processing }">Log in</PrimaryButton>
      </div>
    </form>
  </GuestLayout>
</template>
