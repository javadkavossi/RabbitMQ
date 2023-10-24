const amqp = require("amqplib");
const { orderModel } = require("../model/order");

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

// =================== PushData ========================

const pushToQueue = async (queueName, data) => {
  try {
    await channel.assertQueue(queueName);
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    console.log(error.message);
  }
};

// ===============================
const createQueue = async (queueName) => {
  const channel = await returnChannel();
  await channel.assertQueue(queueName);
  return channel;
};

// =================================

const createOrderWithQueue = async(queueName)=> {
    await createQueue(queueName);
    channel.consume(queueName, async msg => {
        if(msg.content){
            const {products, userEmail} = JSON.parse(msg.content.toString());
            console.log(products);
            const newOrder = new orderModel({products, userEmail,
                 totalPrice: 123
                  })
            await newOrder.save();
            channel.ack(msg);
            pushToQueue("PRODUCT", newOrder)
            console.log("saved order : ", newOrder._id);
        }
    })
}


module.exports = {
  pushToQueue,
  returnChannel,
  connectTochannel,
  createOrderWithQueue,
  createQueue,
};
