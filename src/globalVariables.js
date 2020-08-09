const table = document.getElementById("tableData");

const addDataBtn = document.getElementById("addBtn");
const addModal = document.getElementById("addModal");
const modalTitle = document.getElementById("modalTitle");
const modalForm = document.getElementById("modalForm");
const closeModal = document.getElementById("closeModal");

const addName = document.getElementById("inputName");
const addArea = document.getElementById("inputArea");
const addPopulation = document.getElementById("inputPopulation");
const addCode = document.getElementById("inputCode");

const alertWindow = document.querySelector(".alert-window");
const alertText = document.getElementById("alertText");
const alertBtn = document.getElementById("alertBtn");

const cnfrmWindow = document.querySelector(".confirm-window");
const cnfrmBtnTrue = document.getElementById("cnfrmBtnTrue");
const cnfrmBtnFalse = document.getElementById("cnfrmBtnFalse");

const paginationWrap = document.getElementById("pagiWrap");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchIcon");

const filterBtn = document.getElementById("tableFilter");
const filterTick = document.querySelector(".filter-icon");
const filterContent = document.getElementById("filterContent");

const sortAscBtn = document.getElementById("sortAsc");
const sortDscBtn = document.getElementById("sortDsc");

let tableData = [];

let order = "";
let search = "";
let date = "";
let currentPage = 1;
let editMode = false;
