const btnSave = document.getElementById("btnSave");
const btnAdd = document.querySelector(".btnAdd");
const btnClose = document.getElementById("btnClose");
const textId = document.getElementById("textId");
const textTitle = document.getElementById("textTitle");
const textDec = document.getElementById("textDec");
const ddlPriority = document.getElementById("ddlPriority");
const ddlStatus = document.getElementById("ddlStatus");
const tbody = document.getElementsByClassName("tbody")[0];
let errorSpan = document.querySelector(".error-span");
let inpSearch = document.querySelector("#inpSearch");
let ascendingTitle= document.querySelector(".ascending-title");
let descendingTitle= document.querySelector(".descending-title");
let ascendingDec= document.querySelector(".ascending-dec");
let descendingDec= document.querySelector(".descending-dec");
let ascendingPriority= document.querySelector(".ascending-priority");
let descendingPriority= document.querySelector(".descending-priority");

textId.setAttribute("disabled","");

const Mode = {
  insert: 1,
  edit: 2,
};
let pageMode;

let datas = [];



let message = {
  success: "ToDo inserted Successfully",
  uptade: "ToDo Updated Successfully",
  error: "This id used before",
};

// const showSuccessMessage = (message) => {
//   swal("Success", message, "success");
// };

// const showErrorMessage = (message) => {
//   swal("Error", message, "error");
// };

const ascTitle =()=>{
  datas = datas.sort((a,b)=>{
    return a.title.localeCompare(b.title)
  })
  renderTodo(datas)
}

const descTitle =()=>{
  datas = datas.sort((a,b)=>{
    return b.title.localeCompare(a.title)
  })
  renderTodo(datas)
}

const ascDec =()=>{
  datas = datas.sort((a,b)=>{
    return a.dec.localeCompare(b.dec)
  })
  renderTodo(datas)
}

const descDec =()=>{
  datas = datas.sort((a,b)=>{
    return b.dec.localeCompare(a.dec)
  })
  renderTodo(datas)
}

const ascPriority =()=>{
  datas = datas.sort((a,b)=>{
    return a.priority.localeCompare(b.priority)
  })
  renderTodo(datas)
}

const descPriority =()=>{
  datas = datas.sort((a,b)=>{
    return b.priority.localeCompare(a.priority)
  })
  renderTodo(datas)
}



let idCount;

const generateUniqueId = ()=>{

  let id = datas.map(x=>x.id)
  idCount = Math.max(...id)+1;

  if(idCount== -Infinity){
    idCount=1;
  }


    return idCount;
}



const getTodoFromFields = () => {
  const validationResult = validateInputs(
    textId,
    textTitle,
    textDec,
    ddlPriority,
    ddlStatus
  );

  if (validationResult) {
    return {
      success: false,
      message: "Empty fields",
      data: null,
    };
  }




  let id = generateUniqueId();

  // let id = textId.value;
  let title = textTitle.value;
  let dec = textDec.value;
  let priority = ddlPriority.value;
  let status = ddlStatus.value;

  

  let result = {
    id: id,
    title: title,
    dec: dec,
    priority: priority,
    status: status,
  };

  return {
    success: true,
    message: "Validation is successful",
    data: result,
  };
};

let editId;

const showModalForEdit = (e) => {
  let icon = e.target;
  let tr = icon.closest("tr");
  editId = tr.cells[2].textContent;

  let filteredObject = datas.find((x) => x.id == editId);
  textId.value = filteredObject.id;
  textTitle.value = filteredObject.title;
  textDec.value = filteredObject.dec;
  ddlPriority.value = filteredObject.priority;
  ddlStatus.value = filteredObject.status;

  pageMode = Mode.edit;
};


const removeRow = (e) => {

  let icon = e.target;
  let tr = icon.closest("tr");
  let removeId = tr.cells[2].textContent;

  console.log(removeId);

  datas = datas.filter((x) => x.id !== +removeId);

  console.log(datas);

  renderTodo(datas);
  saveData();
};

