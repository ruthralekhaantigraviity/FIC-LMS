const Module = require('../models/Module');

exports.createModule = async (req, res) => {
  try {
    const newModule = await Module.create(req.body);
    res.status(201).json({ status: 'success', data: newModule });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getModulesByCourse = async (req, res) => {
  try {
    const modules = await Module.find({ course: req.params.courseId }).sort('order');
    res.status(200).json({ status: 'success', data: modules });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ status: 'success', data: module });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
