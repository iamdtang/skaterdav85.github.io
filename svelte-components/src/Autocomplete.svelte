<script>
  import debounce from 'lodash.debounce';

  let posts = [];
  let results = [];
  let value;
  let loading = false;

  (async () => {
    let response = await fetch('/feed.json');
    posts = await response.json();
  })();

  function contains(valueToSearch, searchValue) {
    return valueToSearch.toLowerCase().includes(searchValue.toLowerCase());
  }

  function filterPosts(value) {
    if (value) {
      let resultsBasedOnTitle = [];
      let resultsBasedOnKeywords = [];
      let resultsBasedOnContent = [];

      for (let post of posts) {
        let { title, content, keywords } = post;

        if (contains(title, value)) {
          resultsBasedOnTitle.push(post);
          continue;
        }

        if (contains(keywords, value)) {
          resultsBasedOnKeywords.push(post);
          continue;
        }

        if (contains(content, value)) {
          resultsBasedOnContent.push(post);
        }
      }

      results = resultsBasedOnTitle
        .concat(resultsBasedOnKeywords)
        .concat(resultsBasedOnContent);
    } else {
      results = [];
    }
  };

  let handleKeyStroke = debounce((event) => {
    loading = true;
    value = event.target.value;
    filterPosts(value);
    loading = false;
  }, 200);
</script>

<form autocomplete="off" class="mb-2">
  <div class="autocomplete">
    <input
      type="search"
      placeholder="Search blog posts"
      class="w-100 bg-secondary"
      on:input={handleKeyStroke}>

    <ul
      class="autocomplete-items br-1 bl-1 no-bullets m-0 p-0 bg-secondary"
      class:scrollable={value || loading}>
      {#each results as { url, title }}
        <li>
          <a href={url}>{title}</a>
        </li>
      {:else}
        {#if loading}
          <li>Loading...</li>
        {/if}

        {#if value && !loading}
          <li>No results</li>
        {/if}
      {/each}
    </ul>
  </div>
</form>

<style>
  .autocomplete {
    position: relative;
  }

  input {
    border: 1px solid transparent;
    box-sizing: border-box;
    padding: 10px;
  }

  input::-webkit-search-cancel-button {
    -webkit-appearance: searchfield-cancel-button;
  }

  .autocomplete-items {
    position: absolute;
    z-index: 99;
    top: 100%;
    left: 0;
    right: 0;
  }

  .scrollable {
    max-height: 300px;
    overflow-y: scroll;
    box-shadow: 2px 2px 5px #ddd;
  }

  .autocomplete-items li {
    padding: 5px;
    border-bottom: 1px solid #ddd;
  }

  .autocomplete-items li:last-child {
    border-bottom: 0;
  }

  .autocomplete-items li:hover {
    background-color: #e9e9e9;
  }

  li {
    line-height: 1.5;
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