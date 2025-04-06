---
marp: true
theme: uncover
class: invert
paginate: true
style: |
    .api-call {
        width: 75%;
        height: auto;   
    }

---

<!-- _paginate: false -->

# Wie bekommt man Daten aus dem Internet?

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
