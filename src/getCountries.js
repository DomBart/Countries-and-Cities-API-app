const url = "https://akademija.teltonika.lt/api2/countries";
const format = "";

/** Iš API gaunami Šalių duomenys */
function getData(drawTable) {
  tableData = [];
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url + "?page=" + currentPage + order + search + date, true);
  xhr.onerror = function () {
    connectionErr();
  };
  xhr.onload = function () {
    var xhrdata = JSON.parse(xhr.responseText);
    if (xhrdata.count > 0) {
      for (let i = 0; i < xhrdata.count; i++) {
        tableData.push({
          id: xhrdata.countires[i].id,
          name: xhrdata.countires[i].name,
          area: xhrdata.countires[i].area,
          population: xhrdata.countires[i].population,
          calling_code: xhrdata.countires[i].calling_code,
          created_at: xhrdata.countires[i].created_at,
        });
      }
    }
    drawTable();
  };
  xhr.send();
}

/** Lentelės konstravimo funkcija panaudojanti gautus vieno puslapio duomenis */
function drawTable() {
  clearTable();
  if (tableData.length > 0) {
    for (let i = 0; i < tableData.length; i++) {
      table.insertAdjacentHTML(
        "beforeend",
        `<tr>
      <td><a href="./cities.html?id=${tableData[i].id}&name=${tableData[i].name}">${tableData[i].name}</a></td>
      <td>${tableData[i].area}</td>
      <td>${tableData[i].population}</td>
      <td>${tableData[i].calling_code}</td>
      <td class="row-controls" ><span><img class="delete-btn" onclick="deleteConfirm(${tableData[i].id})" src="./img/trash.svg"/>
      <img class="edit-btn" onclick="editModal(${tableData[i].id})" src="./img/edit.svg"/></span></td>
      </tr>`
      );
    }
    setTableActions();
  } else {
    table.insertAdjacentHTML("beforeend", `<tr><h2>DUOMENŲ NERASTA!</h2></tr>`);
  }
}

/** Šalies pridėjimo į API metodas */
function addCountry() {
  var entry = {
    name: addName.value,
    area: addArea.value,
    population: addPopulation.value,
    calling_code: addCode.value,
  };
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.onerror = function () {
    connectionErr();
  };
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.onload = function () {
    addModal.classList.remove("enabled");
    addModal.classList.add("disabled");
    modalForm.reset();
    if (xhr.status == 200) {
      clearPagination();
      drawPagination(1, format);
      getData(drawTable);
      alertText.innerHTML = `Šalis "${entry.name}" sėkmingai pridėta!`;
      alertWindow.classList.remove("disabled");
    } else {
      alertText.innerHTML = "Įvyko klaida! Prašome bandyti dar kartą.";
      alertWindow.classList.remove("disabled");
    }
  };
  xhr.send(JSON.stringify(entry));
}

/**
 * Į redagavimo lentelę užkraunami šalies duomenys
 * @param {*} id Redaguojamos šalies id
 */
function loadInputValues(id) {
  if (addModal.classList.contains("disabled")) {
    addModal.classList.remove("disabled");
    addModal.classList.add("enabled");
    modalForm.setAttribute("onsubmit", `editCountry(${id});return false;`);
    modalTitle.innerHTML = "REDAGUOTI ŠALĮ";
  }
  let country = tableData.find((obj) => obj.id == id);
  addName.value = country.name;
  addArea.value = country.area;
  addPopulation.value = country.population;
  addCode.value = country.calling_code;
}

/**
 * Šalies duomenų redagavimo funkcija
 * @param {*} id Redaguojamos šalies id
 */
function editCountry(id) {
  var entry = {
    name: addName.value,
    area: addArea.value,
    population: addPopulation.value,
    calling_code: addCode.value,
  };
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", url + "/" + id, true);
  xhr.onerror = function () {
    connectionErr();
  };
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.onload = function () {
    addModal.classList.remove("enabled");
    addModal.classList.add("disabled");
    modalForm.reset();
    if (xhr.status == 200) {
      getData(drawTable);
      alertText.innerHTML = `Šalis "${entry.name}" sėkmingai redaguota!`;
      alertWindow.classList.remove("disabled");
    } else {
      alertText.innerHTML = "Įvyko klaida! Prašome bandyti dar kartą.";
      alertWindow.classList.remove("disabled");
    }
  };
  xhr.send(JSON.stringify(entry));
}

/**
 * Šalies pridėjimo mygtuko paspaudimo funkcija
 */
addDataBtn.addEventListener("click", function () {
  if (addModal.classList.contains("disabled")) {
    addModal.classList.remove("disabled");
    addModal.classList.add("enabled");
    modalForm.setAttribute("onsubmit", "addCountry();return false;");
    modalTitle.innerHTML = "PRIDĖTI ŠALĮ";
  }
});

drawPagination(1, format);
getData(drawTable);
