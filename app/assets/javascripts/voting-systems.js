//Misc.
function shuffle(array) {
  'use strict';
  var indices = [];
  var shuffledArray = [];
  for (var i = 0; i < array.length; i++) {
    indices.push(i);
  }
  for (i = 0; i < array.length; i++) {
    var randomIndex = indices.splice(Math.floor(Math.random() * indices.length),1);
    shuffledArray.push(array[randomIndex]);
  }
  return shuffledArray;
}

function generateRandomVotes(listOfCandidates, n) {
  'use strict';
  var order = [];
  for (var i = 0; i < listOfCandidates.length; i++) {
    order.push(i + 1);
  }
  var votes = [];
  for (i = 0; i < n; i++) {
    var vote = {};
    order = shuffle(order);
    for (var j = 0; j < listOfCandidates.length; j++) {
      vote[listOfCandidates[j]] = order[j];
    }
    votes.push(vote);
  }
  return votes;
}

function generateListOfCandidates(votes) {
  var listOfCandidates = [];
  for (var i = 0; i < votes.length; i++) {
    var keys = Object.keys(votes[i]);
    for (var j = 0; j < keys.length; j++) {
      if (listOfCandidates.indexOf(keys[j]) === -1) {
        listOfCandidates.push(keys[j]);
      }
    }
  }
  return listOfCandidates;
}

// Methods relying on distances
function getDistances(listOfCandidates, votes) {
  'use strict';
  var distances = [];

  for (var i = 0; i < listOfCandidates.length; i++) {
    var row = [];
    for (var j = 0; j < listOfCandidates.length; j++) {
      var distance = 0;
      for (var k = 0; k < votes.length; k++) {
        if (votes[k][listOfCandidates[i]] < votes[k][listOfCandidates[j]]) {
          distance++;
        }
      }
      row.push(distance);
    }
    distances.push(row);
  }
  return distances;
}

function schulze(listOfCandidates, votes) {
  'use strict';
  var distances = getDistances(listOfCandidates, votes);
  var paths = [];
  var j;
  for (var i = 0; i < listOfCandidates.length; i++) {
    var row = [];
    for (j = 0; j < listOfCandidates.length; j++) {
      if (distances[i][j] > distances[j][i]) {
        row.push(distances[i][j]);
      }else {
        row.push(0);
      }
    }
    paths.push(row);
  }
  for (i = 0; i < listOfCandidates.length; i++) {
    for (j = 0; j < listOfCandidates.length; j++) {
      if (i !== j) {
        for (var k = 0; k < listOfCandidates.length; k++) {
          if (k !== i && k !== j) {
            paths[j][k] = Math.max(paths[j][k], Math.min(paths[j][i], paths[i][k]));
          }
        }
      }
    }
  }
  var sortFunction = function sort(a, b) {
    if (paths[a][b] > paths[b][a]) {
      return -1;
    }
    if (paths[b][a] > paths[a][b]) {
      return 1;
    }
    return 0;
  };

  var mapped = [];
  for (i = 0; i < listOfCandidates.length; i++) {
    mapped.push(i);
  }
  mapped.sort(sortFunction);
  var result = mapped.map(function(i) {
    return {film: listOfCandidates[i], index: i};
  });
  result[0].rank = 1;
  for (i = 1; i < listOfCandidates.length; i++) {
    if (paths[result[i].index][result[i - 1].index] === paths[result[i - 1].index][result[i].index]) {
      result[i].rank = result[i - 1].rank;
    }else {
      result[i].rank = i + 1;
    }
  }
  return result;
}

function copeland(listOfCandidates, votes) {
  'use strict';
  var distances = getDistances(listOfCandidates, votes);
  var scores = [];
  for (var i = 0; i < listOfCandidates.length; i++) {
    var score = 0;
    for (var j = 0; j < listOfCandidates.length; j++) {
      if (i !== j) {
        if (distances[i][j] > distances[j][i]) {
          score++;
        }else if (distances[i][j] < distances[j][i]) {
          score--;
        }
      }
    }
    scores.push({film: listOfCandidates[i], 'score': score, rank: i});
  }
  scores.sort(function(a, b) {return b.score - a.score;});
  scores[0].rank = 1;
  for (i = 1; i < listOfCandidates.length; i++) {
    if (scores[i].score === scores[i - 1].score) {
      scores[i].rank = scores[i - 1].rank;
    }else {
      scores[i].rank = i + 1;
    }
  }
  return scores;
}

