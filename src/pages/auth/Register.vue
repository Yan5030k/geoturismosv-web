<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import GuestLayout from '@/components/GuestLayout.vue';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { register } = useAuth();
const nombre = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const processing = ref(false);
const errorMessage = ref('');

const submit = async () => {
  errorMessage.value = '';
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }
  processing.value = true;
  try {
    await register({ nombre: nombre.value, email: email.value, password: password.value });
    router.push('/usuario/panel');
  } catch (e) {
    errorMessage.value = e.message || 'No se pudo crear la cuenta.';
  } finally {
    processing.value = false;
  }
};
</script>

<template>
  <GuestLayout>
    <form @submit.prevent="submit">
      <div>
        <InputLabel for="name" value="Name" />
        <TextInput id="name" type="text" class="mt-1" v-model="nombre" required autofocus autocomplete="name" />
      </div>
      <div class="mt-4">
        <InputLabel for="email" value="Email" />
        <TextInput id="email" type="email" class="mt-1" v-model="email" required autocomplete="username" />
      </div>
      <div class="mt-4">
        <InputLabel for="password" value="Password" />
        <TextInput id="password" type="password" class="mt-1" v-model="password" required autocomplete="new-password" />
      </div>
      <div class="mt-4">
        <InputLabel for="password_confirmation" value="Confirm Password" />
        <TextInput id="password_confirmation" type="password" class="mt-1" v-model="passwordConfirmation" required autocomplete="new-password" />
      </div>
      <InputError class="mt-2" :message="errorMessage" />
      <div class="mt-4 flex items-center justify-end">
        <RouterLink to="/login" class="rounded-md text-sm text-gray-600 underline hover:text-gray-900">Already registered?</RouterLink>
        <PrimaryButton class="ms-4" :disabled="processing" :class="{ 'opacity-25': processing }">Register</PrimaryButton>
      </div>
    </form>
  </GuestLayout>
</template>
