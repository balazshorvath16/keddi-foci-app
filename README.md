# Keddi Foci App

**Keddi Foci App** egy mobilbarát webalkalmazás, amely célja, hogy egyetlen felületen összegyűjtse a focis csapattagok eseményeit. Az alkalmazás lehetővé teszi a felhasználók számára, hogy regisztráljanak, bejelentkezzenek, jelentkezzenek az eseményekre, és adminisztrátori funkciók segítségével az eseményeket kezeljék. A jövőben push értesítések integrálása is tervezett (Blaze csomagra való előfizetés esetén).

## Tartalomjegyzék

- [Funkciók](#funkciók)
- [Technológiák](#technológiák)
- [Telepítés és futtatás](#telepítés-és-futtatás)
- [Verziókövetés és fejlesztési folyamat](#verziókövetés-és-fejlesztési-folyamat)
- [Felhasználói Szintek](#felhasználói-szintek)
- [Adminisztrációs funkciók](#adminisztrációs-funkciók)
- [Események kezelése](#események-kezelése)
- [Jövőbeni fejlesztések](#jövőbeni-fejlesztések)
- [Kapcsolat](#kapcsolat)

## Funkciók

- **Felhasználói regisztráció és bejelentkezés:**  
  Új felhasználók regisztrációja során megadják az email címet, teljes nevet, születési dátumot, jelszót és jelszó megerősítést. A bejelentkezés után a Dashboard felületre kerülnek.

- **Dashboard:**  
  A Dashboard felület tartalmazza az események megtekintését, a profil módosítását, valamint az adminisztrátorok számára elérhető esemény létrehozás és szerkesztés funkciókat.

- **Események listázása:**  
  Az eseményeket egy Slick Carousel segítségével jeleníti meg, így nagyobb mennyiségű esemény is áttekinthető marad. Az eseménykártyák tartalmazzák a helyszínt, dátumot, időpontot, maximális létszámot, résztvevők számát, és a résztvevők részletes listáját (dropdown formában).

- **Jelentkezési logika és várólista:**  
  - Amennyiben az esemény megtelt, a felhasználók várólistára kerülnek.
  - Ha egy résztvevő lemondja, a rendszer automatikusan áthelyezi a várólista első tagját a résztvevők közé.

- **Felhasználói szintek:**  
  Minden regisztrált felhasználó rendelkezik egy "szinttel" és egy "részvételi számmal" (például `3/10`), ami azt jelzi, hogy hány alkalommal vettek részt az eseményeken. Alapértelmezés szerint az új felhasználók "Új játékos" szinten vannak. Ha egy felhasználó eléri a 10 esemény részvételt, automatikusan "Keddi foci veterán" szintre kerül. A veterán felhasználóknak speciális regisztrációs logikájuk van, mely szerint, ha a regisztrációs határidő előtt jelentkeznek, prioritást élveznek, és akár át is tudják váltani az új játékosokat a résztvevők listájából.

- **Adminisztráció:**  
  Az adminoknak elérhető felületük van a felhasználók kezelésére, ahol manuálisan is módosítható a felhasználók szintje és részvételi száma. Emellett adminként eseményeket hozhatnak létre, szerkeszthetnek (pl. helyszín, időpont, létszám módosítása) és jelezhetik, ha egy esemény elmaradt (a kártya kiszürkül és egy "ELMARAD" badge jelenik meg).

## Technológiák

- **Frontend:** React, React Router  
- **Stílusok:** Alap HTML/CSS (bootstrap nélküli verzió), Slick Carousel (események listázása)  
- **Backend:** Firebase (Authentication, Firestore, Storage a push értesítésekhez jövőben)  
- **Egyéb csomagok:** react-slick, slick-carousel

## Telepítés és futtatás

1. **Klónozd a repót:**
   ```bash
   git clone https://github.com/<felhasználónév>/keddi-foci-app.git
   cd keddi-foci-app
