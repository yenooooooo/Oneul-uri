"use client";

import { useRouter } from "next/navigation";
import { useCouple } from "@/hooks/useCouple";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoupleCreateForm from "@/components/common/CoupleCreateForm";
import CoupleJoinForm from "@/components/common/CoupleJoinForm";
import { Heart, Loader2 } from "lucide-react";
import { useEffect } from "react";

/**
 * 커플 스페이스 설정 페이지 — /couple
 * 새 스페이스 만들기 / 초대 코드로 참여하기 두 가지 탭 제공
 * 이미 커플 스페이스가 있으면 홈으로 리다이렉트
 */
export default function CouplePage() {
  const router = useRouter();
  const { couple, loading, createSpace, joinSpace } = useCouple();

  // 이미 커플 스페이스가 있으면 홈으로 이동
  useEffect(() => {
    if (!loading && couple) {
      router.push("/");
    }
  }, [couple, loading, router]);

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-coral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-6">
      {/* 헤더 */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="w-16 h-16 bg-coral-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <h1 className="text-2xl font-bold text-txt-primary">
          커플 스페이스
        </h1>
        <p className="text-sm text-txt-secondary mt-1">
          둘만의 공간을 만들어보세요
        </p>
      </div>

      {/* 탭 — 새로 만들기 / 참여하기 */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-card">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-full bg-cream-dark">
            <TabsTrigger value="create" className="rounded-full">
              새로 만들기
            </TabsTrigger>
            <TabsTrigger value="join" className="rounded-full">
              참여하기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-4">
            <CoupleCreateForm onSubmit={createSpace} />
          </TabsContent>

          <TabsContent value="join" className="mt-4">
            <CoupleJoinForm
              onSubmit={joinSpace}
              onSuccess={() => {
                router.push("/");
                router.refresh();
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
