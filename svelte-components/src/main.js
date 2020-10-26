import StudentList from './StudentList.svelte';
import AutocompleteContainer from './AutocompleteContainer.svelte';

// if (window.DAVID) {
//   const { course, year } = window.DAVID;

//   new StudentList({
//     target: document.querySelector('#students-container'),
//     props: {
//       course,
//       year
//     }
//   });
// }

const autocompleteContainer = document.querySelector('#autocomplete-container');

if (autocompleteContainer) {
  new AutocompleteContainer({
    target: autocompleteContainer
  });
}
