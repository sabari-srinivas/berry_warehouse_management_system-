let editingItem = null;

// Initialize stock data from local storage
function initializeStockData() {
    const storedData = localStorage.getItem('stockData');
    if (storedData) {
        return JSON.parse(storedData);
    } else {
        return {};
    }
}

let stockData = initializeStockData();

// Save stock data to local storage
function saveStockData() {
    localStorage.setItem('stockData', JSON.stringify(stockData));
}

// Show login form
function showLogin() {
    toggleVisibility('loginForm', 'registerForm');
}

// Show registration form
function showRegister() {
    toggleVisibility('registerForm', 'loginForm');
}

// Toggle visibility of forms
function toggleVisibility(showId, hideId) {
    document.getElementById(hideId).classList.add('hidden');
    document.getElementById(showId).classList.remove('hidden');
}

// Register a new user
function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (username && password) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            alert('Username already exists!');
        } else {
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful!');
            document.getElementById('registerForm').classList.add('hidden');
        }
    } else {
        alert('Please fill in all fields!');
    }
}

// Login user
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (username && password) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username] && users[username] === password) {
            alert('Login successful!');
            document.getElementById('authForm').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
        } else {
            alert('Invalid username or password!');
        }
    } else {
        alert('Please fill in all fields!');
    }
}

// Logout user
function logout() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('authForm').classList.remove('hidden');
}

// Show the add shipment form
function showForm(form) {
    document.getElementById('addShipmentForm').classList.add('hidden');
    document.getElementById('viewStock').classList.add('hidden');

    if (form === 'add') {
        document.getElementById('addShipmentForm').classList.remove('hidden');
        clearForm();
        editingItem = null;
        document.getElementById('saveShipmentBtn').classList.remove('hidden');
        document.getElementById('updateShipmentBtn').classList.add('hidden');
    }
}

