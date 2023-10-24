const amqp = require("amqplib")

let channel;
const connectTochannel = async()=>{
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        return (await connection.createChannel()) 
    } catch (error) {
     console.log("can not connect to rabbit mq server ");   
    }
}

// ========== return Chanel for designPattern SingleTon =====================

const returnChannel = async()=>{
    if(!channel){
        channel = await connectTochannel()
    }
    return channel
}

// =================== PushData ========================

const pushToQueue = async(queueName, data)=>{
    try {
        await channel.assertQueue(queueName);
        return channel.sendToQueue(queueName,Buffer.from(JSON.stringify(data)))
    } catch (error) {
        console.log(error.message)
    }
}

// ===============================
const createQueue = async(queueName)=>{
    const channel =await returnChannel()
    await channel.assertQueue(queueName)
    return channel
}




module.exports ={

    pushToQueue,
    returnChannel,
    connectTochannel,
    createQueue,

}