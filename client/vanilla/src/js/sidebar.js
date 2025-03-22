const sidebar = document.querySelector(".chat__sidebar");
const toggleButton = document.querySelector(".burger");

export const initSidebar = () => {
  if (window.innerWidth <= 768) {
    setTimeout(() => {
      sidebar.classList.add("chat__sidebar--hidden");
    }, 1500);

    document.addEventListener("click", (event) => {
      if (
        !sidebar.contains(event.target) &&
        !toggleButton.contains(event.target)
      ) {
        sidebar.classList.add("chat__sidebar--hidden");
      }
    });

    toggleButton.addEventListener("click", (event) => {
      event.stopPropagation();
      sidebar.classList.toggle("chat__sidebar--hidden");
    });
  }
};
