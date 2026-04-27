import puppeteer from "puppeteer-core";
import { fileURLToPath } from "node:url";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TARGET = "http://localhost:5174/";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "../docs/screenshot.png");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 560, height: 1280, deviceScaleFactor: 2 },
});

const page = await browser.newPage();
await page.goto(TARGET, { waitUntil: "networkidle0" });

await page.evaluate(() => {
  const tasks = [
    { id: crypto.randomUUID(), title: "Write project README", done: false, pomodoros: 2 },
    { id: crypto.randomUUID(), title: "Refactor auth module", done: false, pomodoros: 0 },
    { id: crypto.randomUUID(), title: "Reply to design feedback", done: true, pomodoros: 1 },
  ];
  localStorage.setItem("pomodoro.tasks.v1", JSON.stringify(tasks));
  localStorage.setItem("pomodoro.activeTask.v1", JSON.stringify(tasks[1].id));
});

await page.reload({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 300));

await page.screenshot({ path: OUT, fullPage: true });
await browser.close();
console.log("wrote", OUT);