function minimax(listOfCandidates, votes) {
  'use strict';
  var distances = getDistances(listOfCandidates, votes);
  var scores = [];
  for (var i = 0; i < listOfCandidates.length; i++) {
    var highestScore = 0;
    for (var j = 0; j < listOfCandidates.length; j++) {
      if (distances[j][i] > distances[i][j] && distances[j][i] > highestScore) {
        highestScore = distances[j][i];
      }
    }
    scores.push({film: listOfCandidates[i], score: highestScore, rank: i});
  }
  scores.sort(function(a, b) { return a.score - b.score;});
  scores[0].rank = 1;
  for (i = 1; i < listOfCandidates.length; i++) {
    if (scores[i].score === scores[i - 1].score) {
      scores[i].rank = scores[i - 1].rank;
    }else {
      scores[i].rank = i + 1;
    }
  }
  return scores;
}

function permutator(inputArr) {
  // Used in kemenyYoung
  'use strict';
  var results = [];

  function permute(arr, memo) {
    for (var i = 0; i < arr.length; i++) {
      var cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }
    return results;
  }
  return permute(inputArr, []);
}

function kemenyYoung(listOfCandidates, votes) {
  'use strict';
  var distances = getDistances(listOfCandidates, votes);
  var currentHighest = -1;
  var uniqueHighest = true;
  var rankingOfHighest = [];
  var array = [];
  for (var i = 0; i < listOfCandidates.length; i++) {
    array.push(i);
  }
  var permutations = permutator(array);
  for (i = 0; i < permutations.length; i++) {
    var score = 0;
    for (var j = 0; j < listOfCandidates.length - 1; j++) {
      for (var k = j + 1; k < listOfCandidates.length; k++) {
        score = score + distances[permutations[i][j]][permutations[i][k]];
      }
    }
    if (score === currentHighest) {
      uniqueHighest = false;
    }
    if (score > currentHighest) {
      currentHighest = score;
      rankingOfHighest = permutations[i];
      uniqueHighest = true;
    }
  }
  if (!uniqueHighest) {
    throw 'Draw for the higest score';
  }
  var result = rankingOfHighest.map(function(i, index) {return {film: listOfCandidates[i], rank: index + 1};});
  return result;
}

// Self contained voting methods.

function borda(listOfCandidates, votes, topScore) {
  // Used in baldwin and nanson. Note that topScore is optional and to make scoring on baldwin and nanson nicer.
  'use strict';
  if (topScore === null || topScore === undefined) {
    topScore = listOfCandidates.length;
  }
  var scores = [];
  for (var k = 0; k < listOfCandidates.length; k++) {
    scores.push({film: listOfCandidates[k], score: 0, rank: k});
  }

  for (var i = 0; i < listOfCandidates.length; i++) {
    for (var j = 0; j < votes.length; j++) {
      if (votes[j][scores[i].film] !== undefined && votes[j][scores[i].film] !== null) {
        scores[i].score = scores[i].score - votes[j][scores[i].film] + topScore + 1;
      }
    }
  }
  scores.sort(function(a, b) {return b.score - a.score;});
  scores[0].rank = 1;
  for (i = 1; i < listOfCandidates.length; i++) {
    if (scores[i].score === scores[i - 1].score) {
      scores[i].rank = scores[i - 1].rank;
    }else {
      scores[i].rank = i + 1;
    }
  }
  return scores;
}

function antiPlurality(listOfCandidates, votes) {
  // Note that this will return negative scores so that the higher the score the better.
  'use strict';
  var results = [];
  for (var i = 0; i < listOfCandidates.length; i ++) {
    var result = {'film': listOfCandidates[i], 'score': 0, 'rank': i};
    for (var j = 0; j < votes.length; j++) {
      var worstPosition = Object.keys(votes[j]).reduce(function(m, k){ return votes[j][k] > m ? votes[j][k] : m }, -Infinity);
      if (votes[j][listOfCandidates[i]] === worstPosition) {
        result.score--;
      }
    }
    results.push(result);
  }
  results.sort(function(a, b) {return b.score - a.score;});
  results[0].rank = 1;
  for (i = 1; i < listOfCandidates.length; i++) {
    if (results[i].score === results[i - 1].score) {
      results[i].rank = results[i - 1].rank;
    }else {
      results[i].rank = i + 1;
    }
  }
  return results;
}

function plurality(listOfCandidates, votes) {
  'use strict';
  var results = [];
  for (var i = 0; i < listOfCandidates.length; i ++) {
    var result = {'film': listOfCandidates[i], 'score': 0, 'rank': i};
    for (var j = 0; j < votes.length; j++) {
      if (votes[j][listOfCandidates[i]] === 1) {
        result.score++;
      }
    }
    results.push(result);
  }
  results.sort(function(a, b) {return b.score - a.score;});
  results[0].rank = 1;
  for (i = 1; i < listOfCandidates.length; i++) {
    if (results[i].score === results[i - 1].score) {
      results[i].rank = results[i - 1].rank;
    }else {
      results[i].rank = i + 1;
    }
  }
  return results;
}

