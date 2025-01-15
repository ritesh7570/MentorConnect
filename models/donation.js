const mongoose = require("mongoose");
const { Schema } = mongoose;

const donationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [200, "Title cannot exceed 200 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [1, "Description must be at least 1 character long"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: "Invalid owner ID",
      },
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        validate: {
          validator: mongoose.Types.ObjectId.isValid,
          message: "Invalid payment ID",
        },
      },
    ],
    donors: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: "Invalid donor ID",
          },
        },
        amount: {
          type: Number,
          required: true,
          min: [1, "Donation amount must be at least 1"],
        },
      },
    ],
    totalCollection: {
      type: Number,
      default: 0,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
      required: false,
    },
 
    isDeadlineDate: {
      type: Boolean,
      default: false,
      required: false,
    },

    deadlineDate: {
      type: Date,
      default: null,
      required: false,
    },
    isFundraising: {
      type: Boolean,
      default: false,
      required: false,
    },
    fundraisingGoal: {
      type: Number,
      default: null,
      required: false,
    },
    

    isEmergency: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware to update total collection safely
donationSchema.methods.addDonation = async function (userId, amount) {
  try {

  const donationAmount = parseInt(amount, 10); // Convert to integer
   
    const existingDonor = this.donors.find(donor => donor.user.equals(userId));
    if (existingDonor) {
      existingDonor.amount += donationAmount;
    } else {
      this.donors.push({ user: userId, amount });
    }

    console.log("this.totalCollection: ", this.totalCollection, "  amount: ", donationAmount);  
    this.totalCollection += donationAmount;
    console.log("this.totalCollection: ", this.totalCollection, "  amount: ", donationAmount);  
    
    await this.save();
  } catch (err) {
    throw new Error("Error adding donation: " + err.message);
  }
};

// Notification logic
donationSchema.post("save", async function (doc, next) {
  const Notification = mongoose.model("Notification");

  await Notification.create({
    user: doc.owner,
    message: `Your donation "${doc.title}" was successfully created. Current total: ${doc.totalCollection}`,
    link: `/donations/${doc._id}`,
  });

  if (doc.isEmergency) {
    await Notification.create({
      user: doc.owner,
      message: `Emergency donation "${doc.title}" created successfully.`,
      link: `/donations/${doc._id}`,
    });
  }

  next();
});

donationSchema.post("findOneAndUpdate", async function (doc, next) {
  const Notification = mongoose.model("Notification");

  await Notification.create({
    user: doc.owner,
    message: `Your donation "${doc.title}" was successfully updated. Current total: ${doc.totalCollection}`,
    link: `/donations/${doc._id}`,
  });

  if (doc.isEmergency) {
    await Notification.create({
      user: doc.owner,
      message: `Emergency donation "${doc.title}" updated successfully.`,
      link: `/donations/${doc._id}`,
    });
  }

  next();
});



// Indexing for optimization
donationSchema.index({ owner: 1 });
donationSchema.index({ isEmergency: 1 });

module.exports = mongoose.model("Donation", donationSchema);
