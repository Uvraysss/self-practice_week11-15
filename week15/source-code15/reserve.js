      const isLocal = ["localhost", "127.0.0.1"].includes(
        window.location.hostname
      );

      const API_BASE = isLocal
        ? "http://localhost:3000/api/v1"
        : "https://bscit.sit.kmutt.ac.th/intproj25/kp2/itb-ecors/api";

      const KC = isLocal
        ? {
            url: "http://localhost:8180",
            realm: "itb-ecors",
            clientId: "itb-ecors-kp2",
          }
        : {
            url: "https://bscit.sit.kmutt.ac.th/intproj25/ft/keycloak/",
            realm: "itb-ecors",
            clientId: "itb-ecors-kp2",
          };

      let keycloak;

      const planMap = [
        { id: 1, code: "FE", name: "Frontend Developer" },
        { id: 2, code: "BE", name: "Backend Developer" },
        { id: 3, code: "FS", name: "Full-Stack Developer" },
        { id: 4, code: "AI", name: "AI Developer" },
        { id: 5, code: "DS", name: "Data Scientist" },
        { id: 6, code: "DA", name: "Data Analyst" },
        { id: 7, code: "DE", name: "Data Engineer" },
        { id: 8, code: "DB", name: "Database Admin" },
        { id: 9, code: "UX", name: "UX/UI Designer" },
      ];

      // แสดง modal dialog
      function showDialog(msg, onOk) {
        const modal = document.getElementById("ecors-modal");
        const okBtn = document.getElementById("ecors-modal-ok");
        const msgEl = document.getElementById("ecors-modal-message");

        msgEl.textContent = msg;
        modal.style.display = "flex";

        okBtn.onclick = () => {
          modal.style.display = "none";
          if (typeof onOk === "function") onOk();
        };
      }

      async function initPage() {
        const token = sessionStorage.getItem("kcToken");
        const refresh = sessionStorage.getItem("kcRefreshToken");

        if (!token || !refresh)
          return (window.location.href = "./keycloak.html");

        keycloak = new Keycloak(KC);

        await keycloak.init({
          token,
          refreshToken: refresh,
          checkLoginIframe: false,
        });

        const name =
          keycloak.tokenParsed.name || keycloak.tokenParsed.preferred_username;
        document.querySelector(".ecors-fullname").textContent = name;

        const studentId = keycloak.tokenParsed.preferred_username;

        loadPlanList();
        loadDeclaredPlan(studentId);

        document.querySelector(".ecors-button-signout").onclick = () => {
          sessionStorage.clear();
          keycloak.logout({
            redirectUri: isLocal
              ? "http://127.0.0.1:5501/frontend/index.html"
              : "https://bscit.sit.kmutt.ac.th/intproj25/kp2/itb-ecors/index.html",
          });
        };

        setInterval(() => {
          keycloak.updateToken(60).then((refreshed) => {
            if (refreshed) {
              sessionStorage.setItem("kcToken", keycloak.token);
              sessionStorage.setItem("kcRefreshToken", keycloak.refreshToken);
            }
          });
        }, 60000);
      }

      // โหลดตัวเลือก major ลง dropdown
      function loadPlanList() {
        const dropdown = document.getElementById("ecors-dropdown-plan");
        dropdown.innerHTML = `<option value="">-- Select Major --</option>`;

        planMap.forEach((p) => {
          const opt = document.createElement("option");
          opt.value = p.id;
          opt.textContent = `${p.code} - ${p.name}`;
          dropdown.appendChild(opt);
        });

        dropdown.onchange = () => {
          const btn = document.getElementById("ecors-button-declare");
          btn.disabled = dropdown.value === "";
          btn.classList.toggle("active", dropdown.value !== "");
        };
      }

      async function loadDeclaredPlan(studentId) {
        const target = document.getElementById("ecors-declared-plan");

        try {
          const res = await fetch(
            `${API_BASE}/students/${studentId}/declared-plan`
          );

          if (res.status === 404) {
            target.textContent = "Not Declared";
            return;
          }

          const data = await res.json();

          // ===========================
          // (1) CHECK CANCELLED FIRST
          // ===========================
          if (data.status === "CANCELLED") {
            const planInfo = planMap.find((p) => p.id === data.planId);

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const localTime = new Date(data.updatedAt).toLocaleString([], {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            target.textContent = planInfo
              ? `CANCELLED ${planInfo.code} - ${planInfo.name} on ${localTime} (${timezone})`
              : `CANCELLED on ${localTime} (${timezone})`;

            // lock dropdown + reset buttons
            const dropdown = document.getElementById("ecors-dropdown-plan");
            const btn = document.getElementById("ecors-button-declare");
            const container = document.getElementById(
              "change-cancel-container"
            );

            dropdown.value = "";
            btn.style.display = "inline-block";
            btn.disabled = true;
            if (container) container.innerHTML = "";

            return;
          }

          // ===========================
          // (2) ถ้าไม่มี planId → Not Declared
          // ===========================
          if (typeof data.planId !== "number") {
            target.textContent = "Not Declared";
            return;
          }

          // ===========================
          // (3) DECLARED CASE
          // ===========================
          const planInfo = planMap.find((p) => p.id === data.planId);
          if (!planInfo) {
            target.textContent = "Not Declared";
            return;
          }

          const dropdown = document.getElementById("ecors-dropdown-plan");
          dropdown.value = data.planId;

          replaceDeclareWithChangeCancel(
            data.planId,
            studentId,
            data.updatedAt
          );

          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const localTime = new Date(data.updatedAt).toLocaleString([], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          target.textContent = `Declared ${planInfo.code} - ${planInfo.name} on ${localTime} (${timezone})`;
        } catch (err) {
          console.error(err);
          target.textContent = "Error loading";
        }
      }

      function showConfirm(message) {
        return new Promise((resolve) => {
          const overlay = document.createElement("div");
          overlay.style.position = "fixed";
          overlay.style.top = "0";
          overlay.style.left = "0";
          overlay.style.width = "100vw";
          overlay.style.height = "100vh";
          overlay.style.background = "rgba(0,0,0,0.5)";
          overlay.style.display = "flex";
          overlay.style.alignItems = "center";
          overlay.style.justifyContent = "center";
          overlay.style.zIndex = "9999";

          const box = document.createElement("div");
          box.style.background = "#fff";
          box.style.padding = "24px";
          box.style.borderRadius = "12px";
          box.style.width = "360px";
          box.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
          box.style.textAlign = "center";
          box.setAttribute("class", "ecors-dialog");

          const msg = document.createElement("p");
          msg.textContent = message;
          msg.style.marginBottom = "20px";
          msg.style.fontSize = "16px";
          msg.setAttribute("class", "ecors-dialog-message");

          const btnWrap = document.createElement("div");
          btnWrap.style.display = "flex";
          btnWrap.style.gap = "12px";
          btnWrap.style.justifyContent = "center";

          const yesBtn = document.createElement("button");
          yesBtn.textContent = "Cancel Declaration";
          yesBtn.style.padding = "10px 18px";
          yesBtn.style.borderRadius = "5px";
          yesBtn.style.border = "none";
          yesBtn.style.background = "#0D3B66";
          yesBtn.style.color = "white";
          yesBtn.setAttribute("class", "ecors-button-cancel");

          const noBtn = document.createElement("button");
          noBtn.textContent = "Keep Declaration";
          noBtn.style.padding = "10px 18px";
          noBtn.style.borderRadius = "5px";
          noBtn.style.border = "none";
          noBtn.style.background = "#0D3B66";
          noBtn.style.color = "white";
          noBtn.setAttribute("class", "ecors-button-keep");

          btnWrap.appendChild(yesBtn);
          btnWrap.appendChild(noBtn);
          box.appendChild(msg);
          box.appendChild(btnWrap);
          overlay.appendChild(box);
          document.body.appendChild(overlay);

          const close = () => document.body.removeChild(overlay);
          yesBtn.onclick = () => {
            close();
            resolve(true);
          };
          noBtn.onclick = () => {
            close();
            resolve(false);
          };
        });
      }

      // แทนที่ปุ่ม Declare ด้วย Change/Cancel
      function replaceDeclareWithChangeCancel(planId, studentId, updatedAt) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localTime = new Date(updatedAt).toLocaleString([], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const declareBox = document.getElementById("declare-box");
        const dropdown = document.getElementById("ecors-dropdown-plan");

        dropdown.value = planId;

        let container = document.getElementById("change-cancel-container");
        if (!container) {
          container = document.createElement("div");
          container.id = "change-cancel-container";
          declareBox.appendChild(container);
        }
        container.innerHTML = "";
        container.style.display = "flex";
        container.style.gap = "8px";

        const btn = document.getElementById("ecors-button-declare");
        btn.style.display = "none";

        const changeBtn = document.createElement("button");
        changeBtn.id = "ecors-button-change";
        changeBtn.textContent = "Change";
        const cancelBtn = document.createElement("button");
        cancelBtn.id = "ecors-button-cancel";
        cancelBtn.textContent = "Cancel";

        container.appendChild(changeBtn);
        container.appendChild(cancelBtn);

        changeBtn.onclick = async () => {
          const newPlanId = Number(dropdown.value);
          if (newPlanId === planId) {
            showDialog("Please select a different major to change.");
            return;
          }

          try {
            const res = await fetch(
              `${API_BASE}/students/${studentId}/declared-plan`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId: newPlanId }),
              }
            );
            if (res.status === 200) {
              showDialog("Declaration updated.", () => {
                replaceDeclareWithChangeCancel(
                  newPlanId,
                  studentId,
                  new Date().toISOString()
                );
                loadDeclaredPlan(studentId);
              });
            } else if (res.status === 404) {
              showDialog(
                `No declared plan found for student with id= ${studentId}`
              );
            } else showDialog("There is a problem. Please try again later.");
          } catch (err) {
            console.error(err);
            showDialog("There is a problem. Please try again later.");
          }
        };

        cancelBtn.onclick = async () => {
          const planInfo = planMap.find((p) => p.id === planId);
          const message = `You have declared ${planInfo.code} - ${planInfo.name} on ${localTime} (${timezone}).\nAre you sure you want to cancel this declaration?`;
          const ok = await showConfirm(message);
          if (!ok) return;

          try {
            const res = await fetch(
              `${API_BASE}/students/${studentId}/declared-plan`,
              { method: "DELETE" }
            );

            if (res.status === 200) {
              document.getElementById(
                "ecors-declared-plan"
              ).textContent = `CANCELLED ${planInfo.code} - ${planInfo.name} on ${localTime} (${timezone})`;

              container.innerHTML = "";
              btn.style.display = "inline-block";
              dropdown.value = "";
              btn.disabled = true;

              return;
            } else if (res.status === 404) {
              showDialog(
                `No declared plan found for student with id = ${studentId}`
              );
            } else {
              showDialog("There is a problem. Please try again later.");
            }
          } catch (err) {
            console.error(err);
            showDialog("There is a problem. Please try again later.");
          }
        };
      }

      // กดปุ่ม Declare
      document.getElementById("ecors-button-declare").onclick = async () => {
        const dropdown = document.getElementById("ecors-dropdown-plan");
        const planId = Number(dropdown.value);
        const studentId = keycloak.tokenParsed.preferred_username;

        try {
          const res = await fetch(
            `${API_BASE}/students/${studentId}/declared-plan`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ planId }),
            }
          );
          if (res.status === 201) {
            showDialog("Study plan declared successfully!", () => {
              replaceDeclareWithChangeCancel(
                planId,
                studentId,
                new Date().toISOString()
              );
              loadDeclaredPlan(studentId);
            });
            return;
          }
          if (res.status === 409) {
            showDialog(
              "You may have declared study plan already. Please check again.",
              () => {
                document.getElementById("declare-box").style.display = "none";
              }
            );
            return;
          }
          showDialog("There is a problem. Please try again later.");
        } catch (err) {
          console.error(err);
          showDialog("There is a problem. Please try again later.");
        }
      };

      initPage();