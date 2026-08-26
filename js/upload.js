let selectedImages = [];

document.addEventListener("DOMContentLoaded", () => {

  setupProjectUpload();

  loadGroupsIntoProjectForm();

});


function setupProjectUpload() {

  const form =
    document.getElementById("projectForm");

  if (!form) return;

  const imageInput =
    document.getElementById("projectImages");

  if (imageInput) {

    imageInput.addEventListener(
      "change",
      handleImageSelection
    );

  }

  const addMember =
    document.getElementById("addMember");

  if (addMember) {

    addMember.addEventListener("click", () => {

      const container =
        document.getElementById("membersContainer");

      container.insertAdjacentHTML(
        "beforeend",
        `
          <div class="member-input">

            <input
              type="text"
              placeholder="Member name"
            >

            <input
              type="text"
              placeholder="Role"
            >

            <button
              type="button"
              class="remove-member"
              onclick="removeMember(this)"
            >
              ×
            </button>

          </div>
        `
      );

    });

  }

  form.addEventListener(
    "submit",
    submitProject
  );

}


function loadGroupsIntoProjectForm() {

  const select =
    document.getElementById("projectGroup");

  if (!select) return;

  getGroups().forEach(group => {

    const option =
      document.createElement("option");

    option.value = group.id;

    option.textContent =
      group.name;

    select.appendChild(option);

  });

}


function handleImageSelection(event) {

  selectedImages = [];

  const files =
    Array.from(event.target.files);

  const preview =
    document.getElementById("imagePreview");

  preview.innerHTML = "";

  files.slice(0, 8).forEach(file => {

    const reader =
      new FileReader();

    reader.onload = event => {

      selectedImages.push(
        event.target.result
      );

      preview.insertAdjacentHTML(
        "beforeend",
        `
          <img
            src="${event.target.result}"
            class="preview-image"
            alt="Project preview"
          >
        `
      );

    };

    reader.readAsDataURL(file);

  });

}


async function submitProject(event) {

  event.preventDefault();

  const technologies =
    document
      .getElementById("technologies")
      .value
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

  const groupId =
    document.getElementById("projectGroup").value;

  const group =
    getGroups().find(
      item => item.id === groupId
    );

  const members = [];

  document
    .querySelectorAll("#membersContainer .member-input")
    .forEach(row => {

      const inputs =
        row.querySelectorAll("input");

      if (inputs[0].value.trim()) {

        members.push({

          name:
            inputs[0].value.trim(),

          role:
            inputs[1].value.trim()

        });

      }

    });

  const project = {

    id:
      createId("project"),

    title:
      document.getElementById("projectTitle").value.trim(),

    category:
      document.getElementById("projectCategory").value,

    description:
      document
        .getElementById("projectDescription")
        .value
        .trim(),

    problemStatement:
      document
        .getElementById("problemStatement")
        .value
        .trim(),

    implementation:
      document
        .getElementById("implementation")
        .value
        .trim(),

    challenges:
      document
        .getElementById("challenges")
        .value
        .trim(),

    futureScope:
      document
        .getElementById("futureScope")
        .value
        .trim(),

    technologies,

    projectLink:
      document
        .getElementById("projectLink")
        .value
        .trim(),

    groupId:
      groupId || null,

    groupName:
      group ? group.name : "Individual Project",

    members,

    images:
      selectedImages,

    createdAt:
      new Date().toISOString()

  };

  const projects =
    getProjects();

  projects.unshift(project);

  saveProjects(projects);

  alert("Project published successfully!");

  window.location.href =
    `project-detail.html?id=${project.id}`;

}


function removeMember(button) {

  const row =
    button.closest(".member-input");

  if (row) {
    row.remove();
  }

}


function fileToDataURL(file) {

  return new Promise((resolve, reject) => {

    const reader =
      new FileReader();

    reader.onload =
      () => resolve(reader.result);

    reader.onerror =
      reject;

    reader.readAsDataURL(file);

  });

}
