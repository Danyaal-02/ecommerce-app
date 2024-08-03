import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  imageUrl: { 
    type: String, 
    required: true,
    default: 'https://via.placeholder.com/300'
  },
});

export default mongoose.model('Product', productSchema);