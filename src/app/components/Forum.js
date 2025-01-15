import React, { useState } from 'react';
import { MessageCircle, Heart, Send, Clock, ThumbsUp } from 'lucide-react';

const MedicalForum = () => {
  // Sample data structure for a forum post
  const [post, setPost] = useState({
    id: 1,
    title: "Managing Type 2 Diabetes with Diet and Exercise",
    author: "Dr. Sarah Chen",
    content: "I've been working with patients who have successfully managed their Type 2 Diabetes through lifestyle changes. What are your experiences with diet and exercise interventions?",
    timestamp: "2 hours ago",
    likes: 45,
    comments: [
      {
        id: 1,
        author: "Dr. James Wilson",
        content: "In my practice, I've seen great success with the Mediterranean diet combined with 30 minutes of daily moderate exercise. Many patients have reduced their medication needs within 6 months.",
        timestamp: "1 hour ago",
        likes: 12,
        replies: []
      },
      {
        id: 2,
        author: "Emma Thompson, RD",
        content: "Diet compliance is often the biggest challenge. I recommend starting with small, sustainable changes rather than dramatic lifestyle overhauls.",
        timestamp: "45 minutes ago",
        likes: 8,
        replies: [
          {
            id: 3,
            author: "Dr. Sarah Chen",
            content: "Excellent point, Emma. What specific small changes have you found most effective with your patients?",
            timestamp: "30 minutes ago",
            likes: 5
          }
        ]
      }
    ]
  });

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const handleLike = (commentId) => {
    setPost(prevPost => {
      const updateLikes = (comments) => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes + 1 };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateLikes(comment.replies)
            };
          }
          return comment;
        });
      };
      
      return {
        ...prevPost,
        comments: updateLikes(prevPost.comments)
      };
    });
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      author: "Current User",
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      replies: []
    };

    if (replyingTo) {
      setPost(prevPost => {
        const updateComments = (comments) => {
          return comments.map(comment => {
            if (comment.id === replyingTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newCommentObj]
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateComments(comment.replies)
              };
            }
            return comment;
          });
        };
        
        return {
          ...prevPost,
          comments: updateComments(prevPost.comments)
        };
      });
      setReplyingTo(null);
    } else {
      setPost(prevPost => ({
        ...prevPost,
        comments: [...prevPost.comments, newCommentObj]
      }));
    }
    
    setNewComment('');
  };

  const Comment = ({ comment, depth = 0 }) => (
    <div className={`bg-white rounded-lg p-4 mb-4 ${depth > 0 ? 'ml-8' : ''}`}>
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
          {comment.author.charAt(0)}
        </div>
        <div className="ml-2">
          <div className="font-semibold text-gray-800">{comment.author}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {comment.timestamp}
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-3">{comment.content}</p>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleLike(comment.id)}
          className="flex items-center text-gray-500 hover:text-blue-500"
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          <span>{comment.likes}</span>
        </button>
        
        <button
          onClick={() => setReplyingTo(comment.id)}
          className="flex items-center text-gray-500 hover:text-blue-500"
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          Reply
        </button>
      </div>

      {comment.replies?.map(reply => (
        <Comment key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="bg-white rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h1>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
            {post.author.charAt(0)}
          </div>
          <div className="ml-3">
            <div className="font-semibold">{post.author}</div>
            <div className="text-sm text-gray-500">{post.timestamp}</div>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <div className="flex items-center gap-4">
          <button className="flex items-center text-gray-500 hover:text-blue-500">
            <Heart className="w-5 h-5 mr-1" />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center text-gray-500 hover:text-blue-500">
            <MessageCircle className="w-5 h-5 mr-1" />
            <span>{post.comments.length} Comments</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <form onSubmit={handleComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            {replyingTo ? "Reply" : "Comment"}
          </button>
        </form>
        {replyingTo && (
          <button
            onClick={() => setReplyingTo(null)}
            className="text-sm text-gray-500 mt-2 hover:text-gray-700"
          >
            Cancel reply
          </button>
        )}
      </div>

      <div className="space-y-4">
        {post.comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default MedicalForum;