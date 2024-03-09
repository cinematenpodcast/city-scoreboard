document.addEventListener('DOMContentLoaded', loadCities);

function loadCities() {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    const cityList = document.getElementById('cityList');
    cityList.innerHTML = '';
    cities.forEach(city => {
        cityList.appendChild(createCityElement(city));
    });
}

function addCity() {
    const cityName = prompt("Enter city name:");
    if (!cityName) return;
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
        <span>[${city.highestCount}] ${city.name}</span>
        <button onclick="incrementCount('${city.name}')">+</button>
        <span>${city.count}</span>
        <button onclick="decrementCount('${city.name}')">-</button>
        <button onclick="resetCount('${city.name}')">Reset Count</button>
        <button onclick="resetHighestCount('${city.name}')">Reset Highest</button>
        <button onclick="deleteCity('${city.name}')">Delete</button>
    `;
    return div;
}

function findCityIndex(cities, cityName) {
    return cities.findIndex(city => city.name === cityName);
}

function incrementCount(cityName) {
    updateCity(cityName, (city) => {
        city.count++;
        city.highestCount = Math.max(city.count, city.highestCount);
    });
}

function decrementCount(cityName) {
    updateCity(cityName, (city) => {
        city.count--;
    });
}

function resetCount(cityName) {
    updateCity(cityName, (city) => {
        city.count = 0;
    });
}

function resetHighestCount(cityName) {
    updateCity(cityName, (city) => {
        city.highestCount = city.count;
    });
}

function deleteCity(cityName) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities = cities.filter(city => city.name !== cityName);
    localStorage.setItem('cities', JSON.stringify(cities));
    loadCities();
}

function updateCity(cityName, updateFunc) {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    const index = findCityIndex(cities, cityName);
    if (index > -1) {
        updateFunc(cities[index]);
        localStorage.setItem('cities', JSON.stringify(cities));
        loadCities();
    }
}
