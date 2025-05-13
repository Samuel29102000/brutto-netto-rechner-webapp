// main.js
document.getElementById("gehaltsFormular").addEventListener("submit", async function (e) {
  e.preventDefault();

  const btn           = document.getElementById("berechnenBtn");
  const bruttoInput   = document.getElementById("bruttoInput");
  const ergebnisDiv   = document.getElementById("ergebnis");

  ergebnisDiv.innerHTML = "";
  btn.disabled          = true;
  btn.textContent       = "Berechne...";

  const brutto        = parseFloat(bruttoInput.value);
  const steuerklasse  = parseInt(document.getElementById("steuerklasse").value);
  const kirche        = document.getElementById("kirche").checked;

  // Grundvalidierung
  if (isNaN(brutto) || brutto <= 0) {
    ergebnisDiv.innerHTML = `<p style="color:red;">❗ Bitte gültiges Bruttogehalt (> 0) eingeben.</p>`;
    btn.disabled    = false;
    btn.textContent = "Berechnen";
    bruttoInput.focus();
    return;
  }

  // 1) Einkommensteuer-Berechnung (Grundtarif 2025) :contentReference[oaicite:0]{index=0}
  const zvE = brutto * 12; // Jahresbrutto (monatliches x12)
  let einkommensteuer = 0;

  if (zvE <= 12096) {
    einkommensteuer = 0;
  } else if (zvE <= 68429) {
    // einfacher Mittelwert-Marginalsatz von 14 % für diese Zone
    einkommensteuer = (zvE - 12096) * 0.14;
  } else if (zvE <= 277825) {
    // 14 % bis 68 429, dann 42 % bis zvE
    einkommensteuer = (68429 - 12096) * 0.14
                    + (zvE   - 68429) * 0.42;
  } else {
    // 14 % bis 68 429, 42 % bis 277 825, dann 45 % ab darüber
    einkommensteuer = (68429 - 12096) * 0.14
                    + (277825 - 68429) * 0.42
                    + (zvE    - 277825) * 0.45;
  }
  einkommensteuer /= 12; // zurück auf Monat

  // 2) Solidaritätszuschlag: 5,5 % der Steuer, ab Freigrenze entfällt er meist :contentReference[oaicite:1]{index=1}
  const soli = einkommensteuer * 0.055;

  // 3) Kirchensteuer (optional): 9 % der Steuer
  const kirchensteuer = kirche ? einkommensteuer * 0.09 : 0;

  // 4) Sozialversicherungen (monatliche Sätze)
  const rentenRate     = 0.093;
  const arbeitslosRate = 0.012;
  const krankenRate    = 0.073 + 0.013; // Basis + Zusatz
  const pflegeRate     = 0.01525;

  const rentenversicherung      = brutto * rentenRate;
  const arbeitslosenversicherung = brutto * arbeitslosRate;
  const krankenversicherung     = brutto * krankenRate;
  const pflegeversicherung      = brutto * pflegeRate;

  // Gesamtabzüge
  const gesamtAbzug = einkommensteuer
                    + soli
                    + kirchensteuer
                    + rentenversicherung
                    + arbeitslosenversicherung
                    + krankenversicherung
                    + pflegeversicherung;

  const netto = brutto - gesamtAbzug;

  // Ausgabe
  ergebnisDiv.innerHTML = `
    <h2>💰 Netto-Gehalt: <strong>${netto.toFixed(2)} €</strong></h2>
    <ul>
      <li>🧾 Einkommensteuer: ${einkommensteuer.toFixed(2)} €</li>
      <li>🪙 Solidaritätszuschlag (5,5 %): ${soli.toFixed(2)} €</li>
      ${ kirche 
         ? `<li>⛪ Kirchensteuer (9 %): ${kirchensteuer.toFixed(2)} €</li>`
         : ``
      }
      <li>🏦 Rentenversicherung (9,3 %): ${rentenversicherung.toFixed(2)} €</li>
      <li>📉 Arbeitslosenversicherung (1,2 %): ${arbeitslosenversicherung.toFixed(2)} €</li>
      <li>🏥 Krankenversicherung (8,6 %): ${krankenversicherung.toFixed(2)} €</li>
      <li>❤️ Pflegeversicherung (1,525 %): ${pflegeversicherung.toFixed(2)} €</li>
    </ul>
  `;

  btn.disabled    = false;
  btn.textContent = "Berechnen";
});
