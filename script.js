// ==========================================
// LOGIN CHECK
// ==========================================

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser || loggedInUser.role !== "user") {
    window.location.href = "login.html";
}


// ==========================================
// LOAD APPLICATIONS
// ==========================================

let applications =
    JSON.parse(localStorage.getItem("jobApplications")) || [];


// ==========================================
// ELEMENTS
// ==========================================

const modal =
    document.getElementById("modal");

const form =
    document.getElementById("jobForm");

const applicationList =
    document.getElementById("applicationList");

const reminderList =
    document.getElementById("reminderList");

const themeBtn =
    document.getElementById("themeBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// OPEN MODAL
// ==========================================

function openModal() {

    modal.classList.add("show");

    document.getElementById("modalTitle").textContent =
        "Add Job Application";

    form.reset();

    document.getElementById("editId").value = "";
}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    modal.classList.remove("show");

}


// ==========================================
// SAVE APPLICATION
// ==========================================

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const editId =
        document.getElementById("editId").value;


    const application = {

        id: editId || Date.now(),

        company:
            document.getElementById("company").value.trim(),

        role:
            document.getElementById("role").value.trim(),

        applicationDate:
            document.getElementById("applicationDate").value,

        status:
            document.getElementById("status").value,

        priority:
            document.getElementById("priority").value,

        interviewDate:
            document.getElementById("interviewDate").value,

        followupDate:
            document.getElementById("followupDate").value,

        jobLink:
            document.getElementById("jobLink").value.trim(),

        notes:
            document.getElementById("notes").value.trim()
    };


    // EDIT

    if (editId) {

        applications =
            applications.map(function(app) {

                return app.id == editId
                    ? application
                    : app;

            });

    }

    // ADD

    else {

        applications.push(application);

    }


    saveData();

    closeModal();

    displayApplications();

    updateDashboard();

    displayReminders();

});


// ==========================================
// SAVE DATA
// ==========================================

function saveData() {

    localStorage.setItem(
        "jobApplications",
        JSON.stringify(applications)
    );

}


// ==========================================
// DISPLAY APPLICATIONS
// ==========================================

function displayApplications() {

    let filtered =
        [...applications];


    const search =
        document.getElementById("searchInput")
        .value
        .toLowerCase();


    const status =
        document.getElementById("statusFilter")
        .value;


    const priority =
        document.getElementById("priorityFilter")
        .value;


    const sort =
        document.getElementById("sortFilter")
        .value;


    // SEARCH

    filtered =
        filtered.filter(function(app) {

            return (
                app.company.toLowerCase().includes(search) ||
                app.role.toLowerCase().includes(search)
            );

        });


    // STATUS

    if (status !== "all") {

        filtered =
            filtered.filter(function(app) {

                return app.status === status;

            });

    }


    // PRIORITY

    if (priority !== "all") {

        filtered =
            filtered.filter(function(app) {

                return app.priority === priority;

            });

    }


    // SORT

    if (sort === "newest") {

        filtered.sort(function(a, b) {

            return new Date(b.applicationDate) -
                   new Date(a.applicationDate);

        });

    }

    else if (sort === "oldest") {

        filtered.sort(function(a, b) {

            return new Date(a.applicationDate) -
                   new Date(b.applicationDate);

        });

    }

    else if (sort === "company") {

        filtered.sort(function(a, b) {

            return a.company.localeCompare(b.company);

        });

    }


    // EMPTY

    if (filtered.length === 0) {

        applicationList.innerHTML = `

            <div class="empty">

                <i class="fa-solid fa-folder-open"></i>

                <h3>No Applications Found</h3>

                <p>
                    Add a job application or change your filters.
                </p>

            </div>

        `;

        return;
    }


    applicationList.innerHTML = "";


    // APPLICATION CARDS

    filtered.forEach(function(app) {

        const card =
            document.createElement("div");

        card.className =
            "application-card";


        const initial =
            app.company.charAt(0).toUpperCase();


        card.innerHTML = `

            <div class="application-top">

                <div class="company-info">

                    <div class="company-logo">
                        ${initial}
                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(app.company)}
                        </h3>

                        <p>
                            ${escapeHTML(app.role)}
                        </p>

                    </div>

                </div>


                <div class="badges">

                    <span class="badge status-${app.status}">
                        ${app.status}
                    </span>

                    <span class="badge priority-${app.priority}">
                        ${app.priority}
                    </span>

                </div>

            </div>


            <div class="application-details">

                <div class="detail">

                    <p>Applied On</p>

                    <p>
                        ${formatDate(app.applicationDate)}
                    </p>

                </div>


                <div class="detail">

                    <p>Interview</p>

                    <p>
                        ${
                            app.interviewDate
                            ? formatDate(app.interviewDate)
                            : "Not scheduled"
                        }
                    </p>

                </div>


                <div class="detail">

                    <p>Follow-up</p>

                    <p>
                        ${
                            app.followupDate
                            ? formatDate(app.followupDate)
                            : "Not set"
                        }
                    </p>

                </div>

            </div>


            ${
                app.notes
                ?
                `
                <p class="notes">

                    <b>Notes:</b>

                    ${escapeHTML(app.notes)}

                </p>
                `
                :
                ""
            }


            <div class="card-actions">

                ${
                    app.jobLink
                    ?
                    `
                    <button
                        class="link-btn"
                        onclick="openJobLink('${app.jobLink}')">

                        <i class="fa-solid fa-link"></i>

                        Job Link

                    </button>
                    `
                    :
                    ""
                }


                <button
                    class="edit-btn"
                    onclick="editApplication(${app.id})">

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteApplication(${app.id})">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </div>

        `;


        applicationList.appendChild(card);

    });

}


