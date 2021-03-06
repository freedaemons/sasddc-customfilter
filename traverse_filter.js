//store event data for future triggers of updateData
var datatable;
document.getElementById("company").addEventListener('change', onInputChange);
document.getElementById("levels").addEventListener('change', onInputChange);
// var autofill_list = ['Apple', 'Banana', 'Coffee', 'Dog', 'Elephant']
// autocomplete(document.getElementById("company"), autofill_list);

// Create event listener which takes data from VA
function onMessage(evt) {
    if (evt && evt.data && evt.data.hasOwnProperty("data"))
        datatable = evt.data;
        updateData(evt.data);
    }

    if (window.addEventListener) {
        // For standards-compliant web browsers 
        window.addEventListener("message", onMessage, false);
    } else {
        // For Internet Explorer 8 and earlier versions
        window.attachEvent("onmessage", onMessage);
}

function onInputChange(){
    updateData(datatable);
}

function updateData(casData) {
    //casData.data contains rows of data, each column corresponding to the variables assigned in 'Data Roles' of the Data-driven Container, in the order listed
	var company = document.getElementById("company").value,
		levels = document.getElementById("levels").value

		if (Number.isInteger(levels) !== true){
			levels = 1
		}
    // get the first column to use as autofill
    var autofill_companies =  [];
    for (p = 0; p < casData.data.length; p++){
        autofill_companies.push(casData.data[p][0]);
    }
    console.log('>>>autocomplete list generated: ' + autofill_companies.length + ' items.')
    // autofill_companies = autofill_companies.filter(function (a) {
    //     return !this[a.row] && (this[a.row] = true);
    //     }, Object.create(null)); //remove duplicates, just in case

    autocomplete(document.getElementById("company"), autofill_companies);
    //result seems to need to be an array of dictionaries, each specifying the index of a row of the data that should be output.
    //indices of data are messy, i.e. they may not be in the order you loaded them into SAS, so you need to verify that you have the correct row 
    //before pushing it in.
	var result = [];
	var findParents = new Array(); //contains names of parents of previous children
	var findChildren = new Array(); //contains names of previous children, whose parents need to be found
    var toDisplay = new Array();
    var levelcounter = parseInt(levels);
    console.log('raw levelcounter: ' + levelcounter)
    if (levelcounter < 1){
        levelcounter = 1;
        console.log('levelcounter reset to 1')
    }
    //find the search term node
    console.log('Levels requested: ' + levelcounter)
    console.log('>>>Begin searching for search term.')
    for (p = 0; p < casData.data.length; p++){
        //add the searched company to results
        if (toDisplay.indexOf(String(casData.data[p][0]).toUpperCase() < 0) && String(casData.data[p][0]).toUpperCase() === company.toUpperCase()){
            result.push({
                row: p
            })
            toDisplay.push(casData.data[p][0].toUpperCase())
            console.log('>>> toDisplay: ' + casData.data[p][0])
            findParents.push(casData.data[p][1]);
            console.log('>>> searchterm: pushing ' + company + ' to findParents');
            findChildren.push(company);
            console.log('>>> searchterm: pushing ' + company + ' to findChildren');
            break;
        }
    }
    //for each level...
    while(levelcounter > 0){
        //find children
        while(findChildren.length > 0){
            nextChild = findChildren.pop()
            console.log('>>> Looking for children of ' + nextChild)
            for (p = 0; p < casData.data.length; p++){
                if (toDisplay.indexOf(String(casData.data[p][1]).toUpperCase() < 0) && String(casData.data[p][1]).toUpperCase() === nextChild.toUpperCase()){
                    result.push({
                        row: p
                    })
                    toDisplay.push(casData.data[p][0].toUpperCase())
                    console.log('>>> toDisplay: ' + casData.data[p][0])
                    findChildren.push(casData.data[p][0]);
                    console.log('>>> findChild: pushing ' + casData.data[p][0] + ' to findChildren; children left to find: ' + findChildren.length);
                    //do not break, because all children are found in one passthrough
                }
            }
            console.log('Current level: ' + levelcounter + '; Children left to find: ' + findChildren.length)
        }
        //find parents
        while (findParents.length > 0){
            nextParent = findParents.pop()
            thisParents = new Array();
            console.log('>>> Looking for parents of ' + nextParent)
            for (p = 0; p < casData.data.length; p++){
                if (toDisplay.indexOf(String(casData.data[p][0]).toUpperCase() < 0) && String(casData.data[p][0]).toUpperCase() === nextParent.toUpperCase()){
                    thisParents.push(casData.data[p][1])
                }
            }
            while(thisParents.length > 0){
                thisParent = thisParents.pop();
                for (p = 0; p < casData.data.length; p++){
                    if (toDisplay.indexOf(String(casData.data[p][0]).toUpperCase() < 0) && String(casData.data[p][0]).toUpperCase() === thisParent.toUpperCase()){
                        result.push({
                        row: p
                    })
                    toDisplay.push(casData.data[p][0]);
                    console.log('>>> toDisplay: ' + casData.data[p][0])
                    findParents.push(casData.data[p][0]);
                    console.log('>>> findParent pushing ' + casData.data[p][0] + ' to findParents; parents left to find: ' + findParents.length);
                    //do not break, because all next parents to be found are identified in one passthrough
                    }
                }
            }
            console.log('Current level: ' + levelcounter + '; Parents left to find: ' + findChildren.length)
        }

        levelcounter-= 1;
    }
    if (result.length == 0){
        result.push({
            row: 2 // debugging mode - empty result fails to filter and displays all for some unknown reason
        })
    }
    //remove duplicates from results
    uniqresult = result.filter(function (a) {
        return !this[a.row] && (this[a.row] = true);
    }, Object.create(null));


    self.resultName = casData.resultName;
    var message = {
        selections: uniqresult,
        resultName: self.resultName
    };

    var url = (window.location != window.parent.location) ?
        document.referrer :
        document.location.href;

    window.parent.postMessage(message, url);
}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}