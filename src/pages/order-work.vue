<template>
  <div class="section" id="final">
    <div class="row">
      <div class="col m12 s12 offset-m0">
        <div class="card">
          <div class="card-content">
            <h5 class="center truncate">Статус заказа #{{id}}: {{orderStatus}}</h5>
            <div class="section">
              <div class="row">
                <div class="col s12 m6 input-field" v-for="(service, key) in services" :key="key">
                  <span @click="select_item_desc(key)">
                    <i class="material-icons">{{service.Select ? 'check' : 'check_box_outline_blank'}}</i>
                    <span class="label-for-select">{{service.Title}} {{service.Price}}</span>
                  </span>

                </div>
                <div class="col s12 input-field">
                  <h5 class="price">Итого: {{Sum}} руб</h5>
                </div>
              </div>
            </div>
          </div>
          <div class="card-action hide-on-med-and-up">
            <a class="waves-effect waves-blue btn-flat blue-text" @click="driveOrder">
              <i class="fa fa-arrow-left"></i>
            </a>
            <a class="wawaves-effect waves-light btn right" @click="finalOrder">
              <i class="fa fa-arrow-right"></i>
              </i>
            </a>
          </div>
          <div class="card-action hide-on-small-only">
            <a class="waves-effect waves-blue btn-flat blue-text" @click="driveOrder">
              <i class="fa fa-arrow-left left"></i>Назад</a>
            <a class="waves-effect waves-light btn right" @click="finalOrder">
              <i class="fa fa-arrow-right right"></i>
              </i>Я закончил</a>
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
    updateSum() {
      this.Sum = 0;
      for (let i = 0; i < this.services.length; i++) {
        if (this.services[i].Select) {
          this.order.Descript += this.services[i].Title + ', ';
          this.Sum += this.services[i].Price * 1;
        }
      }

    },
    select_item_desc(key) {
      this.services[key].Select = !this.services[key].Select
      this.order.Descript = '';
      this.updateSum()
    },
    driveOrder() {
      this.order.Progress = 2;
      $.post(`${urlServer}/order/${this.id}`, {
        order: this.order
      }, (json) => {
        if (json.result == 1) {
          //Materialize.toast('Карта.', 1000)
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
            for (let key in this.services) {
              this.$set(this.services[key], 'Select', (this.order.Descript.indexOf(this.services[key].Title) > -1) ? true : false)
            }
          }

          this.updateSum()

        } else {
          Materialize.toast(json.message, 5000)
        }
      })
      .catch((err) => {
        Materialize.toast('Ошибка соединения.', 5000)
        //Materialize.toast('Обработка подгрузки из кеша.')
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