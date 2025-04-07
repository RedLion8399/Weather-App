---
marp: true
theme: uncover
paginate: true
style: |
    .api-call {
        width: 75%;
        height: auto;   
    }

---

<!-- _paginate: false -->
<!-- _class: invert -->

# Wie bekommt man <br> Daten aus dem Internet? <!-- fit -->

<!-- - Problem: Wetteradten sind nicht bei uns, sondern auf Servern im Internet
- Rhetorische Frage -->
---

## Anwendungen

- :cloud: Wetter anzeigen  
- :bus: Fahrpläne abrufen  
- :watch: Uhrzeit synchronisieren  
- :mag_right: Suchmaschinen nutzen  
- :arrow_forward: YouTube-Videos abspielen  
- :iphone: Fast jede App nutzt Daten aus dem Internet
- etc.

<!-- - Fast alles auf dem Handy braucht Daten aus dem Internet
- Nicht zwingend Suchmaschiene
- Woher kommen die Daten? -->

---

<!-- _class: invert -->

## Lösung - _API_

### **API  = _Application Programming Interface_**

1. Senden einer Anfrage
2. Erhalten einer Antwort

<!--
Beispiel: Abfrage Uhrzeit
-  Gerät sendet Anfrage ("URL")
-  Antwort als "JSON"
-  Antwort abspeichern / Verarbeiten
-  Zeitinensiv
-->

---

<!-- _class: invert -->

## Request  & Response

```ts
let data = await fetch("https://qapi.vercel.app/api/random");
```

```json
{
  "id": 18,
  "quote": "Don’t watch the clock; do what it does. Keep going.",
  "author": "Sam Levenson"
}
```

---

### **JSON = _JavaScript Object Notation_**

<img src="img/Exemple-api-call.png" alt="API Call"  class="api-call">

---

<!-- _class: invert -->

# Wir programmiere <br> _Back to the Future_    <!-- fit -->

Problem: API-Anfragen sind sehr zeitintensiv

<!-- - Witz über langsames Internet
- Mögliche Übertragungsfehler -->

---

![Mermaid diagram](https://mermaid.ink/svg/pako:eNpdU9uK2zAQ_RWhJwfsENtxLqYshKbQhW4JWdqHXS9Fice2qC25upBtQvLt1cVJw9pgzfjMnJkzkk54z0vAOa5aftg3RCj0bVswZJ5nZbzgdSN4LUjXIWl9UG8jD39hJQSvK3YEWgNDJQi0JgrYFX9kvVbBd62OBqnpTnkYAWVDxDOwMrCfIX21eYy28EeDVCbCx2xB9pxJCFZMHbjpjujKBg4UG-B7kDL4CYKIHVB1pfLRNxqpdFX9ioMCrymrAdEOXXWRXWs5g69E9yp6MRwtUKlgVODRfXJikp-gMSotwwcwNaDpldQUhGnBEn7aiQf0Q4KI3CRkiEDtxy7Pv1Y5QlH0cBPpvUGTs-2QXaydvYcdm7McgTUGdXd2cmenlgDe-5ZQFqwpoP8akexJa_YUSbpvXNfUbRAgN40hSJsy7mdPiCAttJ4CdsDMlLyOy-WChho4xLWgJc4r0koIcQeiI9bHJzuyAqsGOjPA3JglVES3qsChh1rOf3ukIaxcC3JgBS7Y2XD2hL1w3uFcCW1YBdd1c3V0X5qztabE7uitsLBHS3zmmimcJ_PF1JHg_ITfcR5l03ScLOJ4Hi-zxSRLliH-i_PFdJwmcRZPZkkaL2dZeg7x0ZWNx9NsOpsk83iRZqlZshBDSRUXT_4GuYt0_gc3jBPm)

---

<!-- _class: invert -->

## Asyncronität

**async** und **await** ermöglicehn es auf asyncrone Prozesse zu "warten"

---

<!-- _class: invert -->

## Kompliziert

```ts
fetch("https://qapi.vercel.app/api/random")
.then((data: Response) => data.json())
.then((quote: JSON) => console.log(quote.stringify()));

.error((err: Error) => console.log(err));
```

---

<!-- _class: invert -->

## Einfacher

Asynchrone Funktion

```ts
async function displayQuote() {
  let data = await fetch("https://qapi.vercel.app/api/random");
  let quote = await data.json();
  let quoteText = quote.stringify();

  console.log(quoteText);
}
```

---

<!-- _class: invert -->
<!-- _paginate: false -->

## 🧠 Zusammenfassung

- 📡 Daten kommen **nicht vom Gerät**, sondern von **Servern im Internet**
- 🔄 Dafür nutzen wir **APIs**  
  → senden Anfragen, bekommen Antworten (meist in **JSON**)

---

<!-- _class: invert -->
<!-- _paginate: false -->

- ⏱️ Diese Prozesse dauern – deshalb sind sie **asynchron**
- 🧵 Der Code läuft **weiter**, während auf die Antwort gewartet wird
- ✨ Mit `async` / `await` ist das einfacher zu schreiben & zu lesen