// Runoff methods

function removeCandidate(currentCandidates, currentVotes, candidateToRemove) {
  'use strict';
  currentCandidates.splice(currentCandidates.indexOf(candidateToRemove),1);
  for (var i = 0; i < currentVotes.length; i++) {
    var rankOfEliminate = currentVotes[i][candidateToRemove];
    currentVotes[i][candidateToRemove] = NaN;
    for (var j = 0; j < currentCandidates.length; j++) {
      if (currentVotes[i][currentCandidates[j]] > rankOfEliminate) {
        currentVotes[i][currentCandidates[j]]--;
      }
    }
  }
}

function av(listOfCandidates, votes) {
  'use strict';
  var currentCandidates = listOfCandidates.slice();
  var currentVotes = JSON.parse(JSON.stringify(votes));
  var results = [];
  while (currentCandidates.length > 0) {
    var pluralityResults = plurality(currentCandidates, currentVotes);
    if (pluralityResults[0].score > votes.length / 2) {
      results = results.concat(pluralityResults.reverse());
      return results.reverse();
    }
    var lowestScore = pluralityResults[pluralityResults.length - 1].score;
    for (var i = pluralityResults.length - 1; i > -1; i--) {
      if (pluralityResults[i].score === lowestScore) {
        removeCandidate(currentCandidates, currentVotes, pluralityResults[i].film);
        results.push(pluralityResults[i]);
      }else {
        break;
      }
    }
  }
  return results.reverse();
}

function avChanges(listOfCandidates, votes) {
  'use strict';
  var currentCandidates = listOfCandidates.slice();
  var currentVotes = JSON.parse(JSON.stringify(votes));
  var changes = [];
  while (currentCandidates.length > 0) {
    var pluralityResults = plurality(currentCandidates, currentVotes);
    if (pluralityResults[0].score > votes.length / 2) {
      return changes;
    }
    var lowestScore = pluralityResults[pluralityResults.length - 1].score;
    var currentVoteHolder = [];
    for (var i = 0; i < votes.length; i++) {
      for (var j = 0; j < pluralityResults.length; j++) {
        if (currentVotes[i][pluralityResults[j].film] === 1) {
          currentVoteHolder.push(pluralityResults[j].film);
        }
      }
    }
    for (i = pluralityResults.length - 1; i > -1; i--) {
      if (pluralityResults[i].score === lowestScore) {
        removeCandidate(currentCandidates, currentVotes, pluralityResults[i].film);
      }else {
        break;
      }
    }
    var change = {};
    for (i = 0; i < currentVoteHolder.length; i++) {
      for (var j = 0; j < currentCandidates.length; j++) {
        if (currentVotes[i][currentCandidates[j]] === 1) {
          if (!change[currentVoteHolder[i]]) {
            change[currentVoteHolder[i]] = {};
          }
          if (!change[currentVoteHolder[i]][currentCandidates[j]]) {
            change[currentVoteHolder[i]][currentCandidates[j]] = 1;
          }else {
            change[currentVoteHolder[i]][currentCandidates[j]]++;
          }
        }
      }
    }
    changes.push(change);
  }
  return changes;
}

function coombs(listOfCandidates, votes) {
  'use strict';
  var currentCandidates = listOfCandidates.slice();
  var currentVotes = JSON.parse(JSON.stringify(votes));
  var results = [];
  while (currentCandidates.length > 0) {
    var antiPluralityResults = antiPlurality(currentCandidates, currentVotes);
    var pluralityResults = plurality(currentCandidates, currentVotes);
    if (pluralityResults[0].score > votes.length / 2) {
      results = results.concat(pluralityResults.reverse());
      return results.reverse();
    }
    var lowestScore = antiPluralityResults[antiPluralityResults.length - 1].score;
    for (var i = antiPluralityResults.length - 1; i > -1; i--) {
      if (antiPluralityResults[i].score === lowestScore) {
        removeCandidate(currentCandidates, currentVotes, antiPluralityResults[i].film);
        results.push(antiPluralityResults[i]);
      }else {
        break;
      }
    }
  }
  return results.reverse();
}

