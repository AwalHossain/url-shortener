import { model, Schema } from "mongoose";



// src/models/url.ts
export interface IUrl extends Document {
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: Date;
}

const urlSchema: Schema = new Schema<IUrl>({
    
    originalUrl: { type: String, required: true },
    shortUrl: { type: String,
         required: true, 
        unique: true,
        index: true,
    },
    clicks: { type: Number, 
        required: true,
         default: 0 },
    createdAt: { type: Date, required: true, default: Date.now },
});

export default model<IUrl>("Url", urlSchema);
