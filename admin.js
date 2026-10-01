// =====================================
// ADMIN LOGIN CHECK
// =====================================

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));


if (
    !loggedInUser ||
    loggedInUser.role !== "admin"
) {

    window.location.href = "login.html";

}



// =====================================
// GET USERS
// =====================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem("users")
    ) || [];

}



// =====================================
// GET APPLICATIONS
// =====================================

function getApplications() {

    return JSON.parse(
        localStorage.getItem("jobApplications")
    ) || [];

}



// =====================================
// DISPLAY STATISTICS
// =====================================

function displayStats() {

    const users = getUsers();

    const applications = getApplications();


    document.getElementById("totalUsers").textContent =
        users.length;


    document.getElementById("totalApplicationsAdmin").textContent =
        applications.length;


    const interviews =
        applications.filter(function(app) {

            return app.status === "Interview";

        }).length;


    const selected =
        applications.filter(function(app) {

            return app.status === "Selected";

        }).length;


    document.getElementById("totalInterviews").textContent =
        interviews;


    document.getElementById("totalSelected").textContent =
        selected;

}



// =====================================
// DISPLAY USERS
// =====================================

function displayUsers() {

    const users = getUsers();

    const userList =
        document.getElementById("userList");


    userList.innerHTML = "";


    if (users.length === 0) {

        userList.innerHTML = `
            <tr>
                <td colspan="3">
                    No registered users.
                </td>
            </tr>
        `;

        return;
    }


    users.forEach(function(user) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${user.name}
                </strong>
            </td>

            <td>
                ${user.email}
            </td>

            <td>

                <span class="role-badge">
                    ${user.role}
                </span>

            </td>

        `;


        userList.appendChild(row);

    });

}



// =====================================
// DISPLAY APPLICATIONS
// =====================================

function displayApplications(
    filteredApplications = null
) {

    const applications =
        filteredApplications || getApplications();


    const container =
        document.getElementById("adminApplications");


    container.innerHTML = "";


    if (applications.length === 0) {

        container.innerHTML = `

            <tr>

                <td colspan="5">
                    No applications found.
                </td>

            </tr>

        `;

        return;
    }


    applications.forEach(function(app) {

        const row =
            document.createElement("tr");


        let statusClass =
            app.status
                .toLowerCase()
                .replace(" ", "-");


        let priorityClass =
            app.priority
                .toLowerCase();


        row.innerHTML = `

            <td>

                <strong>
                    ${app.company}
                </strong>

            </td>


            <td>
                ${app.role}
            </td>


            <td>

                <span class="status-badge ${statusClass}">
                    ${app.status}
                </span>

            </td>


            <td>

                <span class="priority-badge ${priorityClass}">
                    ${app.priority}
                </span>

            </td>


            <td>
                ${app.applicationDate || "-"}
            </td>

        `;


        container.appendChild(row);

    });

}



// =====================================
// SEARCH + FILTER
// =====================================

function filterAdminApplications() {

    const search =
        document.getElementById("adminSearch")
            .value
            .toLowerCase();


    const status =
        document.getElementById("adminStatusFilter")
            .value;


    const applications =
        getApplications();


    const filtered =
        applications.filter(function(app) {

            const matchesSearch =

                app.company
                    .toLowerCase()
                    .includes(search)

                ||

                app.role
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                status === "all" ||
                app.status === status;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    displayApplications(filtered);

}



// =====================================
// LOGOUT
// =====================================

function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "login.html";

}



// =====================================
// INITIALIZE ADMIN DASHBOARD
// =====================================

displayStats();

displayUsers();

displayApplications();
// =====================================
// ADMIN SIDEBAR NAVIGATION
// =====================================

const adminNavItems =
    document.querySelectorAll(".admin-nav-item");

adminNavItems.forEach(function(item) {

    item.addEventListener("click", function() {

        // Remove active from all items
        adminNavItems.forEach(function(nav) {
            nav.classList.remove("active");
        });

        // Add active to clicked item
        item.classList.add("active");

    });

});