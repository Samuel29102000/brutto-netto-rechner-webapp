<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Brutto-Netto-Rechner</title>

  <!-- Google Font -->
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Stylesheet -->
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <h1><i class="fas fa-calculator"></i> Brutto-Netto-Rechner</h1>

    <form id="gehaltsFormular">
      <label for="bruttoInput">Bruttogehalt (€):</label>
      <input type="number" id="bruttoInput" name="brutto" required />

      <label for="steuerklasse">Steuerklasse:</label>
      <select id="steuerklasse" name="steuerklasse">
        <option value="1">I</option>
        <option value="2">II</option>
        <option value="3">III</option>
        <option value="4">IV</option>
        <option value="5">V</option>
        <option value="6">VI</option>
      </select>

      <label class="checkbox-label" for="kirche">
        <input type="checkbox" id="kirche" name="kirchensteuer" />
        Kirchensteuer
      </label>

      <button type="submit" id="berechnenBtn">
        <i class="fas fa-equals"></i> Berechnen
      </button>
    </form>

    <div id="ergebnis"></div>
    <canvas id="chartCanvas" style="max-width:100%; height:300px;"></canvas>
  </div>

  <script>
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

      // Lohnsteuer-Lookup anhand aktueller Zahlen
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
      // Verwende nächstkleineren oder exakten Wert
      const bruttoKey = Object.keys(estTable).map(Number)
        .filter(key => brutto <= key)
        .sort((a,b) => a-b)[0] || Math.max(...Object.keys(estTable).map(Number));
      const einkommensteuer = estTable[bruttoKey] || 0;

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

      ergebnisDiv.innerHTML = `
        <h2>💰 Netto-Gehalt: <strong>${netto.toFixed(2)} €</strong></h2>
      `;

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
  </script>
</body>
</html>
