document.addEventListener("DOMContentLoaded", () => {
const ROW_COUNT = 8;
const DEFAULT_STEP = 10;
let activeIndex = 1;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function els(i) {
return {
fill: document.getElementById(`fill-${i}`),
input: document.getElementById(`num-${i}`),
plus: document.getElementById(`plus-${i}`),
minus: document.getElementById(`minus-${i}`),
};
}

function getMax(input) {
const m = parseInt(input?.getAttribute("max") || "100", 10);
return Number.isFinite(m) ? m : 100;
}

function getStep(input) {
const raw = (input.value || "").trim();
if (!raw) return DEFAULT_STEP;
const n = parseInt(raw, 10);
return Number.isFinite(n) && n > 0 ? n : DEFAULT_STEP;
}

function getValue(fill, max) {
const w = parseFloat(fill.style.width || "0");
const pct = Number.isFinite(w) ? w : 0;
return Math.round((pct / 100) * max);
}

function setValue(fill, value, max) {
fill.style.width = `${(value / max) * 100}%`;
}

function apply(i, sign) {
const { fill, input } = els(i);
if (!fill || !input) return;

const max = getMax(input);
const step = getStep(input);
const cur = getValue(fill, max);
const next = clamp(cur + sign * step, 0, max);

setValue(fill, next, max);

input.value = "";

activeIndex = i;
}

function bind(i) {
const { fill, input, plus, minus } = els(i);
if (!fill || !input || !plus || !minus) return;

// 초기 보장
if (!fill.style.width) fill.style.width = "0%";

plus.addEventListener("click", () => apply(i, +1));
minus.addEventListener("click", () => apply(i, -1));

input.addEventListener("keydown", (e) => {
if (e.key === "Enter") {
e.preventDefault();
apply(i, +1);
}
});

const activate = () => (activeIndex = i);
[input, plus, minus].forEach((el) => {
el.addEventListener("focus", activate);
el.addEventListener("mousedown", activate);
el.addEventListener("click", activate);
});
}

document.addEventListener("keydown", (e) => {
const isPlus =
e.key === "+" || e.key === "=" || e.key === "Add" || e.code === "NumpadAdd";
const isMinus =
e.key === "-" || e.key === "_" || e.key === "Subtract" || e.code === "NumpadSubtract";

if (!isPlus && !isMinus) return;
e.preventDefault();
apply(activeIndex, isPlus ? +1 : -1);
});

for (let i = 1; i <= ROW_COUNT; i++) bind(i);
});