function saveData() {
    const tasksJSON = JSON.stringify(tasks);
    localStorage.setItem('backup', tasksJSON);
}

window.addEventListener('beforeunload', function(event) {
    const backup = confirm('是否要備份當前數據？');
    if (backup) {
        saveData();
    }
});
