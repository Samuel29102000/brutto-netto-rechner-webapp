document.getElementById("berechnenBtn").addEventListener("click", async () => {
  const brutto = parseFloat(document.getElementById("bruttoInput").value);

  if (isNaN(brutto)) {
    alert("Bitte gib ein gültiges Bruttogehalt ein.");
    return;
  }

  try {
    const response = await fetch("https://brutto-netto-backend.onrender.com/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ brutto })
    });

    if (!response.ok) {
      throw new Error("Fehler bei der Berechnung.");
    }

    const data = await response.json();

    document.getElementById("ergebnis").innerHTML = `
      <p><strong>Netto:</strong> ${data.netto.toFixed(2)} €</p>
      <p><strong>Steuern:</strong> ${data.steuerbetrag.toFixed(2)} €</p>
      <p><strong>Sozialversicherungen:</strong> ${data.sozialversicherungen.toFixed(2)} €</p>
    `;
  } catch (error) {
    alert("Fehler bei der Berechnung.");
    console.error(error);
  }
});
