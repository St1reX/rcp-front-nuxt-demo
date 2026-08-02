<script setup lang="ts">
import RequestLeaveForm from '~/components/leaves/request/RequestLeaveForm.vue';

//******META*********
definePageMeta({
    layout: 'default',
});
</script>

<template>
    <div class="space-y-16">
        <!-- Hero section -->
        <div class="relative isolate min-h-[80vh] flex items-center justify-center overflow-hidden">
            <!-- Spotlight effect -->
            <div
                class="pointer-events-none absolute z-0 w-[700px] h-[700px] bg-radial-spotlight"
                style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
            />

            <!-- Content -->
            <div class="relative z-10 text-center animate-fade-in max-w-2xl">
                <UBadge variant="subtle" class="mb-4"
                    >Leaves system - powered by Jakub Uryga</UBadge
                >
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    Kalendarz zgłoszeniowy<br />
                    <span class="text-primary">urlopów pracowniczych</span>
                </h1>
                <p class="text-gray-500 dark:text-gray-400 mb-6">
                    Tutaj możesz zgłosić swój urlop – wypełnij wniosek, a my zajmiemy się resztą!
                </p>
                <div class="flex justify-center gap-4">
                    <UButton variant="ghost" size="lg" to="https://github.com/Reperaturki"
                        >Dowiedz się więcej</UButton
                    >
                </div>
            </div>
        </div>

        <section class="max-w-4xl mx-auto px-4 flex justify-center">
            <div
                class="border border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl p-6 shadow-sm animate-fade-in-up flex justify-center flex-col"
            >
                <img src="/gifs/cooltext505021443682722.gif" class="mb-10" />

                <p class="text-sm leading-relaxed">
                    Od 1 kwietnia wnioskować o urlop będzie można najpóźniej w jego dniu.
                    <br /><br />
                    Brak złożonego wniosku jest równoznaczny z nieobecnością nieusprawiedliwioną w
                    pracy.
                    <br /><br />
                    <span class="font-medium"> (Koniec wnioskowania o urlopy wstecz) </span>
                </p>
            </div>
        </section>

        <section
            class="max-w-4xl mx-auto flex flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-800 p-10 rounded-xl shadow animate-fade-in-up"
        >
            <h2 class="text-center text-2xl font-semibold mb-16">Formularz urlopów</h2>
            <RequestLeaveForm></RequestLeaveForm>
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
    animation:
        fade-in 0.6s ease-out,
        slide-up 0.6s ease-out;
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
