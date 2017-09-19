<template>
<div class="section" id="final">
   <div class="row">
      <div class="col m12 s12 offset-m0">
         <div class="card">
            <div class="card-content">
              <h4 class="card-title">Заказ #{{id}}</h4>
                <p>Статус: {{orderStatus}}</p>
                <p>Клиент: {{order.ClientFIO}}</p>
                <p>Время регистрации заказа: {{order.Acception_Time}} {{order.Acception_Date}}</p>
                <p>Время завершения заказа: {{order.Finish_Time}} {{order.Finish_Date}}</p>
                <p>Выполнены работы: {{order.Descript}}</p>
                <p>Мастер: {{MasterFIO}}</p>
                <p>Оплаченая сумма: {{Sum}} руб</p>
                <p>Доля мастера: {{MasterSum}}</p>
                <p>&nbsp;</p>
            </div>
            <div class="card-action hide-on-med-and-up" v-if="this.$store.state.login.UserRole < 3">
              <a class="waves-effect waves-blue btn-flat blue-text" @click="editOrder"><i class="fa fa-pencil"></i></a>
              <a class="wawaves-effect waves-light btn right" @click="listOrders"><i class="fa fa-list"></i></i></a>
            </div>
            <div class="card-action hide-on-small-only" v-if="this.$store.state.login.UserRole < 3">
              <a class="waves-effect waves-blue btn-flat blue-text" @click="editOrder"><i class="fa fa-pencil left"></i>Изменить</a>
              <a class="waves-effect waves-light btn right" @click="listOrders"><i class="fa fa-list right"></i></i>К списку</a>
            </div>
         </div>
      </div>
   </div>
</div>
</template>

<script>
  var final = {
    name: 'final',
    props: ['id'],
    data() {
      return {
        order: {},
        users: [],
        status: [],
        services: [],
        orderStatus: '',
        Sum: 0,
        MasterFIO: '',
        MasterSum: 0
      }
    },
    methods: {
      select_item_desc() {
        this.order.Descript = '';
        this.Sum = 0;
        for (let i = 0; i < this.services.length; i++) {
          if (this.services[i].Select) {
            this.order.Descript += this.services[i].Title + ', ';
            this.Sum += this.services[i].Price * 1;
          }
        }
      },
      editOrder() {
        this.order.Progress = 1;
        $.post(`${urlServer}/order/${this.id}`, {
          order: this.order
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast('Изменить заказ.', 1000)
            this.$root.$emit('order-edit', {
              id: this.id
            });
          } else {
            Materialize.toast(json.message, 5000)
          }
        }).fail(err => {
          Materialize.toast('Ошибка соединения.', 5000)
        })
      },
      listOrders() {
        Materialize.toast('Список заказов.', 1000)
        this.$root.$emit('orders-list', {
          id: this.id
        });
      }
    },
    updated() {
      console.log('updated');
    },
    activated() {
      console.log('activated');
    },
    mounted() {
      console.log('mounted');
      httpGet(`${urlServer}/order/${this.id}`, 'json')
        .then(json => {
          if (json.result == 1) {
            this.order = window.dataOrder = json.order;
            this.status = json.status;
            this.services = json.services;
            this.orderStatus = this.status[json.order.Progress - 1].Title
            this.Sum = 0;
            this.users = json.users;
            let Master =  this.users.filter(u => u.Id == this.order.MasterId).pop();
            this.MasterFIO = Master.UserFIO;

            if (this.order.Descript) {
              for (let i = 0; i < this.services.length; i++)
                if (this.order.Descript.indexOf(this.services[i].Title) > -1) {
                  this.services[i].Select = true;
                  this.Sum += this.services[i].Price * 1;
                } else {
                  this.services[i].Select = false;
                }
            }

            this.MasterSum = (Master.procent / 100) * this.Sum;

          } else {
            Materialize.toast(json.message, 5000)
          }
        })
        .catch((err) => {
          Materialize.toast('Ошибка соединения.', 5000)
          Materialize.toast('Обработка подгрузки из кеша.')
        })
    }
  }

  export default final;
</script>

<style>
  .price {
    margin: 20px 10px -20px 10px;
    text-align: right;
  }
</style>