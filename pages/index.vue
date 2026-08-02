<script setup lang="ts">
//******META*********
definePageMeta({
  layout: 'default',
});
</script>

<template>
  <div class="space-y-16">
    <!-- Hero section -->
    <div
      class="relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden"
    >
      <!-- Spotlight effect -->
      <div
        class="pointer-events-none absolute z-0 w-[700px] h-[700px] bg-radial-spotlight"
        style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
      />

      <!-- Content -->
      <div class="relative z-10 text-center animate-fade-in max-w-2xl">
        <UBadge variant="subtle" class="mb-4">System RCP</UBadge>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Nowoczesny system <br />
          <span class="text-primary">kontroli czasu pracy</span>
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Prosty, bezpieczny i skalowalny system do rejestrowania obecności, urlopów
          i nadgodzin.
        </p>
        <div class="flex justify-center gap-4">
          <UButton color="primary" size="lg" to="/login">Zaloguj się</UButton>
          <UButton variant="ghost" size="lg">Dowiedz się więcej</UButton>
        </div>
      </div>
    </div>

    <!-- Features -->
    <section
      class="max-w-4xl mx-auto bg-zinc-50 dark:bg-zinc-800 p-10 rounded-xl shadow animate-fade-in-up"
    >
      <h2 class="text-center text-2xl font-semibold mb-6">Najważniejsze funkcje</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="flex items-start gap-4">
          <UIcon name="i-heroicons-clock" class="text-xl text-primary" />
          <span>Pełna historia obecności pracowników</span>
        </div>
        <div class="flex items-start gap-4">
          <UIcon name="i-heroicons-credit-card" class="text-xl text-pink-500" />
          <span>Obsługa kart RFID i czytników</span>
        </div>
        <div class="flex items-start gap-4">
          <UIcon name="i-heroicons-calculator" class="text-xl text-blue-500" />
          <span>Rozliczanie urlopów, nadgodzin i norm</span>
        </div>
        <div class="flex items-start gap-4">
          <UIcon name="i-heroicons-users" class="text-xl text-purple-500" />
          <span>Widok menadżera, pracownika i administratora</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in 0.6s ease-out, slide-up 0.6s ease-out;
}

.bg-radial-spotlight {
  /* domyślnie (jasny motyw) */
  background: radial-gradient(
    circle at center,
    rgba(34, 197, 94, 0.12) 0%,
    rgba(34, 197, 94, 0.06) 35%,
    transparent 65%
  );
  mask-image: radial-gradient(circle at center, black 60%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 60%, transparent 100%);
}

.dark .bg-radial-spotlight {
  background: radial-gradient(
    circle at center,
    rgba(34, 197, 94, 0.08) 0%,
    rgba(34, 197, 94, 0.04) 35%,
    transparent 65%
  );
}
</style>
