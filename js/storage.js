const STORAGE_KEYS = {
  projects: "innohub_projects",
  groups: "innohub_groups"
};

function getProjects() {
  return JSON.parse(
    localStorage.getItem(STORAGE_KEYS.projects) || "[]"
  );
}

function saveProjects(projects) {
  localStorage.setItem(
    STORAGE_KEYS.projects,
    JSON.stringify(projects)
  );
}

function getGroups() {
  return JSON.parse(
    localStorage.getItem(STORAGE_KEYS.groups) || "[]"
  );
}

function saveGroups(groups) {
  localStorage.setItem(
    STORAGE_KEYS.groups,
    JSON.stringify(groups)
  );
}

function createId(prefix = "item") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");
}

function escapeHTML(value = "") {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
