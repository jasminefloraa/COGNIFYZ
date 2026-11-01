"use strict";

document.documentElement.classList.add("js-ready");

const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeIcon = document.querySelector(".theme-icon");
const hero = document.querySelector(".hero");

function initializeTheme() {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("cognifyz-theme");
  } catch (error) {
    console.warn("Theme preference could not be read from local storage.", error);
  }
  applyTheme(savedTheme === "dark" ? "dark" : "light");
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  themeIcon.textContent = isDark ? "☼" : "◐";
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#14150f" : "#f7f5ef";
}

function toggleTheme() {
  const bounds = themeToggle.getBoundingClientRect();
  document.body.style.setProperty("--ripple-x", `${bounds.left + bounds.width / 2}px`);
  document.body.style.setProperty("--ripple-y", `${bounds.top + bounds.height / 2}px`);
  document.body.classList.remove("theme-ripple");
  void document.body.offsetWidth;
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  document.body.classList.add("theme-ripple");
  window.setTimeout(() => document.body.classList.remove("theme-ripple"), 600);
  try {
    localStorage.setItem("cognifyz-theme", nextTheme);
  } catch (error) {
    console.warn("Theme preference could not be saved to local storage.", error);
  }
}

themeToggle.addEventListener("click", toggleTheme);

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isOpen);
});
navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        sectionLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`) link.classList.add("is-current");
          else link.classList.remove("is-current");
        });
      }
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  document.querySelectorAll("main section[id]").forEach((section) => navObserver.observe(section));
}

const nodeContent = {
  data: ["Data gives an interface something to respond to.", "Information travels through structure, expression, and interaction."],
  structure: ["Give ideas a foundation.", "HTML makes content meaningful, navigable, and accessible."],
  css: ["Make information clear.", "CSS brings structure to life with visual expression."],
  response: ["Make interactions matter.", "JavaScript turns input into a thoughtful response."]
};
const nodeTitle = document.querySelector("#node-title");
const nodeDescription = document.querySelector("#node-description");
const nodes = document.querySelectorAll(".node");
const networkGraphic = document.querySelector(".network-lines");
function selectNode(key) {
  const node = Array.from(nodes).find((item) => item.dataset.node === key);
  if (!node) return;
  nodes.forEach((item) => {
    const selected = item === node;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  const [title, description] = nodeContent[node.dataset.node];
  nodeTitle.textContent = title;
  nodeDescription.textContent = description;
}
nodes.forEach((node) => node.addEventListener("click", () => selectNode(node.dataset.node)));

document.querySelectorAll(".float-object").forEach((object) => {
  object.addEventListener("click", () => {
    if (object.classList.contains("theme-object")) {
      toggleTheme();
    } else {
      selectNode(object.dataset.node);
    }
    object.closest(".float-item").classList.remove("is-popped");
    void object.offsetWidth;
    object.closest(".float-item").classList.add("is-popped");
    window.setTimeout(() => object.closest(".float-item")?.classList.remove("is-popped"), 400);
  });
});

const heroTitle = document.querySelector("#hero-title");
const textWalker = document.createTreeWalker(heroTitle, NodeFilter.SHOW_TEXT);
const titleTextNodes = [];
while (textWalker.nextNode()) titleTextNodes.push(textWalker.currentNode);
let titleWordIndex = 0;
titleTextNodes.forEach((textNode) => {
  const fragments = textNode.textContent.split(/(\s+)/);
  const fragment = document.createDocumentFragment();
  fragments.forEach((part) => {
    if (!part || /^\s+$/.test(part)) {
      fragment.append(document.createTextNode(part));
    } else {
      const word = document.createElement("span");
      word.className = "hero-title-word";
      word.style.setProperty("--word-index", String(titleWordIndex++));
      word.textContent = part;
      fragment.append(word);
    }
  });
  textNode.replaceWith(fragment);
});

const floatItems = document.querySelectorAll(".float-item");
const cursorFollower = document.querySelector(".cursor-follower");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let heroInView = false;
let frameRequest = 0;
let cursorInHero = false;
let pointerOnFloat = false;

function updateParallax() {
  frameRequest = 0;
  if (!heroInView || document.hidden || reduceMotion.matches || pointerOnFloat) return;
  const bounds = hero.getBoundingClientRect();
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  floatItems.forEach((item) => {
    const depth = Number(item.dataset.depth);
    const moveX = Math.max(-12, Math.min(12, (pointerX - centerX) * depth * -.018));
    const moveY = Math.max(-9, Math.min(9, (pointerY - centerY) * depth * -.014));
    const scrollY = Math.max(-18, Math.min(22, -bounds.top * depth * .055));
    item.style.setProperty("--parallax-x", `${moveX.toFixed(2)}px`);
    item.style.setProperty("--parallax-y", `${moveY.toFixed(2)}px`);
    item.style.setProperty("--scroll-y", `${scrollY.toFixed(2)}px`);
  });
  if (cursorInHero) {
    cursorFollower.style.left = `${pointerX}px`;
    cursorFollower.style.top = `${pointerY}px`;
  }
  frameRequest = window.requestAnimationFrame(updateParallax);
}

// One animation frame updates every float; observers and tab visibility pause the loop.
function setNetworkMotion(paused) {
  if (typeof networkGraphic.pauseAnimations !== "function") return;
  if (paused) networkGraphic.pauseAnimations();
  else networkGraphic.unpauseAnimations();
}

function startParallax() {
  if (!frameRequest && heroInView && !document.hidden && !reduceMotion.matches) {
    setNetworkMotion(false);
    frameRequest = window.requestAnimationFrame(updateParallax);
  }
}
function pauseParallax() {
  if (frameRequest) window.cancelAnimationFrame(frameRequest);
  frameRequest = 0;
  setNetworkMotion(true);
}

if ("IntersectionObserver" in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroInView = entry.isIntersecting;
    if (heroInView) startParallax();
    else {
      pauseParallax();
      cursorFollower.classList.remove("is-visible");
    }
  }, { threshold: 0.01 });
  heroObserver.observe(hero);
} else {
  heroInView = true;
  startParallax();
}
if (reduceMotion.matches) setNetworkMotion(true);

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (event.pointerType === "mouse" && window.matchMedia("(pointer: fine)").matches && !reduceMotion.matches) {
    cursorInHero = hero.contains(event.target);
    cursorFollower.classList.toggle("is-visible", cursorInHero);
    startParallax();
  }
}, { passive: true });

document.querySelectorAll("a, button, input, textarea").forEach((element) => {
  element.addEventListener("pointerenter", () => {
    if (window.matchMedia("(pointer: fine)").matches && !reduceMotion.matches) cursorFollower.classList.add("is-hovering");
    if (element.matches(".float-object")) {
      pointerOnFloat = true;
      pauseParallax();
    }
  });
  element.addEventListener("pointerleave", () => {
    cursorFollower.classList.remove("is-hovering");
    if (element.matches(".float-object")) {
      pointerOnFloat = false;
      startParallax();
    }
  });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseParallax();
  else startParallax();
});
reduceMotion.addEventListener?.("change", () => {
  if (reduceMotion.matches) {
    pauseParallax();
    cursorFollower.classList.remove("is-visible");
  } else {
    startParallax();
  }
});

const scrollProgress = document.querySelector(".scroll-progress span");
const scrollCue = document.querySelector(".scroll-cue");
function updateScrollDetails() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
  scrollCue.classList.toggle("is-hidden", window.scrollY > 100);
  startParallax();
}
window.addEventListener("scroll", updateScrollDetails, { passive: true });
window.addEventListener("resize", updateScrollDetails, { passive: true });
updateScrollDetails();

document.querySelectorAll(".hero-actions .button").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || reduceMotion.matches) return;
    const bounds = button.getBoundingClientRect();
    const distanceX = (event.clientX - (bounds.left + bounds.width / 2)) / bounds.width;
    const distanceY = (event.clientY - (bounds.top + bounds.height / 2)) / bounds.height;
    button.style.setProperty("--mag-x", `${(distanceX * 8).toFixed(1)}px`);
    button.style.setProperty("--mag-y", `${(distanceY * 8).toFixed(1)}px`);
  });
  button.addEventListener("pointerleave", () => {
    button.style.removeProperty("--mag-x");
    button.style.removeProperty("--mag-y");
  });
});

document.querySelectorAll(".layer-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || reduceMotion.matches) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--shine-x", `${x * 100}%`);
    card.style.setProperty("--shine-y", `${y * 100}%`);
    card.style.setProperty("--tilt-x", `${((x - .5) * 4).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${((.5 - y) * 4).toFixed(2)}deg`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
});

let typedSequence = "";
const konamiSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiIndex = 0;
function triggerEasterEgg() {
  hero.classList.remove("scatter");
  floatItems.forEach((item, index) => {
    const angle = (Math.PI * 2 * index) / floatItems.length;
    item.style.setProperty("--scatter-x", `${(Math.cos(angle) * 26).toFixed(1)}px`);
    item.style.setProperty("--scatter-y", `${(Math.sin(angle) * 20).toFixed(1)}px`);
  });
  void hero.offsetWidth;
  hero.classList.add("scatter");
  window.setTimeout(() => hero.classList.remove("scatter"), 650);
}
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
  if (isTyping || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key.length === 1) {
    typedSequence = `${typedSequence}${event.key.toLowerCase()}`.slice(-5);
    if (typedSequence === "cogni") {
      triggerEasterEgg();
      typedSequence = "";
    }
  }
  if (event.key === konamiSequence[konamiIndex]) {
    konamiIndex += 1;
    if (konamiIndex === konamiSequence.length) {
      triggerEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = event.key === konamiSequence[0] ? 1 : 0;
  }
});

document.querySelectorAll(".card-link").forEach((button) => {
  button.addEventListener("click", () => {
    const detail = document.querySelector(`#detail-${button.dataset.explain}`);
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    detail.hidden = isExpanded;
    button.firstChild.textContent = isExpanded ? "Explore the layer " : "Close explanation ";
  });
});

