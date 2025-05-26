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