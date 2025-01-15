const toggleBtn = document.getElementById("toggleBtn");
const expandedSidebar = document.querySelector(".expanded-sidebar");
const collapsedSidebar = document.querySelector(".collapsed-sidebar");

function toggleSidebar() {
  const isExpanded = expandedSidebar.classList.contains("active");

  if (isExpanded) {
    expandedSidebar.classList.remove("active");
    collapsedSidebar.classList.add("active");
  } else {
    expandedSidebar.classList.add("active");
    collapsedSidebar.classList.remove("active");
  }
}

toggleBtn.addEventListener("click", toggleSidebar);

function adjustSidebar() {
  if (window.innerWidth <= 768) {
    expandedSidebar.classList.remove("active");
    collapsedSidebar.classList.add("active");
  } else {
    expandedSidebar.classList.add("active");
    collapsedSidebar.classList.remove("active");
  }
}

window.addEventListener("resize", adjustSidebar);
window.addEventListener("load", adjustSidebar);
