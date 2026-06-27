'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { submitReview } from '../store/slices/reviewSlice';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import type { RootState } from '../store/types';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

export default function ReviewForm({ productId, productName, onClose }: ReviewFormProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { submitting } = useAppSelector((state: RootState) => state.reviews);
  
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
  });
  
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter a review title');
      return;
    }
    
    if (!formData.comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    try {
      await dispatch(submitReview({
        productId,
        userId: user.id,
        userName: user.name,
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        isVerifiedPurchase: true, // Assuming user has purchased the product
      })).unwrap();
      
      toast.success('Review submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      const isHovered = i <= hoveredRating;
      
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && handleRatingChange(i)}
          onMouseEnter={() => interactive && setHoveredRating(i)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
          className={`transition-colors ${
            interactive ? 'cursor-pointer hover:scale-110' : ''
          }`}
          disabled={!interactive}
        >
          {isFilled || isHovered ? (
            <StarSolidIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <StarIcon className="h-6 w-6 text-yellow-400" />
          )}
        </button>
      );
    }
    return stars;
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Required</h3>
          <p className="text-gray-600 mb-4">Please login to write a review for this product.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 mb-2">Reviewing:</p>
        <p className="font-medium text-gray-900">{productName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Rating *
          </label>
          <div className="flex items-center space-x-2">
            {renderStars(formData.rating, true)}
            <span className="ml-3 text-sm text-gray-600">
              {formData.rating > 0 ? `${formData.rating} out of 5` : 'Select rating'}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Summarize your experience"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            maxLength={100}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Share your experience with this product..."
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
            maxLength={500}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || formData.rating === 0 || !formData.title.trim() || !formData.comment.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Review</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 
