var http = require('http');
var request = require('request');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var mysql = require('mysql');
var quests = require('./quests')

var loginCustomers = [];

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'diplom'
});

/*var connection = mysql.createConnection({
   host: '81.177.26.143',
   user: 'nime',
   password: '555666q',
   database: 'diplom'
});/* */

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cookieParser())

// default

app.post('/customer/sendPass/', (req, res) => {
  let Phone = req.body.Phone;
  let Pass = '';
  let isLogin = false;

  // Генерация пароля
  let alf = 'abcdefghijklmnopqrstuvwxyz1324567890';
  for (let i = 0; i < 6; i++) {
    let pos = Math.round((Math.random() * 100) % alf.length);
    Pass += alf[pos - 1];
  }

  // Проверка наличия в БД
  connection.query(`SELECT id, Phone, Telegram FROM customers WHERE Phone = '${Phone}'`, function (error, results, fields) {
    if (error) {
      res.send({ result: 0, message: 'Ошибка БД' });
      console.log(`Ошибка получения клиента из бд по телефону '${Phone}'`);
      return;
    }
    if (results.length > 0) {
      res.send({ result: 0, message: 'Для данного телефона уже отправлен пароль' });
      console.log(`Запрос пароля для "${Phone}". Для данного телефона уже выслан пароль.`)
      return;
    } else {
      // Добавление в БД нового пользователя
      connection.query(`INSERT INTO customers (id, Phone, Telegram, Pass) VALUES (NULL, '${Phone}', '', '${Pass}');`, function (error_, results_, fields_) {
        if (error) {
          res.send({ result: 0, message: 'Ошибка добавления в БД' });
          console.log(`Ошибка добавления в БД с телефоном '${Phone}'`);
          return;
        }
        // Отправка смс с паролем
        let mes = `Ваш пароль для входа: ${Pass}. Stack Active.`;
        //res.send({ result: 1, message: mes });
        mes = encodeURI(mes);
        request(`https://sms.ru/sms/send?api_id=A3BA354D-065C-9FF9-2B3C-ED1BEC8D263C&to=${Phone}&msg=${mes}&json=1`, function (error, response, body) {
            if (!error) {
              loginCustomers.push({ Phone, Pass });
              res.send({ result: 1, message: 'Ожидайте смс с паролем' });
              console.log(`Запрос пароля для "${Phone}". Выслан пароль "${Pass}"`)
              console.log(`Баланс аккаунта на sms.ru: ${JSON.parse(body).balance}`)
            } else {
              res.send({ result: 0, message: 'Ошибка отправки сообщения с паролем.' });
              console.log(`Ошибка запроса пароля для  "${Phone}".`)
            }
          }) //*/
      })
    }

  });


})

app.post('/customer/login/', (req, res) => {

  let Phone = req.body.Phone;
  let Pass = req.body.Pass;
  let isLogin = false;

  console.log(`Попытка входа с данными "${Phone}" : "${Pass}"`)

  connection.query(`SELECT id, Phone, Telegram FROM customers WHERE Phone = '${Phone}' AND Pass = '${Pass}'`, function (error, results, fields) {
    if (error) {
      res.send({ result: 0, message: 'Ошибка БД' });
      console.log(`Ошибка получения клиента из бд по телефону '${Phone}'`);
      return;
    }
    if (results.length > 0) {
      res.send({ result: 1, message: 'Успешный вход.', Phone, UserFIO: Phone, UserRole: 3 });
      console.log(`Вход успешен.`)
      return;
    } else {
      res.send({ result: 0, message: 'Неверные данные для входа' });
      console.log(`Запрос пароля для "${Phone}":"${Pass}". Неверные данные для входа.`)
      return;
    }
  })
})

app.post('/login', function (req, res) {
  console.log('/login')
  if (req.body.login == 'admin' & req.body.pwd == '111') {
    res.send(JSON.stringify({ result: '1' }));
  } else {
    res.send(JSON.stringify({ result: '0', message: 'Неверный логин или пароль' }));
  }
});

