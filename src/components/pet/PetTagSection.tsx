"use client";

interface Props {
  likes: string[];
  dislikes: string[];
}

/**
 * 좋아하는 것 / 싫어하는 것 태그 섹션
 * 하트/엑스 아이콘 + 파스텔 칩
 */
export default function PetTagSection({ likes, dislikes }: Props) {
  if (likes.length === 0 && dislikes.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* 좋아하는 것 */}
      {likes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-green-600 flex items-center gap-1">
            💚 좋아하는 것
          </h4>
          <div className="flex flex-wrap gap-2">
            {likes.map((tag) => (
              <span key={tag}
                className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 싫어하는 것 */}
      {dislikes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-coral-500 flex items-center gap-1">
            💔 싫어하는 것
          </h4>
          <div className="flex flex-wrap gap-2">
            {dislikes.map((tag) => (
              <span key={tag}
                className="bg-coral-50 text-coral-600 px-3 py-1.5 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
