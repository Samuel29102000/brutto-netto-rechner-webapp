document.getElementById("berechnenBtn").addEventListener("click", async () => {
  const brutto = parseFloat(document.getElementById("bruttoInput").value);

  if (isNaN(brutto)) {
    alert("Bitte gib ein gültiges Bruttogehalt ein.");
    return;
  }

  try {
    // Sende eine POST-Anfrage an dein Backend
    const response = await fetch("https://brutto-netto-backend-1.onrender.com/calculate", {
      method: "POST", // POST-Anfrage, da wir Daten senden
      headers: {
        "Content-Type": "application/json", // Wir senden JSON
      },
      body: JSON.stringify({ brutto }), // Bruttogehalt als JSON im Body der Anfrage
    });

    // Warte auf die Antwort und verarbeite sie
    const data = await response.json();

    // Zeige die berechneten Werte an
    document.getElementById("ergebnis").innerHTML = `
      <p><strong>Netto:</strong> ${data.netto.toFixed(2)} €</p>
      <p><strong>Steuern:</strong> ${data.steuerbetrag.toFixed(2)} €</p>
      <p><strong>Sozialversicherungen:</strong> ${data.sozialversicherungen.toFixed(2)} €</p>
    `;
  } catch (error) {
    // Fehlerbehandlung, falls etwas schiefgeht
    alert("Fehler bei der Berechnung.");
    console.error(error);
  }
});
