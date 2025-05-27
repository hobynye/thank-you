let allDonors = []; // Store all the donor data
let filteredDonors = []; // Store filtered donor data after applying the filter

// Function to load the donor data from the JSON file
async function loadDonors() {
    const response = await fetch('donors.json'); // Fetch data from donors.json
    allDonors = await response.json();

    // Sort student names by last name (descending), then by first name (descending)
    filteredDonors = sortStudents(allDonors);

    // Populate the dropdown with unique student names
    populateDropdown(filteredDonors);
}

// Function to sort the students by last name, then first name (both descending)
function sortStudents(donors) {
    return donors.sort((a, b) => {
        const [lastA, firstA] = a.studentName.split(' ').reverse();
        const [lastB, firstB] = b.studentName.split(' ').reverse();

        // Sort by last name, then by first name
        if (lastA > lastB) return -1;
        if (lastA < lastB) return 1;
        if (firstA > firstB) return -1;
        if (firstA < firstB) return 1;
        return 0;
    });
}

// Function to populate the dropdown with student names
function populateDropdown(donors) {
    const nameSelect = document.getElementById('nameSelect');
    nameSelect.innerHTML = '<option value="">--Select a Student--</option>'; // Clear previous options

    const studentNames = [...new Set(donors.map(donor => donor.studentName))]; // Get unique student names
    studentNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        nameSelect.appendChild(option);
    });

    // If there's only one matching student, auto-select and show the donor information
    if (studentNames.length === 1) {
        nameSelect.value = studentNames[0];
        showDonors();
    }
}

// Function to filter the students based on the text box input
function filterStudents() {
    const filterText = document.getElementById('filterTextbox').value.toLowerCase();

    // Filter donors based on the input value (partial matches on name)
    filteredDonors = allDonors.filter(donor => {
        return donor.studentName.toLowerCase().includes(filterText);
    });

    // Re-populate the dropdown with the filtered list
    populateDropdown(filteredDonors);

    // If there's only one match, auto-select and display donors
    if (filteredDonors.length === 1) {
        const nameSelect = document.getElementById('nameSelect');
        nameSelect.value = filteredDonors[0].studentName;
        showDonors();
    }
}

// Function to display donors for a selected student
function showDonors() {
    const nameSelect = document.getElementById('nameSelect');
    const donorListDiv = document.getElementById('donorList');
    const selectedName = nameSelect.value;

    if (!selectedName) {
        donorListDiv.innerHTML = ''; // Clear the donor list if no name is selected
        return;
    }

    // Filter donors based on the selected student name
    const selectedDonors = allDonors.filter(donor => donor.studentName === selectedName);

    // Clear any previous donor details
    donorListDiv.innerHTML = '';

    if (selectedDonors.length === 0) {
        // If no donors found, show an error message
        donorListDiv.innerHTML = '<p role="alert" style="color: red; font-weight: bold;">No donors found for the selected student.</p>';
        return;
    }

    // Display the donor details
    selectedDonors.forEach(donor => {
        const donorDiv = document.createElement('div');
        donorDiv.classList.add('donor');
        donorDiv.innerHTML = `
      ${donor.donorOrg && donor.donorOrg.trim() !== '' ? `<strong>Organization:</strong> ${donor.donorOrg} <br>` : ''}
      ${donor.donorName && donor.donorName.trim() !== '' ? `<strong>Donor Name:</strong> ${donor.donorName} <br>` : ''}
      <strong>Address:</strong> ${donor.donorAddress} <br>
      <strong>Donation:</strong> ${donor.donation} <br><br>
    `;
        donorListDiv.appendChild(donorDiv);
    });
}

// Load the student names and donor data when the page is loaded
document.addEventListener('DOMContentLoaded', loadDonors);
