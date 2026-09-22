const API_URL = "http://localhost:5000/api/leads";

let allLeads = [];

let editingLeadId = null;



// ==================================================
// LOAD LEADS
// ==================================================

async function loadLeads() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch leads");
        }

        allLeads = await response.json();

        displayLeads(allLeads);

        updateStats(allLeads);

    }

    catch (error) {

        console.error("Error loading leads:", error);

        document.getElementById("leadTable").innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;"
                >

                    ❌ Unable to connect to the server.

                </td>

            </tr>

        `;

    }

}



// ==================================================
// DISPLAY LEADS
// ==================================================

function displayLeads(leads) {

    const table =
        document.getElementById("leadTable");

    table.innerHTML = "";


    if (leads.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;"
                >

                    No leads found.
                    Add your first lead! 🚀

                </td>

            </tr>

        `;

        return;

    }



    leads.forEach(lead => {


        const row =
            document.createElement("tr");



        let statusClass =
            "status-new";


        if (lead.status === "Contacted") {

            statusClass =
                "status-contacted";

        }


        if (lead.status === "Converted") {

            statusClass =
                "status-converted";

        }



        let followUpText = "—";



        if (lead.followUpDate) {

            const date =
                new Date(lead.followUpDate);

            followUpText =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        }



        row.innerHTML = `

            <td>

                <div class="lead-name">

                    <div class="lead-avatar">

                        ${escapeHTML(
                            (lead.name || "?")
                            .charAt(0)
                            .toUpperCase()
                        )}

                    </div>

                    <strong>
                        ${escapeHTML(
                            lead.name
                        )}
                    </strong>

                </div>

            </td>


            <td>

                ${escapeHTML(
                    lead.email
                )}

            </td>


            <td>

                <span class="source-badge">

                    ${escapeHTML(
                        lead.source || "—"
                    )}

                </span>

            </td>


            <td>

                <select

                    class="status ${statusClass}"

                    onchange="
                        updateStatus(
                            '${lead._id}',
                            this.value
                        )
                    "

                >

                    <option
                        value="New"
                        ${lead.status === "New"
                            ? "selected"
                            : ""}
                    >
                        New
                    </option>


                    <option
                        value="Contacted"
                        ${lead.status === "Contacted"
                            ? "selected"
                            : ""}
                    >
                        Contacted
                    </option>


                    <option
                        value="Converted"
                        ${lead.status === "Converted"
                            ? "selected"
                            : ""}
                    >
                        Converted
                    </option>

                </select>

            </td>


            <td>

                <span class="notes-text">

                    ${escapeHTML(
                        lead.notes || "—"
                    )}

                </span>

            </td>


            <td>

                <span class="follow-up">

                    📅 ${followUpText}

                </span>

            </td>


            <td>

                <div class="actions">

                    <button

                        class="action-btn edit-btn"

                        onclick="
                            editLead(
                                '${lead._id}'
                            )
                        "

                        title="Edit Lead"

                    >

                        ✏️

                    </button>


                    <button

                        class="action-btn delete-btn"

                        onclick="
                            deleteLead(
                                '${lead._id}'
                            )
                        "

                        title="Delete Lead"

                    >

                        🗑️

                    </button>

                </div>

            </td>

        `;



        table.appendChild(row);

    });

}



// ==================================================
// UPDATE STATISTICS
// ==================================================

function updateStats(leads) {

    document.getElementById(
        "totalLeads"
    ).textContent = leads.length;


    document.getElementById(
        "newLeads"
    ).textContent =

        leads.filter(
            lead =>
                lead.status === "New"
        ).length;


    document.getElementById(
        "contactedLeads"
    ).textContent =

        leads.filter(
            lead =>
                lead.status === "Contacted"
        ).length;


    document.getElementById(
        "convertedLeads"
    ).textContent =

        leads.filter(
            lead =>
                lead.status === "Converted"
        ).length;

}



// ==================================================
// ADD / UPDATE LEAD
// ==================================================

