/**
 * Konstruojamas lentelės puslapiavimo modulis
 * @param {*} page Nuskaitomo puslapio indeksas
 * @param {*} format URL formatas - šalių / miestų
 */
function drawPagination(page, format) {
  var length;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url + format + "?page=" + page + order + search + date, true);
  xhr.onload = function () {
    var xhrdata = JSON.parse(xhr.responseText);
    if (xhrdata.count == undefined) length = xhrdata.length;
    else length = xhrdata.count;
    if (length > 0) {
      paginationWrap.insertAdjacentHTML(
        "beforeend",
        `<button>${page}</button>`
      );
      paginationWrap.lastChild.addEventListener("click", function () {
        setActiveBtn(page);
        currentPage = page;
        getData(drawTable);
      });
      drawPagination(page + 1, format);
    } else if (paginationWrap.childNodes.length > 0) {
      paginationWrap.insertAdjacentHTML(
        "afterbegin",
        `<button onclick="pushPage(-1,${page})"><</button>`
      );
      paginationWrap.insertAdjacentHTML(
        "beforeend",
        `<button onclick="pushPage(1,${page})"">></button>`
      );
      paginationWrap.childNodes[currentPage].classList.add("active");
    }
  };
  xhr.send();
}

/**
 * Puslapiavimo sekančio arba praeito puslapio funkcija
 * @param {*} direction Sekantis ar praeitas puslapis
 * @param {*} lastPage Paskutinis puslapis
 */
function pushPage(direction, lastPage) {
  if (currentPage + direction > 0 && currentPage + direction < lastPage) {
    let next = currentPage + direction;
    setActiveBtn(next);
    currentPage = next;
    getData(drawTable);
  }
}

/**
 * Nustatomas parinkto puslapio mygtuko stilius
 * @param {*} page Parinkto puslapio indeksas
 */
function setActiveBtn(page) {
  paginationWrap.childNodes[currentPage].classList.remove("active");
  paginationWrap.childNodes[page].classList.add("active");
}

/**
 * Išvalomas puslapiavimo modulis
 */
function clearPagination() {
  while (paginationWrap.firstChild) {
    paginationWrap.removeChild(paginationWrap.firstChild);
  }
}

/**
 * Lentelės redagavimo ir šalinimo mygtukų funkcijų implementavimas
 */
function setTableActions() {
  let deleteBtn = document.querySelectorAll(".delete-btn");
  let editBtn = document.querySelectorAll(".edit-btn");

  let rowCount = table.rows.length - 1;
  table.rows[rowCount].classList.add("last-row");

  deleteBtn.forEach((button) => {
    button.addEventListener("mouseover", function () {
      button.src = "./img/trash_hover.svg";
    });
    button.addEventListener("mouseout", function () {
      button.src = "./img/trash.svg";
    });
  });
  editBtn.forEach((button) => {
    button.addEventListener("mouseover", function () {
      button.src = "./img/edit_hover.svg";
    });
    button.addEventListener("mouseout", function () {
      button.src = "./img/edit.svg";
    });
  });
}

/**
 * API duomenų filtro nustatymo funkcija
 */
function filterData() {
  var checkbox = document.getElementById("dateCheck");
  var dateInput = document.getElementById("dateInput");
  if (checkbox.checked == true && dateInput.value != "") {
    currentPage = 1;
    date = "&date=" + dateInput.value;
    clearPagination();
    drawPagination(1, format);
    getData(drawTable);
    filterBtn.style.boxShadow = "0px 0px 10px #0054A68a";
  } else if (
    (checkbox.checked == false && dateInput.value != "") ||
    (checkbox.checked == true && dateInput.value == "")
  ) {
    currentPage = 1;
    date = "";
    clearPagination();
    drawPagination(1, format);
    getData(drawTable);
    filterBtn.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
  }
}

/**
 * API duomenų paieškos nustatymo funkcija
 */
function searchData() {
  if (searchInput.value != 0) {
    order = "";
    search = "&text=" + searchInput.value;
    currentPage = 1;
    searchInput.style.boxShadow = "0px 0px 10px #0054A68a";
  } else {
    search = "";
    searchInput.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
  }
  clearPagination();
  drawPagination(1, format);
  getData(drawTable);
}

/**
 * Duomenų šalinimo patvirtinimo lentelės aktyvavimas
 * @param {*} id Šalinamo įrašo ID
 */
function deleteConfirm(id) {
  cnfrmWindow.classList.remove("disabled");
  cnfrmBtnTrue.onclick = function () {
    deleteEntry(id);
    cnfrmWindow.classList.add("disabled");
  };
  cnfrmBtnFalse.onclick = function () {
    cnfrmWindow.classList.add("disabled");
  };
}

/**
 * Įrašo pašalinimo iš API funkcija
 * @param {*} id Šalinamo įrašo ID
 */
