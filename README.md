# FILMBOX

Przeglądaj obszerną bazę filmów, twórz spersonalizowane listy ulubionych i watchlisty, aby z łatwością planować swoje filmowe wieczory i nigdy nie przegapić wyczekiwanych premier.

## Metody HTTP

- `GET /movies` – Pobiera listę filmów (z zewnętrznego API).
- `GET /movies/:id` – Pobiera szczegóły filmu.
- `POST /movies` – Dodaje film do obejrzanych.
- `PUT /movies/:id` – Aktualizuje status filmu z watchlist na obejrzane.
- `DELETE /movies/:id` – Usuwa film z listy obejrzanych.

### Zarządzanie użytkownikami

- `POST /user/register` – Rejestracja użytkownika.
- `POST /user/login` – Logowanie (JWT).
- `PUT /user/:id` – Aktualizacja profilu.
- `DELETE /user/:id` – Usunięcie konta.

## Zewnętrzne API

- `TMDB API` - Baza filmów
- `JustWatch API` - Lista miejsc, gdzie można film obejrzeć

## Uwierzytelnianie i autoryzacja użytkowników

- `Next.js API Routes`
- `bcrypt`
- `jsonwebtoken`

## Baza danych

- `Prisma ORM`
- `PostgreSQL` - Neon.tech

## Open API Documentation

- `Swagger`

## Frontend

- `Next.JS`
- `TypeScript`
- `Tailwind`
