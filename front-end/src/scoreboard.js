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

API.getApi(ApiURL).then(data => data.map(scoreboard => renderScore(scoreboard)))
// document.addEventListener('DOMContentLoaded', () => {
// })

// function getStuff(event) {
  // event.preventDefault()
  // API.getApi(ApiURL).then(data => data.forEach(scoreboard => renderScore(scoreboard)))
// }


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




