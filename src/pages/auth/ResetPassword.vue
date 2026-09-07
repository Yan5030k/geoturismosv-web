<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GuestLayout from '@/components/GuestLayout.vue';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import { supabase } from '@/lib/supabase';

const router = useRouter();
const password = ref('');
const errorMessage = ref('');
const processing = ref(false);

const submit = async () => {
  processing.value = true;
  errorMessage.value = '';
  const { error } = await supabase.auth.updateUser({ password: password.value });
  processing.value = false;
  if (error) errorMessage.value = error.message;
  else router.push('/usuario/panel');
};
</script>

<template>
  <GuestLayout>
    <form @submit.prevent="submit">
      <InputLabel for="password" value="New Password" />
      <TextInput id="password" type="password" class="mt-1" v-model="password" required />
      <InputError class="mt-2" :message="errorMessage" />
      <div class="mt-4 flex justify-end">
        <PrimaryButton :disabled="processing">Reset Password</PrimaryButton>
      </div>
    </form>
  </GuestLayout>
</template>
