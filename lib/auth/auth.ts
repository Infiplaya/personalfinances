import GoogleProvider from "next-auth/providers/google";
import { db } from "../../db/index";
import { PlanetScaleAdapter } from "./planetscale-adapter";

export const authOptions = {
  adapter: PlanetScaleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
};
