<script>
  import debounce from 'lodash.debounce';

  export let onInput;
  export let formAttributes;

  let results = [];
  let searchValue;

  let handleKeyStroke = debounce((event) => {
    searchValue = event.target.value;
    results = onInput(searchValue);
  }, 200);
</script>

<form autocomplete="off" class:autocomplete={true} {...formAttributes}>
  <slot name="search-input" onInput={handleKeyStroke}></slot>
  <slot name="results" {results} {searchValue}></slot>
</form>

<style>
  .autocomplete {
    position: relative;
  }
</style>