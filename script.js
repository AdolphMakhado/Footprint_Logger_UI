const activityForm = document.getElementById('activity-form');
const activitySelect = document.getElementById('activity-select');
const activityList = document.getElementById('activity-list');
const totalEmissions = document.getElementById('total-emissions');
const categoryFilter = document.getElementById('category-filter');
const chartCanvas = document.getElementById('summary-chart');
const clearButton = document.getElementById('clear-data');
const customAmount = document.getElementById('custom-amount');

const activitiesData = {
  car_km: { name: "Car Travel", category: "transport", emission: 1.87},
  meat_meal: { name: "Meat-based Meal", category: "food", emission: 0.5 },
  electricity_kwh: { name: "Electricity Use", category: "energy", emission: 3.5 },
};

let activities = JSON.parse(localStorage.getItem("activities")) || [];

function updateList() {
  const selectedCategory = categoryFilter.value;
  activityList.innerHTML = "";
  let total = 0;
  let chartData = {};

  activities.forEach((item, index) => {
    if (selectedCategory === "all" || item.category === selectedCategory) {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.amount} unit(s) - ${item.emission.toFixed(2)} kg CO₂`;
      activityList.appendChild(li);
    }
    total += item.emission;
    chartData[item.category] = (chartData[item.category] || 0) + item.emission;
  });

  totalEmissions.textContent = total.toFixed(2);
  updateChart(chartData);
}

function addActivity(e) {
  e.preventDefault();
  const key = activitySelect.value;
  if (!key) return;

  const quantity = parseFloat(customAmount.value) || 1;
  const activity = activitiesData[key];
  const emission = activity.emission * quantity;

  activities.push({
    name: activity.name,
    category: activity.category,
    amount: quantity,
    emission: emission,
  });

  localStorage.setItem("activities", JSON.stringify(activities));
  activityForm.reset();
  updateList();
}

function clearAllData() {
  activities = [];
  localStorage.removeItem("activities");
  updateList();
}

categoryFilter.addEventListener("change", updateList);
activityForm.addEventListener("submit", addActivity);
clearButton.addEventListener("click", clearAllData);

let chart;
function updateChart(data) {
  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: 'CO₂ Emissions by Category',
        data: Object.values(data),
        backgroundColor: ['#323332', '#f5d769', '#de0b20'],
      }],
    },
  });
}

updateList();
