<script>
document.getElementById("gehaltsFormular").addEventListener("submit", async function (e) {
  e.preventDefault();

  const button = this.querySelector("button");
  button.disabled = true;
  button.textContent = "Berechne...";

  const brutto = parseFloat(document.getElementById("brutto").value);
  const steuerklasse = parseInt(document.getElementById("steuerklasse").value);
  const kirche = document.getElementById("kirche").checked;

  const ausgabe = document.getElementById("ausgabe");
  ausgabe.innerHTML = ""; // Vorherige Ausgabe leeren

  // Eingaben validieren
  if (isNaN(brutto) || brutto <= 0 || isNaN(steuerklasse) || steuerklasse < 1 || steuerklasse > 6) {
    ausgabe.innerHTML = `<p style="color:red;">❗ Bitte gültige Werte eingeben (Brutto > 0, Steuerklasse 1–6).</p>`;
    button.disabled = false;
    button.textContent = "Berechnen";
    return;
  }

  try {
    const response = await fetch("https://backend-2-0-lyhi.onrender.com/api/gehalt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gehalt: brutto,
        steuerklasse: steuerklasse,
        kirchensteuer: kirche
      })
    });

    if (!response.ok) {
      throw new Error(`Serverfehler: ${response.status}`);
    }

    const daten = await response.json();

    ausgabe.innerHTML = `
      <h2>💰 Netto-Gehalt: <strong>${daten.netto} €</strong></h2>
      <ul>
        <li>🧾 Lohnsteuer: ${daten.abzuege.lohnsteuer} €</li>
        <li>🏦 Rentenversicherung: ${daten.abzuege.rentenversicherung} €</li>
        <li>🏥 Krankenversicherung: ${daten.abzuege.krankenversicherung} €</li>
        <li>❤️ Pflegeversicherung: ${daten.abzuege.pflegeversicherung} €</li>
      </ul>
    `;
  } catch (error) {
    ausgabe.innerHTML = `<p style="color:red;">⚠️ Fehler bei der Berechnung. Bitte später erneut versuchen.<br><small>${error.message}</small></p>`;
  }

  button.disabled = false;
  button.textContent = "Berechnen";
});
</script>
