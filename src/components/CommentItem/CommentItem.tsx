import { useState } from "react";
import { Pencil, Trash2, Reply as ReplyIcon, Check, X } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import {
  editComment,
  deleteComment,
  addComment,
} from "../../features/comments/commentsSlice";
import type { Comment } from "../../features/comments/commentsSlice";

interface CommentItemProps {
  comment: Comment;
  videoId: string;
  replies: Comment[];
}

const formatTimeAgo = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const CommentItem = ({ comment, videoId, replies }: CommentItemProps) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditSave = () => {
    if (editText.trim() === "") return;
    dispatch(editComment({ videoId, commentId: comment.id, text: editText.trim() }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteComment({ videoId, commentId: comment.id }));
    setShowDeleteConfirm(false);
  };

  const handleReplySubmit = () => {
    if (replyText.trim() === "") return;
    dispatch(addComment({ videoId, text: replyText.trim(), parentId: comment.id }));
    setReplyText("");
    setIsReplying(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isEditing) handleEditSave();
      if (isReplying) handleReplySubmit();
    }
    if (e.key === "Escape") {
      if (isEditing) {
        setIsEditing(false);
        setEditText(comment.text);
      }
      if (isReplying) {
        setIsReplying(false);
        setReplyText("");
      }
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex gap-3 group">
      <div className="w-8 h-8 rounded-full bg-neutral-700 flex-shrink-0 flex items-center justify-center text-xs font-semibold">
        {comment.author.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{comment.author}</span>
          <span className="text-xs text-neutral-500">{formatTimeAgo(comment.createdAt)}</span>
        </div>

        {isEditing ? (
          <div className="mt-1">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex gap-2 mt-2 text-xs">
              <button
                onClick={handleEditSave}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer"
              >
                <Check size={14} /> Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(comment.text);
                }}
                className="flex items-center gap-1 px-3 py-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-200 mt-1">{comment.text}</p>
        )}

        {!isEditing && (
          <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsReplying((prev) => !prev)}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
            >
              <ReplyIcon size={14} /> Reply
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 cursor-pointer"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a reply..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex gap-2 mt-2 text-xs">
              <button
                onClick={handleReplySubmit}
                className="flex items-center gap-1 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer"
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setIsReplying(false);
                  setReplyText("");
                }}
                className="flex items-center gap-1 px-4 py-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mt-4 pl-4 border-l border-neutral-800 flex flex-col gap-4">
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-700 flex-shrink-0 flex items-center justify-center text-[10px] font-semibold">
                  {reply.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">{reply.author}</span>
                    <span className="text-[10px] text-neutral-500">
                      {formatTimeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200 mt-0.5">{reply.text}</p>
                  <button
                    onClick={() => dispatch(deleteComment({ videoId, commentId: reply.id }))}
                    className="text-[10px] text-neutral-500 hover:text-red-400 mt-1 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-white">Delete comment?</h3>
            <p className="text-neutral-400 mt-2 text-sm">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-sm font-medium text-white border border-neutral-700 rounded-full hover:bg-neutral-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-full cursor-pointer transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;