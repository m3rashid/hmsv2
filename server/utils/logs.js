const { prisma } = require("./prisma");

const addEventLog = async ({
  action,
  fromId,
  actionId,
  actionTable,
  message,
}) => {
  const log = await prisma.log.create({
    data: {
      action,
      fromId,
      actionId,
      actionTable,
      message,
    },
  });

  console.log({ log });

  return log;
};

module.exports = {
  addEventLog,
};
