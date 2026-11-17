"use strict";

const StudyCommunity = (() => {
  const { url, publishableKey, emailLoginReady } = studyCommunityConfig;
  const enabled = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url) && /^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey);
  const accountButton = document.querySelector("#account-button");
  const dropdown = document.querySelector("#account-dropdown");
  const trigger = document.querySelector("#account-trigger");
  const panel = document.querySelector("#account-panel");
  const panelProfile = document.querySelector("#account-panel-profile");
  const panelSignOut = document.querySelector("#account-panel-signout");
  const panelStatus = panel.querySelector(".account-panel-status");
  const page = document.querySelector("#account");
  const heading = document.querySelector("#account-title");
  const back = document.querySelector("#account-back");
  const content = document.querySelector("#account-content");
  const status = document.querySelector("#account-status");
  const avatars = { initial: "預設人像", blue: "藍色", green: "綠色", orange: "橘色", purple: "紫色", photo: "自訂圖片" };
  let departments = [];
  let site, connection, user, profile, enrollment, profileDetails, sync, email = "", moderator = false, owner = false, identity = 0;
  const codeLifetime = 600;
  let syncMessage = "", syncError = false, pendingAction, returnTo = "#home";
  let profileLoading = false, expiresAt = 0, countdown, previewUrl;
  const canDiscuss = () => Boolean(user && profile && enrollment?.department);

  function connect() {
    if (!connection) {
      connection = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/dist/umd/supabase.js";
        script.integrity = "sha384-uteMfOloLDGt042uDz+xHGF3ym63/WQ6rFq7murQRG8Ih7QrXGEGNtWd8688sb4O";
        script.crossOrigin = "anonymous";
        script.onload = () => {
          try {
            const client = window.supabase.createClient(url, publishableKey, {
              auth: { detectSessionInUrl: false, storageKey: "ntou-cs-study-session" }
            });
            client.auth.onAuthStateChange((_event, session) => {
              const next = session?.user ?? null;
              if (user?.id !== next?.id) sync?.stop();
              setTimeout(() => changeUser(client, next), 0);
            });
            resolve(client);
          } catch (error) { reject(error); }
        };
        script.onerror = () => { script.remove(); reject(new Error("載入登入服務失敗。")); };
        document.head.append(script);
      }).catch(error => { connection = undefined; throw error; });
    }
    return connection;
  }

  function feedback(message, error = false) {
    status.textContent = message;
    status.toggleAttribute("data-error", error);
  }

  function feedChanged() {
    if (!document.querySelector("#community").hidden) StudyDiscussion.refresh();
  }

  function changeUser(client, next) {
    if (user?.id === next?.id) return;
    const revision = ++identity;
    sync?.stop();
    sync = undefined;
    user = next;
    profile = null;
    enrollment = null;
    profileDetails = null;
    profileLoading = Boolean(next);
    moderator = false;
    owner = false;
    email = "";
    expiresAt = 0;
    syncMessage = "";
    syncError = false;
    site.useAccount(user?.id ?? "");
    setAccountPanel(false);
    paintAccountMenu();
    StudyNotifications.setUser(user?.id);
    if (!page.hidden) paintAccount();
    feedChanged();
    if (!user) return;
    sync = StudyCommunitySync.create(client, site, user.id, (message, isError) => {
      syncMessage = message;
      syncError = isError;
      const label = content.querySelector("#cloud-status");
      if (label) {
        label.textContent = message;
        label.toggleAttribute("data-error", Boolean(isError));
      }
    });
    sync.sync().catch(() => {});
    Promise.all([
      client.from("study_profiles").select("id,nickname,bio,avatar,avatar_version").eq("id", user.id).maybeSingle(),
      client.rpc("study_is_moderator"),
      client.rpc("study_is_owner"),
      client.from("study_student_ids").select("student_id,department,grade,section").eq("user_id", user.id).maybeSingle(),
      client.from("study_profile_details").select("discord,birth_month,birth_day,github,interests").eq("user_id", user.id).maybeSingle(),
      client.from("study_departments").select("name,aliases").order("display_order")
    ]).then(([person, role, siteOwner, student, details, catalog]) => {
      if (revision !== identity) return;
      profileLoading = false;
      profile = person.data ?? null;
      enrollment = student.data ?? null;
      profileDetails = details.error ? null : details.data ?? {};
      departments = catalog.data ?? [];
      moderator = role.data === true;
      owner = siteOwner.data === true;
      paintAccountMenu();
      if (!page.hidden && canDiscuss() && pendingAction) location.hash = returnTo;
      else if (!page.hidden) paintAccount();
      if ((person.error || student.error) && !page.hidden) feedback("無法讀取完整帳號資料，請稍後重新整理。", true);
      feedChanged();
    }).catch(() => {
      if (revision !== identity) return;
      profileLoading = false;
      if (!page.hidden) {
        paintAccount();
        feedback("無法讀取個人檔案。", true);
      }
    });
  }

  function hasGuestRecords() {
    return Object.values(site.getGuestCourses()).some(StudyCommunitySync.hasRecords);
  }

  function avatarMarkup(person) {
    const { escape } = site;
    const color = Object.hasOwn(avatars, person?.avatar) ? person.avatar : "initial";
    const initial = Array.from(person?.nickname?.trim() ?? "")[0];
    const silhouette = '<span class="avatar-silhouette"></span>';
    const idFormat = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
    if (color === "photo" && idFormat.test(person.id) && idFormat.test(person.avatar_version)) {
      const src = `${url.replace(/\/$/, "")}/storage/v1/object/public/study-avatars/${person.id}/avatar.webp?v=${person.avatar_version}`;
      return `<span class="study-avatar" aria-hidden="true">${silhouette}<img src="${src}" alt="" loading="lazy"></span>`;
    }
    return `<span class="study-avatar" data-color="${color}" aria-hidden="true">${initial && color !== "initial" ? escape(initial) : silhouette}</span>`;
  }

  function setAccountPanel(open, restoreFocus = false) {
    panel.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (open) panelStatus.textContent = "";
    if (restoreFocus) trigger.focus();
  }

  function paintAccountMenu() {
    accountButton.hidden = !emailLoginReady || Boolean(user);
    dropdown.hidden = !emailLoginReady || !user;
    if (!user) {
      panel.querySelector("#account-panel-person").replaceChildren();
      trigger.replaceChildren();
      return;
    }
    trigger.innerHTML = avatarMarkup(profile);
    const nickname = profile?.nickname?.trim();
    panel.querySelector("#account-panel-person").innerHTML = `${avatarMarkup(profile)}
      <div>${nickname ? `<strong>${site.escape(nickname)}</strong>` : ""}<p>${site.escape(user.email)}</p></div>`;
    panel.querySelector("#account-panel-moderation").hidden = !moderator;
    panel.querySelector("#account-panel-members").hidden = !owner;
  }

  function paintClass(form) {
    const department = form.elements.department.value.trim();
    const grade = form.elements.grade.value;
    const section = form.elements.section.value;
    form.querySelector("#account-class-preview").textContent = department && grade && section ? `系級班　${department} ${grade}${section}` : "";
  }

  function departmentChoices() {
    if (departments.length || !enrollment?.department) return departments;
    return [{ name: enrollment.department, aliases: [] }];
  }

  const searchDepartment = text => text.normalize("NFKC").toLowerCase().replace(/\s+/g, "");

  function fillDepartmentChoices(form) {
    const search = form.querySelector("#account-department-search");
    const select = form.elements.department;
    const status = form.querySelector("#account-department-status");
    const all = departmentChoices();
    const selected = select.value;
    const needle = searchDepartment(search.value);
    const matches = all.filter(row => [row.name, ...row.aliases].some(name => searchDepartment(name).includes(needle)));
    select.replaceChildren(new Option("選擇正式系所名稱", ""));
    if (selected && !matches.some(row => row.name === selected)) {
      const current = document.createElement("optgroup");
      current.label = "目前選擇";
      current.append(new Option(selected, selected));
      select.append(current);
    }
    for (const row of matches) select.add(new Option(row.name, row.name));
    select.value = selected;
    status.textContent = needle ? (matches.length ? `找到 ${matches.length} 個系所` : "找不到符合的系所。") : "";
    return matches;
  }

  const daysInMonth = month => month === 2 ? 29 : [4, 6, 9, 11].includes(month) ? 30 : 31;
  const dateOptions = (count, selected, unit) => `<option value="">選${unit}</option>` +
    Array.from({ length: count }, (_, i) => `<option value="${i + 1}"${i + 1 === selected ? " selected" : ""}>${i + 1} ${unit}</option>`).join("");

  function paintBirthday(form) {
    const month = Number(form.elements.birth_month.value);
    const day = form.elements.birth_day;
    day.innerHTML = dateOptions(month ? daysInMonth(month) : 0, Number(day.value), "日");
    day.disabled = !month;
  }

  function optionalFields() {
    const { escape } = site;
    if (!profileDetails) return '<p class="account-field-hint">其他個人資料暫時無法載入，重新整理後可編輯。</p>';
    const { discord, birth_month, birth_day, github, interests } = profileDetails;
    return `<details class="account-extra"${Object.values(profileDetails).some(Boolean) ? " open" : ""}>
      <summary>其他個人資料 <small>選填</small></summary>
      <div class="account-extra-fields">
        <p class="account-field-hint">填寫的內容會顯示給已登入且填妥學籍資料的同學。留空或清除即可隱藏該項。</p>
        <label>Discord ID 或使用者名稱<input name="discord" value="${escape(discord)}" maxlength="38" autocomplete="off" spellcheck="false"></label>
        <fieldset class="account-birthday"><legend>生日（月日）</legend><div class="account-class-fields">
          <label>月份<select name="birth_month">${dateOptions(12, birth_month, "月")}</select></label>
          <label>日期<select name="birth_day"${birth_month ? "" : " disabled"}>${dateOptions(birth_month ? daysInMonth(birth_month) : 0, birth_day, "日")}</select></label>
        </div></fieldset>
        <label>GitHub 帳號<input name="github" value="${escape(github)}" maxlength="40" autocomplete="off" spellcheck="false"></label>
        <label>興趣／想學的主題<input name="interests" value="${escape(interests)}" maxlength="100" placeholder="例如 網路安全、網頁設計"></label>
      </div></details>`;
  }

  function paintAccount() {
    const { escape } = site;
    clearInterval(countdown);
    releasePreview();
    if (!emailLoginReady) {
      heading.textContent = "電子郵件登入";
      content.innerHTML = '<p class="account-card">驗證信服務設定中。</p>';
      return;
    }
    if (profileLoading) {
      heading.textContent = "我的帳號";
      content.innerHTML = '<p class="account-card" role="status">正在載入個人檔案…</p>';
      return;
    }
    if (!user) {
      heading.textContent = "電子郵件登入";
      content.innerHTML = '<div class="account-card account-auth">' + (email ? `
        <p>驗證碼已寄往 <strong>${escape(email)}</strong>。</p>
        <form id="verify-email" class="community-form">
          <label>6 位數驗證碼<input name="token" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}([0-9]{2})?" maxlength="8" required></label>
          <p><span id="otp-time" aria-hidden="true"></span><span class="visually-hidden" id="otp-accessible" role="status">驗證碼有效期限為 10 分鐘。</span></p>
          <div class="community-actions"><button class="btn" type="submit">驗證並登入</button>
            <button class="btn secondary" type="button" data-account="resend">重寄驗證碼</button>
            <button class="utility" type="button" data-account="change-email">更換信箱</button></div>
        </form>` : `
        <p>登入後能同步閱讀進度、錯題和複習清單，也能在單元討論區發文。第一次驗證信箱會建立帳號。</p>
        <form id="send-email" class="community-form">
          <label>電子郵件<input name="email" type="email" autocomplete="email" maxlength="254" required></label>
          <button class="btn" type="submit">寄送驗證碼</button>
        </form>`) + '</div>';
      if (email) {
        updateCodeTimer();
        countdown = setInterval(updateCodeTimer, 1000);
      }
      return;
    }
    heading.textContent = "我的帳號";
    const savedDepartment = enrollment?.department;
    const choices = departmentChoices();
    const requiresDepartmentReview = Boolean(savedDepartment && departments.length && !departments.some(row => row.name === savedDepartment));
    content.innerHTML = `
      <div class="account-grid">
      <section class="account-card">
        <h2>個人檔案</h2>
        <p>暱稱、簡介和頭像會顯示在討論區。</p>
        ${!canDiscuss() ? '<p class="account-student-reminder">請填寫暱稱、八碼學號及系級班，完成後就能參與討論。</p>' : ""}
        <form id="profile-form" class="community-form">
          <div class="account-avatar-panel">
            <div id="account-avatar-preview" aria-label="頭像預覽">${avatarMarkup(profile)}</div>
            <div class="account-avatar-controls">
              <button class="btn secondary" type="button" data-account="pick-photo">選擇頭像圖片</button>
              <input name="photo" type="file" aria-label="選擇頭像圖片" accept="image/jpeg,image/png,image/webp" hidden>
              <p id="account-photo-info" role="status">JPG、PNG 或 WebP，最多 5 MB</p>
            </div>
          </div>
          <label>頭像樣式<select name="avatar">${Object.entries(avatars).map(([key, label]) =>
            `<option value="${key}" ${key === profile?.avatar ? "selected" : ""}${key === "photo" && profile?.avatar !== "photo" ? " disabled" : ""}>${label}</option>`).join("")}</select></label>
          <label>暱稱<input name="nickname" type="text" required maxlength="32" value="${escape(profile?.nickname)}"></label>
          <fieldset class="account-enrollment"><legend>學籍資料 <span class="account-required">必填</span></legend>
            <label>海洋大學學號<input name="student-id" type="text" required inputmode="numeric"
              maxlength="8" minlength="8" pattern="[0-9]{8}" autocomplete="off"
              aria-describedby="student-id-help" value="${escape(/^[0-9]{8}$/.test(enrollment?.student_id) ? enrollment.student_id : "")}"></label>
            <p id="student-id-help" class="account-field-hint">填寫 8 位數字。已登入並填妥資料的同學可在討論署名旁查看你的學號。</p>
            <div class="account-department">
              <label for="account-department-search">搜尋系所</label>
              <input id="account-department-search" type="search" maxlength="60" placeholder="輸入系所名稱或簡稱，例如 資工" autocomplete="off" ${departments.length ? "" : "disabled"}>
              <label>系所<select name="department" required aria-describedby="account-department-status">
                <option value="">選擇正式系所名稱</option>${choices.map(({ name }) => `<option value="${escape(name)}"${name === savedDepartment ? " selected" : ""}>${escape(name)}</option>`).join("")}
              </select></label>
              <p id="account-department-status" class="account-field-hint" role="status"></p>
              ${requiresDepartmentReview ? `<p class="account-field-hint">先前填寫的是「${escape(savedDepartment)}」，請從清單重新選擇正式名稱。</p>` : ""}
              ${departments.length ? "" : '<p class="account-field-hint">系所清單暫時無法載入。重新整理後可選擇系所。</p>'}
            </div>
            <div class="account-class-fields"><label>年級<select name="grade" required><option value="">選年級</option>
              ${[1, 2, 3, 4].map(grade => `<option value="${grade}"${enrollment?.grade === grade ? " selected" : ""}>${grade} 年級</option>`).join("")}</select></label>
            <label>班別<select name="section" required><option value="">選班別</option>
              ${["A", "B"].map(section => `<option value="${section}"${enrollment?.section === section ? " selected" : ""}>${section} 班</option>`).join("")}</select></label></div>
            <output id="account-class-preview"></output>
          </fieldset>
          <label>簡介（選填）<textarea name="bio" maxlength="160" rows="3">${escape(profile?.bio)}</textarea></label>
          ${optionalFields()}
          <button class="btn" type="submit">儲存個人檔案</button>
        </form>
      </section>
      <div class="account-sidebar">
      <section class="account-card">
        <h2>帳戶</h2>
        <p class="account-email">${escape(user.email)}</p>
        <div class="community-actions">
          ${moderator ? '<a class="btn secondary" href="#discussion/moderation">管理檢舉</a>' : ""}
          ${owner ? '<a class="btn secondary" href="#discussion/moderation/members">成員管理</a>' : ""}
          <button class="btn secondary" type="button" data-account="sign-out">登出此裝置</button>
        </div>
      </section>
      <section class="account-card">
        <h2>學習紀錄</h2>
        <p class="records-status" id="cloud-status" role="status" ${syncError ? "data-error" : ""}>${escape(syncMessage)}</p>
        <div class="community-actions"><button class="btn secondary" type="button" data-account="sync">立即同步</button>
          ${hasGuestRecords() ? '<button class="btn secondary" type="button" data-account="import-guest">帶入此裝置的訪客紀錄</button>' : ""}</div>
      </section></div></div>`;
    const form = content.querySelector("#profile-form");
    paintClass(form);
    const departmentSearch = form.querySelector("#account-department-search");
    departmentSearch.addEventListener("input", () => fillDepartmentChoices(form));
    departmentSearch.addEventListener("keydown", event => {
      if (event.key !== "Enter" || event.isComposing) return;
      event.preventDefault();
      const matches = fillDepartmentChoices(form);
      if (matches.length === 1) {
        form.elements.department.value = matches[0].name;
        paintClass(form);
      }
      if (matches.length) form.elements.department.focus();
    });
    form.addEventListener("input", event => {
      if (["department", "grade", "section"].includes(event.target.name)) paintClass(form);
      if (event.target.name === "birth_month") paintBirthday(form);
    });
  }

  function openAccount(afterSave) {
    if (location.hash === "#account") return;
    returnTo = location.hash || "#home";
    if (afterSave && returnTo.endsWith("/ask")) {
      returnTo = returnTo.slice(0, -4);
      history.replaceState(history.state, "", returnTo);
    }
    pendingAction = afterSave;
    location.hash = "#account";
  }

  function showAccount() {
    back.href = returnTo;
    back.textContent = returnTo === "#home" ? "← 回首頁" : "← 回上一頁";
    feedback("");
    paintAccount();
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function resumeDiscussion() {
    if (location.hash !== returnTo || !canDiscuss() || !pendingAction) return false;
    const resume = pendingAction;
    pendingAction = undefined;
    resume();
    return true;
  }

  back.addEventListener("click", () => { pendingAction = undefined; });

  function updateCodeTimer() {
    const display = content.querySelector("#otp-time");
    if (page.hidden || !display) { clearInterval(countdown); return; }
    const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    display.textContent = seconds ? `剩餘 ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` : "驗證碼已過期，請重寄。";
    if (!seconds) {
      content.querySelector("#otp-accessible").textContent = display.textContent;
      content.querySelector('#verify-email [type="submit"]').disabled = true;
      clearInterval(countdown);
    }
  }

  function releasePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = undefined;
  }

  function refreshAvatar(form) {
    const avatar = form.elements.avatar;
    const file = form.elements.photo.files[0];
    const preview = form.querySelector("#account-avatar-preview");
    preview.innerHTML = avatarMarkup({ ...profile, nickname: form.elements.nickname.value.trim(), avatar: avatar.value });
    if (file && previewUrl && avatar.value === "photo") {
      const image = document.createElement("img");
      image.alt = "";
      image.src = previewUrl;
      preview.querySelector(".study-avatar").replaceChildren(image);
    }
  }

  async function compressPhoto(file) {
    if (file.size > 5_000_000 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("請選擇小於 5 MB 的 JPG、PNG 或 WebP。");
    }
    let bitmap;
    try { bitmap = await createImageBitmap(file); }
    catch { throw new Error("無法讀取這張圖片，請換一張。"); }
    try {
      const size = Math.min(bitmap.width, bitmap.height);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = Math.min(256, size);
      canvas.getContext("2d").drawImage(bitmap, (bitmap.width - size) / 2, (bitmap.height - size) / 2,
        size, size, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/webp", .85));
      if (!blob || blob.type !== "image/webp" || blob.size > 262144) throw new Error("這張圖片無法轉成頭像。");
      return blob;
    } finally { bitmap.close(); }
  }

  async function saveProfile(client, fields) {
    if (!user) return;
    const owner = user.id;
    const nickname = String(fields.get("nickname")).trim();
    const bio = String(fields.get("bio")).trim();
    const studentNumber = String(fields.get("student-id")).trim();
    const department = String(fields.get("department")).trim();
    const grade = Number(fields.get("grade"));
    const section = fields.get("section");
    if (!nickname) throw new Error("請輸入暱稱。");
    if (!/^[0-9]{8}$/.test(studentNumber)) throw new Error("學號須為 8 位數字。");
    if (!departmentChoices().some(row => row.name === department) || ![1, 2, 3, 4].includes(grade) || !["A", "B"].includes(section)) {
      throw new Error("請從清單選擇系所，並填妥年級和班別。");
    }
    let details;
    if (profileDetails && fields.has("discord")) {
      const discord = String(fields.get("discord")).trim().replace(/^@/, "") || null;
      const github = String(fields.get("github")).trim().replace(/^@/, "") || null;
      const birthMonth = Number(fields.get("birth_month")) || null;
      const birthDay = Number(fields.get("birth_day")) || null;
      const interests = String(fields.get("interests")).trim() || null;
      if (discord && (discord.length < 2 || discord.length > 37 || !/^[A-Za-z0-9_.-]+(?:#[0-9]{4})?$/.test(discord))) {
        throw new Error("請填寫 Discord ID 或使用者名稱。");
      }
      if (github && !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(github)) throw new Error("請填寫 GitHub 帳號名稱。");
      if (Boolean(birthMonth) !== Boolean(birthDay) || (birthMonth && (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > daysInMonth(birthMonth)))) {
        throw new Error("請選擇完整的生日月日，或將月份留空。");
      }
      details = { discord, github, birth_month: birthMonth, birth_day: birthDay, interests };
    }
    const photo = fields.get("photo");
    let avatar = fields.get("avatar");
    let version = avatar === "photo" ? profile?.avatar_version : null;
    const bucket = client.storage.from("study-avatars");
    const path = `${owner}/avatar.webp`;
    if (photo.size && avatar === "photo") {
      const blob = await compressPhoto(photo);
      if (user?.id !== owner) return;
      const upload = await bucket.upload(path, blob, { contentType: "image/webp", upsert: true, cacheControl: "300" });
      if (upload.error) throw new Error("無法上傳頭像，請稍後再試。");
      avatar = "photo";
      version = crypto.randomUUID();
    }
    if (avatar === "photo" && !version) throw new Error("請先選擇頭像圖片。");
    if (user?.id !== owner) return;
    const person = { id: owner, nickname, bio, avatar, avatar_version: version ?? null };
    const { error } = await client.from("study_profiles").upsert(person, { onConflict: "id" });
    if (error) throw new Error("無法儲存個人檔案，請稍後再試。");
    if (studentNumber !== enrollment?.student_id || department !== enrollment.department || grade !== enrollment.grade || section !== enrollment.section) {
      const student = await client.rpc("study_save_student", { value: studentNumber, department_name: department, year_level: grade, class_section: section });
      if (student.error) throw new Error("無法儲存學籍資料，請稍後再試。");
      if (user?.id !== owner) return;
      enrollment = { student_id: studentNumber, department, grade, section };
    }
    if (details && Object.entries(details).some(([key, value]) => value !== (profileDetails[key] ?? null))) {
      const result = await client.from("study_profile_details").upsert({ user_id: owner, ...details }, { onConflict: "user_id" });
      if (result.error) throw new Error("無法儲存選填資料，請稍後再試。");
      if (user?.id !== owner) return;
      profileDetails = details;
    }
    if (profile?.avatar === "photo" && avatar !== "photo") await bucket.remove([path]);
    if (user?.id !== owner) return;
    profile = person;
    paintAccountMenu();
    paintAccount();
    if (!page.hidden && pendingAction) location.hash = returnTo;
    feedChanged();
    feedback("個人檔案已儲存。");
  }

  async function sendCode(client, address) {
    const requestedAt = Date.now();
    const result = await client.auth.signInWithOtp({ email: address, options: { shouldCreateUser: true } });
    if (result.error?.status === 429) throw new Error("寄送太頻繁。請稍等再重寄。");
    if (result.error) throw new Error("無法寄送驗證碼。請確認信箱後再試。");
    email = address;
    expiresAt = requestedAt + codeLifetime * 1000;
    paintAccount();
    content.querySelector('[name="token"]').focus();
    feedback("如果沒收到，請檢查垃圾郵件。");
  }

  let busy = false;
  async function run(control, job, report = feedback) {
    if (busy) return;
    busy = true;
    if (control) control.disabled = true;
    report("");
    try { await job(await connect()); }
    catch (error) { report(error.message || "目前無法完成，請稍後再試。", true); }
    finally {
      if (control) control.disabled = false;
      busy = false;
      if (expiresAt) updateCodeTimer();
    }
  }

  async function signOut(client) {
    try { await sync?.sync(); } catch {}
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) throw new Error("登出未完成，請重試。");
    changeUser(client, null);
  }

  page.addEventListener("submit", event => {
    const form = event.target;
    if (!form.id) return;
    event.preventDefault();
    const fields = new FormData(form);
    run(event.submitter, async client => {
      if (form.id === "send-email") await sendCode(client, String(fields.get("email")).trim());
      if (form.id === "verify-email") {
        if (Date.now() >= expiresAt) throw new Error("驗證碼已過期，請重寄。");
        const { data, error } = await client.auth.verifyOtp({ email, token: fields.get("token"), type: "email" });
        if (error || !data.user) throw new Error("驗證碼有誤或已過期。請重試或重寄。");
        changeUser(client, data.user);
        content.querySelector('[name="nickname"]')?.focus();
        feedback("已登入。");
      }
      if (form.id === "profile-form") await saveProfile(client, fields);
    });
  });

  page.addEventListener("click", event => {
    const control = event.target.closest("[data-account]");
    if (!control) return;
    const action = control.dataset.account;
    if (action === "pick-photo") { content.querySelector('[name="photo"]').click(); return; }
    if (action === "change-email") {
      if (busy) return;
      email = "";
      expiresAt = 0;
      feedback("");
      paintAccount();
      content.querySelector('[name="email"]').focus();
      return;
    }
    run(control, async client => {
      if (action === "resend") await sendCode(client, email);
      if (action === "sync") await sync?.sync();
      if (action === "import-guest") {
        if (!user || !sync) return;
        const owner = user.id;
        const key = `ntou-cs-study-imported:${user.id}`;
        const guest = site.getGuestCourses();
        const stamp = JSON.stringify(Object.entries(guest).map(([id, data]) => [id, StudyCommunitySync.snapshot(data)]));
        let imported;
        try { imported = localStorage.getItem(key); } catch {}
        if (imported === stamp) { feedback("這份訪客紀錄已帶入。"); return; }
        await sync?.sync(guest);
        if (user?.id !== owner) return;
        try { localStorage.setItem(key, stamp); } catch {}
        feedback("已合併此裝置的訪客紀錄。");
      }
      if (action === "sign-out") {
        await signOut(client);
        feedback("已登出。");
      }
    });
  });
  content.addEventListener("input", event => {
    if (event.target.name === "nickname") refreshAvatar(event.target.form);
  });
  content.addEventListener("change", event => {
    const { name, form, files } = event.target;
    if (name === "photo") {
      const file = files[0];
      if (!file) return;
      releasePreview();
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5_000_000) {
        event.target.value = "";
        if (profile?.avatar !== "photo") {
          form.elements.avatar.querySelector('option[value="photo"]').disabled = true;
          form.elements.avatar.value = profile?.avatar ?? "initial";
        }
        form.querySelector("#account-photo-info").textContent = "請選擇 5 MB 以內的 JPG、PNG 或 WebP。";
      } else {
        previewUrl = URL.createObjectURL(file);
        form.elements.avatar.querySelector('option[value="photo"]').disabled = false;
        form.elements.avatar.value = "photo";
        form.querySelector("#account-photo-info").textContent = file.name;
      }
    }
    if (name === "photo" || name === "avatar") refreshAvatar(form);
  });

  function start(api) {
    site = api;
    if (!enabled) return;
    paintAccountMenu();
    document.querySelector("#discussion-link").hidden = false;
    accountButton.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openAccount();
    });
    trigger.addEventListener("click", () => setAccountPanel(panel.hidden));
    panelProfile.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      setAccountPanel(false, location.hash === "#account");
      openAccount();
    });
    panelSignOut.addEventListener("click", () => run(panelSignOut, async client => {
      await signOut(client);
      if (!page.hidden) feedback("已登出。");
      accountButton.focus();
    }, message => { panelStatus.textContent = message; }));
    document.addEventListener("click", event => {
      if (!panel.hidden && !dropdown.contains(event.target)) setAccountPanel(false);
    });
    document.addEventListener("focusin", event => {
      if (!panel.hidden && !dropdown.contains(event.target)) setAccountPanel(false);
    });
    dropdown.addEventListener("keydown", event => {
      if (event.key !== "Escape" || panel.hidden) return;
      event.preventDefault();
      setAccountPanel(false, true);
    });
    window.addEventListener("hashchange", () => setAccountPanel(false));
    const resume = () => { if (!document.hidden) sync?.sync().catch(() => {}); };
    window.addEventListener("online", resume);
    document.addEventListener("visibilitychange", resume);
    try {
      if (emailLoginReady && localStorage.getItem("ntou-cs-study-session")) connect().catch(() => {});
    } catch {}
    StudyDiscussion.start(api, {
      connect, getUser: () => user, canDiscuss, isModerator: () => moderator, isOwner: () => owner,
      openAccount, avatarMarkup, resumeDiscussion
    });
    StudyNotifications.start(api, connect, (admin, siteOwner) => {
      if (moderator === admin && owner === siteOwner) return;
      moderator = admin;
      owner = siteOwner;
      paintAccountMenu();
      if (/^#discussion\/moderation(?:\/|$)/.test(location.hash)) feedChanged();
    });
  }

  return { enabled, start, showAccount, progressChanged: () => sync?.changed(),
    showDiscussion: (...args) => StudyDiscussion.show(...args), reportMaterial: target => StudyDiscussion.reportMaterial(target) };
})();
