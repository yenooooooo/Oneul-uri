/** PWA 설치 배너 표시 여부 관련 상수 */
const INSTALL_DISMISSED_KEY = "pwa-install-dismissed";

/**
 * 사용자가 PWA 설치 배너를 이전에 닫았는지 확인한다.
 * localStorage에 저장된 값으로 판단
 * @returns 이전에 닫은 경우 true
 */
export function isInstallDismissed(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(INSTALL_DISMISSED_KEY) === "true";
}

/**
 * PWA 설치 배너를 닫은 것으로 기록한다.
 * 한 번 닫으면 다시 안 보여줌
 */
export function dismissInstallPrompt(): void {
  localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
}

/**
 * 현재 PWA로 실행 중인지 확인한다.
 * standalone 모드 = 홈 화면에서 실행됨
 * @returns PWA 모드로 실행 중이면 true
 */
export function isPWAMode(): boolean {
  if (typeof window === "undefined") return false;

  // iOS Safari standalone 모드 체크
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as unknown as { standalone: boolean }).standalone);

  return !!isStandalone;
}

/**
 * iOS 기기인지 확인한다.
 * iOS에서는 PWA 설치 방법이 다르므로 별도 가이드 필요
 * @returns iOS이면 true
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

/**
 * PWA 설치 배너를 보여줘야 하는지 판단한다.
 * 조건: PWA가 아님 + 이전에 닫지 않음
 * @returns 배너를 보여줘야 하면 true
 */
export function shouldShowInstallBanner(): boolean {
  return !isPWAMode() && !isInstallDismissed();
}
