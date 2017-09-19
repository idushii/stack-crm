<template>
<div class="section" id="final">
   <div class="row">
      <div class="col m12 s12 offset-m0">
         <div class="card">
            <div class="card-content">
               <h5 class="center truncate">Статус заказа #{{id}}: {{orderStatus}}</h5>
               <div class="section">
                  <iframe id="maps" width="100%" height="450" frameborder="0" style="border:0" src="" allowfullscreen></iframe>
               </div>
            </div>
            <div class="card-action hide-on-med-and-up">
              <a class="waves-effect waves-blue btn-flat blue-text" @click="editOrder"><i class="fa fa-arrow-left"></i></a>
              <a class="waves-effect waves-light btn right" @click="workOrder"><i class="fa fa-arrow-right"></i></i></a>
            </div>
            <div class="card-action hide-on-small-only">
              <a class="waves-effect waves-blue btn-flat blue-text" @click="editOrder"><i class="fa fa-arrow-left left"></i>Назад</a>
              <a class="waves-effect waves-light btn right" @click="workOrder"><i class="fa fa-arrow-right right"></i></i>Я на месте</a>
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
        orderStatus: '',
        status: [{
          Title: ''
        }, {}, {
          Title: ''
        }],
      }
    },
    methods: {
      editOrder() {
        this.order.Progress = 1;
        $.post(`${urlServer}/order/${this.id}`, {
          order: this.order
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast('Редактирование заказа.', 1000)
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
            this.orderStatus = this.status[json.order.Progress - 1].Title
            let adres = json.order.adres.split(' ').join('%20');
            let key = 'AIzaSyAU1flKPrO9sxurx_aqak20drEpOKayJdc';
            maps.setAttribute('src', `https://www.google.com/maps/embed/v1/place?key=${key}&q=${adres}`)
          } else {
            Materialize.toast(json.message, 5000)
          }
        })
        .catch((err) => {
          Materialize.toast('Ошибка соединения.', 5000)
          //Materialize.toast('Обработка подгрузки из кеша.', 5000)
        })
    }
  }

  export default final;
</script>

<style>

</style>