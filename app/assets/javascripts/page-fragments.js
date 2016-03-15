function initPageFragment(fragUrl) {
  switch(fragUrl) {
    case "page-fragments/voting.php":
      initVoting();
      break;
    case "page-fragments/results.php":
      initResults();
      break;
    default:
      showContent();
      break;
  }
}
