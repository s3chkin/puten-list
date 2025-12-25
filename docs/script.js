const FUEL_NORM_L_PER_100KM = 11;
const OIL_NORM_L_PER_MOTO_HOUR = 3;

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

  recalculateAll();
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
  // Sync odometer values for the fuel section
  const odometerStart = parseFloat(document.getElementById("odometer-start")?.value) || 0;
  const odometerEnd = parseFloat(document.getElementById("odometer-end")?.value) || 0;
  const distanceKm = Math.max(0, odometerEnd - odometerStart);

  const fuelOdoStart = document.getElementById("fuel-odometer-start");
  const fuelOdoEnd = document.getElementById("fuel-odometer-end");
  const fuelDistance = document.getElementById("fuel-distance-km");
  if (fuelOdoStart) fuelOdoStart.value = odometerStart ? String(odometerStart) : "";
  if (fuelOdoEnd) fuelOdoEnd.value = odometerEnd ? String(odometerEnd) : "";
  if (fuelDistance) fuelDistance.value = distanceKm ? String(Math.round(distanceKm)) : "";

  // Fuel used: (km/100)*11
  const fuelUsed = (distanceKm / 100) * FUEL_NORM_L_PER_100KM;
  const fuelUsedInput = document.getElementById("fuel-used-liters");
  if (fuelUsedInput) {
    fuelUsedInput.value = distanceKm ? (Math.round(fuelUsed * 10) / 10).toFixed(1) : "";
  }

  // End availability: prev remainder + refueled - fuel used
  const prevRemainder = parseFloat(document.getElementById("fuel-prev-remainder")?.value) || 0;
  const refueled = parseFloat(document.getElementById("fuel-refueled")?.value) || 0;
  const endAvailability = prevRemainder + refueled - fuelUsed;

  const endAvailabilityInput = document.getElementById("fuel-end-availability");
  const fuelError = document.getElementById("fuel-error");

  if (endAvailabilityInput) {
    if (distanceKm > 0 || prevRemainder > 0 || refueled > 0) {
      if (endAvailability < 0) {
        endAvailabilityInput.value = "";
        endAvailabilityInput.classList.remove("border-blue-600", "bg-blue-50");
        endAvailabilityInput.classList.add("border-red-600", "bg-red-50");
        if (fuelError) fuelError.classList.remove("hidden");
      } else {
        endAvailabilityInput.value = (Math.round(endAvailability * 10) / 10).toFixed(1);
        endAvailabilityInput.classList.remove("border-red-600", "bg-red-50");
        endAvailabilityInput.classList.add("border-blue-600", "bg-blue-50");
        if (fuelError) fuelError.classList.add("hidden");
      }
    } else {
      endAvailabilityInput.value = "";
      endAvailabilityInput.classList.remove("border-red-600", "bg-red-50");
      endAvailabilityInput.classList.add("border-blue-600", "bg-blue-50");
      if (fuelError) fuelError.classList.add("hidden");
    }
  }
}

function calculateOil() {
  const start = parseFloat(document.getElementById("moto-hour-start")?.value) || 0;
  const end = parseFloat(document.getElementById("moto-hour-end")?.value) || 0;
  const motoHours = end - start;

  const motoHoursUsedInput = document.getElementById("moto-hours-used");
  const oilUsedInput = document.getElementById("oil-used-liters");

  if (motoHoursUsedInput) {
    motoHoursUsedInput.value = motoHours > 0 ? (Math.round(motoHours * 10) / 10).toFixed(1) : "";
  }

  const oilUsed = Math.max(0, motoHours) * OIL_NORM_L_PER_MOTO_HOUR;
  if (oilUsedInput) {
    oilUsedInput.value = motoHours > 0 ? (Math.round(oilUsed * 10) / 10).toFixed(1) : "";
  }
}

function recalculateAll() {
  calculateFuel();
  calculateOil();
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
    recalculateAll();
  }
}

// Auto-load saved data on page load
document.addEventListener("DOMContentLoaded", function () {
  loadData();
});
