import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId, // The one who is subscribing to it
    ref: "User",
  },
  channel: {
    type: Schema.Types.ObjectId, // The channel to which the subscriber is subscribing.
    ref: "User",
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;