// ==========================================
// EDIT APPLICATION
// ==========================================

function editApplication(id) {

    const app =
        applications.find(function(application) {

            return application.id == id;

        });


    if (!app) return;


    document.getElementById("editId").value =
        app.id;

    document.getElementById("company").value =
        app.company;

    document.getElementById("role").value =
        app.role;

    document.getElementById("applicationDate").value =
        app.applicationDate;

    document.getElementById("status").value =
        app.status;

    document.getElementById("priority").value =
        app.priority;

    document.getElementById("interviewDate").value =
        app.interviewDate;

    document.getElementById("followupDate").value =
        app.followupDate;

    document.getElementById("jobLink").value =
        app.jobLink;

    document.getElementById("notes").value =
        app.notes;


    document.getElementById("modalTitle").textContent =
        "Edit Job Application";


    modal.classList.add("show");

}


// ==========================================
// DELETE APPLICATION
// ==========================================

function deleteApplication(id) {

    if (!confirm(
        "Are you sure you want to delete this application?"
    )) {

        return;

    }


    applications =
        applications.filter(function(app) {

            return app.id != id;

        });


    saveData();

    displayApplications();

    updateDashboard();

    displayReminders();

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const total =
        applications.length;


    const applied =
        applications.filter(
            app => app.status === "Applied"
        ).length;


    const shortlisted =
        applications.filter(
            app => app.status === "Shortlisted"
        ).length;


    const interviews =
        applications.filter(
            app => app.status === "Interview"
        ).length;


    const selected =
        applications.filter(
            app => app.status === "Selected"
        ).length;


    const inProgress =
        applied +
        shortlisted +
        interviews;


    document.getElementById("totalApplications")
        .textContent = total;


    document.getElementById("inProgress")
        .textContent = inProgress;


    document.getElementById("interviews")
        .textContent = interviews;


    document.getElementById("selected")
        .textContent = selected;


    document.getElementById("appliedCount")
        .textContent = applied;


    document.getElementById("shortlistedCount")
        .textContent = shortlisted;


    document.getElementById("interviewCount")
        .textContent = interviews;


    document.getElementById("selectedCount")
        .textContent = selected;


    setProgress("appliedBar", applied, total);

    setProgress(
        "shortlistedBar",
        shortlisted,
        total
    );

    setProgress(
        "interviewBar",
        interviews,
        total
    );

    setProgress(
        "selectedBar",
        selected,
        total
    );


    const successRate =
        total === 0
        ? 0
        : Math.round(
            (selected / total) * 100
        );


    document.getElementById("successRate")
        .textContent =
        successRate + "%";

}


// ==========================================
// PROGRESS BAR
// ==========================================

function setProgress(id, count, total) {

    const bar =
        document.getElementById(id);


    if (!bar) return;


    const percentage =
        total === 0
        ? 0
        : (count / total) * 100;


    bar.style.width =
        percentage + "%";

}


// ==========================================
// REMINDERS
// ==========================================

