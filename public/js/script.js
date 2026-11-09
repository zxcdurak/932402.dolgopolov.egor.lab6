(function () {
  "use strict";

  let API = "/api/tasks";

  let form = document.getElementById("task-form");
  let input = document.getElementById("task-title");
  let formError = document.getElementById("form-error");
  let list = document.getElementById("task-list");
  let empty = document.getElementById("empty");
  let loadError = document.getElementById("load-error");
  let counter = document.getElementById("counter");
  let banner = document.getElementById("offline-banner");
  let chips = document.querySelectorAll(".chip");

  let filter = "all"; // all | true | false

  function setText(el, text) {
    el.textContent = text;
    el.hidden = !text;
  }

  function plural(n) {
    let m10 = n % 10;
    let m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return "задача";
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "задачи";
    return "задач";
  }

  function render(tasks) {
    list.textContent = "";

    tasks.forEach(function (t) {
      let li = document.createElement("li");
      li.className = "task" + (t.completed ? " task--done" : "");

      let check = document.createElement("input");
      check.type = "checkbox";
      check.className = "task__check";
      check.checked = !!t.completed;
      check.disabled = true;
      check.setAttribute("aria-label", t.completed ? "Выполнена" : "Не выполнена");

      let title = document.createElement("span");
      title.className = "task__title";
      title.textContent = t.title;

      let id = document.createElement("span");
      id.className = "task__id";
      id.textContent = "#" + t.id;

      li.append(check, title, id);
      list.appendChild(li);
    });

    empty.hidden = tasks.length > 0;
    counter.textContent = tasks.length + " " + plural(tasks.length);
  }

  async function loadTasks() {
    let url = filter === "all" ? API : API + "?completed=" + filter;
    try {
      let res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      render(await res.json());
      setText(loadError, "");
    } catch (err) {
      setText(loadError, "Не удалось загрузить задачи. Проверьте соединение.");
    }
  }

  async function addTask(title) {
    let res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title })
    });
    let data = await res.json().catch(function () { return {}; });
    if (!res.ok) throw new Error(data.error || "Ошибка сервера");
    return data;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let title = input.value.trim();

    if (!title) {
      setText(formError, "Введите название задачи.");
      input.focus();
      return;
    }

    let button = form.querySelector("button");
    button.disabled = true;
    try {
      await addTask(title);
      input.value = "";
      setText(formError, "");
      await loadTasks();
    } catch (err) {
      let offline = !navigator.onLine || err instanceof TypeError;
      setText(formError, offline ? "Нет соединения: задачу добавить не удалось." : err.message);
    } finally {
      button.disabled = false;
      input.focus();
    }
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filter = chip.dataset.filter;
      chips.forEach(function (c) {
        c.classList.toggle("chip--active", c === chip);
      });
      loadTasks();
    });
  });

  function updateOnline() {
    banner.hidden = navigator.onLine;
  }

  window.addEventListener("online", function () {
    updateOnline();
    loadTasks();
  });
  window.addEventListener("offline", updateOnline);

  updateOnline();
  loadTasks();
})();

if ('serviceWorker' in navigator) {
    // регистрация сервис-воркера 
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Новая версия сервис-воркера доступна
              console.log('New service worker version available.');

              // Опционально: показать уведомление пользователю
              showUpdateNotification();
            }
          };
        };
      })
      .catch(err => console.log('service worker not registered', err));
  }