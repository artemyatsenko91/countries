window.addEventListener("load", () => {
    function getCountries() {
        const body = document.body;
        const input = body.querySelector('#country-search');
        const btnChangeMode = body.querySelector('#change-theme');
        const themeIcon = body.querySelector('.icon-mode');
        const themeName = body.querySelector('.theme-text');
        const loadGif = body.querySelector('.load-wrap');
        const dropDownList = body.querySelector('.filter-by-region');
        const searchRow = body.querySelector('.search-row');

        let countryData;
        let filterData = [];
        let darkMode = localStorage.getItem('darkMode');

        if (darkMode === 'enabled') {
            enabledDarkMode();
            differenceOutput('./img/icons/light-mode.png', 'Light Mode', 'none');
        }

        btnChangeMode.addEventListener('click', () => {
            darkMode = localStorage.getItem('darkMode');
            if (darkMode !== 'enabled') {
                enabledDarkMode();
                differenceOutput('./img/icons/light-mode.png', 'Light Mode', 'none');
            } else {
                disabledDarkMode();
                differenceOutput('./img/icons/dark-mode.png', 'Dark Mode', '2px 2px 10px 0 rgba(135, 135, 135, 1)');
            }
        });

        function outBySearch() {
            input.addEventListener('input', () => {
                searchByLetters(countryData);
                generateCountryCard(filterData);
                matchesFound();
                dropDownList.value = 'default';

                if (input.value === '') {
                    generateCountryCard(countryData);
                }
            });
        }

        function matchesFound() {
            if (!filterData.length) {
                if (!document.querySelector('.error-message')) {
                    outErrorMessage('No matches found');
                }
            } else {
                if (document.querySelector('.error-message')) {
                    document.querySelector('.error-message').remove();
                }
            }
        }

        function searchByLetters(data) {
            filterData = [];
            data.forEach(item => {
                if (item.name.common.toLowerCase().includes(input.value.toLowerCase())) {
                    filterData.push(item);
                }
            });
        }

        function sortData(data) {
            data.sort(function (a, b) {
                const nameA = a.name.common.toLowerCase();
                const nameB = b.name.common.toLowerCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        }

        function differenceOutput(src, alt, boxShadow) {
            themeIcon.src = src;
            themeIcon.alt = alt;
            themeName.innerText = alt;
            input.style.boxShadow = boxShadow;
            dropDownList.style.boxShadow = boxShadow;
        }

        function enabledDarkMode() {
            body.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        }

        function disabledDarkMode() {
            body.classList.remove('dark');
            localStorage.removeItem('darkMode', null);
        }

        function outErrorMessage(message) {
            const errorMessageSpan = document.createElement('span');
            errorMessageSpan.innerText = message;
            errorMessageSpan.classList.add('error-message');
            searchRow.insertAdjacentElement('afterend', errorMessageSpan);
        }

        function getData(url) {
            fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Something went wrong.');
                })
                .then(data => {
                    loadGif.classList.add('hide');
                    countryData = data;
                    sortData(countryData);
                    generateCountryCard(countryData);
                    generateByRegion();
                    outBySearch();
                })
                .catch(err => {
                    outErrorMessage(err.message);
                    loadGif.classList.add('hide');
                });
        }

        function generateByRegion() {
            dropDownList.addEventListener('change', () => {

                if (dropDownList.value !== 'default' && dropDownList.value !== 'all') {
                    filterData = countryData.filter(item => item.region.toLowerCase() == dropDownList.value);
                    sortData(filterData);
                    generateCountryCard(filterData);
                } else if (dropDownList.value === 'all') {
                    sortData(countryData);
                    generateCountryCard(countryData);
                }

                input.value = '';
            });
        }

        function generateCountryCard(data) {
            const contentWrapper = document.querySelector('.content');

            let out = '';

            data.forEach(item => {
                out += `
                <div class="coutnry-card">
                    <div class="card-content">
                        <img class="counry-flag" src="${item.flags.png}" alt="${item.name.common} flag">
                        <div class="country-descr">
                            <h3 class="name-of-country">${item.name.common}</h3>
                            <span class="bold">Population: <span class="value population">${item.population}</span></span> 
                            <span class="bold">Region: <span class="value region">${item.region}</span></span> 
                            <span class="bold">Capital: <span class="value capital">${item.capital}</span></span> 
                        </div>
                    </div>
                </div>
            `;
            });

            contentWrapper.innerHTML = out;
        }

        getData('https://restcountries.com/v3.1/all');

    }

    getCountries();
});