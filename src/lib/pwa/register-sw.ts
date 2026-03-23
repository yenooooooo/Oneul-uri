/**
 * Service Worker를 브라우저에 등록한다.
 * 새 버전 감지 시 자동으로 활성화 + 페이지 새로고침
 * NEXT_PUBLIC_DISABLE_SW=true면 등록하지 않음
 */
export async function registerServiceWorker(): Promise<void> {
  // 개발 중 SW 비활성화 옵션
  if (process.env.NEXT_PUBLIC_DISABLE_SW === "true") {
    console.log("[register-sw] SW 비활성화됨 (NEXT_PUBLIC_DISABLE_SW=true)");
    return;
  }

  if (!("serviceWorker" in navigator)) {
    console.warn("[register-sw] Service Worker를 지원하지 않는 브라우저입니다.");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("[register-sw] 등록 성공:", registration.scope);

    // 새 버전 감지 시 자동 활성화 + 새로고침
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        // 새 SW가 활성화되면 페이지 새로고침 (최신 코드 반영)
        if (
          newWorker.state === "activated" &&
          navigator.serviceWorker.controller
        ) {
          console.log("[register-sw] 새 버전 감지 → 새로고침");
          window.location.reload();
        }
      });
    });
  } catch (error) {
    console.error("[register-sw] 등록 실패:", error);
  }
}
