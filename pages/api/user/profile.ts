import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/prisma";
import { getSession } from "@lib/auth";
import { pick } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...pick(req.body, [
          "username",
          "name",
          "avatar",
          "timeZone",
          "weekStart",
          "hideBranding",
          "theme",
          "completedOnboarding",
        ]),
        bio: req.body.description,
      },
    });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({ message: "Username already taken" });
    }
    throw e;
  }

  return res.status(200).json({ message: "Profile updated successfully" });
}