function displayReminders() {

    if (!reminderList) return;


    const reminders = [];


    applications.forEach(function(app) {


        // INTERVIEW

        if (app.interviewDate) {

            reminders.push({

                company: app.company,

                role: app.role,

                date: app.interviewDate,

                type: "Interview"

            });

        }


        // FOLLOW-UP

        if (app.followupDate) {

            reminders.push({

                company: app.company,

                role: app.role,

                date: app.followupDate,

                type: "Follow-up"

            });

        }

    });


    // SORT BY DATE

    reminders.sort(function(a, b) {

        return new Date(a.date) -
               new Date(b.date);

    });


    // NO REMINDERS

    if (reminders.length === 0) {

        reminderList.innerHTML = `

            <div class="empty">

                <i class="fa-solid fa-bell-slash"></i>

                <h3>No Reminders</h3>

                <p>
                    Add an interview or follow-up date
                    to create a reminder.
                </p>

            </div>

        `;

        return;
    }


    reminderList.innerHTML = "";


    // DISPLAY REMINDERS

    reminders.slice(0, 6).forEach(function(reminder) {

        const div =
            document.createElement("div");


        div.className =
            "reminder";


        div.innerHTML = `

            <h3>

                <i class="fa-solid fa-calendar"></i>

                ${reminder.type}

            </h3>


            <p>
                <b>
                    ${escapeHTML(reminder.company)}
                </b>
            </p>


            <p>
                ${escapeHTML(reminder.role)}
            </p>


            <p>
                📅 ${formatDate(reminder.date)}
            </p>

        `;


        reminderList.appendChild(div);

    });

}


// ==========================================
// SEARCH / FILTER
// ==========================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        displayApplications
    );


document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        displayApplications
    );


document
    .getElementById("priorityFilter")
    .addEventListener(
        "change",
        displayApplications
    );


document
    .getElementById("sortFilter")
    .addEventListener(
        "change",
        displayApplications
    );


// ==========================================
// DARK MODE
// ==========================================

function setDarkMode(isDark) {

    if (isDark) {

        document.body.classList.add("dark");

        localStorage.setItem(
            "darkMode",
            "true"
        );


        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i> Light Mode';

    }

    else {

        document.body.classList.remove("dark");

        localStorage.setItem(
            "darkMode",
            "false"
        );


        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i> Dark Mode';

    }

}


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        function() {

            const isDark =
                !document.body.classList.contains("dark");

            setDarkMode(isDark);

        }
    );

}


// ==========================================
// RESTORE DARK MODE
// ==========================================

const savedDarkMode =
    localStorage.getItem("darkMode");


if (savedDarkMode === "true") {

    setDarkMode(true);

}

else {

    setDarkMode(false);

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "login.html";

        }
    );

}


// ==========================================
// EXPORT CSV
// ==========================================

function exportCSV() {

    if (applications.length === 0) {

        alert(
            "There are no applications to export."
        );

        return;

    }


    let csv =
        "Company,Role,Application Date,Status,Priority,Interview Date,Follow-up Date,Notes\n";


    applications.forEach(function(app) {

        csv += [

            `"${app.company}"`,
            `"${app.role}"`,
            `"${app.applicationDate}"`,
            `"${app.status}"`,
            `"${app.priority}"`,
            `"${app.interviewDate}"`,
            `"${app.followupDate}"`,
            `"${app.notes.replace(/"/g, '""')}"`

        ].join(",") + "\n";

    });


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "job-applications.csv";


    link.click();


    URL.revokeObjectURL(url);

}


// ==========================================
// JOB LINK
// ==========================================

function openJobLink(url) {

    window.open(
        url,
        "_blank"
    );

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    if (!date) return "Not set";


    const d =
        new Date(date);


    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    if (!text) return "";


    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// CLOSE MODAL BY CLICKING OUTSIDE
// ==========================================

modal.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {

            closeModal();

        }

    }
);

// ==========================================
// SIDEBAR NAVIGATION ACTIVE ITEM
// ==========================================

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(function(item) {

    item.addEventListener("click", function() {

        // Remove active from all menu items
        navItems.forEach(function(nav) {
            nav.classList.remove("active");
        });

        // Highlight selected menu item
        item.classList.add("active");

    });

});


// ==========================================
// KEEP ACTIVE ITEM AFTER PAGE LOAD
// ==========================================

function setActiveFromHash() {

    const currentHash = window.location.hash;

    navItems.forEach(function(item) {

        item.classList.remove("active");

        if (item.getAttribute("href") === currentHash) {
            item.classList.add("active");
        }

    });

}


// When page loads
setActiveFromHash();


// When Dashboard / Applications / Reminders is clicked
window.addEventListener(
    "hashchange",
    setActiveFromHash
);


// ==========================================
// INITIAL LOAD
// ==========================================

displayApplications();

updateDashboard();

displayReminders();
