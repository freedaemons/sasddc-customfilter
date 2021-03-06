//store event data for future triggers of updateData
var datatable;
document.getElementById("company").addEventListener('change', onInputChange);
document.getElementById("levels").addEventListener('change', onInputChange);

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
        levels = document.getElementById("levels").value;

    // get the first column to use as autofill
    var autofill_companies =  [];
    for (var p = 0; p < casData.data.length; p++){
      if(autofill_companies.indexOf(casData.data[p][0]) < 0){
        autofill_companies.push(casData.data[p][0]);
      }
    }
    console.log('>>>autocomplete list generated: ' + autofill_companies.length + ' items.');

    autocomplete(document.getElementById("company"), autofill_companies);

    /////////////////////////////////// Insert code to filter data here /////////////////////////////////////
    var result = [];
    var display = [];
    var displayed = [];
    var xgParents = [];
    var xgChildren = [];
    
    // first passthrough
    for (var p=0; p < casData.data.length; p++){
        //find the search term
        if (String(casData.data[p][0]).toUpperCase() === company.toUpperCase()){
            if(displayed.indexOf(String(casData.data[p][0]).toUpperCase()) < 0){
                display.push(casData.data[p][0].toUpperCase());
                console.log('>>> Search term row found.');
            }
            //collect previously unseen generation-x parents of the search term
            for (var q=1; q < levels; q++){
                if(xgParents.indexOf(String(casData.data[p][q]).toUpperCase()) < 0 && String(casData.data[p][q])!== '(missing)'){
                    xgParents.push(String(casData.data[p][q]).toUpperCase());
                    console.log('>>> Gen-q parent found: ' + String(casData.data[p][q]));
                }
            }
        }else{
        // if node is not search term
          for(var q=1; q < levels; q++){
            //collect previously unseen generation-x children of the search term
            if(String(casData.data[p][q]).toUpperCase() === company.toUpperCase() && xgChildren.indexOf(String(casData.data[p][0]).toUpperCase()) < 0){
                xgChildren.push(casData.data[p][0].toUpperCase());
                console.log('>>> Gen-q child row found: ' + casData.data[p][0].toUpperCase());
            }
          }
        }
    }
    console.log('>>> List of generation-q parents: ' + xgParents.length + ' items.');
    console.log('>>> ' + xgParents.toString());
    console.log('>>> List of generation-q children: ' + xgChildren.length + ' items.');
    console.log('>>> ' + xgChildren.toString());
    //merge display, xgParents, and xgChildren
    display = display.concat(xgParents, xgChildren);
    //second passthrough
    for (p=0; p < casData.data.length; p++){
      var thisNode_str = String(casData.data[p][0]).toUpperCase();
        // If this node is to be displayed, display it.
        if(display.indexOf(thisNode_str) > -1){
          result.push({
              row: p
          });
          //Since we're displaying all instances of the node, even if it's been displayed before, to capture all relationships, store the list separately
          if(displayed.indexOf(thisNode_str) < 0){
              displayed.push(thisNode_str);
              console.log('>>> Gen-q neighbour row found and displayed.');
          }
        }
    }
    console.log('>>> List of ' + levels + '-degrees neighbours to be displayed: ' + display.length + ' items.');
    console.log('>>> List of unique' + levels + '-degrees neighbours displayed: ' + displayed.length + ' items.');
    console.log('>>> Actual length of result array: ' + result.length + ' items.');
    /////////////////////////////////// End of filter ///////////////////////////////////////////////////////
    
    //remove duplicates from results
    var uniqresult = result.filter(function (a) {
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