import notificationModel from "../models/notification.js";

export const getNotification = async (req, res) => {
  const { id } = req.params; //id is me
  // await notificationModel.create({ notification: "day la thong bao notification", senderId: "6061d90e717de11d840cba5f", receiverId: "60a4dfcf44248e11f8fbbd1a" });
  const listNotification = await notificationModel.find({ receiverId: id }).sort({ createdAt: -1 }).limit(10);
  return res.json({ list: listNotification });
};