app.get('/orders-list', function (req, res) {
  console.log('/orders-list');
  connection.query(`
   SELECT r.Finish_Date, r.Finish_Time, r.Descript, r.ClientFIO, r.ClientPhone, r.Id as idOrder, u.UserFIO, s.Title as Progress, r.Progress as idProgress FROM requistions r
      left join users u on r.MasterId = u.Id
      left join status s on r.Progress = s.Id
      order by r.Id desc
   `, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
})

app.get('/orders-list/actual', function (req, res) {
  console.log('/orders-list-actual');
  connection.query(`
   SELECT r.Finish_Date, r.Finish_Time, r.Descript, r.ClientFIO, r.ClientPhone, r.Id as idOrder, u.UserFIO, s.Title as Progress, r.Progress as idProgress FROM requistions r
      left join users u on r.MasterId = u.Id
      left join status s on r.Progress = s.Id
      order by r.Id desc
   `, function (error, results, fields) {
    if (error) throw error;
    let now = new Date();
    let This_Date = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    let actualOrders = []

    for (let i = 0; i < results.length; i++) {
      let Finish_Date = results[i].Finish_Date.split('-')

      let flag = true;
      for (let j = 0; j < Finish_Date.length; j++)
        if (Finish_Date[j] != This_Date[j])
          flag = false

      if (flag) {
        //console.log(`${now}: ${results[i].Finish_Date}`)
        actualOrders.push(results[i])
      }
    }

    //console.log(This_Date)
    res.send(actualOrders);
  });
})

app.get('/orders-list/user', function (req, res) {
  console.log('/orders-list-user');
  console.log(req.query)
  connection.query(`
   SELECT r.Finish_Date, r.Finish_Time, r.Descript, r.ClientFIO, r.ClientPhone, r.Id as idOrder, u.UserFIO, u.Id as UserId, s.Title as Progress, r.Progress as idProgress 
   FROM requistions r
      left join users u on r.MasterId = u.Id
      left join status s on r.Progress = s.Id
      order by r.Id desc
   `, function (error, results, fields) {
    if (error) throw error;
    let selectOrders = []

    for (let i = 0; i < results.length; i++) {
      if (results[i].UserId == req.query.Id) {
        selectOrders.push(results[i])
      }
    }

    res.send(selectOrders);
  });
})

app.get('/orders-list/customer', function (req, res) {
  console.log('/orders-list-user');
  console.log(req.query)
  connection.query(`
   SELECT r.Finish_Date, r.Finish_Time, r.Descript, r.ClientFIO, r.ClientPhone, r.Id as idOrder, u.UserFIO, u.Id as UserId, s.Title as Progress, r.Progress as idProgress 
   FROM requistions r
      left join users u on r.MasterId = u.Id
      left join status s on r.Progress = s.Id
      order by r.Id desc
   `, function (error, results, fields) {
    if (error) throw error;
    let selectOrders = []

    for (let i = 0; i < results.length; i++) {
      if (results[i].ClientPhone == req.query.ClientPhone) {
        selectOrders.push(results[i])
      }
    }

    res.send(selectOrders);
  });
})


app.get('/list-users', function (req, res) {
  console.log('/list users');
  connection.query(`SELECT u.Id as idUser, u.UserLogin, u.UserFIO, u.Logged, u.phone, u.procent, u.Remark, u.Sum, r.Title as Role FROM users u LEFT JOIN roles r ON r.Id = u.UserRole order by u.Id ASC`, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});

app.get(/\/user/, function (req, res) {
  let id = req.url.split('/')
  console.log('user ' + id)
  id = id[2] * 1;
  let newUser = req.url.split('/')[2] == 'new';
  if (!isNaN(id) || newUser) {
    console.log('/user ' + id || newUser);
    let user = { UserRole: 2 }
    if (!newUser) {
      user = new Promise((resolve, reject) => {
        connection.query(`SELECT Id, UserLogin, UserRole, UserTelegram, UserFIO, Logged, phone, procent, Remark, Sum FROM users where Id='${id}'`, function (error, results, fields) {
          if (error) reject('Ошибка запроса');
          resolve(results[0])
        });
      })
    }
    let roles = new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM roles`, function (error, results, fields) {
        if (error) reject('Ошибка запроса');
        resolve(results)
      });
    })

    Promise.all([user, roles])
      .then(results => {
        results[0].Sum = 0;
        results[0].procent = 60;
        results[0].UserTelegram = '';
        results[0].phone = '';
        
        res.send({ result: 1, user: results[0], roles: results[1] });
      })
      .catch(err => {
        console.log('Ошибка выполнения запроса для получения данных пользователя: ' + err)
        res.send({ result: 0, message: err });
      })
  } else {
    console.log('/user new : get empty')
  }
})

app.post('/user/login', (req, res) => {
  let Login = req.body.Login;
  let Pass = req.body.Pass;
  console.log(`SELECT Id, UserRole, UserFIO, UserLogin FROM users Where UserLogin = '${Login}' and UserPassword='${Pass}' `)
  connection.query(`SELECT Id, UserRole, UserFIO, UserLogin FROM users Where UserLogin = '${Login}' and UserPassword='${Pass}' `, (error, results, fields) => {
    if (error) { res.send({ result: 0, message: 'Ошибка выполнения запроса' }); }
    if (results.length == 0) {
      res.send({ result: 0, message: 'Логин или пароль не подходят' });
      console.log('Логин или пароль не подходят');
    } else {
      let login = results[0];
      login.result = 1;
      res.send(login);
      console.log(login)
      console.log(`В систему вошел #${results[0].Id} '${results[0].UserFIO}'`);
    }
  })
})

