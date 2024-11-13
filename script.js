// script.js

// Load the list of countries for a specific letter
function loadCountries(letter) {
    const countryList = document.getElementById('country-list');

    fetch(`data/${letter}_countries.json`)
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(country => {
                const countryLink = document.createElement('a');
                countryLink.href = `country.html?country=${encodeURIComponent(country)}&letter=${letter}`;
                countryLink.textContent = country;
                countryLink.className = 'country-link';

                const listItem = document.createElement('div');
                listItem.appendChild(countryLink);

                countryList.appendChild(listItem);
            });
        })
        .catch(error => console.error(`Error loading ${letter} countries:`, error));
}

// Load and display data for a specific country
function loadCountryData(country, letter) {
    const countryTitle = document.getElementById('country-title');
    const stampList = document.getElementById('stamp-list');

    countryTitle.textContent = `${country} Stamp Checklist`;

    fetch(`data/${letter}_countries.json`)
        .then(response => response.json())
        .then(data => {
            const countryData = data[country];
            if (countryData) {
                displayStamps(country, countryData);
            } else {
                stampList.innerHTML = `<p>No data found for ${country}</p>`;
            }
        })
        .catch(error => console.error("Error loading country data:", error));
}

// Display stamps as checkboxes for the selected country
function displayStamps(country, data) {
    const stampList = document.getElementById('stamp-list');
    const savedState = JSON.parse(localStorage.getItem(country)) || {};

    for (const section in data) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        sectionDiv.innerHTML = `<h2>${section}</h2>`;

        data[section].forEach(entry => {
            const yearDiv = document.createElement('div');
            yearDiv.className = 'year';
            yearDiv.innerHTML = `<strong>${entry.year}</strong>`;

            entry.numbers.forEach(number => {
                const stampDiv = document.createElement('div');
                stampDiv.className = 'stamp';
                const isAcquired = savedState[number] || false;
                stampDiv.innerHTML = `
                    <input type="checkbox" ${isAcquired ? 'checked' : ''} data-number="${number}">
                    <label>${number}</label>
                `;

                stampDiv.querySelector('input').addEventListener('change', (e) => {
                    const number = e.target.getAttribute('data-number');
                    updateAcquiredStatus(country, number, e.target.checked);
                });

                yearDiv.appendChild(stampDiv);
            });

            sectionDiv.appendChild(yearDiv);
        });

        stampList.appendChild(sectionDiv);
    }
}

// Update acquired status and save it to localStorage
function updateAcquiredStatus(country, number, isAcquired) {
    const state = JSON.parse(localStorage.getItem(country)) || {};
    if (isAcquired) {
        state[number] = true;
    } else {
        delete state[number];
    }
    localStorage.setItem(country, JSON.stringify(state));
}

// On `country.html`, initialize the page by loading the country data
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const country = params.get('country');
    const letter = params.get('letter');

    if (country && letter) {
        loadCountryData(country, letter);
    }
});
