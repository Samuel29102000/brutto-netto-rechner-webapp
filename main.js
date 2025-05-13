// main.js
document.getElementById("gehaltsFormular").addEventListener("submit", function(e) {
  e.preventDefault();

  const btn         = document.getElementById("berechnenBtn");
  const bruttoInput = document.getElementById("bruttoInput");
  const ergebnisDiv = document.getElementById("ergebnis");
  const ctx         = document.getElementById('chartCanvas').getContext('2d');

  btn.disabled    = true;
  btn.textContent = "Berechne...";
  ergebnisDiv.innerHTML = "";

  const brutto = parseFloat(bruttoInput.value);
  const kirche = document.getElementById("kirche").checked;

  if (isNaN(brutto) || brutto <= 0) {
    ergebnisDiv.innerHTML = `<p style=\"color:red;\">❗ Bitte ein gültiges Brutto-Gehalt (> 0) eingeben.</p>`;
    btn.disabled    = false;
    btn.textContent = "Berechnen";
    return;
  }

  // Berechnungsfunktionen...
  function calcESt(z) {
    let S;
    if (z <= 12096) S = 0;
    else if (z <= 17443) {
      const y = (z - 12096)/10000;
      S = (932.3*y + 1400)*y;
    } else if (z <= 68480) {
      const y = (z - 17443)/10000;
      S = (176.64*y + 2397)*y + 1015.13;
    } else if (z <= 277825) {
      S = 0.42*z - 10911.92;
    } else {
      S = 0.45*z - 19246.67;
    }
    return S/12;
  }

  const zvE = brutto * 12;
  const einkommensteuer          = calcESt(zvE);
  const soli                      = einkommensteuer * 0.055;
  const kirchensteuer            = kirche ? einkommensteuer * 0.09 : 0;
  const rentenversicherung        = brutto * 0.093;
  const arbeitslosenversicherung  = brutto * 0.012;
  const krankenversicherung       = brutto * (0.073 + 0.013);
  const pflegeversicherung        = brutto * 0.01525;

  const abzüge = {
    'ESt': einkommensteuer,
    'Soli': soli,
    'Kirchensteuer': kirchensteuer,
    'RentenV.': rentenversicherung,
    'ArbeitslosV.': arbeitslosenversicherung,
    'KrankenV.': krankenversicherung,
    'PflegeV.': pflegeversicherung
  };

  const gesamtAbzug = Object.values(abzüge).reduce((a,b) => a + b, 0);
  const netto = brutto - gesamtAbzug;
  abzüge['Netto'] = netto;

  // Ausgabe Text
  ergebnisDiv.innerHTML = `
    <h2>💰 Netto-Gehalt: <strong>${netto.toFixed(2)} €</strong></h2>
  `;

  // Chart.js erstellen
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(abzüge),
      datasets: [{
        label: 'Betrag in €',
        data: Object.values(abzüge),
        backgroundColor: Object.keys(abzüge).map(key => key === 'Netto' ? 'rgba(54,162,235,0.6)' : 'rgba(255,99,132,0.6)'),
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  btn.disabled    = false;
  btn.textContent = "Berechnen";
});
