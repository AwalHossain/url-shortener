import { Document, model, Schema } from 'mongoose';

// Interface defining the structure of a counter document
interface ICounter extends Document {
  _id: string; // Identifier for the counter (e.g., 'url_count')
  seq: number; // The current sequence value
}

// Schema for the counter
const counterSchema: Schema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// Create and export the Counter model
const Counter = model<ICounter>('Counter', counterSchema);

export default Counter; 