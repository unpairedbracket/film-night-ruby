var listOfCandidates;
var votes;
var results;

function initResults() {
  return fetchResults(location.search);
}

function getResultsForNight(night) {
  return fetchResults('?night=' + night);
}

function fetchResults(search) {
  return fetch('votes' + search, {credentials: 'same-origin'}).then(function(response) {
    return response.json();
  }).then(function(responseJson) {
    if(responseJson.status == "error") {
      throw responseJson.error;
    }
    return responseJson.votes;
  }).then(function(receivedVotes) {
    console.log(receivedVotes);
    if(receivedVotes.length == 0) {
      listOfCandidates = ["A", "B", "C", "D", "E", "F", "G", "H"];
      votes = generateRandomVotes(listOfCandidates, 1000);
    } else {
      votes = receivedVotes;
      listOfCandidates = generateListOfCandidates(votes);
    }
    results = [];
    updateAllTables();
    showContent();
  }).catch(function(err) {
    console.log(err);
  });
}

function createInformationOnAlgorithm(algorithmName, algorithm, listOfCandidates, votes, divToPopulate, onFinish){
  var start = performance.now();
  try{
    var result = algorithm(listOfCandidates, votes);
    results.push(result);
    divToPopulate.innerHTML = '<table class="results-table" id="' + algorithmName + 'Table">' + populateTable(result) + '</table>';
  }catch(err){
    divToPopulate.innerHTML ='<p class="error-message">'+err+'</p>';
  }
  var timeTaken  = (performance.now() - start)/1000;


  timeTaken = timeTaken.toFixed(4);
  //document.getElementById(algorithmName + 'Time').innerHTML = timeTaken + 's';
  console.log(algorithmName + '...' + timeTaken + 's', true);
  onFinish();
}

function updateAllTables() {
  var algorithms = [{Name: 'Schulze', 'Function': schulze, 'TableID': 'schulze-table' },{Name: 'Copeland', 'Function': copeland, 'TableID': 'copeland-table' }, {Name: 'AV', 'Function': av, 'TableID': 'av-table' },{Name: 'Borda', 'Function': borda, 'TableID': 'borda-table' },{Name: 'Minimax', 'Function': minimax, 'TableID': 'minimax-table' },{Name: 'Kemeny-Young', 'Function': kemenyYoung, 'TableID': 'kemenyYoung-table' },{Name: 'Baldwin', 'Function': baldwin, 'TableID': 'baldwin-table' },{Name: 'Nanson', 'Function': nanson, 'TableID': 'nanson-table' },{Name: 'First-Past-The-Post', 'Function': plurality, 'TableID': 'first-past-the-post-table' },{Name: 'Anti-Plurality', 'Function': antiPlurality, 'TableID': 'anti-plurality-table' },{Name: 'Coombs\'', 'Function': coombs, 'TableID': 'coombs-table' }]

  console.log(algorithms[0].Name + '...');

  function updateAllTablesStep(index) {
    var start = performance.now();
    try{
      var result = algorithms[index].Function(listOfCandidates, votes);
      results.push(result);
      document.getElementById(algorithms[index].TableID).innerHTML = '<table class="results-table" id="' + algorithms[index].Name + 'Table">' + populateTable(result) + '</table>';
    }catch(err){
      console.log(err);
    }
    var timeTaken  = (performance.now() - start)/1000;
    timeTaken = timeTaken.toFixed(4);
    //document.getElementById(algorithmName + 'Time').innerHTML = timeTaken + 's';
    console.log(algorithms[index].Name + '...' + timeTaken + 's', true);
    if (index < algorithms.length - 1) {
      console.log(algorithms[index + 1].Name + '...');
      setTimeout(updateAllTablesStep,0, index + 1);
    }else{
      then();
    }
  }
  function then(){
    console.log('Drawing Graphs...');
    setTimeout(drawGraphs);
  }

  updateAllTablesStep(0);
}

function drawGraphs(){
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  var distances = getDistances(listOfCandidates, votes);
  document.getElementById('winner').innerHTML = calculateWinner();
  document.getElementById('schulze-graph').innerHTML  = drawDirectedGraph(listOfCandidates, distances);
  var pluralityResults = plurality(listOfCandidates, votes);
  var initialScores = {};
  for (var i = 0; i < pluralityResults.length; i++) {
    initialScores[pluralityResults[i].film] = pluralityResults[i].score;
  }
  document.getElementById('av-graph').innerHTML = drawRunOffGraph(listOfCandidates, initialScores, avChanges(listOfCandidates, votes));
  var bordaResults = borda(listOfCandidates, votes);
  for (var i = 0; i < bordaResults.length; i++) {
    initialScores[bordaResults[i].film] = bordaResults[i].score;
  }
  document.getElementById('baldwin-graph').innerHTML = drawRunOffGraph(listOfCandidates, initialScores, baldwinChanges(listOfCandidates, votes));
  document.getElementById('nanson-graph').innerHTML = drawRunOffGraph(listOfCandidates, initialScores, nansonChanges(listOfCandidates, votes));
  document.getElementById('schulze-graph').innerHTML  = drawDirectedGraph(listOfCandidates, distances);
  document.getElementById('distances-table').innerHTML = populateDistances(listOfCandidates, distances);
  document.getElementById('key').innerHTML = generateKey(listOfCandidates);
  console.log('Finished');
}

