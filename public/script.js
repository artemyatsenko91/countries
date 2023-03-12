"use strict";
window.addEventListener('load', function () {
    function getCountries() {
        var body = document.body;
        var input = body.querySelector('#country-search');
        var btnChangeMode = (body.querySelector('#change-theme'));
        var themeIcon = body.querySelector('.icon-mode');
        var themeName = body.querySelector('.theme-text');
        var loadGif = body.querySelector('.load-wrap');
        var dropDownList = (body.querySelector('.filter-by-region'));
        var searchRow = body.querySelector('.search-row');
        var countryData;
        var filterData = [];
        var darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            enabledDarkMode();
            differenceOutput('./img/icons/light-mode.png', 'Light Mode', 'none');
        }
        btnChangeMode.addEventListener('click', function () {
            darkMode = localStorage.getItem('darkMode');
            if (darkMode !== 'enabled') {
                enabledDarkMode();
                differenceOutput('./img/icons/light-mode.png', 'Light Mode', 'none');
            }
            else {
                disabledDarkMode();
                differenceOutput('./img/icons/dark-mode.png', 'Dark Mode', '2px 2px 10px 0 rgba(135, 135, 135, 1)');
            }
        });
        function outBySearch() {
            input.addEventListener('input', function () {
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
            var _a;
            if (!filterData.length) {
                if (!document.querySelector('.error-message')) {
                    outErrorMessage('No matches found');
                }
            }
            else {
                if (document.querySelector('.error-message')) {
                    (_a = document.querySelector('.error-message')) === null || _a === void 0 ? void 0 : _a.remove();
                }
            }
        }
        function searchByLetters(data) {
            filterData = [];
            data.forEach(function (item) {
                if (item.name.common
                    .toLowerCase()
                    .includes(input.value.toLowerCase())) {
                    filterData.push(item);
                }
            });
        }
        function sortData(data) {
            data.sort(function (a, b) {
                var nameA = a.name.common.toLowerCase();
                var nameB = b.name.common.toLowerCase();
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
            localStorage.removeItem('darkMode');
        }
        function outErrorMessage(message) {
            var errorMessageSpan = document.createElement('span');
            errorMessageSpan.innerText = message;
            errorMessageSpan.classList.add('error-message');
            searchRow.insertAdjacentElement('afterend', errorMessageSpan);
        }
        function getData(url) {
            fetch(url)
                .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong.');
            })
                .then(function (data) {
                loadGif.classList.add('hide');
                countryData = data;
                sortData(countryData);
                generateCountryCard(countryData);
                generateByRegion();
                outBySearch();
            })
                .catch(function (err) {
                outErrorMessage(err.message);
                loadGif.classList.add('hide');
            });
        }
        function generateByRegion() {
            dropDownList.addEventListener('change', function () {
                if (dropDownList.value !== 'default' &&
                    dropDownList.value !== 'all') {
                    filterData = countryData.filter(function (item) { var _a; return ((_a = item.region) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == dropDownList.value; });
                    sortData(filterData);
                    generateCountryCard(filterData);
                }
                else if (dropDownList.value === 'all') {
                    sortData(countryData);
                    generateCountryCard(countryData);
                }
                input.value = '';
            });
        }
        function generateCountryCard(data) {
            var contentWrapper = (document.querySelector('.content'));
            var out = '';
            data.forEach(function (item) {
                var _a;
                out += "\n                <div class=\"coutnry-card\">\n                    <div class=\"card-content\">\n                        <img class=\"counry-flag\" src=\"".concat((_a = item.flags) === null || _a === void 0 ? void 0 : _a.png, "\" alt=\"").concat(item.name.common, " flag\">\n                        <div class=\"country-descr\">\n                            <h3 class=\"name-of-country\">").concat(item.name.common, "</h3>\n                            <span class=\"bold\">Population: <span class=\"value population\">").concat(item.population, "</span></span> \n                            <span class=\"bold\">Region: <span class=\"value region\">").concat(item.region, "</span></span> \n                            <span class=\"bold\">Capital: <span class=\"value capital\">").concat(item.capital, "</span></span> \n                        </div>\n                    </div>\n                </div>\n            ");
            });
            contentWrapper.innerHTML = out;
        }
        getData('https://restcountries.com/v3.1/all');
    }
    getCountries();
});
