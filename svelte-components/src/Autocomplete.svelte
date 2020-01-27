<script>
  import debounce from 'lodash.debounce';

  export let onInput;
  export let formAttributes;
  export let resultsListAttributes;

  let results = [];
  let searchValue;

  let handleKeyStroke = debounce((event) => {
    searchValue = event.target.value;
    results = onInput(searchValue);
  }, 200);
</script>

<form autocomplete="off" {...formAttributes}>
  <div class="autocomplete">
    <slot name="search-input" onInput={handleKeyStroke}></slot>

    <ul class:autocomplete-items={true} class:scrollable={searchValue} {...resultsListAttributes}>
      {#each results as result}
        <slot name="result-item" result={result}></slot>
      {:else}
        {#if searchValue}
          <slot name="no-results"></slot>
        {/if}
      {/each}
    </ul>
  </div>
</form>

<style>
  .autocomplete {
    position: relative;
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
</style>