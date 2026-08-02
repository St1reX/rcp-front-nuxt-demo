# RCP Front

Frontend systemu RCP napisany w Nuxt 3. Aplikacja udostępnia panel do obsługi rejestracji czasu pracy, pracowników, kart, czytników, działów, typów zatrudnienia, urlopów, świąt oraz korekt dni roboczych.

## Stack

- Nuxt 3, Vue 3 i TypeScript
- Nuxt UI, Pinia, Nuxt Color Mode
- VeeValidate + Zod do formularzy i walidacji
- Chart.js i Schedule-X do widoków statystyk oraz kalendarzy
- Własna warstwa API w katalogu `api/`

## Najważniejsze funkcje

- logowanie, reset hasła i obsługa zaproszeń
- dashboard administracyjny z modułami pracowników, kart, czytników i działów
- ewidencja wejść/wyjść oraz raporty dzienne i miesięczne
- zarządzanie urlopami, wnioskami i widokami dla różnych ról
- obsługa świąt, wyjątkowych dni roboczych i preferowanych godzin pracy
- centralna obsługa błędów oraz komunikatów toast

## Struktura projektu

```text
api/              klient API podzielony na moduły domenowe
assets/           globalne style i fonty
components/       komponenty formularzy, dashboardu i layoutu
composables/      współdzielona logika Vue/Nuxt
constants/        stałe aplikacyjne, role i ścieżki
errorHandler/     centralna obsługa błędów
layouts/          layouty dla panelu, urlopów i widoków publicznych
middleware/       ochrona tras i logika sesji
pages/            routing Nuxta oparty o strukturę plików
plugins/          inicjalizacja API, toastów i handlerów
stores/           stan aplikacji w Pinia
types/            modele i schematy typów
utils/            drobne funkcje pomocnicze
```

## Konfiguracja

Skopiuj `.env.example` do `.env` i uzupełnij adres API:

```env
NUXT_ENV=development
DEV_API_URL=http://localhost:3001
PROD_API_URL=https://api.example.com
```

`NUXT_ENV` decyduje, czy aplikacja używa `DEV_API_URL`, czy `PROD_API_URL`. Wtyczka `plugins/api.ts` przekazuje ten adres do klienta API dostępnego w aplikacji przez Nuxt provide.

## Komendy

```bash
npm install
npm run dev
npm run build
npm run preview
```

Dostępne skrypty:

- `npm run dev` - uruchamia serwer developerski Nuxta na `0.0.0.0`
- `npm run build` - buduje aplikację produkcyjną
- `npm run preview` - podgląd lokalny zbudowanej aplikacji
- `npm run generate` - generowanie statyczne
- `npm run start` - start zbudowanego serwera Nuxta na porcie `4000`

## Integracja z backendem

Frontend komunikuje się z backendem przez moduły w `api/`. Główna klasa `Api` agreguje klientów m.in. dla autoryzacji, obecności, pracowników, kart, czytników, działów, urlopów, statystyk i ról.

Sesja użytkownika jest obsługiwana po stronie backendu przez cookie, dlatego przy lokalnej pracy warto sprawdzić zgodność adresów frontu i backendu oraz konfigurację CORS po stronie API.

## Dobre praktyki w projekcie

- nowe widoki dodawaj jako strony w `pages/`, zgodnie z routingiem Nuxta
- logikę komunikacji z API trzymaj w `api/`, nie bezpośrednio w komponentach
- współdzieloną logikę formularzy i zachowań UI przenoś do `composables/`
- typy odpowiedzi i payloadów utrzymuj w `types/`
- role i stałe domenowe dopisuj w `constants/`, żeby nie rozpraszać stringów po widokach
