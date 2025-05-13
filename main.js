// main.js
const form = document.getElementById("gehaltsFormular");
const bruttoInput = document.getElementById("bruttoInput");
const steuerklasseSelect = document.getElementById("steuerklasse");
const kircheCheckbox = document.getElementById("kirche");
const ergebnisDiv = document.getElementById("ergebnis");
const ctx = document.getElementById('chartCanvas').getContext('2d');
const btn = document.getElementById("berechnenBtn");

// Verhindere, dass das Formular die Seite neu lädt
form.addEventListener("submit", function(e) {
  e.preventDefault();
  berechne();
});

async function berechne() {
  // Button-Feedback
  btn.disabled = true;
  btn.textContent = "Berechne...";
  ergebnisDiv.innerHTML = "";

  const brutto = parseFloat(bruttoInput.value);
  const kirche = kircheCheckbox.checked;

  if (isNaN(brutto) || brutto <= 0) {
    ergebnisDiv.innerHTML = `<p style=\"color:red;\">❗ Bitte ein gültiges Brutto-Gehalt (> 0) eingeben.</p>`;
    btn.disabled = false;
    btn.textContent = "Berechnen";
    return;
  }

  // Lohnsteuer-Lookup
  const estTable = {
    12000: 688,
    14000: 300,
    16000: 688,
    18000: 1149,
    20000: 1639,
    32000: 3742,
    48000: 9988,
    52000: 11407,
    56000: 12883,
    60000: 14415,
    65000: 16409,
    70000: 18488,
    75000: 20664,
    80000: 23014,
    90000: 27714,
    100000: 32413,
    120000: 41660,
    140000: 50522,
    160000: 59384,
    180000: 68246,
    200000: 77108,
    240000: 94832,
    280000: 112624,
    300000: 122119,
    350000: 145857,
    400000: 169594
  };

  const keys = Object.keys(estTable).map(Number).sort((a,b) => a - b);
  let einkommensteuer = 0;
  for (const k of keys) {
    if (brutto <= k) { einkommensteuer = estTable[k]; break; }
  }
  if (einkommensteuer === 0) einkommensteuer = estTable[keys[keys.length-1]];

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
  const gesamt = Object.values(abzüge).reduce((a,b) => a + b, 0);
  const netto = brutto - gesamt;
  abzüge['Netto'] = netto;

  // Ergebnis Text
  ergebnisDiv.innerHTML = `<h2>💰 Netto-Gehalt: <strong>${netto.toFixed(2)} €</strong></h2>`;

  // Chart aktualisieren
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(abzüge),
      datasets: [{
        label: 'Betrag in €',
        data: Object.values(abzüge),
        backgroundColor: Object.keys(abzüge).map(key => key === 'Netto' ? 'rgba(54,162,235,0.6)' : 'rgba(255,99,132,0.6)')
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });

  btn.disabled = false;
  btn.textContent = "Berechnen";
}
