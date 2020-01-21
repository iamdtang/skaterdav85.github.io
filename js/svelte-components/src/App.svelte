<script>
	export let course, year;

	let students = [];
  let url = 'https://davids-students.herokuapp.com';

	fetch(`${url}/api/${year}/${course}/students`)
		.then((response) => {
      return response.json();
		})
		.then((response) => {
			students = response.students;
		});
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