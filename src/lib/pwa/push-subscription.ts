/**
 * 푸시 알림 구독을 요청하고 구독 정보를 반환한다.
 * 사용자 인터랙션(버튼 클릭 등) 중에만 호출 가능 (iOS 제약)
 * @param vapidPublicKey - VAPID 공개 키 (Base64 URL-safe)
 * @returns PushSubscription 또는 null (거부/미지원)
 */
export async function subscribePush(
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  try {
    // Service Worker 등록 확인
    const registration = await navigator.serviceWorker.ready;

    // 이미 구독 중인지 확인
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log("[push-subscription] 이미 구독 중");
      return existingSubscription;
    }

    // VAPID 키를 ArrayBuffer로 변환
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey).buffer as ArrayBuffer;

    // 푸시 알림 구독 요청 (사용자에게 허용 팝업 표시됨)
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    console.log("[push-subscription] 구독 성공");
    return subscription;
  } catch (error) {
    console.error("[push-subscription] 구독 실패:", error);
    return null;
  }
}

/**
 * 푸시 알림 구독을 해제한다.
 * @returns 해제 성공 여부
 */
export async function unsubscribePush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) return true;

    // 구독 해제
    const result = await subscription.unsubscribe();
    console.log("[push-subscription] 구독 해제:", result);
    return result;
  } catch (error) {
    console.error("[push-subscription] 해제 실패:", error);
    return false;
  }
}

/**
 * Base64 URL-safe 문자열을 Uint8Array로 변환한다.
 * VAPID 키 변환에 사용
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
