import mongoose from 'mongoose'

export interface ToolSaveDocument extends mongoose.Document {
  authorId: number
  name: string
  description: string
  tags: string[]
  data: JSON
  verified: boolean
  type: string
  isPublic: boolean
  permissions: { userId: number; permission: string }[]
}

const ToolSaveSchema = new mongoose.Schema(
  {
    authorId: { type: Number },
    name: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    data: { type: JSON, required: true },
    verified: { type: Boolean, default: false },
    type: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    permissions: [{ userId: Number, permission: String }],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<ToolSaveDocument>('ToolSave', ToolSaveSchema)
