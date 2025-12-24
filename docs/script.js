// Calculate distance traveled
function calculateDistance() {
  const start =
    parseFloat(document.getElementById("odometer-start").value) || 0;
  const end = parseFloat(document.getElementById("odometer-end").value) || 0;
  const distance = end - start;

  const distanceInput = document.getElementById("distance-traveled");
  if (distanceInput) {
    distanceInput.value = distance > 0 ? Math.round(distance) : "";
  }

  // Auto-calculate routes from distance
  updateRoutesFromDistance();

  // Recalculate fuel if distance changes
  calculateFuel();
}

// Calculate route total kilometers
function calculateRouteTotal() {
  const km1 = parseFloat(document.getElementById("route-km1")?.value) || 0;
  const km2 = parseFloat(document.getElementById("route-km2")?.value) || 0;
  const total = km1 + km2;

  const routeTotal = document.getElementById("route-total");
  if (routeTotal) {
    routeTotal.value = total > 0 ? Math.round(total) : "";
  }

  // Recalculate fuel
  calculateFuel();
}

// Auto-calculate route 1 and 2 from total distance (split by 2)
function updateRoutesFromDistance() {
  const distance =
    parseFloat(document.getElementById("distance-traveled")?.value) || 0;

  const r1 = document.getElementById("route-km1");
  const r2 = document.getElementById("route-km2");
  const rt = document.getElementById("route-total");

  if (!r1 || !r2 || !rt) return;

  if (distance > 0) {
    // Keep integers and preserve sum even for odd distances
    const half1 = Math.floor(distance / 2);
    const half2 = distance - half1;
    r1.value = String(half1);
    r2.value = String(half2);
    rt.value = String(distance);
  } else {
    r1.value = "";
    r2.value = "";
    rt.value = "";
  }
}

// Calculate fuel consumption
function calculateFuel() {
  const available =
    parseFloat(document.getElementById("fuel-available").value) || 0;
  const filled1 =
    parseFloat(document.getElementById("fuel-filled1").value) || 0;
  const filled2 =
    parseFloat(document.getElementById("fuel-filled2").value) || 0;

  const totalFilled = filled1 + filled2;
  const quantity = available + totalFilled;

  // Get distance from front page or route total
  const distance =
    parseFloat(document.getElementById("distance-traveled").value) ||
    parseFloat(document.getElementById("route-total").value) ||
    0;

  const quantityInput = document.getElementById("fuel-quantity");
  const remainderInput = document.getElementById("fuel-remainder");

  if (quantityInput) {
    quantityInput.value =
      quantity > 0 ? (Math.round(quantity * 10) / 10).toFixed(1) : "";
  }

  // Calculate economy based on actual remainder (manually entered)
  calculateEconomy();
}

// Calculate economy from actual remainder
function calculateEconomy() {
  const quantityInput = document.getElementById("fuel-quantity");
  const remainderInput = document.getElementById("fuel-remainder");
  const economyInput = document.getElementById("fuel-economy");
  const expectedConsumptionInput = document.getElementById(
    "fuel-expected-consumption"
  );
  const actualConsumptionInput = document.getElementById("fuel-actual-consumption");
  const rateInput = document.getElementById("fuel-consumption-rate");
  const motoHoursInput = document.getElementById("moto-hours");

  const quantity = parseFloat(quantityInput?.value) || 0;
  const remainder = parseFloat(remainderInput?.value) || 0;

  // Get distance from front page or route total
  const distance =
    parseFloat(document.getElementById("distance-traveled").value) ||
    parseFloat(document.getElementById("route-total").value) ||
    0;

  // Норма (л/100км) — по подразбиране 11
  const ratePer100km = parseFloat(rateInput?.value) || 11;
  // Моточасове — по подразбиране 0
  const motoHours = parseFloat(motoHoursInput?.value) || 0;
  // 1 моточас = 3л
  const motoConsumption = motoHours * 3;

  // Очакван разход = (км/100 * норма) + (моточасове * 3л)
  const expectedConsumption = (distance / 100) * ratePer100km + motoConsumption;
  if (expectedConsumptionInput) {
    expectedConsumptionInput.value =
      expectedConsumption > 0 ? (Math.round(expectedConsumption * 10) / 10).toFixed(1) : "";
  }

  // Реален разход = Количество - Остатък (реално измерен) — само ако е въведен остатък
  const hasRemainder = remainderInput && remainderInput.value !== "";
  if (hasRemainder && quantity > 0) {
    const actualConsumption = quantity - remainder;
    if (actualConsumptionInput) {
      actualConsumptionInput.value = (Math.round(actualConsumption * 10) / 10).toFixed(1);
    }

    // Икономия = Очакван разход - Реален разход (може да е отрицателна)
    const economyValue = expectedConsumption - actualConsumption;
    if (economyInput) {
      economyInput.value = (Math.round(economyValue * 10) / 10).toFixed(1);
    }
  } else {
    if (actualConsumptionInput) {
      actualConsumptionInput.value = "";
    }
    if (economyInput) {
      economyInput.value = "";
    }
  }
}

// Clear all form fields
function clearForm() {
  if (confirm("Сигурни ли сте, че искате да изчистите всички данни?")) {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach((input) => {
      input.value = "";
    });
  }
}

// Save data to localStorage
function saveData() {
  const formData = {};
  const inputs = document.querySelectorAll('input[type="number"]');

  inputs.forEach((input) => {
    if (input.id) {
      formData[input.id] = input.value;
    }
  });

  localStorage.setItem("putenListData", JSON.stringify(formData));
  alert("Данните са запазени успешно!");
}

// Load data from localStorage
function loadData() {
  const savedData = localStorage.getItem("putenListData");
  if (savedData) {
    const formData = JSON.parse(savedData);
    Object.keys(formData).forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.value = formData[id];
      }
    });

    // Recalculate all fields
    calculateDistance();
    updateRoutesFromDistance();
    calculateFuel();
  }
}

// Auto-load saved data on page load
document.addEventListener("DOMContentLoaded", function () {
  loadData();
});
