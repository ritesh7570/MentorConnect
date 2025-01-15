function toggleEventLocation() {
    const isOnline = document.querySelector('input[name="event[isOnline]"]:checked').value === 'true';
    document.getElementById('linkField').classList.toggle('d-none', !isOnline);
    document.getElementById('venueField').classList.toggle('d-none', isOnline);
}

