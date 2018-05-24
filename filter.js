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

function updateData(casData) {
	var company = document.getElementById("company").value,
		levels = document.getElementById("levels").value

		if (Number.isInteger(levels) !== true){
			levels = 1
		}

	var result = [];
	var findParents = new Array();
	var findChildren = new Array();
	//Replicate the parent OR child parameterized filter in VA
	// for (p = 0; p < casData.data.length; p++) {
 //        if (String(casData.data[p][1]).toUpperCase().includes(company).toUpperCase()) {
 //            result.push({
 //                row: p
 //            });
 //        }
 //        if (String(casData.data[p][5]).toUpperCase().includes(company).toUpperCase()) {
 //            result.push({
 //                row: p
 //            });
 //        }
 //    };
 	// for (p = 0; p < casData.data.length; p++) { // push everything
  //           result.push({
  //               row: p 
  //           })
  //   }
    
    result.push({
    	row: 2 // simulate filter result only containing 3rd row
    })
    console.log('--- filter debugging begins ---\n')
    console.log(String(casData.data[0][0]))
    console.log(String(casData.data[0][1]))
    console.log(String(casData.data[0][2]))
    console.log(String(casData.data[0][3]))

    console.log(String(casData.data[1][0]))
    console.log(String(casData.data[1][1]))
    console.log(String(casData.data[1][2]))
    console.log(String(casData.data[1][3]))

    console.log(String(casData.data[2][0]))
    console.log(String(casData.data[2][1]))
    console.log(String(casData.data[2][2]))
    console.log(String(casData.data[2][3]))
    console.log('--- filter debugging ends ---\n')

    self.resultName = casData.resultName;
    var message = {
        selections: result,
        resultName: self.resultName
    };

    var url = (window.location != window.parent.location) ?
        document.referrer :
        document.location.href;

    window.parent.postMessage(message, url);
}