document
    .getElementById("leadForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();



            const lead = {

                name:
                    document
                    .getElementById("name")
                    .value
                    .trim(),


                email:
                    document
                    .getElementById("email")
                    .value
                    .trim(),


                phone:
                    document
                    .getElementById("phone")
                    .value
                    .trim(),


                company:
                    document
                    .getElementById("company")
                    .value
                    .trim(),


                source:
                    document
                    .getElementById("source")
                    .value,


                notes:
                    document
                    .getElementById("notes")
                    .value
                    .trim(),


                followUpDate:
                    document
                    .getElementById("followUpDate")
                    .value
                    || null

            };



            try {


                let response;



                // EDIT EXISTING LEAD

                if (editingLeadId) {


                    response =
                        await fetch(
                            `${API_URL}/${editingLeadId}`,
                            {

                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        lead
                                    )

                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Failed to update lead"
                        );

                    }


                    alert(
                        "Lead updated successfully! ✨"
                    );

                }



                // ADD NEW LEAD

                else {


                    lead.status = "New";


                    response =
                        await fetch(
                            API_URL,
                            {

                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        lead
                                    )

                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Failed to create lead"
                        );

                    }


                    alert(
                        "Lead added successfully! 🎉"
                    );

                }



                // RESET FORM

                document
                    .getElementById("leadForm")
                    .reset();


                editingLeadId = null;



                document
                    .getElementById(
                        "leadModalTitle"
                    )
                    .textContent =
                        "Add New Lead";



                document
                    .getElementById("saveBtn")
                    .textContent =
                        "Save Lead";



                closeForm();



                await loadLeads();

            }


            catch (error) {

                console.error(
                    "Error saving lead:",
                    error
                );


                alert(
                    "Could not save the lead. Please check the server."
                );

            }

        }
    );



// ==================================================
// EDIT LEAD
// ==================================================

function editLead(id) {


    const lead =
        allLeads.find(
            lead =>
                lead._id === id
        );


    if (!lead) {

        alert(
            "Lead not found."
        );

        return;

    }



    editingLeadId = id;



    document
        .getElementById(
            "leadModalTitle"
        )
        .textContent =
            "Edit Lead";



    document
        .getElementById("saveBtn")
        .textContent =
            "Update Lead";



    document
        .getElementById("name")
        .value =
            lead.name || "";



    document
        .getElementById("email")
        .value =
            lead.email || "";



    document
        .getElementById("phone")
        .value =
            lead.phone || "";



    document
        .getElementById("company")
        .value =
            lead.company || "";



    document
        .getElementById("source")
        .value =
            lead.source || "";



    document
        .getElementById("notes")
        .value =
            lead.notes || "";



    if (lead.followUpDate) {

        const date =
            new Date(
                lead.followUpDate
            );


        document
            .getElementById(
                "followUpDate"
            )
            .value =
                date
                    .toISOString()
                    .split("T")[0];

    }

    else {

        document
            .getElementById(
                "followUpDate"
            )
            .value = "";

    }



    openForm();

}



// ==================================================
// UPDATE STATUS
// ==================================================

async function updateStatus(
    id,
    status
) {


    try {


        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            status: status
                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update status"
            );

        }


        await loadLeads();

    }


    catch (error) {

        console.error(
            "Error updating status:",
            error
        );


        alert(
            "Could not update the lead status."
        );

    }

}



// ==================================================
// DELETE LEAD
// ==================================================

async function deleteLead(id) {


    const confirmed =
        confirm(
            "Are you sure you want to delete this lead?"
        );


    if (!confirmed) {

        return;

    }



    try {


        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete lead"
            );

        }


        await loadLeads();

    }


    catch (error) {

        console.error(
            "Error deleting lead:",
            error
        );


        alert(
            "Could not delete the lead."
        );

    }

}



// ==================================================
// SEARCH
// ==================================================

function searchLeads() {


    const search =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();



    const filtered =
        allLeads.filter(
            lead =>

                (lead.name || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (lead.email || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (lead.source || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (lead.company || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (lead.status || "")
                    .toLowerCase()
                    .includes(search)

        );



    displayLeads(filtered);

}



// ==================================================
// OPEN FORM
// ==================================================

function openForm() {

    document
        .getElementById(
            "leadModal"
        )
        .style.display = "flex";

}



// ==================================================
// CLOSE FORM
// ==================================================

function closeForm() {

    document
        .getElementById(
            "leadModal"
        )
        .style.display = "none";

}



// ==================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==================================================

window.addEventListener(
    "click",
    function(event) {


        const modal =
            document.getElementById(
                "leadModal"
            );


        if (
            event.target === modal
        ) {

            closeForm();

        }

    }
);



// ==================================================
// SECURITY
// ==================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



// ==================================================
// START APPLICATION
// ==================================================

loadLeads();
