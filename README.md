# 🎛️ DJ Stolik Nuty – Fisher-Price (PWA na iOS)

Aplikacja webowa (PWA) zaprojektowana pod iPhone'a (Safari → *Dodaj do ekranu początkowego*), generująca kolorowe nuty z kształtami na 8-klawiszowy **Muzyczny Stolik DJ-a Fisher-Price** na bazie polskich piosenek dziecięcych i tradycyjnych.

## Funkcje
- **12 polskich utworów** w czystej skali C-dur (`1..8` / `C–C2`)
- **2 tryby gry:** czytelny śpiewnik (kolor + kształt + sylaba) oraz interaktywne odtwarzanie w tempie i krok po kroku
- **Kalibrator klawiszy (`🎨 Klawisze`):** dopasowanie koloru i kształtu każdego z 8 klawiszy pod konkretny egzemplarz zabawki
- **Generator własnych melodii (`＋ Własna`):** wpisywanie lub wystukiwanie nut literowych `C D E F G A H C2`
- **Pełne wsparcie offline (Service Worker)** po dodaniu na ekran główny iPhone'a

## Hosting
Projekt działa od razu na:
1. **GitHub Pages** — w ustawieniach repozytorium na GitHubie wybierz *Settings → Pages → Source: GitHub Actions* (workflow `.github/workflows/deploy-pages.yml` wdroży aplikację automatycznie po `git push`).
2. **Vercel** — zaimportuj repozytorium Git na [vercel.com/new](https://vercel.com/new) (konfiguracja w `vercel.json` jest już gotowa, *Framework Preset: Other*).
