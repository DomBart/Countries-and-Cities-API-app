const queryString = window.location.search;

const title = document.getElementById("title");
const name = new URLSearchParams(queryString).get("name");
title.innerHTML = name;

const countryID = new URLSearchParams(queryString).get("id");

const url = "https://akademija.teltonika.lt/api2/cities";
const format = "/" + countryID;

/** Iš API gaunami Miestų duomenys */
function getData(drawTable) {
  tableData = [];
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    url + "/" + countryID + "?page=" + currentPage + order + search + date,
    true
  );
  xhr.onerror = function () {
    connectionErr();
  };
  xhr.onload = function () {
    var xhrdata = JSON.parse(xhr.responseText);
    if (xhrdata.length > 0) {
      for (let i = 0; i < xhrdata.length; i++) {
        tableData.push({
          id: xhrdata[i].id,
          name: xhrdata[i].name,
          area: xhrdata[i].area,
          population: xhrdata[i].population,
          postcode: xhrdata[i].postcode,
          country_id: xhrdata[i].country_id,
          created_at: xhrdata[i].created_at,
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
      <td>${tableData[i].name}</td>
      <td>${tableData[i].area}</td>
      <td>${tableData[i].population}</td>
      <td>${tableData[i].postcode}</td>
      <td class="row-controls"><span><img class="delete-btn" onclick="deleteConfirm(${tableData[i].id})" src="./img/trash.svg"/>
      <img class="edit-btn" onclick="editModal(${tableData[i].id})" src="./img/edit.svg"/></span></td>
      </tr>`
      );
    }
    setTableActions();
  } else {
    table.insertAdjacentHTML("beforeend", `<tr><h2>DUOMENŲ NERASTA!</h2></tr>`);
  }
}

/** Miesto pridėjimo į API metodas */
function addCity() {
  var entry = {
    name: addName.value,
    area: addArea.value,
    population: addPopulation.value,
    postcode: addCode.value,
    country_id: parseInt(countryID),
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
      alertText.innerHTML = `Miestas "${entry.name}" sėkmingai pridėtas!`;
      alertWindow.classList.remove("disabled");
    } else {
      alertText.innerHTML = "Įvyko klaida! Prašome bandyti dar kartą.";
      alertWindow.classList.remove("disabled");
    }
  };
  xhr.send(JSON.stringify(entry));
}

/**
 * Į redagavimo lentelę užkraunami miesto duomenys
 * @param {*} id Redaguojamo miesto id
 */
function loadInputValues(id) {
  if (addModal.classList.contains("disabled")) {
    addModal.classList.remove("disabled");
    addModal.classList.add("enabled");
    modalForm.setAttribute("onsubmit", `editCity(${id});return false;`);
    modalTitle.innerHTML = "REDAGUOTI MIESTĄ";
  }
  let city = tableData.find((obj) => obj.id == id);
  addName.value = city.name;
  addArea.value = city.area;
  addPopulation.value = city.population;
  addCode.value = city.postcode;
}

/**
 * Miesto duomenų redagavimo funkcija
 * @param {*} id Redaguojamo miesto id
 */
function editCity(id) {
  var entry = {
    name: addName.value,
    area: addArea.value,
    population: addPopulation.value,
    postcode: addCode.value,
    country_id: countryID,
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
      alertText.innerHTML = `Miestas "${entry.name}" sėkmingai redaguotas!`;
      alertWindow.classList.remove("disabled");
    } else {
      alertText.innerHTML = "Įvyko klaida! Prašome bandyti dar kartą.";
      alertWindow.classList.remove("disabled");
    }
  };
  xhr.send(JSON.stringify(entry));
}

/**
 * Miesto pridėjimo mygtuko paspaudimo funkcija
 */
addDataBtn.addEventListener("click", function () {
  if (addModal.classList.contains("disabled")) {
    addModal.classList.remove("disabled");
    addModal.classList.add("enabled");
    modalForm.setAttribute("onsubmit", "addCity();return false;");
    modalTitle.innerHTML = "PRIDĖTI MIESTĄ";
  }
});

drawPagination(1, format);
getData(drawTable);
