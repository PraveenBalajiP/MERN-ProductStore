import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name:     { type: String,  required: true },  // snapshot at order time
    price:    { type: Number,  required: true },  // snapshot at order time
    quantity: { type: Number,  default: 1 }
});

const orderSchema = new mongoose.Schema({
    user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items:  { type: [orderItemSchema], required: true },
    total:  { type: Number, required: true },
    status: { type: String, enum: ['pending','shipped','delivered','cancelled'], default: 'pending' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;