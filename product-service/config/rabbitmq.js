const amqp = require("amqplib");

let channel;
const connectTochannel = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    return await connection.createChannel();
  } catch (error) {
    console.log("can not connect to rabbit mq server ");
  }
};

// ========== return Chanel for designPattern SingleTon =====================

const returnChannel = async () => {
  if (!channel) {
    channel = await connectTochannel();
  }
  return channel;
};

// ===============================

const createQueue = async (queueName) => {
  let mychannel = await returnChannel();
  const queueDetails = await mychannel.assertQueue(queueName);
  return { channel: mychannel, queueDetails };
};

// =================== PushData ========================

const pushToQueue = async (queueName, data) => {
  try {
    await returnChannel();
    await channel.assertQueue(queueName);
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  pushToQueue,
  returnChannel,
  connectTochannel,
  createQueue,
};
