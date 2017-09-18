let connection = {
   query: () => {}
}

function connect(con) {
   connection = con;
}

module.exports.connect = connect;

let Users = new Promise((resolve, reject) => {
   connection.query(`SELECT * FROM users `, function(error, results, fields) {
      if (error) { return reject(error) };
      return resolve(results)
   });
})
module.exports.users = Users;

function Status() {
   new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM Status `, function(error, results, fields) {
         if (error) { return reject(error) };
         return resolve(results)
      });
   }).then(data => {
      return data
   })
}
module.exports.Status = Status;