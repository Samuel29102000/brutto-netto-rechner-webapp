document.getElementById("gehaltsFormular").addEventListener("submit", async function (e) {
  e.preventDefault();

  const button = this.querySelector("button");
  button.disabled = true;
  button.textContent = "Berechne...";

  const brutto = parseFloat(document.getElementById("brutto").value);
  const steuerklasse = parseInt(document.getElementById("steuerklasse").value);
  const kirche = document.getElementById("kirche").checked;

  try {
    const response = await fetch("https://YOUR-BACKEND-URL/api/berechne", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gehalt: brutto,
        steuerklasse,
        kirchensteuer: kirche
      })
    });

    const daten = await response.json();

    document.getElementById("ausgabe").innerHTML = `
      <h2>Netto-Gehalt: <strong>${daten.netto} €</strong></h2>
      <ul>
        <li>Lohnsteuer: ${daten.abzuege.lohnsteuer} €</li>
        <li>Rentenversicherung: ${daten.abzuege.rentenversicherung} €</li>
        <li>Krankenversicherung: ${daten.abzuege.krankenversicherung} €</li>
        <li>Pflegeversicherung: ${daten.abzuege.pflegeversicherung} €</li>
      </ul>
    `;
  } catch (error) {
    document.getElementById("ausgabe").innerHTML = `<p style="color:red;">Fehler bei der Berechnung. Bitte später erneut versuchen.</p>`;
  }

  button.disabled = false;
  button.textContent = "Berechnen";
});
