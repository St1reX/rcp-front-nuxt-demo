// composables/useDateTimeInput.ts
import { ref } from 'vue';
import type { Ref } from 'vue';

export function useDateTimeInput(date: Ref<string>, time?: Ref<string>) {
  const isDeleting = ref(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Backspace') {
      isDeleting.value = true;
    } else {
      isDeleting.value = false;
    }
  };

  const onDateInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 8) value = value.slice(0, 8);

    if (!isDeleting.value) {
      if (value.length >= 6) {
        value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}`;
      } else if (value.length >= 4) {
        value = `${value.slice(0, 4)}-${value.slice(4)}`;
      }
    }

    date.value = value;
    input.value = value;
  };

  const onTimeInput = (e: Event) => {
    if (!time) {
      return;
    }

    const input = e.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 5) value = value.slice(0, 5);

    if (!isDeleting.value) {
      if (value.length >= 2) {
        value = `${value.slice(0, 2)}:${value.slice(2)}`;
      }
    }

    time.value = value;
    input.value = value;
  };

  return {
    onKeyDown,
    onDateInput,
    onTimeInput,
  };
}
