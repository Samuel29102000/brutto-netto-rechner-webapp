const form = document.getElementById("gehaltsFormular");
const bruttoInput = document.getElementById("bruttoInput");
const steuerklasseSelect = document.getElementById("steuerklasse");
const kircheCheckbox = document.getElementById("kirche");
const ergebnisDiv = document.getElementById("ergebnis");
const ctx = document.getElementById('chartCanvas').getContext('2d');
const btn = document.getElementById("berechnenBtn");

let chartInstance = null;

form.addEventListener("submit", function(e) {
  e.preventDefault();
  berechne();
});

async function berechne() {
  btn.disabled = true;
  btn.textContent = "Berechne...";
  ergebnisDiv.innerHTML = "";

  const brutto = parseFloat(bruttoInput.value);
  const kirche = kircheCheckbox.checked;
  const steuerklasse = steuerklasseSelect.value;

  if (isNaN(brutto) || brutto <= 0) {
    ergebnisDiv.innerHTML = `<p style="color:red;">❗ Bitte ein gültiges Brutto-Gehalt (> 0) eingeben.</p>`;
    btn.disabled = false;
    btn.textContent = "Berechnen";
    return;
  }

  // Einkommensteuer berechnen
  const einkommensteuer = berechneEinkommensteuer(brutto, steuerklasse);
  const soli = einkommensteuer * 0.055;
  const kirchensteuer = kirche ? einkommensteuer * 0.09 : 0;
  const renten = brutto * 0.093;
  const arbeitslos = brutto * 0.012;
  const kranken = brutto * (0.073 + 0.013);
  const pflege = brutto * 0.01525;

  const abzüge = {
    'ESt': einkommensteuer,
    'Soli': soli,
    'Kirchensteuer': kirchensteuer,
    'RentenV.': renten,
    'ArbeitslosV.': arbeitslos,
    'KrankenV.': kranken,
    'PflegeV.': pflege
  };

  const gesamt = Object.values(abzüge).reduce((a, b) => a + b, 0);
  const netto = brutto - gesamt;
  abzüge['Netto'] = netto;

  ergebnisDiv.innerHTML = `<h2>💰 Netto-Gehalt: <strong>${netto.toFixed(2)} €</strong></h2>`;

  // Chart aktualisieren
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(abzüge),
      datasets: [{
        label: 'Betrag in €',
        data: Object.values(abzüge),
        backgroundColor: Object.keys(abzüge).map(key =>
          key === 'Netto' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(255, 99, 132, 0.6)'
        )
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  btn.disabled = false;
  btn.textContent = "Berechnen";
}

function berechneEinkommensteuer(bruttoMonat, steuerklasse) {
  const bruttoJahr = bruttoMonat * 12;
  let zuVersteuernd = bruttoJahr;
  let faktor = 1;

  // Grundfreibetrag je Steuerklasse (Stand 2024)
  switch (steuerklasse) {
    case "I":
    case "IV":
      zuVersteuernd -= 11604;
      break;
    case "II":
      zuVersteuernd -= 11990;
      break;
    case "III":
      zuVersteuernd -= 2 * 11604;
      faktor = 0.5;
      break;
    case "V":
    case "VI":
      // kein Freibetrag
      break;
  }

  if (zuVersteuernd <= 0) return 0;

  // Einkommensteuer-Berechnung nach §32a EStG (vereinfachte Version)
  let est = 0;
  const z = zuVersteuernd;

  if (z <= 15999) {
    const y = (z - 11604) / 10000;
    est = (979.18 * y + 1400) * y;
  } else if (z <= 62959) {
    const y = (z - 15999) / 10000;
    est = (192.59 * y + 2397) * y + 965.58;
  } else if (z <= 277825) {
    est = 0.42 * z - 9972.98;
  } else {
    est = 0.45 * z - 18307.73;
  }

  return est * faktor / 12; // auf Monat umgerechnet
}
