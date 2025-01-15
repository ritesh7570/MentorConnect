const mongoose = require("mongoose");

const slotPaymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking", // Reference to the Booking model
        required: true,
    },
    menteeUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    mentorUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["UPI", "Credit Card", "Debit Card"], // Allowed payment methods
        required: true,
    },
    upiId: {
        type: String,
        required: function () {
            return this.paymentMethod === "UPI";
        },
    },
    cardDetails: {
        cardNumber: {
            type: String,
            required: function () {
                return this.paymentMethod === "Credit Card" || this.paymentMethod === "Debit Card";
            },
        },
        expiryDate: {
            type: String,
            required: function () {
                return this.paymentMethod === "Credit Card" || this.paymentMethod === "Debit Card";
            },
        },
        cvv: {
            type: String,
            required: function () {
                return this.paymentMethod === "Credit Card" || this.paymentMethod === "Debit Card";
            },
        },
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("SlotPayment", slotPaymentSchema);
