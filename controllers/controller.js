const Room = require("../models/roomModel");
const Booking = require("../models/bookingModel");
exports.showAllBooking = async (req, res) => {
  const bookings = await Booking.find();
  res.render("booking", { bookings });
};
exports.showAddForm = async (req, res) => {
  const rooms = await Room.find();
  res.render("bookRoom", { rooms });
};
exports.addBooking = async (req, res) => {
  const { customerName, roomNumber, startTime, endTime } = req.body;
  const room = await Room.findOne({ roomNumber });
  if (!room) {
    return res.send("This room does not exist");
  }

  if (new Date(endTime) <= new Date(startTime)) {
    return res.send("End time must be after start time");
  }

  const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
  const totalAmount = Math.round(hours * room.pricePerHour);

  await Booking.create({
    customerName,
    roomNumber,
    startTime,
    endTime,
    totalAmount,
  });

  res.redirect("/bookings");
};
exports.showUpdateForm = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  const rooms = await Room.find();
  res.render("updateRoom", { booking, rooms });
};
exports.deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.redirect("/bookings");
};
exports.updateBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  const room = await Room.findOne({
    roomNumber: req.body.roomNumber,
  });

  if (!room) {
    return res.send("This room does not exist");
  }

  if (new Date(req.body.endTime) <= new Date(req.body.startTime)) {
    return res.send("End time must be after start time");
  }

  const hours =
    (new Date(req.body.endTime) - new Date(req.body.startTime)) /
    (1000 * 60 * 60);
  booking.customerName = req.body.customerName;
  booking.roomNumber = req.body.roomNumber;
  booking.startTime = req.body.startTime;
  booking.endTime = req.body.endTime;
  booking.totalAmount = Math.round(hours * room.pricePerHour);
  await booking.save();

  res.redirect("/bookings");
};
