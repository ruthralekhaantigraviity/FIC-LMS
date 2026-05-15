const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: { type: String },
  transactionId: { type: String, unique: true, sparse: true },
  paidAt: Date,
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
