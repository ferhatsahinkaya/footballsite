function refreshFields() {
    var filterTypeOption = document.getElementById("filtertype");
    var selectedFilterType = filterTypeOption.options[filterTypeOption.selectedIndex].value;

    var filters = JSON.parse("{{ filters | safe | escapejs }}".replace(/'/g, '\"'));
    var selectedFilter = $.grep(filters, function(f){ return f.type == selectedFilterType; })[0];

    var allFields = ['numberofgoals', 'halffulltime', 'homeaway'];
    for(var fieldIndex in allFields) {
        document.getElementById('div' + allFields[fieldIndex]).style.display = 'none';
        document.getElementById(allFields[fieldIndex]).disabled = true;
    }    
    
    for(var fieldIndex in selectedFilter.fields) {
	document.getElementById('div' + selectedFilter.fields[fieldIndex]).style.display = 'block';
	document.getElementById(selectedFilter.fields[fieldIndex]).disabled = false;
    }
}
