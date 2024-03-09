document.addEventListener('DOMContentLoaded', () => {
    loadCities();
    document.getElementById('addCityBtn').addEventListener('click', addCityFromInput);
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
      addCity(cityName);
      document.getElementById('newCityName').value = ''; // Clear input field after adding
    } else {
      alert("Please enter a city name."); // Ensure user provides a city name
    }
  }
  
  function addCity(cityName) {
    const city = { name: cityName, count: 0, highestCount: 0 };
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
    loadCities();
  }
  
  function createCityElement(city) {
    const div = document.createElement('div');
    div.className = 'city';
    div.innerHTML = `
      <div>
          <span>${city.name}</span>
          <span>[Highest: ${city.highestCount}]</span>
      </div>
      <div>
          <button onclick="incrementCount('${city.name}')">+</button>
          <span id="count-${city.name}">${city.count}</span>
          <button onclick="decrementCount('${city.name}')">-</button>
          <button onclick="resetCount('${city.name}')">Reset Count</button>
          <button onclick="resetHighestCount('${city.name}')">Reset Highest</button>
          <button onclick="deleteCity('${city.name.replace("'", "\\'")}')">Delete</button>
      </div>
    `;
    return div;
  }
  
  function incrementCount(cityName) {
    updateCity(cityName, city => {
      city.count++;
      city.highestCount = Math.max(city.count, city.highestCount);
    });
  }
  
  function decrementCount(cityName) {
    updateCity(cityName, city => city.count > 0 ? city.count-- : 0);
  }
  
  function resetCount(cityName) {
    updateCity(cityName, city => city.count = 0);
  }
  
  function resetHighestCount(cityName) {
    updateCity(cityName, city => city.highestCount = city.count);
  }
  
  function deleteCity(cityName) {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    const updatedCities = cities.filter(city => city.name !== cityName);
    localStorage.setItem('cities', JSON.stringify(updatedCities));
    loadCities();
  }
  
  function updateCity(cityName, updateFunc) {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    const index = cities.findIndex(city => city.name === cityName);
    if (index > -1) {
      updateFunc(cities[index]);
      localStorage.setItem('cities', JSON.stringify(cities));
      loadCities();
    }
  }
  