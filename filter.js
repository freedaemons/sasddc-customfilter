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
 //        if (casData.data[p][1] == company) {
 //            result.push({
 //                row: p
 //            });
 //        }
 //        if (casData.data[p][5] == company) {
 //            result.push({
 //                row: p
 //            });
 //        }
 //    };
 	// for (p = 0; p < casData.data.length; p++) {
  //       if (p%5 == 0){ // simulate result containing every 5th row
  //       	result.push({
  //       		row: p
  //       	})
  //       }
  //       }
  //   };
    result.push({
    	row: 2 // simulate filter result only containing 3rd row
    })
    result.push({
        row: 3 // one more
    })
        result.push({
        row: 4 // one more
    })
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