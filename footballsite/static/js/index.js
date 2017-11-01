var optionalFields = ['numberofgoals', 'halffulltime', 'homeaway'];

function refreshDocument(document, filters) {
    var filterTypeOption = document.getElementById("filtertype");
    var selectedFilterType = filterTypeOption.options[filterTypeOption.selectedIndex].value;

    filters = JSON.parse(filters);
    var selectedFilter = $.grep(filters, function (f) {
        return f.type === selectedFilterType;
    })[0];

    for (var fieldIndex in optionalFields) {
        document.getElementById('div' + optionalFields[fieldIndex]).style.display = 'none';
        document.getElementById(optionalFields[fieldIndex]).disabled = true;
    }

    for (var fieldIndex in selectedFilter.fields) {
        document.getElementById('div' + selectedFilter.fields[fieldIndex]).style.display = 'block';
        document.getElementById(selectedFilter.fields[fieldIndex]).disabled = false;
    }
}
