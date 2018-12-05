var calypso = (function () {
  'use strict';

  var env = {
    apiUrl: "http://localhost:8090",
    defaultRewardsText: null,
    events: {
    "ADD_TO_CALENDAR": "addtocal"
  },
    badgesImagesPath: "/settings/loot/images/",
  };

  let apiKey;
  const { apiUrl, defaultRewardsText, events } = env;

  const paths = {
    events: '/events',
    rewards: '/rewards',
    image: '/settings/loot/images'
  };

  const addRewardsTextToNav = () => {
    const subMenu = document.getElementById('myAccountSubMenu');
    const myAccountSubMenu = subMenu.getElementsByClassName(
      'menu-account-summary',
    )[0];
    const frag = document.createElement('li');
    frag.className = 'loyalty-container';

    const heading = document.createElement('div');
    heading.className = 'head';
    heading.innerHTML = defaultRewardsText;

    const rewardsText = document.createElement('div');
    rewardsText.className = 'info-content';
    rewardsText.id = 'loyaltyRewardsText';

    frag.appendChild(heading);
    frag.appendChild(rewardsText);
    myAccountSubMenu.appendChild(frag);
  };

  const getRewardsHtmlObj = () => {
    const rewardsText = document.getElementsByClassName('rewards');

    if (rewardsText === null) {
      addRewardsTextToNav();
      return document.getElementById('loyaltyRewardsText');
    }

    return rewardsText;
  };

  const updateRewardsText = (rewardsObj) => {
    const rewardsText = getRewardsHtmlObj();
    let rewardsStr = '';
    for (let index = 0; index < rewardsObj.length; index += 1) {
      let imgPath = env.apiUrl + env.badgesImagesPath + rewardsObj[index].imageUuid;
      rewardsStr+= '<div class="reward">';
      rewardsStr+= `<div class="reward-icon"><img src="${imgPath}"/></div>`;
      rewardsStr+= '<div class="reward-info">';
      rewardsStr+= `<div>${rewardsObj[index].name}</div>`;
      rewardsStr+= `<div>${rewardsObj[index].amount}</div>`;
      rewardsStr+= '</div>';
      rewardsStr+= '</div>';
    }

    for(var i=0; i < rewardsText.length; i++) {
      rewardsText[i].innerHTML = rewardsStr;
    }
  };

  const sendRequest = (path, method = 'GET', cb = () => {}) => {
    fetch(apiUrl + path, {
      credentials: 'include',
      headers: headers(),
      method,
    })
      .then(response => response.json())
      .then(response => cb(response))
      .catch();
  };

  const headers = () => {
    return {
      apiKey,
      'FFF-Auth': 'V1.1',
      'Content-Type': "application/json; charset=utf-8",
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1NGQ0N2I1OS1mZGJjLTQ0MTMtYjA5ZS1kZTcxZjkwMDlkZjMiLCJl' +
      'eHAiOjE1MzQ5NjY3MTQsIm5iZiI6MCwiaWF0IjoxNTMzNzQ4MDMzLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0L2F1dGgvcmVhbG1zL2ZmZiIsImF1ZCI6InByb3h5I' + 
      'iwic3ViIjoiOGM0OWZkZjUtODIxZC00ODQ5LWI4NTYtNDg1ZWNjOTlmZGM5IiwidHlwIjoiSUQiLCJhenAiOiJwcm94eSIsIm5vbmNlIjoiNTRmYjZhY2JmOTZlYTU' + 
      'xY2JkNmU1MjJiZjJiMWZiNDQiLCJhdXRoX3RpbWUiOjE1MzM3NDc0ODMsInNlc3Npb25fc3RhdGUiOiI5NWI2ZGM0YS0yZWY0LTQ2NmMtODY5OC1mMThkNzMxNDJlYm' + 
      'QiLCJhY3IiOiIwIiwiYWNjb3VudENvZGUiOiIxMjM0NTYiLCJ3b29JZCI6MTA2LCJwdXNoSWQiOjEwLCJyb2xlcyI6WyJVc2VyIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWF' + 
      'fYXV0aG9yaXphdGlvbiIsIkFkbWluIl0sImlkIjoiOGM0OWZkZjUtODIxZC00ODQ5LWI4NTYtNDg1ZWNjOTlmZGM5In0.lZ3QMdljx_w2MEM12IH_OZQPtF3OU33yCzr-2rxcHMo'
    };
  };

  const getRewards = () => {
    sendRequest(paths.rewards, 'GET', updateRewardsText);
  };

  const track = (eventKey) => {
    sendRequest(`${paths.events}/${eventKey}`, 'POST', updateRewardsText);
  };

  const load = (key) => {
    apiKey = key;
  };

  var index = {
    getRewards,
    track,
    load,
    ...events,
  };

  return index;

}());
