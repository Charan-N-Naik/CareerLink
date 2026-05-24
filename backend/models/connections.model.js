import mongoose from "mongoose";

const connectionRequest = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    status_accepted: {
        type: Boolean,
        default: null,
    }
});

export default mongoose.model("ConnectionRequest", connectionRequest);