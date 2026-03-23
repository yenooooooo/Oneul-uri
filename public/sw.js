/** 오늘우리 Service Worker — 캐싱 + 푸시 알림 수신 */

const CACHE_NAME = "oneul-uri-v1";

/** 오프라인 캐싱할 기본 리소스 목록 */
const PRECACHE_URLS = ["/", "/manifest.json"];

/** Service Worker 설치 — 기본 리소스 프리캐싱 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/** Service Worker 활성화 — 이전 버전 캐시 정리 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // 즉시 클라이언트 제어 시작
  self.clients.claim();
});

/** 네트워크 요청 인터셉트 — 네트워크 우선, 실패 시 캐시 */
self.addEventListener("fetch", (event) => {
  // API, Supabase, Next.js 내부 요청은 캐싱하지 않음
  const url = event.request.url;
  if (
    url.includes("/api/") ||
    url.includes("supabase") ||
    url.includes("_next/") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 성공한 응답은 캐시에 저장
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(async () => {
        // 네트워크 실패 시 캐시에서 응답, 캐시도 없으면 빈 응답
        const cached = await caches.match(event.request);
        return cached || new Response("Offline", { status: 503 });
      })
  );
});

/** 푸시 알림 수신 — 서버에서 보낸 푸시 메시지 처리 */
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  // 알림 표시 옵션
  const options = {
    body: data.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(data.title || "오늘우리", options));
});

/** 푸시 알림 클릭 — 해당 페이지로 이동 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      // 이미 열린 탭이 있으면 포커스
      for (const client of clients) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // 없으면 새 탭 열기
      return self.clients.openWindow(url);
    })
  );
});
