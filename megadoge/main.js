import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, update, get, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBqsj5CkvEP_7MqQmYESgDnsz-VSTimhdw",
  authDomain: "xsweb-6f858.firebaseapp.com",
  databaseURL: "https://xsweb-6f858-default-rtdb.firebaseio.com",
  projectId: "xsweb-6f858",
  storageBucket: "xsweb-6f858.appspot.com",
  messagingSenderId: "599529998192",
  appId: "1:599529998192:web:63c64ed7dcc5208d5971b5",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

// DOM Elements
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

// State
let count = 0;
let country = "Unknown";
let code = "";
let canClick = true;
let openTimeout = null;

// 載入畫面隱藏
function hideLoading() {
  const loader = document.getElementById("loading-screen");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 400);
  }
}

// 切換登入 / 註冊卡牌
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

// 顯示或隱藏導覽按鈕
function showNavButtons(show) {
  btnLogin.style.display = show ? "inline-block" : "none";
  btnRegister.style.display = show ? "inline-block" : "none";
  logoutBtn.style.display = show ? "none" : "inline-block";
}

// 國碼轉旗幟 Emoji
function codeToFlagEmoji(code) {
  if (!code) return "";
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  );
}

// 取得使用者 IP 國家資訊
async function fetchCountryInfo() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return { country: data.country_name || "Unknown", code: data.country_code || "" };
  } catch {
    return { country: "Unknown", code: "" };
  }
}

// bonkdoge 點擊計數邏輯
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

  if (auth.currentUser) {
    update(ref(db, "scores/" + auth.currentUser.uid), {
      score: count,
      country: country,
      code: code,
      timestamp: Date.now(),
    });
  }

  setTimeout(() => {
    canClick = true;
  }, 100);
}

// 更新排行榜資料
function updateLeaderboard() {
  const topRef = ref(db, "scores");
  onValue(topRef, (snapshot) => {
    const countryScores = {};
    snapshot.forEach((child) => {
      const val = child.val();
      const key = (val.country || "Unknown") + "|" + (val.code || "");
      if (!countryScores[key]) {
        countryScores[key] = { score: 0, name: val.country, code: val.code };
      }
      countryScores[key].score += val.score || 0;
    });

    const sorted = Object.values(countryScores).sort((a, b) => b.score - a.score);
    // 顯示前三名
    top1.textContent = codeToFlagEmoji(sorted[0]?.code) + " " + (sorted[0]?.code || "🥇1st");
    top2.textContent = codeToFlagEmoji(sorted[1]?.code) + " " + (sorted[1]?.code || "🥈2nd");
    top3.textContent = codeToFlagEmoji(sorted[2]?.code) + " " + (sorted[2]?.code || "🥉3rd");

    leaderboardList.innerHTML = sorted
      .map(
        (entry) =>
          `<li><span>${codeToFlagEmoji(entry.code)} ${entry.name}</span><span>${entry.score}</span></li>`
      )
      .join("");
  });
}

// 排行榜切換按鈕
toggleBtn.addEventListener("click", () => {
  leaderboard.classList.toggle("show");
  toggleBtn.textContent = leaderboard.classList.contains("show") ? "↓" : "↑";
});

const langToggleBtn = document.getElementById("langToggleBtn");

let currentLang = "en"; // 預設語言

const langMap = {
  "Login": "登入",
  "Register": "註冊",
  "Logout": "登出",
  "Don't have an account?": "沒有帳號？",
  "Already have an account?": "已經有帳號？",
  "Email": "電子郵件",
  "Password": "密碼",
  "Tap Bonk Doge to score high and climb the leaderboard!": "點擊狗狗來得分，登上排行榜！",
  "Global Rankings": "全球排行榜",
  "Loading MegaDoge...": "載入 MegaDoge 中...",
  "Loading...": "載入中...",
  "🌐 Global Rankings": "🌐 全球排行榜",
  "Don't have an account?": "沒有帳戶？",
  "Already have an account?": "擁有帳戶？",
};

function toggleLanguage() {
  currentLang = currentLang === "en" ? "zh" : "en";

  // 修改文字
  const textNodes = document.querySelectorAll("button, h1, h2, span, p, label, div, input::placeholder");

  textNodes.forEach(node => {
    if (node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (currentLang === "zh" && langMap[text]) {
        node.textContent = langMap[text];
      } else if (currentLang === "en") {
        const entry = Object.entries(langMap).find(([en, zh]) => zh === text);
        if (entry) node.textContent = entry[0];
      }
    }
  });

  // 額外處理 placeholder
  const emailInput = document.querySelectorAll('input[type="email"]');
  const passwordInput = document.querySelectorAll('input[type="password"]');
  emailInput.forEach(input => input.placeholder = currentLang === "zh" ? "電子郵件" : "Email");
  passwordInput.forEach(input => input.placeholder = currentLang === "zh" ? "密碼" : "Password");
}

langToggleBtn.addEventListener("click", toggleLanguage);

// bonkdoge 點擊事件綁定
bonkdoge.addEventListener("mousedown", pop);
bonkdoge.addEventListener("touchstart", pop);

// 監聽 Firebase Auth 狀態
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // 使用者已登入，隱藏登入註冊卡牌，顯示遊戲主畫面
    loginCard.style.display = "none";
    registerCard.style.display = "none";
    gameContainer.style.display = "flex";
    showNavButtons(false);

    // 取得使用者國家資訊
    const info = await fetchCountryInfo();
    country = info.country;
    code = info.code;

    // 讀取用戶分數
    const userRef = ref(db, "scores/" + user.uid);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      count = snapshot.val().score || 0;
      counter.textContent = count;
    } else {
      await update(userRef, { score: 0, country, code, timestamp: Date.now() });
      count = 0;
      counter.textContent = count;
    }
    updateLeaderboard();

    // 載入完成後隱藏載入畫面
    hideLoading();

  } else {
    // 登出狀態，顯示登入卡牌，隱藏遊戲主畫面
    gameContainer.style.display = "none";
    loginCard.style.display = "block";
    registerCard.style.display = "none";
    showNavButtons(true);
    count = 0;
    counter.textContent = count;

    // 載入完成後隱藏載入畫面
    hideLoading();
  }
});

// 登入表單提交
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

// 註冊表單提交
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

// 登出按鈕事件
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});