// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

function textInputFocus(input){
  input.nextElementSibling.classList.add('label-active');
}

function textInputBlur(input){
  if(input.value.length === 0){
    input.nextElementSibling.classList.remove('label-active');
  }
}

function keyDown(event){
  if("keyIdentifier" in event && event.keyIdentifier === "Enter"){
    search();
  } else if ("key" in event && event.key === "Enter") {
    search();
  }
}

function validateYear(input){
  console.log( /^\+?\d+$/.test(input.value));
  if(input.value.length !== 0 && /^\+?\d+$/.test(input.value)){
    input.nextElementSibling.nextElementSibling.style.display = "none";
  }else{
    input.nextElementSibling.nextElementSibling.style.display = "block";
  }
}

function search(){
  var filmName = document.getElementById('film-name').value;
  var filmYear = document.getElementById('film-year').value;
  if(!filmYear.match(/^\d+$/)){
    filmYear = "";
  }
  var href = 'https://www.omdbapi.com/?s=' + filmName +'&y=' + filmYear + '&plot=short&r=json&type=movie';
  var xhr = new XMLHttpRequest();
  xhr.open('GET',href);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function(){
    var results = JSON.parse(xhr.responseText);
    removeOldFilms();
    if(results.Search){
      updateFilms(results.Search);
    }else{
      document.getElementById('error-container').style.opacity = 1;
      document.getElementById('error-container').style.backgroundColor = "#F47738";
      document.getElementById('error-message').innerHTML = results.Error;
      setTimeout(function(){document.getElementById('error-container').style.opacity = 0;}, 2000);
    }
  }
  xhr.send();
}

function removeOldFilms(){
  var results = document.getElementById('search-results');
  for(var i = results.children.length-1; i > 0; i--){
    var child = results.children[i];
    if(child.getAttribute('data-selected') === "false"){
      child.remove();
    }
  }
}

function updateFilms(searchResults){
  var html = "";
  var searchResultsDiv = document.getElementById('search-results');
  for(var i = 0; i < searchResults.length; i++){
    var div = document.createElement('div');
    searchResultsDiv.appendChild(div);
    if(searchResults[i].Poster == "N/A") {
      searchResults[i].Poster = "assets/icons/nothing.png";
    }
    html = '<div class="search-result" class="search-result-picture" data-film-id="' + searchResults[i].imdbID + '" data-film-name="' + searchResults[i].Title + '" data-film-year="' + searchResults[i].Year + '" data-selected="false" data-veto="false">';
    html += '<img class="search-result-picture" src="' + searchResults[i].Poster + '" onclick="toggleSelected(this.parentElement)" draggable="false">';
    html += '<div class="main-icon-container" onclick="toggleSelected(this.parentElement)"><div class="check-background"></div><img src="assets/icons/ic_check.svg" class="icon"></div>'
    html += '<div class="child-icon-container" title="Suitable for vegetarians" onclick="toggleVetoed(this.parentElement)"><div class="veto-background"></div><span class="veto-v">V</span><span class="veto-eto">eto</span></div>'
    html += '<div class="info-conatiner">';
    html += '<h3 class="search-result-title">' + searchResults[i].Title + '</h3>';
    html += '<h4 class="search-result-year">' + searchResults[i].Year + '</h4>';
    html += '</div></div>';
    div.outerHTML = html;
  }
}

var numberSelected = 0;

function toggleSelected(tile) {
  var selected = tile.getAttribute('data-selected');
  var img = tile.getElementsByClassName('search-result-picture')[0];
  var nominated = tile.getElementsByClassName('main-icon-container')[0];
  var veto = tile.getElementsByClassName('child-icon-container')[0];
  if(selected === "true") {
    numberSelected--;
    if(numberSelected === 0){
      document.getElementById('button-disabler').style.width = "100%";
    }
    if(img) img.classList.remove('search-result-picture-hover');
    nominated.classList.remove('selected-true');
    veto.classList.remove('slide-down');
    tile.setAttribute('data-selected', 'false');
  }else {
    if(numberSelected === 0){
      document.getElementById('button-disabler').style.width = '0';
    }
    numberSelected++;
    if(img) img.classList.add('search-result-picture-hover');
    veto.classList.add('slide-down');
    nominated.classList.add('selected-true');
    tile.setAttribute('data-selected', 'true');
  }
}

function toggleVetoed(tile){
  var veto = tile.getAttribute('data-veto');
  var vetoButton = tile.getElementsByClassName('child-icon-container')[0];
  if(veto === "true") {
    // Switch to false;
    vetoButton.classList.remove('veto-true');
    tile.setAttribute('data-veto', "false");
  }else {
    vetoButton.classList.add('veto-true');
    tile.setAttribute('data-veto', "true");
  }
}


function changeInformation(message, color, showImage){
  document.getElementById('information').style.backgroundColor = color;
  document.getElementById('tooltip').innerHTML = message;
  if(showImage){
    document.getElementById('action-button').style.opacity = "1";
  }else{
    document.getElementById('action-button').style.opacity = "0";
  }
}

function submitFilms(){
  removeOldFilms();
  var selectedFilms = [];
  var results = document.getElementsByClassName('search-result');
  for(var i = 1; i < results.length; i++){
    var filmEntry = results[i];
    if(filmEntry.getAttribute('data-selected') === "true"){
      var film = {};
      film.id = filmEntry.getAttribute('data-film-id');
      film.veto = filmEntry.getAttribute('data-veto');
      toggleSelected(filmEntry);
      selectedFilms.push(film);
    }
  }
  numberSelected = 0;
  console.log(selectedFilms);
  console.log(JSON.stringify(selectedFilms));
  var button = document.getElementById("Submit");
  document.getElementById('error-container').style.opacity = 1;
  document.getElementById('error-container').style.backgroundColor = "#FFBF47";
  document.getElementById('error-message').innerHTML = 'Submitting';
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'admin/nominationhandler');
  xhr.setRequestHeader('accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
  xhr.onload = function() {
    console.log(xhr.responseText);
    if(xhr.responseText.indexOf("Error")>-1){
      document.getElementById('error-container').style.backgroundColor = "#F47738";
      document.getElementById('error-message').innerHTML = xhr.responseText;
      setTimeout(function(){document.getElementById('error-container').style.opacity = 0;}, 2000);
    }else {
      document.getElementById('error-container').style.backgroundColor = "#00823B"
      document.getElementById('error-message').innerHTML = 'Submitted Successfully';
      setTimeout(function(){document.getElementById('error-container').style.opacity = 0; document.getElementById('error-container').style.backgroundColor = "#F47738";}, 2000);
    }

  };
  xhr.send(JSON.stringify({proposal: selectedFilms}));
}
