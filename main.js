// main.js
document.getElementById("gehaltsFormular").addEventListener("submit", async function (e) {
  e.preventDefault();

  const btn = document.getElementById("berechnenBtn");
  const bruttoInput = document.getElementById("bruttoInput");
  const ergebnisDiv = document.getElementById("ergebnis");

  ergebnisDiv.innerHTML = "";
  btn.disabled = true;
  btn.textContent = "Berechne...";

  const brutto = parseFloat(bruttoInput.value);
  const steuerklasse = parseInt(document.getElementById("steuerklasse").value);
  const kirche = document.getElementById("kirche").checked;

  if (isNaN(brutto) || brutto <= 0 || steuerklasse < 1 || steuerklasse > 6) {
    ergebnisDiv.innerHTML = `<p style="color:red;">❗ Bitte gib ein gültiges Bruttogehalt (> 0) und eine Steuerklasse (1–6) ein.</p>`;
    btn.disabled = false;
    btn.textContent = "Berechnen";
    bruttoInput.focus();
    return;
  }

  try {
    const response = await fetch("https://backend-2-0-lyhi.onrender.com/api/gehalt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gehalt: brutto, steuerklasse, kirchensteuer: kirche })
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);
    const daten = await response.json();

    ergebnisDiv.innerHTML = `
      <h2>💰 Netto-Gehalt: <strong>${daten.netto.toFixed(2)} €</strong></h2>
      <ul>
        <li>🧾 Lohnsteuer: ${daten.abzuege.lohnsteuer.toFixed(2)} €</li>
        <li>🏦 Rentenversicherung: ${daten.abzuege.rentenversicherung.toFixed(2)} €</li>
        <li>🏥 Krankenversicherung: ${daten.abzuege.krankenversicherung.toFixed(2)} €</li>
        <li>❤️ Pflegeversicherung: ${daten.abzuege.pflegeversicherung.toFixed(2)} €</li>
      </ul>
    `;
  } catch (err) {
    ergebnisDiv.innerHTML = `<p style="color:red;">⚠️ Fehler bei der Berechnung: ${err.message}</p>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Berechnen";
  }
});