// Save new shipment
function saveShipment() {
    const berryType = document.getElementById('berryType').value;
    const batchNumber = document.getElementById('batchNumber').value;
    const harvestDate = new Date(document.getElementById('harvestDate').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const storageLocation = document.getElementById('storageLocation').value;

    if (berryType && batchNumber && harvestDate && quantity && storageLocation) {
        const currentDate = new Date();
        const daysDifference = Math.floor((currentDate - harvestDate) / (1000 * 60 * 60 * 24));

        if (daysDifference > 7) {
            alert('The harvested berries are expired!');
        } else {
            if (!stockData[storageLocation]) {
                stockData[storageLocation] = { totalQuantity: 0, items: [] };
            }

            if (stockData[storageLocation].totalQuantity + quantity > 500) {
                alert('Particular location has overstock and stock can\'t be added further.');
            } else {
                stockData[storageLocation].items.push({
                    berryType,
                    batchNumber,
                    harvestDate: harvestDate.toISOString().split('T')[0],
                    quantity,
                    storageLocation
                });
                stockData[storageLocation].totalQuantity += quantity;
                saveStockData();
                alert('Shipment Added Successfully');
                clearForm();
                showStock();
            }
        }
    } else {
        alert('Please fill in all fields!');
    }
}

// Show stock data
function showStock() {
    document.getElementById('addShipmentForm').classList.add('hidden');
    document.getElementById('viewStock').classList.remove('hidden');
    renderStockTable();
}

// Render stock table
function renderStockTable() {
    const stockTableBody = document.getElementById('stockTable').getElementsByTagName('tbody')[0];
    stockTableBody.innerHTML = '';

    for (const location in stockData) {
        stockData[location].items.forEach(item => {
            const row = stockTableBody.insertRow();
            row.insertCell(0).innerText = item.berryType;
            row.insertCell(1).innerText = item.batchNumber;
            row.insertCell(2).innerText = item.harvestDate;
            row.insertCell(3).innerText = item.quantity;
            row.insertCell(4).innerText = item.storageLocation;
            const daysDifference = Math.floor((new Date() - new Date(item.harvestDate)) / (1000 * 60 * 60 * 24));
            
            // Set status based on the number of days
            if (daysDifference > 7) {
                row.insertCell(5).innerText = 'Expired';
            } else if (daysDifference === 5 || daysDifference === 6) {
                row.insertCell(5).innerText = 'Nearing Expiration Date';
            } else {
                row.insertCell(5).innerText = 'Fresh';
            }

            row.insertCell(6).innerHTML = `<button onclick="editShipment('${location}', '${item.batchNumber}')">Edit</button> 
                                             <button onclick="deleteShipment('${location}', '${item.batchNumber}')">Delete</button>`;
        });
    }
    renderLocationTable();
}

// Render location table
function renderLocationTable() {
    const locationTableBody = document.getElementById('locationTable').getElementsByTagName('tbody')[0];
    locationTableBody.innerHTML = '';
    
    // Track if any location has a total quantity greater than zero
    let hasStock = false;

    for (const location in stockData) {
        if (stockData[location].totalQuantity > 0) {
            hasStock = true; // Set flag if there's stock
            const row = locationTableBody.insertRow();
            row.insertCell(0).innerText = location;
            row.insertCell(1).innerText = stockData[location].totalQuantity;
        }
    }
    
    // Show or hide the location table based on total quantity
    const locationTable = document.getElementById('locationTable');
    locationTable.style.display = hasStock ? 'table' : 'none'; // Hide table if no locations have stock
}

// Edit shipment
function editShipment(location, batchNumber) {
    editingItem = { location, batchNumber };
    const item = stockData[location].items.find(i => i.batchNumber === batchNumber);

    if (item) {
        document.getElementById('berryType').value = item.berryType;
        document.getElementById('batchNumber').value = item.batchNumber;
        document.getElementById('harvestDate').value = item.harvestDate;
        document.getElementById('quantity').value = item.quantity;
        document.getElementById('storageLocation').value = item.storageLocation;
        
        document.getElementById('addShipmentForm').classList.remove('hidden');
        document.getElementById('viewStock').classList.add('hidden');
        document.getElementById('saveShipmentBtn').classList.add('hidden');
        document.getElementById('updateShipmentBtn').classList.remove('hidden');
    }
}

// Update shipment
function updateShipment() {
    const berryType = document.getElementById('berryType').value;
    const batchNumber = document.getElementById('batchNumber').value;
    const harvestDate = new Date(document.getElementById('harvestDate').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const storageLocation = document.getElementById('storageLocation').value;

    if (berryType && batchNumber && harvestDate && quantity && storageLocation) {
        const itemIndex = stockData[editingItem.location].items.findIndex(i => i.batchNumber === editingItem.batchNumber);
        const item = stockData[editingItem.location].items[itemIndex];

        if (item) {
            const previousQuantity = item.quantity;
            // Update item details
            item.berryType = berryType;
            item.batchNumber = batchNumber;
            item.harvestDate = harvestDate.toISOString().split('T')[0];
            item.quantity = quantity;
            item.storageLocation = storageLocation;

            // Update location total quantities
            stockData[editingItem.location].totalQuantity += (quantity - previousQuantity);

            // If the storage location changes
            if (editingItem.location !== storageLocation) {
                // Remove item from old location
                stockData[editingItem.location].items.splice(itemIndex, 1);
                stockData[editingItem.location].totalQuantity -= previousQuantity;

                // Add item to new location
                if (!stockData[storageLocation]) {
                    stockData[storageLocation] = { totalQuantity: 0, items: [] };
                }
                stockData[storageLocation].items.push(item);
                stockData[storageLocation].totalQuantity += quantity;
            }

            saveStockData();
            alert('Shipment Updated Successfully');
            clearForm();
            showStock();
            editingItem = null;
        }
    } else {
        alert('Please fill in all fields!');
    }
}

// Delete shipment
function deleteShipment(location, batchNumber) {
    const itemIndex = stockData[location].items.findIndex(i => i.batchNumber === batchNumber);
    
    if (itemIndex > -1) {
        const quantityToRemove = stockData[location].items[itemIndex].quantity;
        stockData[location].items.splice(itemIndex, 1);
        stockData[location].totalQuantity -= quantityToRemove;
        
        // Remove the location entry if total quantity is 0
        if (stockData[location].totalQuantity === 0) {
            delete stockData[location];
        }
        
        saveStockData();
        alert('Shipment Deleted Successfully');
        showStock();
    }
}

// Clear the form fields
function clearForm() {
    document.getElementById('berryType').value = '';
    document.getElementById('batchNumber').value = '';
    document.getElementById('harvestDate').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('storageLocation').value = '';
}

// Call the function to initialize
initializeStockData();
