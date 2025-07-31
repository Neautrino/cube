import mongoose, { Schema } from "mongoose"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: "Role" },
  tasks: [{ 
    name: { type: String, required: true }, 
    isCompleted: { type: Boolean, default: false }
  }],
})

const roleSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  rank: { type: Number, required: true },
})

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

export { Role, User }
