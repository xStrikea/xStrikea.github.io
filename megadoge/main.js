import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, getDocs, collection, query, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBqsj5CkvEP_7MqQmYESgDnsz-VSTimhdw",
  authDomain: "xsweb-6f858.firebaseapp.com",
  projectId: "xsweb-6f858",
  storageBucket: "xsweb-6f858.appspot.com",
  messagingSenderId: "599529998192",
  appId: "1:599529998192:web:63c64ed7dcc5208d5971b5",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// DOM elements
const loginCard = document.getElementById("login-card");
const registerCard = document.getElementById("register-card");
const btnLogin = document.getElementById("btn-login");
const btnRegister = document.getElementById("btn-register");
const toRegister = document.getElementById("to-register");
const toLogin = document.getElementById("to-login");
const logoutBtn = document.getElementById("logoutBtn");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

const gameContainer = document.getElementById("game-container");
const bonkdoge = document.getElementById("bonkdoge");
const counter = document.getElementById("counter");
const leaderboard = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("topScores");
const toggleBtn = document.getElementById("toggleBtn");

const top1 = document.getElementById("top1");
const top2 = document.getElementById("top2");
const top3 = document.getElementById("top3");

const closedImg = "image/doge.png";
const openImg = "image/doge_open.png";

let count = 0;
let country = "Unknown";
let code = "";
let canClick = true;
let openTimeout = null;

// ------------------ Utility Functions ------------------

function hideLoading() {
  const loader = document.getElementById("loading-screen");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => { loader.style.display = "none"; }, 400);
  }
}

function showLogin() {
  loginCard.style.display = "block";
  registerCard.style.display = "none";
}
function showRegister() {
  loginCard.style.display = "none";
  registerCard.style.display = "block";
}
btnLogin.addEventListener("click", showLogin);
btnRegister.addEventListener("click", showRegister);
toRegister.addEventListener("click", showRegister);
toLogin.addEventListener("click", showLogin);

function showNavButtons(show) {
  btnLogin.style.display = show ? "inline-block" : "none";
  btnRegister.style.display = show ? "inline-block" : "none";
  logoutBtn.style.display = show ? "none" : "inline-block";
}

function codeToFlagEmoji(code) {
  if (!code) return "";
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  );
}

async function fetchCountryInfo() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return { country: data.country_name || "Unknown", code: data.country_code || "" };
  } catch {
    return { country: "Unknown", code: "" };
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}
function setCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
}
function getValidCountFromCookie(uid) {
  const val = parseInt(getCookie(`megadoge_count_${uid}`));
  return (typeof val === "number" && !isNaN(val) && val >= 0) ? val : 0;
}

// ------------------ Game Logic ------------------

async function saveScore() {
  if (!auth.currentUser) return;
  const userDoc = doc(db, "scores", auth.currentUser.uid);
  await setDoc(userDoc, { score: count, country, code, timestamp: Date.now() });
  setCookie(`megadoge_count_${auth.currentUser.uid}`, count);
}

function pop() {
  if (!canClick) return;
  canClick = false;
  count++;
  counter.textContent = count;
  bonkdoge.src = openImg;
  new Audio("audio/audio.mp3").play();

  if (openTimeout) clearTimeout(openTimeout);
  openTimeout = setTimeout(() => {
    bonkdoge.src = closedImg;
    openTimeout = null;
  }, 500);

  saveScore();

  setTimeout(() => { canClick = true; }, 100);
}

// ------------------ Leaderboard ------------------

async function updateLeaderboard() {
  try {
    const q = query(collection(db, "scores"), orderBy("score", "desc"));
    const snapshot = await getDocs(q);
    const countryScores = {};

    snapshot.forEach(docSnap => {
      const val = docSnap.data();
      const key = (val.country || "Unknown") + "|" + (val.code || "");
      if (!countryScores[key]) {
        countryScores[key] = { score: 0, name: val.country, code: val.code };
      }
      countryScores[key].score += val.score || 0;
    });

    const sorted = Object.values(countryScores).sort((a, b) => b.score - a.score);
    top1.textContent = codeToFlagEmoji(sorted[0]?.code) + " " + (sorted[0]?.code || "🥇1st");
    top2.textContent = codeToFlagEmoji(sorted[1]?.code) + " " + (sorted[1]?.code || "🥈2nd");
    top3.textContent = codeToFlagEmoji(sorted[2]?.code) + " " + (sorted[2]?.code || "🥉3rd");

    leaderboardList.innerHTML = sorted
      .map(entry => `<li><span>${codeToFlagEmoji(entry.code)} ${entry.name}</span><span>${entry.score}</span></li>`)
      .join("");
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
  }
}

toggleBtn.addEventListener("click", () => {
  leaderboard.classList.toggle("show");
  toggleBtn.textContent = leaderboard.classList.contains("show") ? "↓" : "↑";
});

// ------------------ Language Toggle ------------------

const langToggleBtn = document.getElementById("langToggleBtn");
let currentLang = "en";
const langMap = {
  "Login": "登入",
  "Register": "註冊",
  "Logout": "登出",
  "Don't have an account?": "沒有帳號？",
  "Already have an account?": "已經有帳號？",
  "Email": "電子郵件",
  "Password": "密碼",
  "Global Rankings": "全球排行榜",
  "Loading MegaDoge...": "載入 MegaDoge 中...",
};

function toggleLanguage() {
  currentLang = currentLang === "en" ? "zh" : "en";
  const nodes = document.querySelectorAll("button, h1, h2, span, p, label");
  nodes.forEach(node => {
    if (node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (currentLang === "zh" && langMap[text]) node.textContent = langMap[text];
      else if (currentLang === "en") {
        const entry = Object.entries(langMap).find(([en, zh]) => zh === text);
        if (entry) node.textContent = entry[0];
      }
    }
  });

  const emailInput = document.querySelectorAll('input[type="email"]');
  const passwordInput = document.querySelectorAll('input[type="password"]');
  emailInput.forEach(input => input.placeholder = currentLang === "zh" ? "電子郵件" : "Email");
  passwordInput.forEach(input => input.placeholder = currentLang === "zh" ? "密碼" : "Password");
}
langToggleBtn.addEventListener("click", toggleLanguage);

// ------------------ Auth State ------------------

bonkdoge.addEventListener("mousedown", pop);
bonkdoge.addEventListener("touchstart", pop);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginCard.style.display = "none";
    registerCard.style.display = "none";
    gameContainer.style.display = "flex";
    showNavButtons(false);

    const info = await fetchCountryInfo();
    country = info.country;
    code = info.code;

    count = getValidCountFromCookie(user.uid);
    if (count === 0) {
      const userDoc = doc(db, "scores", user.uid);
      const snapshot = await getDoc(userDoc);
      if (snapshot.exists()) count = snapshot.data().score || 0;
      setCookie(`megadoge_count_${user.uid}`, count);
    } else {
      await saveScore();
    }

    counter.textContent = count;
    updateLeaderboard();
    hideLoading();
  } else {
    gameContainer.style.display = "none";
    loginCard.style.display = "block";
    registerCard.style.display = "none";
    showNavButtons(true);
    count = 0;
    counter.textContent = count;
    hideLoading();
  }
});

// ------------------ Login & Register ------------------

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const email = loginForm["login-email"].value.trim();
  const password = loginForm["login-password"].value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    loginError.textContent = err.message;
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  registerError.textContent = "";
  const email = registerForm["register-email"].value.trim();
  const password = registerForm["register-password"].value.trim();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    registerError.textContent = err.message;
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));