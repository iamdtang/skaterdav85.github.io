<script>
  export let course, year;

  let students = [];
  let url = 'https://davids-students.herokuapp.com';
  let loading = true;

  (async () => {
    let response = await fetch(`${url}/api/${year}/${course}/students`);
    let json = await response.json();
    students = json.students;
    loading = false;
  })();
</script>

{#if loading}
  <div class="text-center">Loading...</div>
{/if}

<ul class="no-bullets p-0 flex justify-between flex-wrap mt-2">
  {#each students as student}
    <li class="mb-2">
      <img src="{url}{student.image}" alt={student.name}>
      <small class="d-block text-center">{student.name}</small>
    </li>
  {/each}
</ul>

<style>
  img {
    width: 75px;
  }

  li {
    line-height: 1.2;
  }

  small {
    font-size: 70%;
  }
</style>