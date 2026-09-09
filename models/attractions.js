const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Attraction name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: ["nature", "culture", "history", "adventure", "entertainment"],
      required: true,
    },
    location: {
      state: { type: String, required: true },
      city: { type: String, required: true },
    },
    price: {
      type: Number,
      default: 0, 
    },
    openingHours: {
      type: String,
    },
     image: {
            type: String,
            default: "",
        },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

attractionSchema.index({ "location.state": 1, category: 1 });

module.exports = mongoose.model("Attraction", attractionSchema);