document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    // var bookings = <%- JSON.stringify(bookings) %>; // Embed the bookings data

    // Map bookings to FullCalendar event format
    var events = bookings.map(function(booking) {
        let backgroundColor;
        switch (booking.status) {
            case 'pending':
                backgroundColor = 'orange';
                break;
            case 'confirmed':
                backgroundColor = 'green';
                break;
            case 'cancelled':
                backgroundColor = 'red';
                break;
            default:
                backgroundColor = 'blue';
        }

        return {
            id: booking.id || Math.random().toString(36).substr(2, 9), // Ensure unique ID for each booking
            title: booking.title,
            start: booking.start,
            end: booking.end,
            backgroundColor: backgroundColor,
            extendedProps: {
                status: booking.status,
                reason: booking.reason,
                paymentStatus: booking.paymentStatus
            }
        };
    });

    var selectedEvent; // To track the event being toggled

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,dayGridMonth'
        },
        events: events,
        editable: false,
        droppable: false,
        selectable: false,
        eventMouseEnter: function(info) {
            // Display a tooltip for event details
            var tooltip = document.createElement('div');
            tooltip.id = 'eventTooltip';
            tooltip.innerHTML = `
                <p><strong>Title:</strong> ${info.event.title}</p>
                <p><strong>Status:</strong> ${info.event.extendedProps.status}</p>
                <p><strong>Reason:</strong> ${info.event.extendedProps.reason || 'N/A'}</p>
                <p><strong>Payment Status:</strong> ${info.event.extendedProps.paymentStatus}</p>
            `;
            document.body.appendChild(tooltip);

            document.addEventListener('mousemove', function moveTooltip(e) {
                tooltip.style.top = e.clientY + 10 + 'px';
                tooltip.style.left = e.clientX + 10 + 'px';

                // Remove tooltip on mouse leave
                info.el.addEventListener('mouseleave', function removeTooltip() {
                    tooltip.remove();
                    document.removeEventListener('mousemove', moveTooltip);
                });
            });
        },
        eventClick: function(info) {
            selectedEvent = info.event; // Save the selected event

            // Populate modal with booking details
            document.getElementById('modalTitle').textContent = selectedEvent.title;
            document.getElementById('modalStart').textContent = selectedEvent.start.toISOString();
            document.getElementById('modalEnd').textContent = selectedEvent.end.toISOString();
            document.getElementById('modalStatus').textContent = selectedEvent.extendedProps.status;
            document.getElementById('modalReason').textContent = selectedEvent.extendedProps.reason || 'N/A';
            document.getElementById('modalPayment').textContent = selectedEvent.extendedProps.paymentStatus;

            // Reset reason input
            document.getElementById('toggleReason').value = '';

            // Show the modal
            var bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
            bookingModal.show();
        }
    });

    // Handle status toggle
    document.getElementById('toggleStatusButton').addEventListener('click', function() {
        if (!selectedEvent) return;

        var reasonInput = document.getElementById('toggleReason').value.trim();

        if (selectedEvent.extendedProps.status !== 'cancelled' && !reasonInput) {
            alert('Please provide a reason for cancellation.');
            return;
        }

        // Toggle status
        var newStatus = selectedEvent.extendedProps.status === 'cancelled' ? 'confirmed' : 'cancelled';
        var newColor = newStatus === 'cancelled' ? 'red' : 'green';

        // Update the event properties
        selectedEvent.setExtendedProp('status', newStatus);
        selectedEvent.setExtendedProp('reason', newStatus === 'cancelled' ? reasonInput : '');
        selectedEvent.setProp('backgroundColor', newColor);

        // Send update to the backend
        fetch('/mentor/update-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: selectedEvent.id,
                status: newStatus,
                reason: reasonInput
            })
        })
        .then(response => {
            if (response.ok) {
                alert("Booking status updated successfully!");
            } else {
                alert("Failed to update booking. Please try again.");
            }
        })
        .catch(err => console.error("Error:", err));

        // Close the modal
        var bookingModal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        bookingModal.hide();
    });

    calendar.render();
});
