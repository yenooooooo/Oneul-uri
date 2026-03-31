"use client";

import { createContext, useContext, useState, useCallback } from "react";

/**
 * 모달 열림 상태 전역 관리 — BottomNav 숨김 제어용
 * 모달이 열리면 BottomNav를 숨기고, 닫히면 다시 표시
 */
interface ModalStateContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const ModalStateContext = createContext<ModalStateContextType>({
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

/** 모달 상태 Provider */
export function ModalStateProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0); // 열린 모달 수 (중첩 대응)

  const openModal = useCallback(() => setCount((c) => c + 1), []);
  const closeModal = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);

  return (
    <ModalStateContext.Provider value={{ isModalOpen: count > 0, openModal, closeModal }}>
      {children}
    </ModalStateContext.Provider>
  );
}

/** 모달 상태 사용 훅 */
export function useModalState() {
  return useContext(ModalStateContext);
}
