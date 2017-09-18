<template>
<div class="section" id="final">
   <div class="row">
      <div class="col m12 s12 offset-m0">
         <div class="card">
            <div class="card-content">
               <h5 class="center truncate">Статус заказа #{{id}}: {{orderStatus}}</h5>
               <div class="section">
                  <div class="row">
                     <div class="col s12 m6 input-field" v-for="service in services">
                        <input type="checkbox" v-bind:id="'service-'+service.Id" class="filled-in" v-model="service.Select" @click="select_item_desc()" />
                        <label v-bind:for="'service-'+service.Id">{{service.Title}} {{service.Price}}</label>
                     </div>
                     <div class="col s12 input-field">
                       <h5 class="price">Итого: {{Sum}} руб</h5>
                     </div>
                  </div>
               </div>
            </div>
            <div class="card-action hide-on-med-and-up">
              <a class="waves-effect waves-blue btn-flat blue-text" @click="driveOrder"><i class="fa fa-arrow-left"></i></a>
              <a class="wawaves-effect waves-light btn right" @click="finalOrder"><i class="fa fa-arrow-right"></i></i></a>
            </div>
            <div class="card-action hide-on-small-only">
              <a class="waves-effect waves-blue btn-flat blue-text" @click="driveOrder"><i class="fa fa-arrow-left left"></i>Назад</a>
              <a class="waves-effect waves-light btn right" @click="finalOrder"><i class="fa fa-arrow-right right"></i></i>Я закончил</a>
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
        Sum: 0
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
      driveOrder() {
        this.order.Progress = 2;
        $.post(`${urlServer}/order/${this.id}`, {
          order: this.order
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast('Карта.', 1000)
            this.$root.$emit('order-drive', {
              id: this.id
            });
          } else {
            Materialize.toast(json.message, 5000)
          }
        }).fail(err => {
          Materialize.toast('Ошибка соединения.', 5000)
        })
      },
      finalOrder() {
        this.order.Progress = 4;
        $.post(`${urlServer}/order/${this.id}`, {
          order: this.order
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast('Закончил работу.', 1000)
            this.$root.$emit('order-final', {
              id: this.id
            });
          } else {
            Materialize.toast(json.message, 5000)
          }
        }).fail(err => {
          Materialize.toast('Ошибка соединения.', 5000)
        })
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

            if (this.order.Descript) {
              for (let i = 0; i < this.services.length; i++)
                if (this.order.Descript.indexOf(this.services[i].Title) > -1) {
                  this.services[i].Select = true;
                  this.Sum += this.services[i].Price * 1;
                } else {
                  this.services[i].Select = false;
                }


            }

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