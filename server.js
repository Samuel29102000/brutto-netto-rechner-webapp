// server.js

// Importiere die notwendigen Module
const express = require('express');
const cors = require('cors');

// Initialisiere die Express-App
const app = express();

// Middleware
app.use(cors());  // Erlaubt CORS-Anfragen
app.use(express.json());  // Für das Parsen von JSON-Daten

// Brutto-Netto-Rechner-Logik (beispielhaft)
app.post('/calculate', (req, res) => {
    const { brutto } = req.body;

    if (!brutto || isNaN(brutto)) {
        return res.status(400).json({ error: 'Bitte einen gültigen Bruttolohn eingeben' });
    }

    // Beispielhafte Berechnungen (vereinfacht)
    const steuerfreibetrag = 10000;
    const steueranteil = 0.2;  // 20% Steuern
    const sozialversicherungsanteil = 0.1;  // 10% Sozialversicherungen

    // Berechnung
    const steuerbetrag = brutto * steueranteil;
    const sozialversicherungen = brutto * sozialversicherungsanteil;
    const netto = brutto - steuerbetrag - sozialversicherungen;

    // Sende die Berechnung zurück
    res.json({
        brutto,
        steuerbetrag,
        sozialversicherungen,
        netto
    });
});

// Starte den Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
