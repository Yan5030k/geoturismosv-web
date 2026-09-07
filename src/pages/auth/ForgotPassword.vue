<script setup>
import { ref } from 'vue';
import GuestLayout from '@/components/GuestLayout.vue';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import { supabase } from '@/lib/supabase';

const email = ref('');
const status = ref('');
const errorMessage = ref('');
const processing = ref(false);

const submit = async () => {
  processing.value = true;
  errorMessage.value = '';
  status.value = '';
  const redirectTo = `${window.location.origin}${window.location.pathname}#/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, { redirectTo });
  processing.value = false;
  if (error) errorMessage.value = error.message;
  else status.value = 'Te enviamos un enlace para restablecer la contraseña.';
};
</script>

<template>
  <GuestLayout>
    <div class="mb-4 text-sm text-gray-600">
      ¿Olvidaste tu contraseña? Escribe tu correo y te enviaremos un enlace para elegir una nueva.
    </div>
    <div v-if="status" class="mb-4 text-sm font-medium text-green-600">{{ status }}</div>
    <form @submit.prevent="submit">
      <InputLabel for="email" value="Email" />
      <TextInput id="email" type="email" class="mt-1" v-model="email" required autofocus />
      <InputError class="mt-2" :message="errorMessage" />
      <div class="mt-4 flex items-center justify-end">
        <PrimaryButton :disabled="processing">Email Password Reset Link</PrimaryButton>
      </div>
    </form>
  </GuestLayout>
</template>
