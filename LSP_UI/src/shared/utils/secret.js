import { createSecretKey, randomBytes } from "crypto";

export default async () => {
  try {
    const day = new Date().getUTCDay();
    if (process.env.SECRET) {
      const idx = Number(process.env.SECRET.toString().slice(1)[0]);
      if (idx !== day) {
        process.env.SECRET = `${day}${createSecretKey(randomBytes(256))
          .export()
          .toString("hex")}`;
      }
    } else {
      process.env.SECRET = `${day}${createSecretKey(randomBytes(256))
        .export()
        .toString("hex")}`;
    }
  } catch (e) {
    throw new Error(e);
  }
};
