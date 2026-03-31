"use client";

import { useEffect } from "react";
import { useModalState } from "@/hooks/useModalState";

/**
 * 모달/오버레이 열릴 때 뒷배경 스크롤 방지 + BottomNav 숨김 훅
 * 마운트 시: body overflow hidden + 모달 열림 알림
 * 언마운트 시: 복원 + 모달 닫힘 알림
 */
export function useLockScroll() {
  const { openModal, closeModal } = useModalState();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    openModal();
    return () => {
      document.body.style.overflow = "";
      closeModal();
    };
  }, [openModal, closeModal]);
}