function baldwin(listOfCandidates, votes) {
  'use strict';
  var currentCandidates = listOfCandidates.slice();
  var currentVotes = JSON.parse(JSON.stringify(votes));
  var results = [];
  while (currentCandidates.length > 0) {
    var bordaResults = borda(currentCandidates, currentVotes, listOfCandidates.length);
    var lowestScore = bordaResults[bordaResults.length - 1].score;
    for (var i = bordaResults.length - 1; i > -1; i--) {
      if (bordaResults[i].score === lowestScore) {
        removeCandidate(currentCandidates, currentVotes, bordaResults[i].film);
        results.push(bordaResults[i]);
      }else {
        break;
      }
    }
  }
  results.reverse();
  return results;
}

function baldwinChanges(listOfCandidates, votes) {
  'use strict';
  var currentCandidates = listOfCandidates.slice();
  var currentVotes = JSON.parse(JSON.stringify(votes));
  var changes = [];
  while (currentCandidates.length > 0) {
    var change = {};
    var bordaResults = borda(currentCandidates, currentVotes, listOfCandidates.length);
    var lowestScore = bordaResults[bordaResults.length - 1].score;
    var candidatesToRemove = [];
    for (var i = bordaResults.length - 1; i > -1; i--) {
      if (bordaResults[i].score === lowestScore) {
        candidatesToRemove.push(bordaResults[i].film);
        removeCandidate(currentCandidates, currentVotes, bordaResults[i].film);
      }else {
        change[bordaResults[i].film] = {};
        change[bordaResults[i].film][bordaResults[i].film] = bordaResults[i].score;
      }
    }
    if (currentCandidates.length === 0) {
      return changes;
    }
    for (i = 0; i < votes.length; i++) {
      for (var j = 0; j < candidatesToRemove.length; j++) {
        for (var k = 0; k < currentCandidates.length; k++) {
          if (votes[i][currentCandidates[k]] > votes[i][candidatesToRemove[j]]) {
            if (!change[candidatesToRemove[j]]) {
              change[candidatesToRemove[j]] = {};
            }
            if (!change[candidatesToRemove[j]][currentCandidates[k]]) {
              change[candidatesToRemove[j]][currentCandidates[k]] = 1;
            }else {
              change[candidatesToRemove[j]][currentCandidates[k]]++;
            }
          }
        }
      }
    }
    changes.push(change);
  }
  return changes;
}

function nanson(listOfCandidates, votes) {
  'use strict';
  var currentCandidates = listOfCandidates.slice();
  var currentVotes = JSON.parse(JSON.stringify(votes));
  var results = [];
  while (currentCandidates.length > 0) {
    var bordaResults = borda(currentCandidates, currentVotes, listOfCandidates.length);
    var average = 0;
    for (var i = 0; i < bordaResults.length; i++) {
      average += bordaResults[i].score / bordaResults.length;
    }
    for (i = bordaResults.length - 1; i > -1; i--) {
      if (bordaResults[i].score <= average) {
        removeCandidate(currentCandidates, currentVotes, bordaResults[i].film);
        results.push(bordaResults[i]);
      }else {
        break;
      }
    }
  }
  return results.reverse();
}

function nansonChanges(listOfCandidates, votes) {
  'use strict';
  var currentCandidates = listOfCandidates.slice();
  var currentVotes = JSON.parse(JSON.stringify(votes));
  var changes = [];
  while (currentCandidates.length > 0) {
    var change = {};
    var bordaResults = borda(currentCandidates, currentVotes, listOfCandidates.length);
    var average = 0;
    for (var i = 0; i < bordaResults.length; i++) {
      average += bordaResults[i].score / bordaResults.length;
    }
    var candidatesToRemove = [];
    for (i = bordaResults.length - 1; i > -1; i--) {
      if (bordaResults[i].score <= average) {
        candidatesToRemove.push(bordaResults[i].film);
        removeCandidate(currentCandidates, currentVotes, bordaResults[i].film);
      }else {
        change[bordaResults[i].film] = {};
        change[bordaResults[i].film][bordaResults[i].film] = bordaResults[i].score;
      }
    }
    if (currentCandidates.length === 0) {
      return changes;
    }
    for (i = 0; i < votes.length; i++) {
      for (var j = 0; j < candidatesToRemove.length; j++) {
        for (var k = 0; k < currentCandidates.length; k++) {
          if (votes[i][currentCandidates[k]] > votes[i][candidatesToRemove[j]]) {
            if (!change[candidatesToRemove[j]]) {
              change[candidatesToRemove[j]] = {};
            }
            if (!change[candidatesToRemove[j]][currentCandidates[k]]) {
              change[candidatesToRemove[j]][currentCandidates[k]] = 1;
            }else {
              change[candidatesToRemove[j]][currentCandidates[k]]++;
            }
          }
        }
      }
    }
    changes.push(change);
  }
  return changes;
}
