(function(w) {
  let { course, year } = w.DAVID;
  let url = 'https://davids-students.herokuapp.com';

  fetch(`${url}/api/${year}/${course}/students`)
    .then((response) => {
      return response.json();
    })
    .then(buildHTML)
    .then(insertIntoPage);

  function buildHTML({ students }) {
    return students
      .map(({ name, image }) => {
        return `
          <div class="student">
            <img src="${url}${image}" alt="${name} image">
            <small>${name}</small>
          </div>
        `;
      })
      .join('');
  }

  function insertIntoPage(html) {
    document.querySelector('#students-container').innerHTML = html;
  }
})(window);
