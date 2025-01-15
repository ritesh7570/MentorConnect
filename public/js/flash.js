document.addEventListener("DOMContentLoaded", function() {
    // Time in milliseconds after which the message will disappear
    const autoHideTime = 3000; // 5 seconds

    // Select all alert messages
    const alertMessages = document.querySelectorAll('.alert');

    alertMessages.forEach(alert => {
        // Set a timeout to hide the message after 5 seconds
        setTimeout(() => {
            alert.classList.add('hideMessage');
            // Remove the message after the animation duration (0.5s)
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, autoHideTime);
    });
});
