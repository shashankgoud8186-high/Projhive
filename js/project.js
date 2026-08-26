document.addEventListener("DOMContentLoaded", () => {

  renderProjects();

  const search =
    document.getElementById("projectSearch");

  const category =
    document.getElementById("projectCategory");

  if (search) {
    search.addEventListener("input", renderProjects);
  }

  if (category) {
    category.addEventListener("change", renderProjects);
  }

  renderProjectDetail();

});


function renderProjects() {

  const container =
    document.getElementById("projectsContainer");

  if (!container) return;

  const search =
    document.getElementById("projectSearch")
      ?.value
      .toLowerCase()
      .trim() || "";

  const category =
    document.getElementById("projectCategory")
      ?.value || "all";

  let projects = getProjects();

  projects = projects.filter(project => {

    const searchable = [

      project.title,
      project.description,
      project.category,
      project.groupName,
      ...(project.technologies || [])

    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !search || searchable.includes(search);

    const matchesCategory =
      category === "all" ||
      project.category === category;

    return matchesSearch && matchesCategory;

  });

  const empty =
    document.getElementById("emptyProjects");

  if (!projects.length) {

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
    projects.map(createProjectCard).join("");

}


function renderProjectDetail() {

  const container =
    document.getElementById("projectDetail");

  if (!container) return;

  const id =
    getQueryParam("id");

  const project =
    getProjects().find(item => item.id === id);

  if (!project) {

    container.innerHTML = `
      <section class="section">
        <div class="container empty-state">
          <div class="empty-icon">🔍</div>
          <h2>Project not found</h2>
          <p>This project may have been removed.</p>
          <a href="projects.html"
             class="btn btn-primary">
             Browse Projects
          </a>
        </div>
      </section>
    `;

    return;
  }

  const gallery =
    (project.images || [])
      .map(
        image =>
          `<img src="${image}" alt="${escapeHTML(project.title)}">`
      )
      .join("");

  const members =
    (project.members || [])
      .map(
        member => `
          <div class="member-row">
            <span>${escapeHTML(member.name)}</span>
            <span>${escapeHTML(member.role)}</span>
          </div>
        `
      )
      .join("");

  container.innerHTML = `

    <section class="detail-hero">

      <div class="container">

        <span class="section-label">
          ${escapeHTML(project.category)}
        </span>

        <h1>${escapeHTML(project.title)}</h1>

        <p>
          ${escapeHTML(project.description)}
        </p>

        ${
          project.projectLink
            ? `
              <a
                href="${escapeHTML(project.projectLink)}"
                target="_blank"
                rel="noopener"
                class="btn btn-primary"
                style="margin-top:25px"
              >
                View Project →
              </a>
            `
            : ""
        }

      </div>

    </section>

    <section class="section">

      <div class="container detail-layout">

        <div>

          ${
            gallery
              ? `
                <div class="detail-section">
                  <h2>Project Gallery</h2>

                  <div class="detail-gallery">
                    ${gallery}
                  </div>
                </div>
              `
              : ""
          }

          ${detailSection(
            "Problem Statement",
            project.problemStatement
          )}

          ${detailSection(
            "How We Built It",
            project.implementation
          )}

          ${detailSection(
            "Challenges & Solutions",
            project.challenges
          )}

          ${detailSection(
            "Future Improvements",
            project.futureScope
          )}

        </div>

        <aside>

          <div class="sidebar-card">

            <h3>Technologies</h3>

            <div class="tech-list">

              ${(project.technologies || [])
                .map(
                  tech =>
                    `<span class="tech-tag">
                      ${escapeHTML(tech)}
                    </span>`
                )
                .join("")}

            </div>

          </div>

          <div class="sidebar-card">

            <h3>Team Members</h3>

            ${
              members ||
              "<p>No members listed.</p>"
            }

          </div>

          <div class="sidebar-card">

            <h3>Project Group</h3>

            <p>
              ${escapeHTML(
                project.groupName || "Individual Project"
              )}
            </p>

          </div>

        </aside>

      </div>

    </section>
  `;

}


function detailSection(title, content) {

  if (!content) return "";

  return `
    <div class="detail-section">

      <h2>${title}</h2>

      <p>
        ${escapeHTML(content)}
      </p>

    </div>
  `;

}
