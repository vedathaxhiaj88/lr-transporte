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

Playwright startet einen eigenen lokalen Testserver auf Port 8011. Die 11 Tests prüfen unter anderem Layout und Navigation bei 320, 390, 768, 1024 und 1440 Pixeln, Tastaturbedienung, Kontaktdaten, Formularvalidierung, E-Mail-Inhalt, Kopier-Fallback, reduzierte Bewegung, Nutzung ohne JavaScript und WCAG-2.1-AA-Regeln mit axe. Automatisierte Scans ersetzen keine vollständige manuelle Barrierefreiheitsprüfung.

## Dateien

- `index.html`: semantische Seitenstruktur, de-CH-Inhalte, Metadaten und strukturierte Unternehmensdaten.
- `styles.css`: Farben, Typografie, Komponenten und responsive Layouts.
- `script.js`: Navigation, dezente Einblendeffekte und E-Mail-Vorbereitung.
- `bildnachweise.html`: tatsächlich verwendete Gestaltungsmittel und Schriftlizenz.
- `assets/fonts/`: lokal eingebundene Manrope-Schrift inklusive SIL-Open-Font-Lizenz.
- `tests/site.spec.cjs`: Browser- und Barrierefreiheitsprüfungen.

## Kontakt und Anfrage

Aus der bestehenden Website übernommen:

- L&R Transporte Selmani
- Wiesenstrasse 17, 5303 Würenlingen, Schweiz
- Telefon: 079 907 63 96 (`+41799076396`)
- E-Mail: info@lrtransporte.ch

Das Formular validiert die Angaben und erstellt einen codierten `mailto:`-Link. Nutzende öffnen diesen anschliessend im E-Mail-Programm und senden die Nachricht selbst. Der Text bleibt zusätzlich zum Kopieren verfügbar, auch ohne Clipboard-Berechtigung. Es gibt keinen Versand-Endpunkt, keine automatische Zustellung und keine Speicherung im Browser oder auf einem Anwendungsserver. Ohne JavaScript bleibt die native `mailto:`-Formularaktion verfügbar. Telefonnummer und E-Mail-Adresse sind immer direkt verlinkt.

Die Website lädt keine externen Schriften, Tracking-Skripte oder anderen externen Ressourcen. Es wurden keine Bewertungen, Zertifizierungen, Preise, Öffnungszeiten oder Angaben zur Firmengeschichte ergänzt.

## Noch offen: Fotografien

Die gewünschte Fotografie ist **noch nicht umgesetzt**. Die Cloud-Netzwerkrichtlinie blockierte die angefragten Fotografie- und Lizenzquellen mit HTTP 403. Deshalb sind momentan ausschliesslich eigene typografische Gestaltungselemente und einfache Symbole eingebunden; es gibt keine nicht verifizierten Fotos, Hotlinks oder defekten Bildplatzhalter.

Zum Abschliessen müssen `www.pexels.com` und `images.pexels.com` in den Internet-Einstellungen erreichbar sein oder geeignete eigene Fotos mit geklärten Nutzungsrechten vorliegen. Dann:

1. Relevante Aufnahmen von Lieferwagen, Möbeltransport oder Be-/Entladen auswählen und visuell prüfen. Keine grossen Lastwagen oder sachfremden Motive verwenden.
2. Originalquelle, Urheber und Lizenz dokumentieren; ausschliesslich geklärte Nutzungsrechte verwenden.
3. Lokale, passend dimensionierte WebP-/AVIF-Dateien mit geeigneten Alternativtexten und festen Abmessungen einbinden. Hero-Bild priorisieren, weitere Bilder verzögert laden.
4. Typografische Bildflächen ersetzen und `bildnachweise.html` aktualisieren. Stockaufnahmen als Symbolbilder kenntlich machen.
5. Responsive Darstellung, Ladeverhalten und Browserprüfungen erneut kontrollieren.

Canonical-URL und `og:url` werden erst ergänzt, wenn die endgültige öffentliche Website-Adresse feststeht. Der dezente Hinweis «Website-Demo» bleibt sichtbar. Die Arbeiten liegen auf `feature/premium-redesign`; es wurde weder nach `main` gemergt noch zu Cloudflare deployt.
