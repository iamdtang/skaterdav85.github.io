<script>
  export let course, year;

  let students = [];
  let url = 'https://davids-students.herokuapp.com';

  (async () => {
    let response = await fetch(`${url}/api/${year}/${course}/students`);
    let json = await response.json();
    students = json.students;
  })();
</script>

<main class="flex justify-between flex-wrap mt-2">
  {#each students as student}
    <div class="mb-2">
      <img src="{url}{student.image}" alt={student.name}>
      <div class="text-center">
        <small>{student.name}</small>
      </div>
    </div>
  {/each}
</main>

<style>
  img {
    width: 75px;
  }
</style>