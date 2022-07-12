import { PrismaClient } from "@prisma/client";
import { Logger } from "../../logging/Logger.js";

const prisma = new PrismaClient();

export class Database {
  createUser(user) {
    return prisma.user.create({
      data: {
        platformId: `${user.platform}${user.platformId}`,
        preferences: { create: {} },
        account: {
          create: {
            username: user.username,
          },
        },
      },
    });
  }

  findUser(platform, id) {
    return prisma.user.findUnique({
      where: {
        platformId: `${platform}${id}`,
      },
      include: {
        preferences: true,
        account: true,
      },
    });
  }
}

process.on("exit", async (code) => {
  Logger.showStopper("Lastgram", "Process is leaving, running cleanup tasks.");
  await prisma.$disconnect();
  Logger.showStopper("Lastgram", "Leaving now. Bye.");
  process.exit(code);
});
