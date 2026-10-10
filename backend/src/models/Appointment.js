import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },

    date: { type: String, required: true },     // "2026-10-15"
    timeSlot: { type: String, required: true }, // "10:30"
    mode: {
      type: String,
      enum: ["in-person", "online", "phone"],
      default: "in-person",
    },
    reason: { type: String, trim: true },

    status: {
      type: String,
      enum: ["booked", "cancelled", "completed", "no-show"],
      default: "booked",
    },

    // Token + queue
    tokenNumber: { type: Number },    // e.g. 7 for that doctor on that day
    queuePosition: { type: Number },  // updates as patients are served

    fee: { type: Number, required: true },
    cancelledAt: Date,
    cancelReason: String,
  },
  { timestamps: true }
);

// Stops two ACTIVE bookings for the same doctor, date and slot.
// Cancelled appointments don't block the slot.
appointmentSchema.index(
  { doctor: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: "booked" } }
);

export default mongoose.model("Appointment", appointmentSchema);
