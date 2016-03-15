function initPageFragment(fragUrl) {
  console.log(fragUrl);
  switch(fragUrl) {
    case "/voting":
      return initVoting();
    case "/results":
      return initResults();
    default:
      return Promise.resolve();
  }
}
