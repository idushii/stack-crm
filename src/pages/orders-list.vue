<template>
  <div class="section" id="login">
    <div class="row">
      <div class="col m12 s12 offset-m0">
        <ul class="collection with-header">
          <li class="collection-header"><h4>Список заказов: </h4></li>
          <li class="collection-item row hide-on-small-only">
            <span class="col s4 m2"><b>Время</b></span>
            <span class="col s8 m3"><b>Клиент</b></span>
            <span class="col s12 m2"><b>Проблема</b></span>
            <span class="col s4 m2"><b>Телефон</b></span>
            <span class="col s8 m2"><b>Мастер</b></span>
            <span class="col s12 m1"><b>Статус</b></span>
          </li>
          <li class="collection-item row link-order" v-bind:class="{ isEdit: Order.idProgress == 1, isDraw: Order.idProgress == 2, isWork: Order.idProgress == 3, isFinal: Order.idProgress == 4, isInfo: Order.idProgress == 5 }"  v-for="Order in list_order" @click="openOrder(Order)">
            <span class="col s4 m2 isimportatant truncate">{{Order.Finish_Time}} {{Order.Finish_Date}}</span>
            <span class="col s8 m3 isimportatant truncate">{{Order.ClientFIO}}</span>
            <span class="col s12 m2 truncate">{{Order.Descript}}</span>
            <span class="col s4 m2 isimportatant truncate">{{Order.ClientPhone}}</span>
            <span class="col s8 m2 truncate">{{Order.UserFIO}}</span>
            <span class="col s12 m1 truncate">{{Order.Progress}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="fixed-action-btn" v-if="datauser.UserRole < 4">
      <a class="btn-floating btn-large waves-effect waves-light red" @click="new_order">
        <i class="material-icons">add</i>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'orders-list',
    props: ['status'],
    data() {
      return {
        list_order: [],
        list_status: []
      }
    },
    methods: {
      new_order() {
        this.$root.$emit('order-edit', {
          id: 'new'
        });
      },
      openOrder(Order) {
        if (this.$store.state.login.UserRole == 3) {
          this.$root.$emit('order-info', {
            id: Order.idOrder
          });
          return;
        }

        if (Order.Progress == this.list_status[0].Title) { // В ожидании звонка
          Materialize.toast('Переход к заказу', 1000)
          console.log('Переход к заказу')
          this.$root.$emit('order-edit', {
            id: Order.idOrder
          });
        }
        if (Order.Progress == this.list_status[1].Title) { // В пути
          Materialize.toast('Переход к заказу', 1000)
          console.log('Переход к заказу')
          this.$root.$emit('order-drive', {
            id: Order.idOrder
          });
        }
        if (Order.Progress == this.list_status[2].Title) { // Приступил к работе
          Materialize.toast('Переход к заказу', 1000)
          console.log('Переход к заказу')
          this.$root.$emit('order-work', {
            id: Order.idOrder
          });
        }
        if (Order.Progress == this.list_status[3].Title) { // Подтверждение заказа
          Materialize.toast('Переход к заказу', 1000)
          console.log('Переход к заказу')
          this.$root.$emit('order-final', {
            id: Order.idOrder
          });
        }
        if (Order.Progress == this.list_status[4].Title) { // Готов (страница просмотра заказа)
          Materialize.toast('Переход к заказу', 1000)
          console.log('Переход к заказу')
          this.$root.$emit('order-info', {
            id: Order.idOrder
          });
        }
      },
      loadData() {
        let list_url = `${urlServer}/orders-list/`;
        if (this.status == 'actual' || this.status == 'user') {
          list_url += `${this.status}?Id=${this.$store.state.login.Id}`
        }
        if (this.status == 'customer') {
          list_url += `${this.status}?ClientPhone=${this.$store.state.login.Phone}`
        }
        Promise.all([
            httpGet(`${urlServer}/status`, 'json'),
            httpGet(list_url, 'json')
          ])
          .then(
            response => {
              this.list_status = response[0];
              this.list_order = response[1];
            }
          )
          .catch(error => {
            Materialize.toast(error)
          });

      }
    },
    watch: {
      status: function(val, oldVal) {
        this.loadData()
      }
    },
    mounted() {
      console.log('mounted')
      this.loadData()
    },
    computed: {
      datauser() {
        return this.$store.state.login;
      }
    }
  }
</script>

<style>
  .link-order {
    cursor: pointer;
  }
  
  @media (max-width: 1000px) {
    .phone {
      display: none;
    }
  }
  
  @media(max-width: 600px) {
    .isimportatant {
      font-weight: bold;
    }
    .collection-item.link-order {
      margin: 5px 0px;
    }
  }
  
  li.collection-item.isEdit {
    background-color: rgba(50, 50, 0, 0.1);
  }
  
  li.collection-item.isDraw {
    background-color: rgba(10, 50, 100, 0.2);
  }
  
  li.collection-item.isWork {
    background-color: rgba(0, 200, 200, 0.2);
  }
  
  li.collection-item.isFinal {
    background-color: rgba(0, 200, 100, 0.3);
  }
  
  li.collection-item.isInfo {
    background-color: rgba(0, 200, 0, 0.4);
  }
</style>