async function fetchForms() {
  const response = await fetch('/forms');
  const forms = await response.json();
  const container = document.getElementById('forms-container');
  container.innerHTML = '';

  forms.forEach(form => {
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
}

fetchForms();
