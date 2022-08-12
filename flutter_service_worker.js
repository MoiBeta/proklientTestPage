'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "d65d1dbee3263420c9dd1258b24b5cf0",
"assets/assets/images/logo.png": "9c7f2aafeab80de5410b80cc7f50ac91",
"assets/assets/svg/address.svg": "6deaa2d67b4e602075da71c287575fe3",
"assets/assets/svg/camera.svg": "d870e5c2199e8f83d2951d0d0929c368",
"assets/assets/svg/circle.svg": "d22f9294b13b1db2941dea7e893964d3",
"assets/assets/svg/city.svg": "d381ad128251673ea3b03f911860ca8e",
"assets/assets/svg/email.svg": "2a1ff3aec7108e3b14a448277ca8a7ca",
"assets/assets/svg/facebook.svg": "08d63868889abf4cbe59fefecb904c4e",
"assets/assets/svg/home.svg": "acb20484a67a9b4c7dce95e7df118faf",
"assets/assets/svg/instagram.svg": "40defd64b6ea71740affcd7eb39698f7",
"assets/assets/svg/linkedin.svg": "26d70b1ef54ef9da372f99651411f0f5",
"assets/assets/svg/location.svg": "7c89e5d8c7ddc1b183fcadd39e706da1",
"assets/assets/svg/lock.svg": "406c5f78ef2366e0dabd92e75a4b99c2",
"assets/assets/svg/menu.svg": "2cc305c83f29905a76020b3153761bc6",
"assets/assets/svg/message.svg": "8323cd24d40f75862e27d766f31ead45",
"assets/assets/svg/notification.svg": "4d17ba86a543fd277c7eca8e4ad61c7a",
"assets/assets/svg/phone.svg": "04b434bf80dd74f48143214381e0a750",
"assets/assets/svg/postal_code.svg": "c804b72896f0871e43e3846e8bd73b56",
"assets/assets/svg/round_check.svg": "6a9211afe9130bac806d1c3455602770",
"assets/assets/svg/state.svg": "b2c53fd54b97a514ff72d3343423043c",
"assets/assets/svg/twitter.svg": "ec819851c102be9ec37c10bcc8d4d48f",
"assets/assets/svg/user.svg": "54e73b485d170109dff4055867f791a2",
"assets/assets/svg/user2.svg": "5a31341ae43c1719529a6a8199926cac",
"assets/assets/svg/user3.svg": "abe13231aff76f7f654d23990d621765",
"assets/assets/svg/warning.svg": "720a0c4d6a377e6c9fc844a69d0a02c4",
"assets/assets/svg/youtube.svg": "14b27b9f5417fd692f1f9d17de7c8eac",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "a600d17f55a9eca8294a43055f5494e4",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "4a76b437b2b93f9cb4fd2dff7d1bad6a",
"/": "4a76b437b2b93f9cb4fd2dff7d1bad6a",
"main.dart.js": "1311e9a798d5e43ed151c617eb6ce2c9",
"manifest.json": "cc0e40cef18f47238b0d2a2a67e7d741",
"version.json": "a8947335b0ddea1016240d1f214bcb93"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