const createRow = (todo) => {
  let tr = document.createElement("tr");
  let tdEdit = document.createElement("td");
  let tdTrash = document.createElement("td");
  let tdId = document.createElement("td");
  let tdTitle = document.createElement("td");
  let tdDesc = document.createElement("td");
  let tdPriority = document.createElement("td");
  let tdStatus = document.createElement("td");

  let statusIcon = document.createElement("span");
  

  let iconEdit = document.createElement("i");
  let iconTrash = document.createElement("i");

  iconEdit.className = "fa-solid fa-edit";
  iconTrash.className = "fa-solid fa-trash-alt";

  iconEdit.setAttribute("data-bs-toggle", "modal");
  iconEdit.setAttribute("data-bs-target", "#exampleModal");
  iconEdit.addEventListener("click", showModalForEdit);

  iconTrash.addEventListener("click",removeRow);

  tdEdit.appendChild(iconEdit);
  tdTrash.appendChild(iconTrash);

  tdId.textContent = todo.id;
  tdTitle.textContent = todo.title;
  tdDesc.textContent = todo.dec;
  tdPriority.textContent = todo.priority;
  tdStatus.textContent = todo.status;



  if(tdStatus.textContent=="done")
  {
    tdStatus.textContent=""
    statusIcon.className="done"
  }
  else if(tdStatus.textContent=="in progress"){
    tdStatus.textContent=""
    statusIcon.className="in-progress";
  }
  else{
    tdStatus.textContent=""
    statusIcon.className="ready";
  }

  tr.appendChild(tdEdit);
  tr.appendChild(tdTrash);
  tr.appendChild(tdId);
  tr.appendChild(tdTitle);
  tr.appendChild(tdDesc);
  tr.appendChild(tdPriority);
  tr.appendChild(tdStatus);

  tdStatus.appendChild(statusIcon);

  return tr;
};

const renderTodo = (dataForRender) => {
  tbody.innerHTML = "";
  dataForRender.forEach((todo) => {
    let tr = createRow(todo);
    tbody.appendChild(tr);
  });
};

const clearModal = () => {
  textId.value = "";
  textTitle.value = "";
  textDec.value = "";
  ddlPriority.selectedIndex = 0;
  ddlStatus.selectedIndex = 0;
};

const edit = () => {
  let updatedId = editId;
  let updatedRow = datas.find((x) => x.id == updatedId);

  updatedRow.id = textId.value;
  updatedRow.title = textTitle.value;
  updatedRow.dec = textDec.value;
  updatedRow.priority = ddlPriority.value;
  updatedRow.status = ddlStatus.value;

  renderTodo(datas);
  btnClose.click();
  clearModal();
  // showSuccessMessage(message.uptade);
};

let key;

const saveData = () => {
  localStorage.setItem("data", JSON.stringify(datas));
};

const checkForExistence = (id) => {
  return datas.some((x) => x.id == id);
};

const add = () => {
  let model = getTodoFromFields();

  // if(todo.id =="" || todo.title=="" || todo.dec=="" || todo.priority=="" || todo.status==""){
  //     alert("Please fill out this field.")
  // }

  if (!model.success) {
    // showErrorMessage(model.message);
    return;
  }

  const isExist = checkForExistence(model.data.id);
  if (isExist) {
    showErrorMessage(message.error);
    return;
  }
  datas.push(model.data);
  renderTodo(datas);
  btnClose.click();
  clearModal();
  // showSuccessMessage(message.success);


};

const validateInputs = (...inputs) => {
  return inputs.some((x) => x.value == "");
};

const test = () => {
  renderTodo(datas);
  btnClose.click();
};

const save = () => {
  if (pageMode === Mode.insert) {
    add();
    saveData();
  } else if (pageMode === Mode.edit) {
    edit();
    saveData();
  }
};

const onFlySearch = (e) => {
  let textSearch = e.target.value;
  let filterData = datas.filter((x) => {
    return (
      x.title.toLowerCase().includes(textSearch.toLowerCase()) ||
      x.dec.toLowerCase().includes(textSearch.toLowerCase()) ||
      x.priority.toLowerCase().includes(textSearch.toLowerCase()) ||
      x.status.toLowerCase().includes(textSearch.toLowerCase())
    );
  });

  renderTodo(filterData);
  
};

const pageLoad = () => {
  pageMode = Mode.insert;
  btnSave.addEventListener("click", save);
  datas = JSON.parse(localStorage.getItem("data")) || [];
  datas.forEach((x) => {
    test();
  });
  inpSearch.addEventListener("keyup", onFlySearch);

  btnAdd.addEventListener("click",()=>{
    pageMode=Mode.insert;
    textId.value= generateUniqueId();
  });
  ascendingTitle.addEventListener("click",ascTitle);
  descendingTitle.addEventListener("click",descTitle);

  ascendingDec.addEventListener("click",ascDec);
  descendingDec.addEventListener("click",descDec);

  ascendingPriority.addEventListener("click",ascPriority);
  descendingPriority.addEventListener("click",descPriority);
  
};

document.addEventListener("DOMContentLoaded", pageLoad);
