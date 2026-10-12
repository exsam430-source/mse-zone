import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";

const ReviewSection = ({ productId, onReviewAdded }) => {
  const { user, token, backendURL } = useContext(ShopContext);

  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  const [confirmDelete, setConfirmDelete] = useState({ show: false, reviewId: null });
  const [ratingAlert, setRatingAlert] = useState(false);

  const REVIEWS_PER_PAGE = 5;

  const fetchReviews = async (pageNum = 1) => {
  if (!productId) return;
  const skip = (pageNum - 1) * REVIEWS_PER_PAGE;
  try {
    const { data } = await axios.get(
      `${backendURL}/reviews/${productId}?skip=${skip}&limit=${REVIEWS_PER_PAGE}`
    );
    if (data.success) {
      if (pageNum === 1) setReviews(data.reviews);
      else setReviews(prev => [...prev, ...data.reviews]);
      setTotalReviews(data.total); // total from all reviews

      if (onReviewAdded) {
        onReviewAdded(data.averageRating); // average from all reviews
      }
    }
  } catch (err) {
    console.error("Fetch review error:", err);
  }
};

  useEffect(() => {
    setPage(1);
    fetchReviews(1);
  }, [productId]);

  const submitReview = async () => {
    if (!user || !user._id) return alert("Please login to submit a review");
    if (!rating) {
      setRatingAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", user.name || "");
    formData.append("email", user.email || "");
    formData.append("rating", rating);
    formData.append("comment", comment);
    images.forEach(file => formData.append("images", file));

    try {
      const { data } = await axios.post(
        `${backendURL}/reviews/review/${productId}`,
        formData,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (data.success) {
        setReviews(data.reviews.slice(0, REVIEWS_PER_PAGE)); // show only first page after submit
        setTotalReviews(data.total);
        setPage(1);
        setRating(0);
        setComment("");
        setImages([]);
        setShowForm(false);

        if (onReviewAdded) {
          const avg = data.reviews.reduce((a, r) => a + r.rating, 0) / (data.reviews.length || 1);
          onReviewAdded(avg);
        }
      }
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const { data } = await axios.delete(
        `${backendURL}/reviews/review/${productId}/${reviewId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (data.success) {
        setReviews(data.reviews.slice(0, page * REVIEWS_PER_PAGE)); // show reviews up to current page
        setTotalReviews(data.total);

        if (onReviewAdded) {
          const avg = data.reviews.reduce((a, r) => a + r.rating, 0) / (data.reviews.length || 1);
          onReviewAdded(avg);
        }
      }
    } catch (err) {
      console.error("Delete error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to delete review");
    } finally {
      setConfirmDelete({ show: false, reviewId: null });
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  };

  return (
    <div className="mt-6">
      {!showForm && (
        <button
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition"
          onClick={() => {
            if (!user?._id) return alert("Please login first");
            setShowForm(true);
          }}
        >
          Write a Review
        </button>
      )}

      {showForm && (
        <div className="p-6 border rounded-2xl mb-6 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-3">Rate & Review</h3>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`text-3xl cursor-pointer transition-transform hover:scale-125 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-xl mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your review..."
          />
          <input
            type="file"
            accept="image/*"
            multiple
            className="mb-3"
            onChange={e => setImages(Array.from(e.target.files).slice(0, 3))}
          />
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow transition"
            onClick={submitReview}
          >
            Submit Review
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 relative">
        {reviews.map((rev, idx) => (
          <div key={idx} className="flex gap-4 p-5 border rounded-2xl relative bg-white shadow-sm hover:shadow-md transition">
            <img
              src={
                rev.userId?.avatar
                  ? `${backendURL}${rev.userId.avatar.startsWith("/") ? "" : "/"}${rev.userId.avatar}`
                  : "/default-avatar.png"
              }
              className="w-14 h-14 rounded-full object-cover border border-gray-200"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="font-semibold text-gray-800">{rev.userId?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{rev.userId?.email}</p>
                </div>
                <p className="text-yellow-400 font-medium">{`★`.repeat(rev.rating)}</p>
              </div>
              <p className="text-gray-600 mb-2">{rev.comment}</p>
              {rev.images?.length > 0 && (
                <div className="flex gap-2 mt-1">
                  {rev.images.map((img, i) => (
                    <img
                      key={i}
                      src={`${backendURL}/${img}`}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                    />
                  ))}
                </div>
              )}
              <p className="text-gray-400 text-xs mt-2">{new Date(rev.date).toLocaleDateString()}</p>
            </div>

            {user?._id === rev.userId?._id && (
              <button
                onClick={() => setConfirmDelete({ show: true, reviewId: rev._id })}
                className="absolute top-3 right-3 text-red-500 font-medium hover:text-red-700 transition"
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {/* Show More Reviews button */}
        {reviews.length < totalReviews && (
          <button
            className="mt-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            onClick={loadMore}
          >
            Load More Reviews
          </button>
        )}

        {reviews.length === 0 && (
          <p className="text-gray-500 text-center mt-4">No reviews yet. Be the first to review this product!</p>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete.show && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-2xl w-80 text-center shadow-lg animate-pop">
              <p className="mb-4 text-gray-800 font-semibold text-lg">
                Are you sure you want to delete this review?
              </p>
              <div className="flex justify-around mt-3">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  onClick={() => deleteReview(confirmDelete.reviewId)}
                >
                  Yes
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  onClick={() => setConfirmDelete({ show: false, reviewId: null })}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rating Alert Modal */}
        {ratingAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-2xl w-80 text-center shadow-lg animate-pop">
              <p className="mb-4 text-gray-800 font-semibold text-lg">
                Please select a rating before submitting!
              </p>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setRatingAlert(false)}
              >
                Okay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
