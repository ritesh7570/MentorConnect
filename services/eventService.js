const Event = require('../models/event');
const User = require('../models/user');
const { handleError } = require('../utils/expressError');

// Index
exports.index = async (req, res) => {
    try {
        const events = await Event.find({});
        res.render('events/index', { events });
    } catch (err) {
        handleError(err, res);
    }
};

// Show
exports.show = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('likes').populate('participants');
        res.render('events/show', { event });
    } catch (err) {
        handleError(err, res);
    }
};

// New
exports.new = (req, res) => {
    res.render('events/new');
};

// Create
exports.create = async (req, res) => {
    try {
        const event = new Event(req.body.event);
        event.owner = req.user._id;
        await event.save();
        req.flash('success', 'Event created successfully!');
        res.redirect(`/events/${event._id}`);
    } catch (err) {
        handleError(err, res);
    }
};

// Edit
exports.edit = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.render('events/edit', { event });
    } catch (err) {
        handleError(err, res);
    }
};

// Update
exports.update = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body.event);
        req.flash('success', 'Event updated successfully!');
        res.redirect(`/events/${event._id}`);
    } catch (err) {
        handleError(err, res);
    }
};

// Join
exports.join = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        event.participants.push(req.user._id);
        await event.save();
        req.flash('success', 'You have joined the event!');
        res.redirect(`/events/${event._id}`);
    } catch (err) {
        handleError(err, res);
    }
};

// Leave
exports.leave = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        event.participants.pull(req.user._id);
        await event.save();
        req.flash('success', 'You have left the event!');
        res.redirect(`/events/${event._id}`);
    } catch (err) {
        handleError(err, res);
    }
};

// Like
exports.like = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        event.likes.push(req.user._id);
        await event.save();
        req.flash('success', 'Event liked!');
        res.redirect(`/events/${event._id}`);
    } catch (err) {
        handleError(err, res);
    }
};

// Report
exports.report = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        event.reports.push(req.user._id);
        await event.save();
        req.flash('success', 'Event reported!');
        res.redirect(`/events/${event._id}`);
    } catch (err) {
        handleError(err, res);
    }
};
