async function filterForms() {
    const filter = document.getElementById('filter-input').value.toLowerCase();
    const container = document.getElementById('forms-container');

    try {
        const response = await fetch('/forms');
        
        if (!response.ok) throw new Error(`Fehler: ${response.statusText}`);
        const allForms = await response.json();
        
        container.innerHTML = '';

        const filteredForms = allForms.filter(form =>
            form._id.toLowerCase().includes(filter)
        );

        if (filteredForms.length === 0) {
            container.innerHTML = '<p>Keine Formen gefunden.</p>';
            return;
        }

        filteredForms.forEach(form => {
            const div = document.createElement('div');
            div.classList.add('form');

            const title = document.createElement('p');
            title.textContent = form._id;
            div.appendChild(title);

            const table = document.createElement('table');
            form.grid.forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    if (cell === 1) td.classList.add('alive');
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });

            div.appendChild(table);
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Formen:', error);
        container.innerHTML = `<p style="color: red;">Es gab ein Problem beim Abrufen der Formen. Bitte versuchen Sie es erneut.</p>`;
    }
}

document.getElementById('filter-input').addEventListener('input', filterForms);

filterForms();

function loadIn() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    saveToDatabase(data, "form").then(() => {
                        alert('Die Datei wurde erfolgreich hochgeladen und gespeichert.');
                        location.reload();
                    }).catch((error) => {
                        console.error('Fehler beim Speichern in der Datenbank:', error);
                        alert('Fehler: Die Datei konnte nicht gespeichert werden.');
                    });
                } catch (error) {
                    alert('Fehler: Ungültige JSON-Datei.');
                }
            };

            reader.onerror = () => {
                alert('Fehler beim Lesen der Datei.');
            };

            reader.readAsText(file);
        }
    });

    fileInput.click();
}

async function saveToDatabase(data, type) {
    return fetch('/api/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, type })
    });
}
