document.addEventListener("DOMContentLoaded", () => {

  setupGroupCreation();
  renderGroups();
  renderGroupDetail();

  const search =
    document.getElementById("groupSearch");

  if (search) {
    search.addEventListener("input", renderGroups);
  }

});


function renderGroups() {

  const container =
    document.getElementById("groupsContainer");

  if (!container) return;

  const search =
    document.getElementById("groupSearch")
      ?.value
      .toLowerCase()
      .trim() || "";

  let groups = getGroups();

  if (search) {

    groups = groups.filter(group => {

      const searchable = [
        group.name,
        group.description,
        group.organization,
        group.domain
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(search);

    });

  }

  const empty =
    document.getElementById("emptyGroups");

  if (!groups.length) {

    container.innerHTML = "";

    if (empty) {
      empty.classList.remove("hidden");
    }

    return;
  }

  if (empty) {
    empty.classList.add("hidden");
  }

  container.innerHTML =
    groups.map(createGroupCard).join("");

}


function setupGroupCreation() {

  const form =
    document.getElementById("groupForm");

  if (!form) return;

  const addButton =
    document.getElementById("addGroupMember");

  if (addButton) {

    addButton.addEventListener("click", () => {

      const container =
        document.getElementById("groupMembers");

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

  const imageInput =
    document.getElementById("groupImage");

  if (imageInput) {

    imageInput.addEventListener("change", () => {

      const file = imageInput.files[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload = event => {

        const preview =
          document.getElementById("groupImagePreview");

        preview.innerHTML = `
          <img
            src="${event.target.result}"
            class="preview-image"
            style="margin-top:15px"
          >
        `;

      };

      reader.readAsDataURL(file);

    });

  }

  form.addEventListener("submit", async event => {

    event.preventDefault();

    const members = [];

    document
      .querySelectorAll("#groupMembers .member-input")
      .forEach(row => {

        const inputs =
          row.querySelectorAll("input");

        if (inputs[0].value.trim()) {

          members.push({
            name: inputs[0].value.trim(),
            role: inputs[1].value.trim()
          });

        }

      });

    const group = {

      id: createId("group"),

      name:
        document.getElementById("groupName").value.trim(),

      description:
        document.getElementById("groupDescription").value.trim(),

      organization:
        document.getElementById("organization").value.trim(),

      domain:
        document.getElementById("groupDomain").value.trim(),

      members,

      image: "",

      createdAt:
        new Date().toISOString()

    };

    const imageInput =
      document.getElementById("groupImage");

    if (
      imageInput.files &&
      imageInput.files[0]
    ) {

      group.image =
        await fileToDataURL(imageInput.files[0]);

    }

    const groups = getGroups();

    groups.unshift(group);

    saveGroups(groups);

    window.location.href =
      `group-detail.html?id=${group.id}`;

  });

}


function renderGroupDetail() {

  const container =
    document.getElementById("groupDetail");

  if (!container) return;

  const id =
    getQueryParam("id");

  const group =
    getGroups().find(item => item.id === id);

  if (!group) {

    container.innerHTML = `
      <section class="section">
        <div class="container empty-state">
          <div class="empty-icon">👥</div>
          <h2>Group not found</h2>
          <a href="groups.html"
             class="btn btn-primary">
             Browse Groups
          </a>
        </div>
      </section>
    `;

    return;
  }

  const projects =
    getProjects().filter(
      project => project.groupId === group.id
    );

  const members =
    (group.members || [])
      .map(
        member => `
          <div class="member-row">
            <span>${escapeHTML(member.name)}</span>
            <span>${escapeHTML(member.role)}</span>
          </div>
        `
      )
      .join("");

  const groupImage =
    group.image
      ? `
        <img
          src="${group.image}"
          alt="${escapeHTML(group.name)}"
          style="
            width:100%;
            height:300px;
            object-fit:cover;
            border-radius:18px;
            margin-bottom:25px;
          "
        >
      `
      : "";

  container.innerHTML = `

    <section class="detail-hero">

      <div class="container">

        <span class="section-label">
          ${escapeHTML(group.domain || "INNOVATION GROUP")}
        </span>

        <h1>${escapeHTML(group.name)}</h1>

        <p>
          ${escapeHTML(group.description)}
        </p>

      </div>

    </section>

    <section class="section">

      <div class="container detail-layout">

        <div>

          ${groupImage}

          <div class="detail-section">

            <h2>About the Group</h2>

            <p>
              ${escapeHTML(group.description)}
            </p>

            ${
              group.organization
                ? `
                  <p style="margin-top:15px">
                    <strong>Organization:</strong>
                    ${escapeHTML(group.organization)}
                  </p>
                `
                : ""
            }

          </div>

          <div class="detail-section">

            <h2>Group Projects</h2>

            <div class="project-grid">

              ${
                projects.length
                  ? projects
                      .map(createProjectCard)
                      .join("")
                  : `
                    <div class="empty-state"
                         style="grid-column:1/-1">

                      <div class="empty-icon">
                        🚀
                      </div>

                      <h3>No projects yet</h3>

                      <p>
                        Add your first project to this group.
                      </p>

                      <a
                        href="upload.html"
                        class="btn btn-primary"
                      >
                        Upload Project
                      </a>

                    </div>
                  `
              }

            </div>

          </div>

        </div>

        <aside>

          <div class="sidebar-card">

            <h3>Team Members</h3>

            ${
              members ||
              "<p>No members listed.</p>"
            }

          </div>

          <div class="sidebar-card">

            <h3>Group Statistics</h3>

            <div class="member-row">
              <span>Members</span>
              <strong>
                ${(group.members || []).length}
              </strong>
            </div>

            <div class="member-row">
              <span>Projects</span>
              <strong>
                ${projects.length}
              </strong>
            </div>

          </div>

        </aside>

      </div>

    </section>
  `;

}
