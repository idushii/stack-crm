var now = new Date();

function thisDate() {
  return now.getFullYear() + '-' + ((now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)) + '-' + now.getDate()
}

function thisTime() {
  return (now.getHours() > 9 ? now.getHours() : '0' + now.getHours()) + ':' + (now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes());
}

var urlServer = 'https://ddbfa5d2.ngrok.io';
//var urlServer = 'http://localhost:3000'; 

function httpGet(url, type = 'text') {
  if (window.dataUser == undefined) {
    return new Promise(function (resolve, reject) {
      reject("Вы не вошли в систему")
    })
  }
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
      if (this.status == 200) {
        if (type == 'json') {
          try {
            resolve(JSON.parse(this.response));
          } catch (err) {
            reject("Ошибка разбора JSON");
          }
        }
        if (type == 'text') {
          resolve(this.response);
        }

      } else {
        reject("Ошибка запроса");
      }
    };
    xhr.onerror = function () {
      reject("Ошибка соединения");
    };
    xhr.send();
  });

}