const previewPanel = document.querySelector(".preview-panel");
const modeButtons = document.querySelectorAll(".mode-button");
const modeContent = {
  focus: ["A point of focus.", "One clear signal stands out from the noise.", "CONTRAST + CLARITY", "1"],
  flow: ["Let information move.", "Connections shift to reveal another way through.", "MOTION + CONNECTION", "2"],
  quiet: ["Make room to breathe.", "Less visual noise gives the important parts space.", "SPACE + STILLNESS", "3"]
};
function setPreviewMode(mode) {
  const [title, description, tag, number] = modeContent[mode];
  previewPanel.dataset.preview = mode;
  document.querySelector("#preview-status").textContent = `STATE / ${mode.toUpperCase()}`;
  document.querySelector("#mode-title").textContent = title;
  document.querySelector("#mode-description").textContent = description;
  document.querySelector("#mode-tag").textContent = tag;
  document.querySelector("#mode-number").textContent = number;
  modeButtons.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
modeButtons.forEach((button) => button.addEventListener("click", () => setPreviewMode(button.dataset.mode)));
document.querySelector(".reset-preview").addEventListener("click", () => setPreviewMode("focus"));

const postGrid = document.querySelector("#post-grid");
const searchInput = document.querySelector("#post-search");
const resultsCount = document.querySelector("#results-count");
const loadMoreButton = document.querySelector("#load-more");
const retryButton = document.querySelector("#retry-posts");
const pageSize = 6;
let posts = [];
let visibleCount = pageSize;
let renderedQuery = null;
const postAccents = ["teal", "sky", "coral", "lilac"];

function createPostCard(post, index) {
  // API strings only enter the DOM through textContent, never as parsed HTML.
  const article = document.createElement("article");
  article.className = "post-card";
  article.dataset.postId = String(post.id);
  article.style.setProperty("--card-index", String(index % pageSize));
  article.style.setProperty("--post-accent", `var(--${postAccents[post.id % postAccents.length]})`);
  const metadata = document.createElement("div");
  metadata.className = "post-meta";
  const id = document.createElement("span");
  id.textContent = `POST / ${String(post.id).padStart(3, "0")}`;
  const mark = document.createElement("span");
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "↗";
  const title = document.createElement("h3");
  title.textContent = post.title;
  const body = document.createElement("p");
  body.textContent = post.body;
  metadata.append(id, mark);
  article.append(metadata, title, body);
  return article;
}

function renderPosts(appendOnly = false) {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const matchingPosts = posts.filter((post) =>
    post.title.toLocaleLowerCase().includes(query) || post.body.toLocaleLowerCase().includes(query)
  );
  const displayedPosts = matchingPosts.slice(0, visibleCount);
  const canAppend = appendOnly && query === renderedQuery && postGrid.querySelector(".post-card");
  if (canAppend) {
    const previousCount = postGrid.querySelectorAll(".post-card").length;
    displayedPosts.slice(previousCount).forEach((post, index) => {
      const card = createPostCard(post, previousCount + index);
      card.classList.add("is-new");
      postGrid.append(card);
    });
  } else {
    postGrid.replaceChildren(...displayedPosts.map(createPostCard));
  }
  renderedQuery = query;
  postGrid.setAttribute("aria-busy", "false");
  searchInput.disabled = false;
  resultsCount.textContent = query
    ? `Showing ${displayedPosts.length} of ${matchingPosts.length} ${matchingPosts.length === 1 ? "match" : "matches"}`
    : `Showing ${displayedPosts.length} of ${matchingPosts.length} posts`;
  loadMoreButton.hidden = matchingPosts.length <= visibleCount;
  if (matchingPosts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "api-message";
    const heading = document.createElement("strong");
    heading.textContent = "No matching signals.";
    const message = document.createElement("p");
    message.textContent = "Try another title or phrase from the descriptions.";
    empty.append(heading, message);
    postGrid.append(empty);
  }
}

async function fetchPosts() {
  postGrid.replaceChildren();
  const loading = document.createElement("div");
  loading.className = "loading-state";
  loading.setAttribute("role", "status");
  const spinner = document.createElement("span");
  spinner.className = "loader";
  spinner.setAttribute("aria-hidden", "true");
  const status = document.createElement("span");
  status.textContent = "Gathering the collection…";
  loading.append(spinner, status);
  postGrid.append(loading);
  postGrid.setAttribute("aria-busy", "true");
  resultsCount.textContent = "Connecting to source…";
  searchInput.disabled = true;
  retryButton.hidden = true;
  loadMoreButton.hidden = true;
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error(`The data source responded with status ${response.status}.`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("The data source returned an unexpected response.");
    posts = data.filter((item) =>
      Number.isFinite(item.id) && typeof item.title === "string" && typeof item.body === "string"
    );
    visibleCount = pageSize;
    if (posts.length === 0) {
      postGrid.replaceChildren();
      const empty = document.createElement("div");
      empty.className = "api-message";
      const heading = document.createElement("strong");
      heading.textContent = "The collection is empty.";
      const message = document.createElement("p");
      message.textContent = "There are no posts available from the public sample source.";
      empty.append(heading, message);
      postGrid.append(empty);
      postGrid.setAttribute("aria-busy", "false");
      resultsCount.textContent = "0 posts in the collection";
      return;
    }
    renderPosts();
  } catch (error) {
    console.error("Unable to load public sample posts.", error);
    postGrid.replaceChildren();
    const message = document.createElement("div");
    message.className = "api-message";
    const heading = document.createElement("strong");
    heading.textContent = "The collection couldn't connect.";
    const description = document.createElement("p");
    description.textContent = "Check your connection and try again. The rest of the experience is still available.";
    message.append(heading, description);
    postGrid.append(message);
    postGrid.setAttribute("aria-busy", "false");
    resultsCount.textContent = "Source unavailable";
    searchInput.disabled = true;
    retryButton.hidden = false;
  }
}

searchInput.addEventListener("input", () => {
  visibleCount = pageSize;
  renderPosts();
});
loadMoreButton.addEventListener("click", () => {
  visibleCount += pageSize;
  renderPosts(true);
});
retryButton.addEventListener("click", fetchPosts);
fetchPosts();

const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const submitButton = document.querySelector(".submit-button");
const submitLabel = document.querySelector(".submit-label");
const fieldRules = {
  name: {
    input: document.querySelector("#full-name"),
    error: document.querySelector("#name-error"),
    validate: (value) => value.trim() ? "" : "Please enter your name."
  },
  email: {
    input: document.querySelector("#email"),
    error: document.querySelector("#email-error"),
    validate: (value) => {
      const email = value.trim();
      if (!email) return "Please enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter a valid email, such as name@example.com.";
    }
  },
  subject: {
    input: document.querySelector("#subject"),
    error: document.querySelector("#subject-error"),
    validate: (value) => value.trim() ? "" : "Please add a subject."
  },
  message: {
    input: document.querySelector("#message"),
    error: document.querySelector("#message-error"),
    validate: (value) => value.trim().length >= 10 ? "" : "Your message needs at least 10 non-whitespace characters."
  }
};

function validateField(name) {
  const field = fieldRules[name];
  const error = field.validate(field.input.value);
  field.error.textContent = error;
  field.input.setAttribute("aria-invalid", String(Boolean(error)));
  return !error;
}

Object.entries(fieldRules).forEach(([name, field]) => {
  field.input.addEventListener("input", () => {
    if (field.input.hasAttribute("aria-invalid")) validateField(name);
    formStatus.textContent = "";
    formStatus.classList.remove("is-error");
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submitButton.disabled) return;

  let firstInvalidField = null;
  Object.keys(fieldRules).forEach((name) => {
    if (!validateField(name) && firstInvalidField === null) firstInvalidField = name;
  });
  if (firstInvalidField) {
    formStatus.textContent = "A couple of details need your attention.";
    formStatus.classList.add("is-error");
    fieldRules[firstInvalidField].input.focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.classList.remove("is-success");
  submitButton.classList.add("is-processing");
  submitButton.setAttribute("aria-busy", "true");
  submitLabel.textContent = "Sending…";
  formStatus.classList.remove("is-error");
  formStatus.textContent = "Sending your message securely…";

  const config = window.COGNIFYZ_EMAIL_CONFIG || {};
  const publicKey = config.publicKey || "";
  const serviceId = config.serviceId || "";
  const templateId = config.templateId || "";
  const placeholder = /^(YOUR_|REPLACE_|$)/i;

  if (placeholder.test(publicKey) || placeholder.test(serviceId) || placeholder.test(templateId) || !window.emailjs) {
    submitButton.disabled = false;
    submitButton.classList.remove("is-processing");
    submitButton.removeAttribute("aria-busy");
    submitLabel.textContent = "Try sending";
    formStatus.classList.add("is-error");
    formStatus.textContent = "Email is not configured yet. Add the EmailJS values in emailjs-config.js, then try again.";
    return;
  }

  try {
    emailjs.init({ publicKey });
    await emailjs.send(serviceId, templateId, {
      from_name: fieldRules.name.input.value.trim(),
      reply_to: fieldRules.email.input.value.trim(),
      subject: fieldRules.subject.input.value.trim(),
      message: fieldRules.message.input.value.trim(),
      recipient_email: config.recipientEmail || "jasmineflora2006@gmail.com"
    });
    submitButton.disabled = false;
    submitButton.classList.remove("is-processing");
    submitButton.classList.add("is-success");
    submitButton.removeAttribute("aria-busy");
    submitLabel.textContent = "Message accepted";
    formStatus.classList.remove("is-error");
    formStatus.textContent = "EmailJS confirmed acceptance of your request. Delivery can still depend on the dashboard template and connected email service.";
    window.setTimeout(() => {
      submitButton.classList.remove("is-success");
      submitLabel.textContent = "Check my message";
    }, 2600);
  } catch (error) {
    console.error("EmailJS submission failed.", error);
    submitButton.disabled = false;
    submitButton.classList.remove("is-processing");
    submitButton.removeAttribute("aria-busy");
    submitLabel.textContent = "Try again";
    formStatus.classList.add("is-error");
    formStatus.textContent = "The message could not be sent. Your details are still here—please try again.";
  }
});

form.addEventListener("reset", () => {
  submitButton.disabled = false;
  submitButton.classList.remove("is-processing", "is-success");
  submitButton.removeAttribute("aria-busy");
  submitLabel.textContent = "Check my message";
  Object.values(fieldRules).forEach(({ input, error }) => {
    input.removeAttribute("aria-invalid");
    error.textContent = "";
  });
});
document.querySelector(".reset-form").addEventListener("click", () => {
  formStatus.textContent = "";
  formStatus.classList.remove("is-error");
});

document.querySelector("#year").textContent = String(new Date().getFullYear());
initializeTheme();
