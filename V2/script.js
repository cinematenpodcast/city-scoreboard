document.addEventListener('DOMContentLoaded', () => {
  loadCities();
  document.getElementById('addCityBtn').addEventListener('click', addCityFromInput);
  document.getElementById('resetAllDrawnBtn').addEventListener('click', resetAllDrawn);
  document.getElementById('resetAllMaxBtn').addEventListener('click', resetAllMaxAmounts);
});

function loadCities() {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  const cityList = document.getElementById('cityList');
  cityList.innerHTML = '';
  cities.forEach(city => {
      cityList.appendChild(createCityElement(city));
  });
}

function addCityFromInput() {
  const cityName = document.getElementById('newCityName').value.trim();
  if (cityName) {
      const city = { name: cityName, count: 0, highestCount: 0 };
      const cities = JSON.parse(localStorage.getItem('cities')) || [];
      cities.push(city);
      localStorage.setItem('cities', JSON.stringify(cities));
      loadCities();
      document.getElementById('newCityName').value = '';
  } else {
      alert("Voer a.u.b. een stadsnaam in.");
  }
}

function createCityElement(city) {
  const div = document.createElement('div');
  div.className = 'city';
  div.innerHTML = `
      <div class="city-instance">
          <span>${city.name}</span>
          <span>[Max Aantal: ${city.highestCount}]</span>
      </div>
      <div>
          <button onclick="decrementCount('${city.name}')">-</button>
          <span id="count-${city.name}">${city.count}</span>
          <button onclick="incrementCount('${city.name}')">+</button>
          <button onclick="resetCount('${city.name}')">Reset Getrokken</button>
          <button onclick="resetHighestCount('${city.name}')">Reset Max Aantal</button>
          <button id="deletebutton" onclick="deleteCity('${city.name.replace("'", "\\'")}')">🗑️</button>
      </div>
  `;
  updateBackgroundColor(div, city);
  return div;
}

function incrementCount(cityName) {
  updateCity(cityName, city => {
      city.count++;
      if (city.count > city.highestCount) {
          city.highestCount = city.count;
      }
  });
}

function decrementCount(cityName) {
  updateCity(cityName, city => {
      if (city.count > 0) city.count--;
  });
}

function resetCount(cityName) {
  updateCity(cityName, city => city.count = 0);
}

function resetHighestCount(cityName) {
  updateCity(cityName, city => city.highestCount = 0);
}

function resetAllDrawn() {
  updateAllCities(city => city.count = 0);
}

function resetAllMaxAmounts() {
  updateAllCities(city => city.highestCount = 0);
}

function deleteCity(cityName) {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  const updatedCities = cities.filter(city => city.name !== cityName);
  localStorage.setItem('cities', JSON.stringify(updatedCities));
  loadCities();
}

function updateCity(cityName, updateFunc) {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  const city = cities.find(city => city.name === cityName);
  if (city) {
      updateFunc(city);
      localStorage.setItem('cities', JSON.stringify(cities));
      loadCities();
  }
}

function updateAllCities(updateFunc) {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  cities.forEach(updateFunc);
  localStorage.setItem('cities', JSON.stringify(cities));
  loadCities();
}

function updateBackgroundColor(element, city) {
  if (city.highestCount > 1 && city.highestCount === city.count) {
      element.style.backgroundColor = "#9aff9f"; // Green when max and count are the same, and more than 1
  } else if (city.highestCount === 0) {
      element.style.backgroundColor = "#f9f9f9"; // White
  } else if (city.highestCount === 1) {
      element.style.backgroundColor = "#ffd669"; // Yellow
  } else if (city.highestCount === 2 || city.highestCount === 3) {
      element.style.backgroundColor = "#ffa340"; // Light Red
  } else if (city.highestCount >= 4) {
      element.style.backgroundColor = "#ff9a9a"; // Red
  }
}
