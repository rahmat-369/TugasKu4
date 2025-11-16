// sw.js - Service Worker TugasKu PRO v5.9.2
const CACHE_NAME = 'tugasku-pro-v5.9.2';
const DYNAMIC_CACHE = 'tugasku-dynamic-v1';
const urlsToCache = [
  './',
  './index.html',
  './my-icon.png',
  './splash.png',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// Install event - cache resources dengan strategi yang lebih baik
self.addEventListener('install', event => {
  console.log('🔄 Service Worker: Installing v5.9.2...');
  
  self.skipWaiting(); // Paksa aktivasi segera
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache)
          .then(() => {
            console.log('✅ Service Worker: All resources cached successfully');
          })
          .catch(error => {
            console.error('❌ Service Worker: Cache failed:', error);
          });
      })
  );
});

// Activate event - clean up old caches dengan lebih agresif
self.addEventListener('activate', event => {
  console.log('🎯 Service Worker: Activating v5.9.2...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Hapus SEMUA cache lama kecuali yang saat ini
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker: Cleanup completed');
      return self.clients.claim(); // Ambil kendali semua clients
    })
    .then(() => {
      // Kirim pesan ke semua clients bahwa SW sudah update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: '5.9.2'
          });
        });
      });
    })
  );
});

// Fetch event - strategi cache yang lebih cerdas
self.addEventListener('fetch', event => {
  // Skip non-GET requests dan external requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Untuk HTML, gunakan network first strategy untuk memastikan update
  if (event.request.url.includes('/index.html') || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Update cache dengan response terbaru
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // Fallback ke cache jika offline
          return caches.match(event.request);
        })
    );
    return;
  }

  // Untuk resources lainnya, gunakan cache first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Selalu cek update di background untuk resources yang di-cache
          fetch(event.request)
            .then(response => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseClone);
                  });
              }
            })
            .catch(() => {
              // Ignore fetch errors untuk background update
            });
          
          return cachedResponse;
        }

        // Jika tidak ada di cache, fetch dari network
        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(error => {
            console.log('🌐 Fetch failed:', error);
            // Untuk CSS/JS, coba serve dari cache meskipun request berbeda
            if (event.request.destination === 'script' || event.request.destination === 'style') {
              return caches.match(event.request.url);
            }
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Handle messages dari client
self.addEventListener('message', event => {
  console.log('📨 Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION_INFO',
      version: '5.9.2',
      cacheName: CACHE_NAME
    });
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('🔔 Notification clicked:', event.notification);
  
  event.notification.close();
  
  const promiseChain = self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then(windowClients => {
    let matchingClient = null;
    
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url.includes(self.location.origin)) {
        matchingClient = windowClient;
        break;
      }
    }
    
    if (matchingClient) {
      return matchingClient.focus();
    } else {
      return self.clients.openWindow('./');
    }
  });
  
  event.waitUntil(promiseChain);
});

// Background sync untuk offline functionality
self.addEventListener('sync', event => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    console.log('🔄 Performing background sync...');
    // Di sini Anda bisa menambahkan logika sync data offline
    // Misalnya: sync tugas yang dibuat saat offline
    
    const cache = await caches.open(DYNAMIC_CACHE);
    console.log('✅ Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Handle push messages
self.addEventListener('push', event => {
  console.log('📨 Push message received:', event);
  
  let data = {
    title: 'TugasKu PRO',
    body: 'Anda memiliki tugas yang perlu diperhatikan',
    icon: './my-icon.png',
    badge: './my-icon.png'
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      console.log('Push data bukan JSON, menggunakan default');
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [100, 50, 100],
    data: {
      url: data.url || './',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'Lihat Tugas'
      },
      {
        action: 'dismiss', 
        title: 'Tutup'
      }
    ],
    tag: 'tugasku-notification',
    renotify: true,
    requireInteraction: true
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Periodic sync untuk update background (jika browser support)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'content-update') {
      console.log('🔄 Periodic sync for content update');
      event.waitUntil(updateContent());
    }
  });
}

async function updateContent() {
  try {
    // Cek update untuk content yang sering berubah
    const cache = await caches.open(CACHE_NAME);
    console.log('✅ Periodic sync completed');
  } catch (error) {
    console.error('❌ Periodic sync failed:', error);
  }
}

// Cache warming - preload resources penting saat idle
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'WARM_CACHE') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(urls);
      })
    );
  }
});

// Error handling global
self.addEventListener('error', event => {
  console.error('❌ Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('❌ Service Worker Unhandled Rejection:', event.reason);
});
