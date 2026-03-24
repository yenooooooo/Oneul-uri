/** 오늘우리 Service Worker — 네트워크 우선 + 푸시 알림 */

/** 캐시 버전 — 배포마다 변경하여 이전 캐시 자동 삭제 */
const CACHE_VERSION = 2;
const CACHE_NAME = `oneul-uri-v${CACHE_VERSION}`;

/**
 * 설치 — 이전 SW를 즉시 교체 (skipWaiting)
 * 프리캐싱은 최소한만 (HTML은 항상 네트워크에서 가져옴)
 */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

/**
 * 활성화 — 이전 버전 캐시 모두 삭제 + 즉시 클라이언트 제어
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

/**
 * fetch 인터셉트 — 네트워크 우선 전략
 * HTML/페이지 요청: 항상 네트워크에서 가져옴 (캐시 안 함)
 * 이미지/폰트: 네트워크 우선, 실패 시 캐시
 */
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // 캐싱하지 않는 요청들
  if (
    url.includes("/api/") ||
    url.includes("supabase") ||
    url.includes("_next/") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  // HTML 네비게이션 요청은 항상 네트워크 (캐시 안 함 → 최신 버전 보장)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((r) => r || new Response("Offline", { status: 503 }))
      )
    );
    return;
  }

  // 나머지 (이미지, 폰트 등): 네트워크 우선 + 캐시 폴백
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        return cached || new Response("Offline", { status: 503 });
      })
  );
});

/** 푸시 알림 수신 */
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title ?? "", {
      body: data.body || "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url || "/" },
    })
  );
});

/** 푸시 알림 클릭 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
