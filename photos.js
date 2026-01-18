import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const photoInput = document.getElementById("photo-input");
const photoGrid = document.getElementById("photo-grid");

const photosRef = ref(storage, "photos");

const addImageToGrid = (url) => {
  if (!photoGrid) {
    return;
  }
  const img = document.createElement("img");
  img.src = url;
  img.alt = "Trip photo";
  photoGrid.prepend(img);
};

const loadExistingPhotos = async () => {
  if (!photoGrid) {
    return;
  }
  photoGrid.innerHTML = "";
  const { items } = await listAll(photosRef);
  const urls = await Promise.all(items.map((item) => getDownloadURL(item)));
  urls.forEach((url) => addImageToGrid(url));
};

const uploadPhoto = async (file) => {
  const safeName = `${Date.now()}-${file.name}`;
  const fileRef = ref(photosRef, safeName);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  addImageToGrid(url);
};

if (photoInput) {
  photoInput.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }
      await uploadPhoto(file);
    }
    photoInput.value = "";
  });
}

loadExistingPhotos().catch((error) => {
  console.error("Failed to load photos", error);
});