app.post('/user/remove', function (req, res) {
  let user = req.body.user
  connection.query(`DELETE FROM users Where Id = ${user.Id}`, (error, results, fields) => {
    if (error) { res.send({ result: 0, message: 'Ошибка выполнения запроса' }); }
    res.send({ result: 1 });
  })
})

app.post('/user/pass', (req, res) => {
  let last_pass = req.body.last_pass
  let new_pass = req.body.new_pass
  let new_pass2 = req.body.new_pass2
  let id = req.body.id;
  console.log(`user #${id} change pass`);

  if (new_pass != new_pass2) {
    res.send({ result: 0, message: 'Пароли не совпадают' });
    console.log('Пароли не совпадают')
    return;
  }

  connection.query(`SELECT UserPassword FROM users Where Id = ${id}`, (error, results, fields) => {
    if (error) { res.send({ result: 0, message: 'Ошибка выполнения запроса' }); }
    if (results[0].UserPassword == last_pass) {
      connection.query(`UPDATE users SET UserPassword = '${new_pass2}' Where Id = ${id}`, (error, results, fields) => {
        if (error) { res.send({ result: 0, message: 'Ошибка выполнения запроса' }); }
        res.send({ result: 1 });
        console.log('Успешная смена пароля')
      })
    } else {
      res.send({ result: 0, message: 'Пароль пользователя не подходит к данной учетной записи.' });
      console.log('Пароль пользователя не подходит к данной учетной записи')
      return;
    }
  })
})

app.post(/\/user/, function (req, res) {
  let user = req.body.user
  if (user.Id) {
    console.log(`/user ${user.Id} : update`)
    connection.query(`
      UPDATE users SET 
         UserLogin = '${user.UserLogin}', 
         UserFIO = '${user.UserFIO}', 
         UserTelegram = '${user.UserTelegram}', 
         UserRole = '${user.UserRole}', 
         phone = '${user.phone}', 
         procent = '${user.procent}', 
         Remark = '${user.Remark}', 
         Sum = '${user.Sum}' 
      WHERE users.Id = ${user.Id}
      `, function (error, results, fields) {
      if (error) res.send({ result: 0, message: 'Ошибка выполнения запроса' });
      res.send({ result: 1 });
    });
  } else {
    console.log('/user new : insert')
    connection.query(`
      INSERT INTO users (
         Id, UserLogin, UserPassword, UserFIO, UserTelegram, Logged, UserRole, 
         phone, procent, Remark, Percent, Sum
      ) VALUES (
         NULL, '${user.UserLogin}', '111', '${user.UserFIO}', '${user.UserTelegram}', NULL, '${user.UserRole}', 
         '${user.phone}', '${user.procent}', '${user.Remark}', NULL, '${user.Sum}')
      `, function (error, results, fields) {
      if (error) res.send({ result: 0, message: 'Ошибка выполнения запроса' });
      // Послений добавленый
      connection.query(`SELECT Id FROM users order by Id desc limit 1 `, function (error, results, fields) {
        if (error) {
          console.log('Ошибка получения последнего Id добавленого пользователя')
          res.send({ result: 0, message: 'Запись добавлена. Возникла ошибка.' })
        };
        console.log(`user / ${results[0].Id} : Получил последний Id`);
        res.send({ result: '1', Id: results[0].Id });
      })
    });
  }
})

