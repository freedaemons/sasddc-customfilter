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
    //casData.data contains rows of data, each column corresponding to the variables assigned in 'Data Roles' of the Data-driven Container, in the order listed
	var company = document.getElementById("company").value,
		levels = document.getElementById("levels").value

		if (Number.isInteger(levels) !== true){
			levels = 1
		}

    //result seems to need to be an array of dictionaries, each specifying the index of a row of the data that should be output.
    //indices of data are messy, i.e. they may not be in the order you loaded them into SAS, so you need to verify that you have the correct row 
    //before pushing it in.
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

    console.log(Object.prototype.toString.call(casData);)
    console.log(Object.prototype.toString.call(casData.data);)
    console.log(Object.prototype.toString.call(casData.data[2]);)
    console.log(Object.prototype.toString.call(result[0]);)
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