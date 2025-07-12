import mongoose, { Document, Schema } from 'mongoose';

export interface ISwap extends Document {
  requester: mongoose.Types.ObjectId;
  itemRequested: mongoose.Types.ObjectId;
  itemOffered?: mongoose.Types.ObjectId;
  pointsOffered?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  swapType: 'direct' | 'points';
  message?: string;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: mongoose.Types.ObjectId;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const swapSchema = new Schema<ISwap>({
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  itemRequested: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Requested item is required']
  },
  itemOffered: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  },
  pointsOffered: {
    type: Number,
    min: [0, 'Points offered cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  swapType: {
    type: String,
    enum: ['direct', 'points'],
    required: [true, 'Swap type is required']
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelReason: {
    type: String,
    maxlength: [200, 'Cancel reason cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
swapSchema.index({ requester: 1 });
swapSchema.index({ itemRequested: 1 });
swapSchema.index({ status: 1 });
swapSchema.index({ createdAt: -1 });

// Virtual for requester name
swapSchema.virtual('requesterName', {
  ref: 'User',
  localField: 'requester',
  foreignField: '_id',
  justOne: true,
  get: function(this: ISwap) {
    return this.populated('requester') ? 
      `${this.populated('requester')?.firstName} ${this.populated('requester')?.lastName}` : 
      undefined;
  }
});

// Virtual for item owner
swapSchema.virtual('itemOwner', {
  ref: 'Item',
  localField: 'itemRequested',
  foreignField: '_id',
  justOne: true,
  get: function(this: ISwap) {
    return this.populated('itemRequested') ? 
      this.populated('itemRequested')?.uploader : 
      undefined;
  }
});

// Ensure virtuals are serialized
swapSchema.set('toJSON', { virtuals: true });
swapSchema.set('toObject', { virtuals: true });

// Pre-save middleware to validate swap type
swapSchema.pre('save', function(next) {
  if (this.swapType === 'direct' && !this.itemOffered) {
    return next(new Error('Direct swap requires an offered item'));
  }
  if (this.swapType === 'points' && !this.pointsOffered) {
    return next(new Error('Points swap requires points to be offered'));
  }
  next();
});

export default mongoose.model<ISwap>('Swap', swapSchema); 
 