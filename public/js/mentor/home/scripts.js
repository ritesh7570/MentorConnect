document.addEventListener("DOMContentLoaded", () => {
    const mentorNameElement = document.getElementById("mentor-name");
    const mentorName = "<%= mentorName %>"; // Injected server-side
  
    // Typing effect for mentor name
    let index = 0;
  
    function typeEffect() {
      if (index < mentorName.length) {
        mentorNameElement.textContent += mentorName.charAt(index);
        index++;
        setTimeout(typeEffect, 100);
      }
    }
  
    typeEffect();
  });
  