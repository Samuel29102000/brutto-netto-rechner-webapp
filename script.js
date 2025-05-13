document.getElementById("berechnenBtn").addEventListener("click", async () => {
  const bruttoInput = document.getElementById("bruttoInput");
  const brutto = parseFloat(bruttoInput.value);
  const ergebnisDiv = document.getElementById("ergebnis");

  // Vorherige Ausgabe löschen
  ergebnisDiv.innerHTML = "";

  // Eingabe-Validierung
  if (isNaN(brutto) || brutto <= 0) {
    alert("❗ Bitte gib ein gültiges Bruttogehalt (> 0) ein.");
    bruttoInput.focus();
    return;
  }

  // Button-Feedback
  const btn = document.getElementById("berechnenBtn");
  btn.disabled = true;
  btn.textContent = "Berechne...";

  try {
    const response = await fetch("https://backend-2-0-9xt0.onrender.com/api/gehalt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brutto })
    });

    if (!response.ok) {
      throw new Error(`Server reagierte mit Status ${response.status}`);
    }

    const data = await response.json();

    // Ausgabe formatieren
    ergebnisDiv.innerHTML = `
      <h2>Ergebnis:</h2>
      <p><strong>Netto:</strong> ${data.netto.toFixed(2)} €</p>
      <p><strong>Steuerbetrag:</strong> ${data.steuerbetrag.toFixed(2)} €</p>
      <p><strong>Sozialversicherungen:</strong> ${data.sozialversicherungen.toFixed(2)} €</p>
    `;
  } catch (err) {
    console.error(err);
    ergebnisDiv.innerHTML = `<p style="color:red;">⚠️ Fehler bei der Berechnung: ${err.message}</p>`;
  } finally {
    // Button zurücksetzen
    btn.disabled = false;
    btn.textContent = "Berechnen";
  }
});