function deleteEntry(id) {
  var name = tableData.find((obj) => obj.id == id).name;
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", url + "/" + id, true);
  xhr.onerror = function () {
    connectionErr();
  };
  xhr.onload = function () {
    if (xhr.status == 200) {
      clearPagination();
      drawPagination(1, format);
      if (tableData.length - 1 < 1) currentPage--;
      getData(drawTable);
      alertText.innerHTML = `Įrašas "${name}" sėkmingai pašalintas!`;
      alertWindow.classList.remove("disabled");
    } else {
      alertText.innerHTML = "Įvyko klaida! Prašome bandyti dar kartą.";
      alertWindow.classList.remove("disabled");
    }
  };
  xhr.send();
}

/**
 * Įrašo redagavimo lentelės duomenų paruošimas
 * @param {*} id Redaguojamo įrašo ID
 */
function editModal(id) {
  loadInputValues(id);
  editMode = true;
}

/**
 * Lentelės išvalymo funkcija
 */
function clearTable() {
  var count = table.rows.length - 1;
  for (let i = count; i > 0; i--) {
    table.removeChild(table.lastChild);
  }
}

/**
 * Pranešimas dėl nesusieto ryšio su API serveriu
 */
function connectionErr() {
  addModal.classList.remove("enabled");
  addModal.classList.add("disabled");
  modalForm.reset();
  alertText.innerHTML =
    "Nepavyko užmegzti ryšio!<br/>Prašome bandyti dar kartą.";
  alertWindow.classList.remove("disabled");
}

// Mygtukų funkcijų realizavimas

searchBtn.addEventListener("click", function () {
  searchData();
});

searchInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchBtn.click();
  }
});

filterBtn.addEventListener("click", function () {
  if (filterContent.classList.contains("filter-enabled"))
    filterContent.classList.remove("filter-enabled");
  else filterContent.classList.add("filter-enabled");
});

window.addEventListener("click", function (e) {
  if (
    filterContent.contains(e.target) != true &&
    filterBtn.contains(e.target) != true &&
    filterContent.classList.contains("filter-enabled")
  )
    filterContent.classList.remove("filter-enabled");
});

closeModal.addEventListener("click", function () {
  if (addModal.classList.contains("enabled")) {
    addModal.classList.remove("enabled");
    addModal.classList.add("disabled");
    modalForm.reset();
  }
});

sortAscBtn.addEventListener("click", function () {
  if (sortAscBtn.classList.contains("active")) {
    sortAscBtn.classList.remove("active");
    order = "";
    sortAscBtn.src = "./img/sort_asc.svg";
    getData(drawTable);
  } else {
    sortAscBtn.classList.add("active");
    sortDscBtn.classList.remove("active");
    sortDscBtn.src = "./img/sort_dsc.svg";
    order = "&order=asc";
    sortAscBtn.src = "./img/sort_asc_active.svg";
    getData(drawTable);
  }
});

sortDscBtn.addEventListener("click", function () {
  if (sortDscBtn.classList.contains("active")) {
    sortDscBtn.classList.remove("active");
    order = "";
    sortDscBtn.src = "./img/sort_dsc.svg";
    getData(drawTable);
  } else {
    sortDscBtn.classList.add("active");
    sortAscBtn.classList.remove("active");
    sortAscBtn.src = "./img/sort_asc.svg";
    order = "&order=desc";
    sortDscBtn.src = "./img/sort_dsc_active.svg";
    getData(drawTable);
  }
});

alertBtn.addEventListener("click", function () {
  alertWindow.classList.add("disabled");
});

addName.addEventListener("keydown", function (e) {
  if (addName.value.length === 0 && e.which === 32) {
    e.preventDefault();
  }
});

addCode.addEventListener("keydown", function (e) {
  if (addCode.value.length === 0 && e.which === 32) {
    e.preventDefault();
  }
});

//"Hover" efektai

addDataBtn.addEventListener("mouseover", function () {
  addDataBtn.childNodes[1].src = "./img/add_hover.svg";
});
addDataBtn.addEventListener("mouseout", function () {
  addDataBtn.childNodes[1].src = "./img/add.svg";
});

closeModal.addEventListener("mouseover", function () {
  closeModal.src = "./img/close_hover.svg";
});
closeModal.addEventListener("mouseout", function () {
  closeModal.src = "./img/close.svg";
});

searchBtn.addEventListener("mouseover", function () {
  searchBtn.src = "./img/search_hover.svg";
});
searchBtn.addEventListener("mouseout", function () {
  searchBtn.src = "./img/search.svg";
});

filterBtn.addEventListener("mouseover", function () {
  filterTick.src = "./img/filter_tick_hover.svg";
  filterBtn.style.color = "#0054A6";
});
filterBtn.addEventListener("mouseout", function () {
  filterTick.src = "./img/filter_tick.svg";
  filterBtn.style.color = "#969696";
});
