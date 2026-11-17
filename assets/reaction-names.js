"use strict";

const StudyReactionNames = (() => {
  const hoverDelay = 1000;
  const pressDelay = 550;
  const names = new Intl.ListFormat("zh-TW", { type: "conjunction" });

  function create(view, { escape, load }) {
    const popup = document.createElement("div");
    popup.id = "reaction-names";
    popup.className = "reaction-names";
    popup.setAttribute("role", "tooltip");
    popup.hidden = true;
    document.body.append(popup);

    let anchor, mode, openTimer, leaveTimer, press, suppressed, revision = 0;
    const reactionButton = target => target instanceof Element ? target.closest(".discussion-reaction") : null;

    function dismiss() {
      if (!anchor) return;
      clearTimeout(openTimer);
      clearTimeout(leaveTimer);
      ++revision;
      if (anchor?.getAttribute("aria-describedby") === popup.id) anchor.removeAttribute("aria-describedby");
      anchor = mode = press = null;
      popup.hidden = true;
      popup.replaceChildren();
    }

    function place() {
      const rect = anchor.getBoundingClientRect();
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      const gap = 7, inset = 8;
      const left = rect.left + (rect.width - popup.offsetWidth) / 2;
      const top = rect.top - popup.offsetHeight - gap >= inset ? rect.top - popup.offsetHeight - gap : rect.bottom + gap;
      popup.style.left = Math.max(inset, Math.min(left, width - popup.offsetWidth - inset)) + "px";
      popup.style.top = Math.max(inset, Math.min(top, height - popup.offsetHeight - inset)) + "px";
    }

    async function open() {
      const button = anchor;
      const at = revision;
      if (!button?.isConnected || view.hidden) return;
      const emoji = button.dataset.emoji;
      popup.innerHTML = StudyEmoji.markup(emoji, escape) + '<p aria-live="polite">正在載入反應名單…</p>';
      const copy = popup.querySelector("p");
      popup.hidden = false;
      button.setAttribute("aria-describedby", popup.id);
      place();
      StudyEmoji.paint(popup);
      try {
        const { nicknames, total } = await load(button.dataset.id, emoji);
        if (at !== revision || !button.isConnected) return;
        const others = Number(total) - nicknames.length;
        const summary = nicknames.length ? names.format(nicknames) + (others > 0 ? "，還有 " + others + " 人" : "") : "目前沒有表情反應。";
        copy.textContent = summary;
      } catch {
        if (at !== revision || !button.isConnected) return;
        copy.textContent = "暫時無法載入反應名單。";
      }
      place();
    }

    function schedule(button, input, delay) {
      dismiss();
      anchor = button;
      mode = input;
      openTimer = setTimeout(open, delay);
    }

    function leave() {
      clearTimeout(leaveTimer);
      if (popup.hidden) dismiss();
      else leaveTimer = setTimeout(dismiss, 140);
    }

    view.addEventListener("pointerover", event => {
      if (event.pointerType !== "mouse") return;
      const button = reactionButton(event.target);
      if (!button || button.contains(event.relatedTarget)) return;
      if (button === anchor && !popup.hidden) clearTimeout(leaveTimer);
      else schedule(button, "mouse", hoverDelay);
    });

    view.addEventListener("pointerout", event => {
      const button = reactionButton(event.target);
      if (event.pointerType !== "mouse" || !button || button !== anchor || mode !== "mouse") return;
      if (button.contains(event.relatedTarget) || popup.contains(event.relatedTarget)) return;
      leave();
    });
    popup.addEventListener("pointerenter", event => { if (event.pointerType === "mouse") clearTimeout(leaveTimer); });
    popup.addEventListener("pointerleave", event => {
      if (mode === "mouse" && !anchor?.contains(event.relatedTarget)) leave();
    });

    view.addEventListener("focusin", event => {
      const button = reactionButton(event.target);
      if (button?.matches(":focus-visible") && button !== anchor) schedule(button, "focus", hoverDelay);
    });
    view.addEventListener("focusout", event => {
      if (event.target === anchor && mode === "focus") dismiss();
    });

    document.addEventListener("pointerdown", event => {
      suppressed = null;
      const button = reactionButton(event.target);
      if (button && view.contains(button) && event.isPrimary && event.pointerType !== "mouse") {
        dismiss();
        anchor = button;
        mode = "touch";
        press = { id: event.pointerId, x: event.clientX, y: event.clientY };
        openTimer = setTimeout(() => { suppressed = button; open(); }, pressDelay);
      } else if (anchor && !anchor.contains(event.target) && !popup.contains(event.target)) dismiss();
    }, true);

    document.addEventListener("pointermove", event => {
      if (press?.id === event.pointerId && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) dismiss();
    }, true);
    document.addEventListener("pointerup", event => {
      if (press?.id !== event.pointerId) return;
      press = null;
      if (popup.hidden) dismiss();
    }, true);
    document.addEventListener("pointercancel", event => { if (press?.id === event.pointerId) dismiss(); }, true);

    view.addEventListener("contextmenu", event => {
      if (mode === "touch" && anchor === reactionButton(event.target) && (press || !popup.hidden)) event.preventDefault();
    });

    view.addEventListener("click", event => {
      const button = reactionButton(event.target);
      if (!button) return;
      if (suppressed === button) {
        suppressed = null;
        event.preventDefault();
        event.stopImmediatePropagation();
      } else if (anchor) dismiss();
    }, true);

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && anchor) dismiss();
    });
    window.addEventListener("scroll", dismiss, { capture: true, passive: true });
    window.addEventListener("resize", dismiss);
    window.addEventListener("hashchange", dismiss);

    return { dismiss };
  }

  return { create };
})();
