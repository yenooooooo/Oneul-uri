"use client";

import { Component, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * 에러 바운더리 — 자식 컴포넌트 에러 시 폴백 UI 표시
 * 흰 화면 방지, 새로고침 버튼 제공
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary] 렌더링 에러:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-6">
          <div className="text-center space-y-4">
            <p className="text-5xl">😢</p>
            <h2 className="text-lg font-bold text-txt-primary">
              문제가 발생했어요
            </h2>
            <p className="text-sm text-txt-secondary">
              잠시 후 다시 시도해주세요
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-coral-500 text-white rounded-full font-medium active:scale-95 transition-transform"
            >
              <RefreshCw className="w-4 h-4" />
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
