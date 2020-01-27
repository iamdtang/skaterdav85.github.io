<script>
  import Autocomplete from './Autocomplete.svelte';

  let posts;
  let formAttributes = {
    'class': 'mb-2'
  };

  let resultsListAttributes = {
    'class': 'br-1 bl-1 no-bullets m-0 p-0 bg-secondary'
  };

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

<Autocomplete onInput={filterPosts} {formAttributes} {resultsListAttributes}>
  <div slot="search-input" let:onInput={onInput}>
    <input
      type="search"
      placeholder="Search"
      class="w-100 bg-secondary"
      on:input={onInput}>
  </div>
  <li slot="result-item" let:result={{ url, title}}>
    <a href={url}>{title}</a>
  </li>
  <li slot="no-results">No results</li>
</Autocomplete>

<style>
  input {
    border: 1px solid transparent;
    box-sizing: border-box;
    padding: 10px;
  }

  input::-webkit-search-cancel-button {
    -webkit-appearance: searchfield-cancel-button;
  }

  li {
    padding: 5px;
    border-bottom: 1px solid #ddd;
    line-height: 1.5;
  }

  li:last-child {
    border-bottom: 0;
  }

  li:hover {
    background-color: #e9e9e9;
  }

  a {
    display: block;
    width: 100%;
    height: 100%;
  }

  a, li {
    font-size: 13px;
  }
</style>