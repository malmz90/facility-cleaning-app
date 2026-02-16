# facility-cleaning-app

# Städapp – Arkitektur & Flödesdokumentation

## 1. Översikt

Systemet består av:

- **Webbapp** för företagets ägare / admin (dashboard, uppsättning, översikt)
- **Mobilapp** för städpersonal (QR-skanning, instruktioner, loggning)

Autentisering och datasäkerhet hanteras via **Supabase** med **Row Level Security (RLS)**.

---

## 2. Användar- och organisationsflöde

### Försäljning & onboarding

1. Företagsägaren kontaktas och får en pitch
2. Ägaren skapar ett konto
3. I samma flöde:
   - En **organization** skapas
   - Ägaren tilldelas rollen **admin**
4. Ägaren landar direkt i admin-dashboarden

---

### Admin (Chef)

Admin kan:

- Skapa och hantera:
  - Buildings
  - Rooms
  - QR-koder
- Bjuda in cleaners till organisationen
- Se städstatus i realtid
- Se historik över städning och försenade rum

---

### Cleaner (Städpersonal)

Cleaner kan:

- Logga in i mobilappen
- Skanna QR-koder i rum
- Se rumspecifika instruktioner och redskap
- Logga utförd städning

Städpersonal kan inte ändra data eller se admin-vyer.

---

## 3. Arkitekturprinciper

- **Supabase Auth** = vem användaren är
- **Egna domäntabeller** = vad användaren får göra
- **Row Level Security (RLS)** = tvingar alla regler i databasen
- Frontend visar rätt UI men har aldrig ansvar för säkerhet

---

## 4. Databasstruktur (auktoritativ)

### Authentication (Supabase)

auth.users

id

email

---

### Profiles

profiles

id (FK → auth.users.id)

name

created_at

---

### Organizations (Företag)

organizations

id

name

owner_id (FK → auth.users.id)

created_at

---

### Organization Members (roller)

organization_members

id

organization_id (FK)

user_id (FK)

role ('admin' | 'cleaner')

created_at

Roller lagras alltid här, aldrig direkt på användaren.

---

### Buildings

buildings

id

organization_id (FK)

name

address

En organisation kan ha flera byggnader.

---

### Rooms

rooms

id

building_id (FK)

name

instructions

tools

cleaning_frequency_minutes

Varje rum har en QR-kod som innehåller `room_id`.

---

### Cleaning Logs

cleaning_logs

id

room_id (FK)

user_id (FK)

cleaned_at (TIMESTAMPTZ)

Denna tabell är grunden för historik, status och rapporter.

---

## 5. QR-kodflöde

- QR-koden innehåller **endast** `room_id`
- Ingen känslig data finns i QR-koden
- Efter skanning:
  - Appen hämtar rummet
  - RLS verifierar att användaren tillhör organisationen

QR-koder är säkra även om de sprids.

---

## 6. Säkerhetsmodell (RLS – sammanfattning)

- Endast organization_members får åtkomst till data
- Cleaners:
  - Kan läsa rooms
  - Kan skapa cleaning_logs för sig själva
- Admins:
  - Kan hantera buildings, rooms och medlemmar
  - Kan se alla cleaning_logs
- All behörighet enforceas i databasen

---

## 7. Statuslogik (Dashboard)

Rummets status beräknas dynamiskt baserat på:

- Senaste cleaned_at
- cleaning_frequency_minutes
- Nuvarande tid (UTC)

Statusar:

- 🟢 Städad i tid
- 🟡 Ej städad ännu (inom deadline)
- 🔴 Försenad

Status sparas inte i databasen, utan räknas ut.