app.get('/status', function (req, res) {
  console.log('/status lists');
  connection.query(`SELECT * FROM status`, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
})

app.post(/\/order/, function (req, res) {
  let order = req.body.order
  if (order.Id) {
    connection.query(`
        UPDATE requistions 
        SET 
            Acception_Date = '${order.Acception_Date}', 
            Acception_Time = '${order.Acception_Time}', 
            adres = '${order.adres}', 
            ClientFIO = '${order.ClientFIO}', 
            ClientId = '${order.ClientId}', 
            ClientPhone = '${order.ClientPhone}', 
            ClientTelegram = '${order.ClientTelegram}', 
            Descript = '${order.Descript}', 
            Finish_Date = '${order.Finish_Date}', 
            Finish_Time = '${order.Finish_Time}', 
            MasterId = '${order.MasterId}', 
            Progress = '${order.Progress}', 
            Remark = '${order.Remark}'
        WHERE Id  = '${order.Id}'`,
      function (error, results, fields) {
        if (error) {
          console.log('order / ' + order.Id + ' : Error of execute');
          res.send({ result: '0', message: 'Ошибка выполнения запроса' });
        }
        console.log('order / ' + order.Id + ' : изменен');
        res.send({ result: '1' });
      });
  } else {
    connection.query(`
      INSERT INTO requistions (
         Id, Descript, adres, Acception_Date, Acception_Time, Finish_Date, Finish_Time, 
         MasterId, ClientId, Progress, Remark, ClientFIO, ClientPhone, ClientTelegram) 
      VALUES (NULL, '${order.Descript}', '${order.adres}', '${order.Acception_Date}', '${order.Acception_Time}', 
      '${order.Finish_Date}', '${order.Finish_Time}', '${order.MasterId}', NULL, '${order.Progress}', '${order.Remark}', 
      '${order.ClientFIO}', '${order.ClientPhone}', '${order.ClientTelegram}');`, function (error, results, fields) {
      if (error) {
        console.log('order / new  : Error of insert');
        res.send({ result: '0', message: 'Ошибка выполнения запроса' });
      }
      console.log('order / new : вставлен');
      new Promise((resolve, reject) => {
        connection.query(`SELECT Id FROM requistions order by Id desc limit 1 `, function (error, results, fields) {
          if (error) { return reject(error) };
          return resolve(results[0])
        });
      }).then(result => {
        console.log(`order / ${result.Id} : Получил последний Id`);
        res.send({ result: '1', Id: result.Id });
      }).catch(err => {
        res.send({ result: 0, message: 'Запись добавлена. Возникла ошибка.' })
      })


    })
  }
});

app.get(/\/order\/[0-9]*/, function (req, res) {
  let id = req.url.split('/')
  id = id[2] * 1;
  let newOrder = req.url.split('/')[2] == 'new';
  if (!isNaN(id) || newOrder) {
    let Order = { Progress: 1 };
    if (!newOrder) {
      Order = new Promise((resolve, reject) => {
        connection.query(`
                  SELECT * FROM requistions WHERE id = '${id}'
                  `, function (error, results, fields) {
          if (error) { return reject(error) };
          return resolve(results[0])
        });
      });
    } else {
      /*Order = new Promise((resolve, reject) => {
         connection.query(`SELECT * FROM requistions order by Id desc limit 1 `, function(error, results, fields) {
            if (error) { return reject(error) };
            return resolve(results[0])
         });
      });//*/
    }

    let Users = new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM users `, function (error, results, fields) {
        if (error) { return reject(error) };
        return resolve(results)
      });
    });
    let Status = new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM status `, function (error, results, fields) {
        if (error) { return reject(error) };
        return resolve(results)
      });
    });
    let Services = new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM services`, function (error, results, fields) {
        if (error) { return reject(error) };
        return resolve(results)
      });
    });

    Promise.all([Order, Users, Status, Services])
      .then((result) => {
        console.log('order / ' + id);
        res.send({ result: '1', order: result[0], users: result[1], status: result[2], services: result[3] });
      }).catch(err => {
        res.send({ result: '0', message: 'Ошибка выполненния запроса', err })
      })

  } else {
    console.log('order / NaN : Error');
    res.send({ result: '0', message: 'Ошибка в запросе' });
  }
})

app.get('/random', (req, res) => {
  request.get({ "uri": 'http://randus.ru/api.php' },
    function (err, resp, body) {
      res.send(body);
      console.log('Random values')
    }
  );
})

app.post('/preview_order', (req, res) => {
  let data = req.body
  let order = {};
  order.ClientFIO = data.fio;
  order.adres = data.adres;
  order.ClientPhone = data.tel;
  order.Descript = data.Descript;
  order.ClientTelegram = '';
  order.Finish_Date = data.Finish_Date;
  order.Finish_Time = data.Finish_Time;
  var now = new Date();
  order.Acception_Date = now.getFullYear() + '-' + ((now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)) + '-' + now.getDate();
  order.Acception_Time = (now.getHours() > 9 ? now.getHours() : '0' + now.getHours()) + ':' + (now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes());

  connection.query(`
      INSERT INTO requistions (
         Id, Descript, adres, Acception_Date, Acception_Time, Finish_Date, Finish_Time, 
         Progress,  ClientFIO, ClientPhone, ClientTelegram) 
      VALUES (NULL, '${order.Descript}', '${order.adres}', '${order.Acception_Date}', '${order.Acception_Time}', '${order.Finish_Date}', '${order.Finish_Time}', 
      '1', '${order.ClientFIO}', '${order.ClientPhone}', '${order.ClientTelegram}');`, function (error, results, fields) {
      if (error) {
        console.log('order / new  : Error of insert');
        res.send({ result: '0', message: 'Ошибка выполнения запроса' });
      }
      console.log('preview order : добавлен');
      res.send('Ваша заявка принята. Ожидайте звонка.')
    }) //*/


})

app.listen(3000, function () {
  console.log('Сервер запущен на порту 3000');
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});