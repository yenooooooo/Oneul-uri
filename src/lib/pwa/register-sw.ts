/**
 * Service Worker를 브라우저에 등록한다.
 * 페이지 로드 완료 후 호출해야 한다.
 */
export async function registerServiceWorker(): Promise<void> {
  // Service Worker를 지원하지 않는 브라우저는 무시
  if (!("serviceWorker" in navigator)) {
    console.warn("[register-sw] Service Worker를 지원하지 않는 브라우저입니다.");
    return;
  }

  try {
    // /sw.js 파일을 Service Worker로 등록
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("[register-sw] 등록 성공:", registration.scope);
  } catch (error) {
    console.error("[register-sw] 등록 실패:", error);
  }
}
