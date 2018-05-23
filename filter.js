// Create event listener which takes data from VA
function onMessage(evt) {
    if (evt && evt.data && evt.data.hasOwnProperty("data"))
        updateData(evt.data);
}

if (window.addEventListener) {
    // For standards-compliant web browsers 
    window.addEventListener("message", onMessage, false);
} else {
    // For Internet Explorer 8 and earlier versions
    window.attachEvent("onmessage", onMessage);
}

function updateData(chartData) {
	var company = document.getElementById("company").value,
		levels = document.getElementById("levels").value

	var temp = [];
    // for (p = 0; p < chartData.data.length; p++) {
    //     if (chartData.data[p][0] == legendOptions[x]) {
    //         temp.push({
    //             row: p
    //         });
    //     }
    // };
    temp.push({
    	row: 2 // simulate filter result only containing 3rd row
    })

    self.resultName = chartData.resultName;
    var message = {
        selections: temp,
        resultName: self.resultName
    };

    var url = (window.location != window.parent.location) ?
        document.referrer :
        document.location.href;

    window.parent.postMessage(message, url);
}