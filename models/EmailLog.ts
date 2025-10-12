import mongoose, { Schema, models } from "mongoose"

const EmailLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionId: { type: String, required: true },
    // purchase = welcome/receipt, cancel-user = user cancelled, cancel-admin = admin cancelled
    type: {
      type: String,
      enum: ["purchase", "cancel-user", "cancel-admin"],
      required: true,
    },
  },
  { timestamps: true },
)

EmailLogSchema.index({ userId: 1, subscriptionId: 1, type: 1 }, { unique: true })

export default models.EmailLog || mongoose.model("EmailLog", EmailLogSchema)
