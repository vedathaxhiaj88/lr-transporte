# L&R Transporte Selmani

Statische Website-Demo in de-CH für Privatumzüge, Möbeltransporte, Kleintransporte und Entsorgung. HTML, CSS und JavaScript ohne Laufzeit-Abhängigkeiten oder Build-Schritt.

## Lokal starten

Voraussetzung: Python 3. Im Repository-Verzeichnis:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Alternativ: `npm start`. Der Webserver liefert die Dateien direkt aus. Node.js wird nur für Entwicklungsprüfungen benötigt.

## Prüfungen

Voraussetzungen: Node.js 22 oder neuer, npm, Python 3 und Chromium.

```sh
npm ci
npx playwright install chromium
npm run check
npm test
```

Wenn ein System-Chromium vorhanden ist, entfällt der Browser-Download:

```sh
CHROMIUM_PATH=/usr/bin/chromium npm test
```

Playwright startet einen eigenen lokalen Testserver auf Port 8011. Die 15 Tests prüfen unter anderem Layout und Navigation bei 320, 390, 768, 1024 und 1440 Pixeln, Tastaturbedienung, Kontaktdaten, Formularvalidierung, E-Mail-Inhalt, Kopier-Fallback, reduzierte Bewegung, Nutzung ohne JavaScript und WCAG-2.1-AA-Regeln mit axe. Automatisierte Scans ersetzen keine vollständige manuelle Barrierefreiheitsprüfung.

## Dateien

- `index.html`: semantische Seitenstruktur, de-CH-Inhalte, Metadaten und strukturierte Unternehmensdaten.
- `styles.css`: Farben, Typografie, Komponenten und responsive Layouts.
- `script.js`: Navigation, dezente Einblendeffekte und E-Mail-Vorbereitung.
- `bildnachweise.html`: tatsächlich verwendete Gestaltungsmittel und Schriftlizenz.
- `assets/fonts/`: lokal eingebundene Manrope-Schrift inklusive SIL-Open-Font-Lizenz.
- `tests/site.spec.cjs`: Browser- und Barrierefreiheitsprüfungen.

## Kontakt und Anfrage

Kontaktdaten gemäss den aktuellen Angaben des Auftraggebers:

- L&R Transporte Selmani
- Wiesenstrasse 17, 5303 Würenlingen, Schweiz
- Telefon: 062 535 74 85 (`+41625357485`)
- Besarta Selmani: +41 79 907 63 96 (`+41799076396`)
- Nezir Kuqi: +41 76 502 61 71 (`+41765026171`)
- E-Mail: info@lrtransporte.ch

Das Formular validiert die Angaben und erstellt einen codierten `mailto:`-Link. Nutzende öffnen diesen anschliessend im E-Mail-Programm und senden die Nachricht selbst. Der Text bleibt zusätzlich zum Kopieren verfügbar, auch ohne Clipboard-Berechtigung. Es gibt keinen Versand-Endpunkt, keine automatische Zustellung und keine Speicherung im Browser oder auf einem Anwendungsserver. Ohne JavaScript bleibt die native `mailto:`-Formularaktion verfügbar. Telefonnummer und E-Mail-Adresse sind immer direkt verlinkt.

Die Website lädt keine externen Schriften, Tracking-Skripte oder anderen externen Ressourcen. Es wurden keine Bewertungen, Zertifizierungen, Preise, Öffnungszeiten oder Angaben zur Firmengeschichte ergänzt.

## Premium V2

`feature/premium-v2` verfeinert die bestehende Gestaltung: dreizeiliger Titel, gerahmtes Startbild mit direktem Anfragelink, zweispaltige Leistungskarten mit seitlichen Bildern auf grossen Bildschirmen und gestapelte Karten auf Mobilgeräten. Inhalte, Kontaktdaten und lizenzierte Bilder bleiben erhalten. Hover-Effekte sind dezent; einmalige Scroll-Einblendungen berücksichtigen Tastaturfokus und Änderungen an der Einstellung für reduzierte Bewegung. Es wurden keine zusätzlichen Bibliotheken, Schriften oder Bilddateien eingebunden.

## Fotografien

Drei visuell geprüfte Pexels-Symbolbilder ergänzen das Startbild und die Leistungen Privatumzüge und Möbeltransporte. Urheber, Originalquellen und Lizenz sind in `bildnachweise.html` dokumentiert (geprüft am 15. November 2026). Die Pexels-Lizenz erlaubt kommerzielle Website-Nutzung und Bearbeitungen. Die Bilder zeigen keine Mitarbeitenden oder Firmenfahrzeuge.

`assets/images/` enthält lokale WebP-Varianten mit 480, 960 und 1440 Pixeln Breite. `srcset` und `sizes` steuern die Auswahl; `object-fit` und responsive Bildpositionen den Ausschnitt. Das Startbild hat hohe Ladepriorität, Leistungsbilder werden verzögert geladen. Feste Bildabmessungen und reservierte Bildflächen verhindern Layoutsprünge. Es werden keine externen Bildressourcen geladen.

Canonical-URL und `og:url` werden erst ergänzt, wenn die endgültige öffentliche Website-Adresse feststeht. Der dezente Hinweis «Website-Demo» bleibt sichtbar. Die Arbeiten liegen auf `feature/premium-redesign`; es wurde weder nach `main` gemergt noch zu Cloudflare deployt.

Die aktuelle Markenfassung verwendet Orange, Anthrazit und Weiss sowie ein anhand der bereitgestellten Visitenkarte nachgezeichnetes LR-Zeichen. Die aktuellen Mobilnummern stammen aus den ausdrücklichen Angaben des Auftraggebers.
