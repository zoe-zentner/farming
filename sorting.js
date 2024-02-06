// Function to retrieve stored entries from Local Storage
function getStoredEntries() {
    return JSON.parse(localStorage.getItem('playerEntries')) || [];
}

// Insertion sort by name in ascending order
function insertionSortByNameAscending(arr) {
    for (let i = 1; i < arr.length; i++) {
        let currentValue = arr[i];
        let j;
        for (j = i - 1; j >= 0 && arr[j].name > currentValue.name; j--) {
            arr[j + 1] = arr[j];
        }
        arr[j + 1] = currentValue;
    }
    return arr;
}

// Insertion sort by name in descending order
function insertionSortByNameDescending(arr) {
    for (let i = 1; i < arr.length; i++) {
        let currentValue = arr[i];
        let j;
        for (j = i - 1; j >= 0 && arr[j].name < currentValue.name; j--) {
            arr[j + 1] = arr[j];
        }
        arr[j + 1] = currentValue;
    }
    return arr;
}

// Insertion sort by score in ascending order
function insertionSortByScoreAscending(arr) {
    for (let i = 1; i < arr.length; i++) {
        let currentValue = arr[i];
        let j;
        for (j = i - 1; j >= 0 && arr[j].score > currentValue.score; j--) {
            arr[j + 1] = arr[j];
        }
        arr[j + 1] = currentValue;
    }
    return arr;
}

// Insertion sort by score in descending order
function insertionSortByScoreDescending(arr) {
    for (let i = 1; i < arr.length; i++) {
        let currentValue = arr[i];
        let j;
        for (j = i - 1; j >= 0 && arr[j].score < currentValue.score; j--) {
            arr[j + 1] = arr[j];
        }
        arr[j + 1] = currentValue;
    }
    return arr;
}

// Sort stored entries by name in ascending order
export function sortByNamesAscending() {
    const storedEntries = getStoredEntries();
    const sortedEntries = insertionSortByNameAscending(storedEntries.slice());
    // sortedEntries.forEach(entry => {
    //     console.log(`Name: ${entry.name}, Score: ${entry.score}`);
    // });
    return sortedEntries
}

// Sort stored entries by name in descending order
export function sortByNamesDescending() {
    const storedEntries = getStoredEntries();
    const sortedEntries = insertionSortByNameDescending(storedEntries.slice());
    // sortedEntries.forEach(entry => {
    //     console.log(`Name: ${entry.name}, Score: ${entry.score}`);
    // });
    return sortedEntries
}

// Sort stored entries by score in ascending order
export function sortByScoresAscending() {
    const storedEntries = getStoredEntries();
    const sortedEntries = insertionSortByScoreAscending(storedEntries.slice());
    // sortedEntries.forEach(entry => {
    //     console.log(`Name: ${entry.name}, Score: ${entry.score}`);
    // });
    return sortedEntries
}

// Sort stored entries by score in descending order
export function sortByScoresDescending() {
    const storedEntries = getStoredEntries();
    const sortedEntries = insertionSortByScoreDescending(storedEntries.slice());
    // sortedEntries.forEach(entry => {
    //     console.log(`Name: ${entry.name}, Score: ${entry.score}`);
    // });
    return sortedEntries
}
