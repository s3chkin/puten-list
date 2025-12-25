function calculate() {
  // 1. Вземане на входните данни
  const odoStart = parseFloat(document.getElementById("odo-start").value) || 0;
  const odoEnd = parseFloat(document.getElementById("odo-end").value) || 0;
  
  const fuelInit = parseFloat(document.getElementById("fuel-init").value) || 0;
  const fuelAdded1 = parseFloat(document.getElementById("fuel-added-1").value) || 0;
  const fuelAdded2 = parseFloat(document.getElementById("fuel-added-2").value) || 0;
  const fuelRemainder = parseFloat(document.getElementById("fuel-remainder-input").value) || 0;

  // 2. Изчисления за разстояние
  const distance = Math.max(0, odoEnd - odoStart);
  
  // 3. Маршрути (Делене на 2)
  const route1 = Math.floor(distance / 2);
  const route2 = distance - route1;

  // 4. Нормативен разход (Разход)
  // Твърда норма 11/100 + 3л за моточас (винаги 3л според указанията)
  const kmPart = Math.round((distance / 100) * 11);
  const motoPart = 3; // ВИНАГИ 3л за работа
  const normExpenditure = kmPart + motoPart;

  // 5. Количества гориво
  const physicalFuel = fuelInit + fuelAdded1 + fuelAdded2; // Реално налично

  // 6. Икономия (Автоматично изчисляване)
  // Икономия = Нормативен разход - Реален разход
  // Реален разход = Налично - Остатък
  let economy = 0;
  if (document.getElementById("fuel-remainder-input").value !== "") {
    const realExpenditure = physicalFuel - fuelRemainder;
    economy = normExpenditure - realExpenditure;
  }

  // 7. Отчетно количество (това, което е в скобите)
  const accountingFuel = physicalFuel + economy;

  // 8. Показване на резултатите в UI
  document.getElementById("res-distance").textContent = distance;
  document.getElementById("res-route-1").textContent = route1;
  document.getElementById("res-route-2").textContent = route2;
  
  document.getElementById("res-total-label").textContent = `${physicalFuel} (${accountingFuel})`;
  
  document.getElementById("res-expenditure-detail").textContent = `${kmPart} (км) + ${motoPart} (мото)`;
  document.getElementById("res-expenditure").textContent = `${normExpenditure} л.`;
  
  document.getElementById("res-economy").textContent = `${economy} л.`;
}

function clearForm() {
  if (confirm("Сигурни ли сте, че искате да изчистите всичко?")) {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = "");
    calculate();
  }
}

function saveData() {
  const formData = {};
  document.querySelectorAll('input').forEach(input => {
    formData[input.id] = input.value;
  });
  localStorage.setItem('putenListV3', JSON.stringify(formData));
  alert('Данните са запазени!');
}

function loadData() {
  const data = localStorage.getItem('putenListV3');
  if (data) {
    const formData = JSON.parse(data);
    Object.keys(formData).forEach(id => {
      const input = document.getElementById(id);
      if (input) input.value = formData[id];
    });
    calculate();
  }
}

// Зареждане при старт
window.onload = loadData;
