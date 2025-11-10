const CACHE_NAME = 'tugasku-v1.3.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/my-icon.png',
  '/splash.png',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting());
      })
      .catch(error => {
        console.error('Service Worker: Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network with improved strategy
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Add to cache for future requests
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('Fetch failed; returning offline page instead.', error);
            // You could return a custom offline page here
          });
      })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event.notification);
  
  event.notification.close();
  
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then(windowClients => {
    let matchingClient = null;
    
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url.includes('/')) {
        matchingClient = windowClient;
        break;
      }
    }
    
    if (matchingClient) {
      return matchingClient.focus();
    } else {
      return clients.openWindow('/');
    }
  });
  
  event.waitUntil(promiseChain);
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Implement offline task synchronization here
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return new Promise((resolve, reject) => {
    // Simulate background sync process
    console.log('Performing background sync...');
    setTimeout(() => {
      console.log('Background sync completed');
      resolve();
    }, 1000);
  });
}

// Handle push messages
self.addEventListener('push', event => {
  console.log('Push message received:', event);
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  
  const options = {
    body: data.body || 'Anda memiliki tugas yang perlu diperhatikan',
    icon: '/my-icon.png',
    badge: '/my-icon.png',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/' },
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
    self.registration.showNotification(
      data.title || 'TugasKu - Pengingat', 
      options
    )
  );
});

// Handle push subscription changes
self.addEventListener('pushsubscriptionchange', event => {
  console.log('Push subscription changed:', event);
  event.waitUntil(
    // You would typically re-subscribe here and send the new subscription to your server
    self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then(subscription => {
        // Send new subscription to server
        return fetch('/api/update-subscription', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      })
  );
});