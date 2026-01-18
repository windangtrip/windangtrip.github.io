import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMcltIQXIbIEa1pzWn2Cr1QMjR8awAmfc",
  authDomain: "windang-67439.firebaseapp.com",
  projectId: "windang-67439",
  storageBucket: "windang-67439.firebasestorage.app",
  messagingSenderId: "721949397628",
  appId: "1:721949397628:web:8c07862ffd48eb11c4aff9",
  measurementId: "G-B97DXS0J5N",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const people = [
  { key: "jacob", label: "Jacob" },
  { key: "harc", label: "Harc" },
  { key: "liamP", label: "Liam P" },
];

const cardFor = (key) => document.querySelector(`.cone-card[data-person="${key}"]`);
const countFor = (key) => document.getElementById(`count-${key}`);
const counts = {};

const updateLeader = () => {
  const values = people.map((person) => ({
    key: person.key,
    value: typeof counts[person.key] === "number" ? counts[person.key] : 0,
  }));

  const maxValue = Math.max(...values.map((entry) => entry.value));
  let leaders = values.filter((entry) => entry.value === maxValue).map((entry) => entry.key);
  if (leaders.length === people.length) {
    leaders = [];
  }

  const glowStrength = 0.62;

  people.forEach((person) => {
    const card = cardFor(person.key);
    if (!card) {
      return;
    }
    if (leaders.includes(person.key)) {
      card.classList.add("cone-leader");
      card.style.setProperty("--cone-glow", glowStrength.toFixed(2));
    } else {
      card.classList.remove("cone-leader");
      card.style.removeProperty("--cone-glow");
    }
  });
};

const ensureDoc = async (key) => {
  const ref = doc(db, "coneCounters", key);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { count: 0, name: key });
  }
  return ref;
};

const wireCard = async (person) => {
  const card = cardFor(person.key);
  const countEl = countFor(person.key);
  if (!card || !countEl) {
    return;
  }

  const ref = await ensureDoc(person.key);

  onSnapshot(ref, (snap) => {
    const data = snap.data();
    const nextCount = typeof data?.count === "number" ? data.count : 0;
    countEl.textContent = nextCount;
    counts[person.key] = nextCount;
    updateLeader();
  });

  card.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    const delta = button.dataset.action === "increment" ? 1 : -1;
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      const current = snap.data()?.count ?? 0;
      const next = Math.max(0, current + delta);
      transaction.update(ref, { count: next });
    });
  });
};

people.forEach((person) => {
  wireCard(person).catch((error) => {
    console.error("Failed to wire counter", person.key, error);
  });
});
