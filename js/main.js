document.addEventListener("DOMContentLoaded", () => {

  const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

  const mainNav =
    document.getElementById("mainNav");

  if (mobileMenuBtn && mainNav) {

    mobileMenuBtn.addEventListener("click", () => {
      mainNav.classList.toggle("show");
    });

  }

  updateHomepageStats();
  renderFeaturedProjects();
  renderFeaturedGroups();

});


function updateHomepageStats() {

  const projects = getProjects();
  const groups = getGroups();

  const technologies = new Set();

  projects.forEach(project => {

    (project.technologies || []).forEach(technology => {
      technologies.add(technology);
    });

  });

  const projectCount =
    document.getElementById("heroProjectCount");

  const groupCount =
    document.getElementById("heroGroupCount");

  const techCount =
    document.getElementById("heroTechCount");

  if (projectCount) {
    projectCount.textContent = projects.length;
  }

  if (groupCount) {
    groupCount.textContent = groups.length;
  }

  if (techCount) {
    techCount.textContent = technologies.size;
  }
}


function renderFeaturedProjects() {

  const container =
    document.getElementById("featuredProjects");

  if (!container) return;

  const projects = getProjects().slice(0, 6);

  if (!projects.length) {

    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🚀</div>
        <h3>Your innovation starts here</h3>
        <p>Be the first to publish a project.</p>
        <a href="upload.html" class="btn btn-primary">
          Upload Project
        </a>
      </div>
    `;

    return;
  }

  container.innerHTML =
    projects.map(createProjectCard).join("");

}


function renderFeaturedGroups() {

  const container =
    document.getElementById("featuredGroups");

  if (!container) return;

  const groups = getGroups().slice(0, 3);

  if (!groups.length) {

    container.innerHTML = `
      <div class="empty-state"
           style="grid-column:1/-1;color:white">
        <div class="empty-icon">👥</div>
        <h3>Create the first group</h3>
        <p>Bring your team together on InnoHub.</p>
        <a href="create-group.html" class="btn btn-primary">
          Create Group
        </a>
      </div>
    `;

    return;
  }

  container.innerHTML =
    groups.map(createGroupCard).join("");

}


function createProjectCard(project) {

  const image =
    project.images && project.images.length
      ? `<img src="${project.images[0]}" alt="${escapeHTML(project.title)}">`
      : `<div class="card-placeholder">🚀</div>`;

  const technologies =
    (project.technologies || [])
      .slice(0, 4)
      .map(
        tech => `<span class="tech-tag">${escapeHTML(tech)}</span>`
      )
      .join("");

  return `
    <article class="project-card">

      <a href="project-detail.html?id=${project.id}">

        <div class="card-image">
          ${image}
        </div>

        <div class="card-content">

          <span class="card-category">
            ${escapeHTML(project.category || "Project")}
          </span>

          <h3>${escapeHTML(project.title)}</h3>

          <p>${escapeHTML(project.description)}</p>

          <div class="tech-list">
            ${technologies}
          </div>

        </div>

      </a>

    </article>
  `;
}


function createGroupCard(group) {

  const initials =
    getInitials(group.name) || "IH";

  return `
    <article class="group-card">

      <a href="group-detail.html?id=${group.id}">

        <div class="group-avatar">
          ${initials}
        </div>

        <h3>${escapeHTML(group.name)}</h3>

        <p>
          ${escapeHTML(group.description)}
        </p>

        <div class="group-meta">

          <span>
            👥 ${(group.members || []).length} members
          </span>

          <span>
            ${escapeHTML(group.domain || "Innovation")}
          </span>

        </div>

      </a>

    </article>
  `;
}
