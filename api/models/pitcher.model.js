import mongoose from 'mongoose';

const PitcherSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Pitcher = mongoose.model('Pitcher', PitcherSchema);

export default Pitcher;
