import Hostel from "../models/Hostel.js";
import Room from "../models/Room.js";

export const createHostel = async (req, res, next) => {

  const newHostel = new Hostel({
    createdBy: req.user.id,
    ...req.body,
  });

  try {
    const savedHostel = await newHostel.save();
    res.status(200).json(savedHostel);
  } catch (err) {
    next(err);
  }
};
export const updateHostel = async (req, res, next) => {
  const hostel = await Hostel.findById(req.params.id);

  if (!hostel) {
    return res.status(404).json({ message: "hostel not found" });
  }

  if (hostel.createdBy.toString() !== req.user.id.toString() && hostel.managerId.toString() !== req.user.id.toString()) {
    return res.status(401).json({ message: "You are not authorized to perform this action" });
  }

  try {
    const updatedHostel = await Hostel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedHostel);
  } catch (err) {
    next(err);
  }
};
export const deleteHostel = async (req, res, next) => {
  const hostel = await Hostel.findById(req.params.id);

  if (!hostel) {
    return res.status(404).json({ message: "hostel not found" });
  }

  if (hostel.createdBy.toString() !== req.user.id.toString() && hostel.managerId.toString() !== req.user.id.toString()) {
    return res.status(401).json({ message: "You are not authorized to perform this action" });
  }

  try {
    await Hostel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hostel has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: "hostel not found" });
    }
    res.status(200).json(hostel);
  } catch (err) {
    next(err);
  }
};
export const getHostels = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    let Hostels;

    Hostels = await Hostel.find({
      ...others,
      cheapestPrice: { $gte: min || 1, $lte: max || 9999999 },
    }).limit(req.query.limit);
    res.status(200).json(Hostels);
  } catch (err) {
    next(err);
  }
};
export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hostel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const boysHostelCount = await Hostel.countDocuments({ type: "boys hostel" });
    const girlsHostelCount = await Hostel.countDocuments({ type: "girls hostel" });

    res.status(200).json([
      { type: "boys hostel", count: boysHostelCount },
      { type: "boys hostel", count: girlsHostelCount },
    ]);
  } catch (err) {
    next(err);
  }
};
export const getHostelRooms = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    const list = await Promise.all(
      hostel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const getHostelsByOwner = async (req, res) => {
  const userId = req.user.id;

  try {
    const hostels = await Hostel.find({ createdBy: userId }).populate("managerId").populate("rooms");

    res.json(hostels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};


// <feature:0>  LOCATION </feature:0>
