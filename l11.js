var countries = [];

function sortCountries(countries, sortName) {
    return countries.sort((country, nextCountry) => {

        let value = country[sortName];
        let nextValue = nextCountry[sortName];
        if (sortName === "name") {
            return ((value < nextValue) ? -1 : ((value > nextValue) ? 1 : 0));
        } else {
            return ((value < nextValue) ? 1 : ((value > nextValue) ? -1 : 0));
        }

    });
}

function observeTable() {
    $('th.sortable').on('click', (e) => {

        let sortableTh = $(e.target).attr('data-sort');
        $('#tags').val('');

        if ($(e.target).hasClass('active-sort')) {
            buildTable(sortCountries(countries, sortableTh).reverse());
            $(`th[data-sort=${sortableTh}]`).addClass('active-sort-reverse');
            return;
        }

        buildTable(sortCountries(countries, sortableTh));
        $(`th[data-sort=${sortableTh}]`).addClass('active-sort');
    });
}

function initAutocomplete(countriesNames) {
    $("#tags").autocomplete({
        source: countriesNames,
        select: function (event, ui) {
            buildTable(countries, ui.item.value);
        }
    });
}

function buildTable(countries, newValue) {
    let htmlCode = '<table class="table"><thead><tr><th>#</th><th class="sortable" data-sort="name">название страны</th><th>столица</th><th class="sortable" data-sort="population">населениe</th><th class="sortable" data-sort="area">площадь</th><th>валюты</th><th>языки</th><th>флаг</th><th>граничит с</th></tr></thead>';
    for (let index in countries) {
        let element = countries[index];
        if (newValue && element.name !== newValue) {
            continue;
        }
        htmlCode += `<tr><td>${+index + 1}</td><td>${element.name}</td><td>${element.capital}</td><td>${element.population}</td><td>${element.area}</td><td>`;
        let currencies = element.currencies.map((item) => {
            return item.name;
        });
        htmlCode += `${currencies.join(', ')}</td><td>`;

        let languages = element.languages.map((item) => {
            return item.name;
        });
        htmlCode += `${languages.join(', ')}</td><td><img src="${element.flag}"></td><td>`;
        let borderNames = [];
        for (let borderItem of element.borders) {
            for (let searchArray in countries) {
                if (countries[searchArray].alpha3Code === borderItem) {
                    borderNames.push(countries[searchArray].name);
                }
            }
        }

        htmlCode += `${borderNames.join(', ')}</td></tr>`;
    }
    htmlCode += '</table>';


    let countriesNames = countries.map((el) => {
        return el.name;
    });

    $('.htmlTable').html(htmlCode);



    if (!newValue) {
        initAutocomplete(countriesNames);
        observeTable();
    }

}

$(document).ready(() => {
    $('.ui-widget').hide();

    $('.btn').click(() => {
        $.ajax({
            url: "https://restcountries.eu/rest/v2/all"
        }).done((data) => {
            $('.ui-widget').show();
            $('.btn').hide();
            countries = data;
            buildTable(data);
        });
    });

});