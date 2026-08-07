import prisma from "@/lib/prisma";

export class SystemSettingService {

  async get(
    key: string
  ) {

    return prisma.systemSetting.findUnique({
      where: {
        key,
      },
    });

  }


  async getValue(
    key: string,
    fallback: string
  ) {

    const setting =
      await this.get(key);


    return setting?.value ?? fallback;

  }


  async update(
    key: string,
    value: string,
    description?: string
  ) {

    return prisma.systemSetting.upsert({

      where: {
        key,
      },

      update: {
        value,
        description,
      },

      create: {
        key,
        value,
        description,
      },

    });

  }

}


export const systemSettingService =
new SystemSettingService();