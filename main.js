// main.js
document.getElementById("gehaltsFormular").addEventListener("submit", function(e) {
  e.preventDefault();

  const btn         = document.getElementById("berechnenBtn");
  const bruttoInput = document.getElementById("bruttoInput");
  const ergebnisDiv = document.getElementById("ergebnis");

  btn.disabled    = true;
  btn.textContent = "Berechne...";
  ergebnisDiv.innerHTML = "";

  const brutto       = parseFloat(bruttoInput.value);
  const kirche       = document.getElementById("kirche").checked;

  if (isNaN(brutto) || brutto <= 0) {
    ergebnisDiv.innerHTML = `<p style="color:red;">❗ Bitte ein gültiges Brutto-Gehalt (> 0) eingeben.</p>`;
    btn.disabled    = false;
    btn.textContent = "Berechnen";
    return;
  }

  // 1) Jahresbrutto
  const zvE = brutto * 12;

  // 2) Einkommensteuer (§ 32a EStG)
  function calcESt(z) {
    let S;
    if (z <= 12096) {
      S = 0;
    } else if (z <= 17443) {
      const y = (z - 12096) / 10000;
      S = (932.3 * y + 1400) * y;
    } else if (z <= 68480) {
      const y = (z - 17443) / 10000;
      S = (176.64 * y + 2397) * y + 1015.13;
    } else if (z <= 277825) {
      S = 0.42 * z - 10911.92;
    } else {
      S = 0.45 * z - 19246.67;
    }
    return S / 12;
  }
  const einkommensteuer = calcESt(zvE);

  // 3) Solidaritätszuschlag (5,5 %)
  const soli = einkommensteuer * 0.055;

  // 4) Kirchensteuer (9 % auf ESt)
  const kirchensteuer = kirche ? einkommensteuer * 0.09 : 0;

  // 5) Sozialversicherungen
  const rentenversicherung       = brutto * 0.093;
  const arbeitslosenversicherung = brutto * 0.012;
  const krankenversicherung      = brutto * (0.073 + 0.013);
  const pflegeversicherung       = brutto * 0.01525;

  // 6) Gesamtabzug
  const gesamtAbzug = einkommensteuer
                    + soli
                    + kirchensteuer
                    + rentenversicherung
                    + arbeitslosenversicherung
                    + krankenversicherung
                    + pflegeversicherung;

  // 7) Netto
  const netto = brutto - gesamtAbzug;

  // 8) Ausgabe
  ergebnisDiv.innerHTML = `
    <h2>💰 Netto-Gehalt: <strong>${netto.toFixed(2)} €</strong></h2>
    <ul>
      <li>🧾 Einkommensteuer: ${einkommensteuer.toFixed(2)} €</li>
      <li>🪙 Solidaritätszuschlag: ${soli.toFixed(2)} €</li>
      ${kirche ? `<li>⛪ Kirchensteuer: ${kirchensteuer.toFixed(2)} €</li>` : ''}
      <li>🏦 Rentenversicherung: ${rentenversicherung.toFixed(2)} €</li>
      <li>📉 Arbeitslosenversicherung: ${arbeitslosenversicherung.toFixed(2)} €</li>
      <li>🏥 Krankenversicherung: ${krankenversicherung.toFixed(2)} €</li>
      <li>❤️ Pflegeversicherung: ${pflegeversicherung.toFixed(2)} €</li>
    </ul>
  `;

  btn.disabled    = false;
  btn.textContent = "Berechnen";
});