function populateTable(results){
  var html = "";
  if(results && results[0].hasOwnProperty('score')){
    html = "<thead><tr><th>Rank</th><th>Film</th><th>Score</th></tr></thead>";
    for(var i = 0; i < results.length; i++){
      if(results[i].rank === 1){
        html = html + "<tr class='rank1'><td>" + results[i].rank + "</td><td>" + results[i].film + "</td><td>" + results[i].score +"</td></tr>";
      }else{
        html = html + "<tr><td>" + results[i].rank + "</td><td>" + results[i].film + "</td><td>" + results[i].score +"</td></tr>";
      }
    }
  }else if(results){
    html = "<thead><th>Rank</th><th>Film</th></thead>";
    for(var i = 0; i < results.length; i++){
      if(results[i].rank === 1){
        html = html + "<tr class='rank1'><td>" + results[i].rank + "</td><td>" + results[i].film + "</td></tr>";
      }else{
        html = html + "<tr><td>" + results[i].rank + "</td><td>" + results[i].film + "</td></tr>";
      }
    }
  }
  return html;
}

function calculateWinner(){
  var numberWon = {};
  for(var i =0; i < listOfCandidates.length; i++){
    numberWon[listOfCandidates[i]] = 0;
  }
  for(var i = 0; i < results.length; i++){
    for(var j =0; j < listOfCandidates.length; j++){
      if(results[i][j].rank === 1){
        numberWon[results[i][j].film]++;
      }else{
        break;
      }
    }
  }
  var highestScorers = [];
  var highestScore = 0;
  for(var i =0; i < listOfCandidates.length; i++){
    if(numberWon[listOfCandidates[i]] === highestScore){
      highestScorers.push(listOfCandidates[i]);
    }else if(numberWon[listOfCandidates[i]] > highestScore){
      highestScore = numberWon[listOfCandidates[i]];
      highestScorers = [listOfCandidates[i]];
    }
  }
  // TODO: Check which ones they won;
  var winner = "It's a draw";
  if(highestScorers.length === 1){
    winner = highestScorers[0];
  }
  return winner;
}

function populateDistances(listOfCandidates, distances){
  var html = "<tbody><tr><th></th>"
  for(var i = 0; i < listOfCandidates.length; i++){
    html = html + '<th><span class="key-node" style="background-color:'+nodeColors[i % nodeColors.length]+'">' +  String.fromCharCode(65 + i) + '</span></th>';
  }
  html = html + "</tr>";
  for(var i = 0; i < listOfCandidates.length; i++){
    html = html + '<tr><th><span class="key-node" style="background-color:'+nodeColors[i % nodeColors.length]+'">' +  String.fromCharCode(65 + i) + '</span></th>';
    for(var j = 0; j < listOfCandidates.length; j++){
      if(i === j){
        html = html + "<td class='null'></td>";
      }else if(distances[i][j] === distances[j][i]){
        html = html + "<td class='equal'>" + distances[i][j] + "</td>";
      }else if(distances[i][j] > distances[j][i]){
        html = html + "<td class='better'>" + distances[i][j] + "</td>";
      }else{
        html = html + "<td class='worse'>" + distances[i][j] + "</td>";
      }
    }
    html = html + "</tr>";
  }
  html = html + "</tbody>";
  return html;
}

function generateKey(listOfCandidates){
  var key = "";
  for(var i = 0; i < listOfCandidates.length; i++){
    key = key + '<div><span class="key-node" style="background-color:'+nodeColors[i % nodeColors.length]+'">' +  String.fromCharCode(65 + i) + '</span><span>' + listOfCandidates[i] + '</span></div>';
  }
  return key;
}

function calculateMetaResult() {
  var metaVotes = [];
  results.forEach(function(result) {
    voteForm = {};
    result.forEach(function(entry) {
      voteForm[entry.film] = entry.rank;
    });
    metaVotes.push(voteForm);
  });
  results = [];
  votes = metaVotes;
  updateAllTables();
}

