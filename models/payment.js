const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,   default: "",
     
    },
    donationTitle: {
      type: String,
      trim: true,   default: "",
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be a positive number."],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["UPI", "Credit Card", "Debit Card"],
    },
    upiId: {
      type: String,   default: "",
    },
    cardNumber: {
      type: String,
      default: "",
    },
    debitCardNumber: {
      type: String,   default: "",
    },
    debitExpiryDate: {
      type: String,   default: "",
    },
    expiryDate: {
      type: String,   default: "",
    },
    donationId: {
      type: Schema.Types.ObjectId,
      ref: "Donation",
    },
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Ensure valid donation ID before saving payment
paymentSchema.pre("save", async function (next) {
  if (this.donationId) {
    const donationExists = await mongoose.model("Donation").exists({ _id: this.donationId });
    if (!donationExists) {
      return next(new Error("Invalid donation ID."));
    }
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
