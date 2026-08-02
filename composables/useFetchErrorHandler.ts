import { FetchError } from 'ofetch';

export function useFetchErrorHandler(entityName: string, error?: any) {
  const toast = useToast();

  const handle = (e: any) => {
    if (e instanceof FetchError) {
      if (e.statusCode === 422) {
        toast.add({
          title: `[${entityName}]: Błąd walidacji`,
          description: 'Podane dane są błędne',
          color: 'error',
          duration: 3000,
        });
        return;
      }

      toast.add({
        title: `[${entityName}]: Wystąpił błąd`,
        description: e.message || 'Brak opisu błędu dostarczonego z serwera.',
        color: 'error',
        duration: 3000,
      });
      return;
    }

    toast.add({
      title: e?.statusMessage || 'Błąd połączenia',
      description: e?.data?.message || 'Coś poszło nie tak',
      color: 'error',
      duration: 3000,
    });
  };

  if (error) handle(error);
  return handle;
}
