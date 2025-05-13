document.getElementById("gehaltsFormular").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const brutto = parseFloat(document.getElementById("brutto").value);
  const steuerklasse = parseInt(document.getElementById("steuerklasse").value);
  const kirche = document.getElementById("kirche").checked;

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
    <h2>Netto-Gehalt: ${daten.netto} €</h2>
    <ul>
      <li>Lohnsteuer: ${daten.abzuege.lohnsteuer} €</li>
      <li>Rentenversicherung: ${daten.abzuege.rentenversicherung} €</li>
      <li>Krankenversicherung: ${daten.abzuege.krankenversicherung} €</li>
      <li>Pflegeversicherung: ${daten.abzuege.pflegeversicherung} €</li>
    </ul>
  `;
});
