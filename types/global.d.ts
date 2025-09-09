// global.d.ts
import mongoose from "mongoose";

declare global {
  // globalThis ke andar mongoose cache define kar dete hain
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}
