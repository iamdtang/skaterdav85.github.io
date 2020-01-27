<script>
  import Autocomplete from './Autocomplete.svelte';

  let posts;

  (async () => {
    let response = await fetch('/posts.json');
    posts = await response.json();
  })();

  function filterPosts(value) {    
    if (value) {
      let resultsBasedOnTitle = [];
      let resultsBasedOnKeywords = [];

      for (let post of posts) {
        let { title, keywords } = post;

        if (contains(title, value)) {
          resultsBasedOnTitle.push(post);
          continue;
        }

        if (contains(keywords, value)) {
          resultsBasedOnKeywords.push(post);
        }
      }

      return resultsBasedOnTitle.concat(resultsBasedOnKeywords);
    } else {
      return [];
    }
  }

  function contains(valueToSearch, searchValue) {
    return valueToSearch.toLowerCase().includes(searchValue.toLowerCase());
  }
</script>

<Autocomplete onInput={filterPosts} />