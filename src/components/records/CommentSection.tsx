"use client";

import { useState } from "react";
import { useRecordComments } from "@/hooks/useRecordComments";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import { Send, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { RecordComment } from "@/types/comment";

/** CommentSection 컴포넌트 props */
interface CommentSectionProps {
  recordId: string;
}

/**
 * 댓글 섹션 — 기록 상세 하단에 표시
 * 인스타 스타일: 이모지 + 닉네임 + 내용 + 시간 + 수정/삭제
 */
export default function CommentSection({ recordId }: CommentSectionProps) {
  const { comments, loading, addComment, updateComment, deleteComment } = useRecordComments(recordId);
  const { couple } = useCouple();
  const { user } = useAuth();
  const [input, setInput] = useState(""); // 새 댓글 입력

  /** 댓글 작성 */
  const handleSend = async () => {
    if (!input.trim()) return;
    const ok = await addComment(input);
    if (ok) setInput("");
  };

  /** 작성자 정보 반환 */
  const getAuthor = (authorId: string) => {
    if (!couple) return { emoji: "💬", name: "알 수 없음" };
    if (authorId === couple.user1_id) return { emoji: couple.user1_emoji, name: couple.user1_nickname };
    if (authorId === couple.user2_id) return { emoji: couple.user2_emoji, name: couple.user2_nickname };
    return { emoji: "💬", name: "알 수 없음" };
  };

  /** 시간 표시 (방금 전, N분 전, N시간 전, N일 전) */
  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "방금 전";
    if (min < 60) return `${min}분 전`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}시간 전`;
    return `${Math.floor(hr / 24)}일 전`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-txt-primary">
        댓글 {comments.length > 0 && `${comments.length}`}
      </h3>

      {/* 댓글 목록 */}
      {!loading && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              author={getAuthor(comment.author_id)}
              isMine={comment.author_id === user?.id}
              timeAgo={timeAgo(comment.created_at)}
              isEdited={comment.updated_at !== comment.created_at}
              onUpdate={updateComment}
              onDelete={deleteComment}
            />
          ))}
        </div>
      )}

      {/* 댓글 입력 */}
      <div className="flex gap-2 items-center">
        <span className="text-xl flex-shrink-0">
          {couple && user
            ? (user.id === couple.user1_id ? couple.user1_emoji : couple.user2_emoji)
            : "💬"}
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="댓글을 남겨보세요..."
          className="flex-1 h-10 bg-white rounded-xl border border-gray-200 px-4 text-sm focus:border-coral-500 focus:ring-1 focus:ring-inset focus:ring-coral-500/20 focus:outline-none transition-colors duration-200"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2 text-coral-400 disabled:opacity-30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/** 개별 댓글 아이템 */
function CommentItem({
  comment, author, isMine, timeAgo, isEdited, onUpdate, onDelete,
}: {
  comment: RecordComment;
  author: { emoji: string; name: string };
  isMine: boolean;
  timeAgo: string;
  isEdited: boolean;
  onUpdate: (id: string, content: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  /** 수정 저장 */
  const handleSave = async () => {
    if (!editText.trim()) return;
    const ok = await onUpdate(comment.id, editText.trim());
    if (ok) setEditing(false);
  };

  return (
    <div className="flex gap-2.5">
      {/* 작성자 이모지 */}
      <span className="text-lg flex-shrink-0 mt-0.5">{author.emoji}</span>

      <div className="flex-1 min-w-0">
        {/* 닉네임 + 시간 */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${
            isMine ? "text-blue-soft" : "text-pink-soft"
          }`}>
            {author.name}
          </span>
          <span className="text-[10px] text-txt-tertiary">{timeAgo}</span>
          {isEdited && <span className="text-[10px] text-txt-tertiary">(수정됨)</span>}
        </div>

        {/* 댓글 내용 또는 수정 입력 */}
        {editing ? (
          <div className="flex gap-1.5 mt-1">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="flex-1 h-10 bg-white rounded-xl border border-gray-200 px-4 text-sm focus:border-coral-500 focus:ring-1 focus:ring-inset focus:ring-coral-500/20 focus:outline-none transition-colors duration-200"
              autoFocus
            />
            <button onClick={handleSave} className="text-xs text-coral-400 font-medium">저장</button>
            <button onClick={() => setEditing(false)} className="text-xs text-txt-tertiary">취소</button>
          </div>
        ) : (
          <p className="text-sm text-txt-primary mt-0.5">{comment.content}</p>
        )}
      </div>

      {/* 내 댓글만 수정/삭제 메뉴 */}
      {isMine && !editing && (
        <div className="relative flex-shrink-0">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-txt-tertiary">
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 bg-white rounded-xl shadow-card border border-cream-dark z-10 py-1 min-w-[80px]">
              <button
                onClick={() => { setMenuOpen(false); setEditing(true); setEditText(comment.content); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-txt-primary hover:bg-cream w-full">
                <Pencil className="w-3 h-3" /> 수정
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete(comment.id); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-error hover:bg-cream w-full">
                <Trash2 className="w-3 h-3" /> 삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
