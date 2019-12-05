// Definitons 
const ApiURL = "http://localhost:3000/score_boards";
const table = document.querySelector('tbody')

// API Stuff

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const getApi = url => fetch(url).then(resp => resp.json());
const patchApi = (url, patchInfo) =>
  fetch(url, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(patchInfo)
  }).then(resp => resp.json());
const postApi = (url, postInfo) =>
  fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(postInfo)
  }).then(resp => resp.json());

const API = { getApi, patchApi, postApi };

// Functions 

API.getApi(ApiURL).then(data => sortScore(data)) //.forEach(scoreboard => sortScore(scoreboard)) )          //renderScore(scoreboard)))


function sortScore(data) {

  let sortedData = data.sort((a, b) => (a.count < b.count) ? 1 : -1)

  sortedData.forEach(scoreboard => renderScore(scoreboard))

}

function compare(a, b) {
  if (a > b) return 1;
  if (b > a) return -1;

  return 0;
}

function renderScore(scoreboard) {
    let newTr = document.createElement('tr')
    let newtdName = document.createElement('td')
    newtdName.innerHTML = scoreboard.name

    let newtdScore = document.createElement('td')
    newtdScore.innerHTML = scoreboard.count

    let newtdRank = document.createElement('td')
    newtdRank.innerHTML = "NO rank yet"

    newTr.append(newtdName, newtdScore, newtdRank)
    table.append(newTr)
}




