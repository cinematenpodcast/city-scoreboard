// Wait for the DOM content to be loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
  // Call the function to load cities when the DOM content is loaded
  loadCities();

  // Add event listener to the "Add City" button
  document.getElementById('addCityBtn').addEventListener('click', addCityFromInput);

  // Add event listener to the "Reset All Drawn" button
  document.getElementById('resetAllDrawnBtn').addEventListener('click', () => {
    // Reset all drawn counts and show city select popup
    resetAllDrawn();
    showCitySelectPopup();
  });

  // Add event listener to the "Reset All Max" button
  document.getElementById('resetAllMaxBtn').addEventListener('click', resetAllMaxAmounts);

  // Add event listener to each confirmation button
  const confirmButtons = document.querySelectorAll('.confirm-btn');
  let confirmCount = 0;

  confirmButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.disabled = true;
      confirmCount++;
      // Hide warning popup when the confirm count reaches 3
      if (confirmCount === 3) {
        //document.getElementById('warningPopup').style.display = 'none';
      }
    });
  });
});

// Function to load cities from local storage
function loadCities() {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  const cityList = document.getElementById('cityList');
  cityList.innerHTML = '';
  cities.forEach(city => {
    cityList.appendChild(createCityElement(city));
  });
}

// Function to add a new city from input
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
    alert("Please enter a city name.");
  }
}

// Function to create HTML element for a city
function createCityElement(city) {
  const div = document.createElement('div');
  div.className = 'city';
  div.innerHTML = `
      <div class="city-instance">
          <span>${city.name}</span>
          <span>[Max: ${city.highestCount}]</span>
      </div>
      <div class="buttondiv">
          <button onclick="decrementCount('${city.name}')">-</button>
          <span class="count-number" id="count-${city.name}">${city.count}</span>
          <button onclick="incrementCount('${city.name}')">+</button>
          <button onclick="resetCount('${city.name}')">⟲ Drawn</button>
          <button onclick="resetHighestCount('${city.name}')">⟲ Max</button>
          <button onclick="deleteCity('${city.name.replace("'", "\\'")}')">🗑️</button>
      </div>
  `;
  updateBackgroundColor(div, city);
  return div;
}

// Function to show city selection popup
function showCitySelectPopup() {
  const citySelectPopup = document.getElementById('citySelectPopup');
  const cityButtonsContainer = document.getElementById('cityButtonsContainer');
  cityButtonsContainer.innerHTML = '';
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  cities.forEach(city => {
    const button = document.createElement('button');
    button.textContent = city.name;
    button.addEventListener('click', () => incrementMaxCounterAndHidePopup(city.name));
    cityButtonsContainer.appendChild(button);
  });
  citySelectPopup.style.display = 'flex';
}

// Function to increment max count for a city and hide popup
function incrementMaxCounterAndHidePopup(cityName) {
  updateCity(cityName, city => {
    city.highestCount++;
  });
  document.getElementById('citySelectPopup').style.display = 'none';
}

// Function to increment count for a city
function incrementCount(cityName) {
  updateCity(cityName, city => {
    city.count++;
    if (city.count > city.highestCount) {
      city.highestCount = city.count;
    }
  });
}

// Function to decrement count for a city
function decrementCount(cityName) {
  updateCity(cityName, city => {
    if (city.count > 0) city.count--;
  });
}

// Function to reset count for a city
function resetCount(cityName) {
  updateCity(cityName, city => city.count = 0);
}

// Function to reset highest count for a city
function resetHighestCount(cityName) {
  updateCity(cityName, city => city.highestCount = 0);
}

// Function to reset all drawn counts for all cities
function resetAllDrawn() {
  updateAllCities(city => city.count = 0);
}

// Function to reset all max counts and drawn counts for all cities
function resetAllMaxAmounts() {
  updateAllCities(city => {
    city.highestCount = 0;
    city.count = 0;
  });
}

// Function to delete a city
function deleteCity(cityName) {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  const updatedCities = cities.filter(city => city.name !== cityName);
  localStorage.setItem('cities', JSON.stringify(updatedCities));
  loadCities();
}

// Function to update city data in local storage
function updateCity(cityName, updateFunc) {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  const city = cities.find(city => city.name === cityName);
  if (city) {
      updateFunc(city);
      localStorage.setItem('cities', JSON.stringify(cities));
      loadCities();
  }
}

// Function to update all cities data in local storage
function updateAllCities(updateFunc) {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  cities.forEach(updateFunc);
  localStorage.setItem('cities', JSON.stringify(cities));
  loadCities();
}

// Function to update background color based on count and highest count
function updateBackgroundColor(element, city) {
  let color;
  if (city.count === 0 && city.highestCount === 0) {
    color = "#fceaab"; // Specific color when both count and highestCount are 0
  } else {
    const ratio = city.highestCount > 0 ? city.count / city.highestCount : 0;
    if (ratio === 1) {
      color = "#9aff9f"; // Green
    } else if (ratio >= 0.75) {
      color = "#ffd669"; // Yellow
    } else if (ratio >= 0.5) {
      color = "#ffa340"; // Orange
    } else {
      color = "#ff9a9a"; // Red
    }
  }
  element.style.backgroundColor = color;
}

// Commented out the block that hides the warning popup
/*document.addEventListener('DOMContentLoaded', () => {
  const confirmButtons = document.querySelectorAll('.confirm-btn');
  let confirmCount = 0;

  confirmButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.disabled = true;
      confirmCount++;
      if (confirmCount === 3) {
        document.getElementById('warningPopup').style.display = 'none';
      }
    });
  });
});*/
