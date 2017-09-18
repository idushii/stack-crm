<template>
<div class="section" id="final">
   <div class="row">
      <div class="col m12 s12 offset-m0">
         <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col m6 s12">
                  <ul  class="collection with-header">
                      <li class="collection-header"><h5 class="truncate">Оказанные услуги</h5></li>
                      <li class="collection-item" v-for="service in services" v-if="service.Select">{{service.Title}}: {{service.Price}} руб</li>
                    <li class="collection-header"><h6>Итого: {{Sum}}</h6></li>
                  </ul>
                </div>
                <div class="col m6 s12">
                  <div class="sectionSend">
                     <ul class="collection with-header">
                       <li class="collection-header"><h5>Отправить</h5></li>
                     </ul>
                     <div class="collection">
                        <a class="collection-item sendBtn" @click="openSendModal(0)">телефон</a>
                        <a class="collection-item sendBtn" @click="openSendModal(1)">telegram</a>
                        <a class="collection-item sendBtn" @click="openSendModal(2)">почту</a>
                        <a class="collection-item sendBtn">Скачать pdf</a>
                     </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-action hide-on-med-and-up">
              <a class="waves-effect waves-blue btn-flat blue-text" @click="workOrder"><i class="fa fa-arrow-left"></i></a>
              <a class="waves-effect waves-light btn right" @click="successOrder"><i class="fa fa-check"></i></i></a>
            </div>
            <div class="card-action hide-on-small-only">
              <a class="waves-effect waves-blue btn-flat blue-text" @click="workOrder"><i class="fa fa-arrow-left left"></i>Назад</a>
              <a class="waves-effect waves-light btn right" @click="successOrder"><i class="fa fa-check right"></i></i>Готово</a>
            </div>
         </div>
      </div>
   </div>
    <div id="modalSend" class="modal">
      <div class="modal-content">
        <h4>{{SendTo[SelectSend]}}</h4>
        <div class="row">
            <div class="input-field col s12">
               <input placeholder="" id="adres" type="text" v-model="SelectAdres">
            </div>
            <div class="col s12">
               <button class="waves-effect waves-light btn right" @click="send">Отправить</button>
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
        Sum: 0,
        SendTo: ['Отправить на телефон', 'Отправить на telegram', 'Отправить на почту'],
        SelectSend: 0,
        SelectAdres: ''
      }
    },
    methods: {
      workOrder() {
        this.order.Progress = 3;
        $.post(`${urlServer}/order/${this.id}`, {
          order: this.order
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast('Приступил к работе.', 1000)
            this.$root.$emit('order-work', {
              id: this.id
            });
          } else {
            Materialize.toast(json.message, 5000)
          }
        }).fail(err => {
          Materialize.toast('Ошибка соединения.', 5000)
        })
      },
      updateSum() {
        this.Sum = 0;
        for (let i = 0; i < this.services.length; i++)
          if (this.services[i].Select) {
            this.Sum += this.services[i].Price * 1
          }

      },
      send() {
        Materialize.toast('Функционал не реализован.')
        $('#modalSend').modal('close')
      },
      openSendModal(select) {
        this.SelectSend = select;
        if (select == 0) {
          this.SelectAdres = this.order.ClientPhone;
        }
        if (select == 1) {
          this.SelectAdres = this.order.ClientTelegram;
        }
        if (select == 2) {
          this.SelectAdres = '';
        }
        $('#modalSend').modal('open')
        console.log('modal')
      },
      successOrder() {
        this.order.Progress = 5;
        $.post(`${urlServer}/order/${this.id}`, {
          order: this.order
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast('Заказ завершен.', 1000)
            this.$root.$emit('order-info', {
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
      $.get(`${urlServer}/order/${this.id}`, (json) => {
        if (json.result == 1) {
          this.order = window.dataOrder = json.order;
          this.users = json.users;
          this.status = json.status;
          this.services = json.services;

          console.log('selected')
          if (this.order.Descript) {
            for (let i = 0; i < this.services.length; i++)
              this.services[i].Select = (this.order.Descript.indexOf(this.services[i].Title) > -1) ? true : false;
          }
          this.updateSum();
        } else {
          Materialize.toast(json.message, 5000)
        }

      }).fail((err) => {
        Materialize.toast('Ошибка соединения.', 5000)
        Materialize.toast('Обработка подгрузки из кеша.')
      })
    }
  }

  export default final;
</script>

<style>
  .sendBtn {
    text-align: center;
    cursor: pointer;
  }
  
  .sectionSend div.collection {}
  
  .sectionSend ul.collection {}
</style>