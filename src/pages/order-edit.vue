<template>
  <div class="section" id="order">
    <div class="row">
      <div class="col m12 s12 offset-m0">
        <div class="card">
          <div class="card-content">
            <span class="card-title truncate">Заказ #{{id}} [{{order.Acception_Time}} {{order.Acception_Date}}]</span>
              <div class="row">
                <div class="input-field col s6 m3">
                  <label for="Finish_Date">Дата заказа</label>
                  <input placeholder=" " id="Finish_Date" type="date" v-model="order.Finish_Date" class="datepicker"  />
                </div>
                <div class="input-field col s6 m3">
                  <label for="Finish_Time">Время заказа</label>
                  <input id="Finish_Time" type="time" v-model="order.Finish_Time" />
                </div>
                <div class="input-field col s12 m6">
                  <label for="ClientFIO">Клиент</label>
                  <input id="ClientFIO" type="text" v-model="order.ClientFIO" />
                </div>
                <div class="input-field col s12 m6">
                  <label for="ClientPhone">Телефон</label>
                  <input id="ClientPhone" type="text" v-model="order.ClientPhone"  />
                </div>
                <div class="input-field col s12 m6">
                  <label for="ClientTelegram">Telegram</label>
                  <input id="ClientTelegram" type="text" v-model="order.ClientTelegram" />
                </div>
                <div class="input-field col s12 m6">
                  <label for="adres">Адрес</label>
                  <input id="adres" type="text" v-model="order.adres" />
                </div>
                <div class="input-field col s12 m6">
                  <input type="button" class="waves-effect waves-blue btn-flat blue-text truncate" @click="open_list_desc" :value="getDesc() || 'Выберите задачи'" id="Descript" />
                </div>
                <div class="input-field col s12 m6" v-if="datauser.UserRole < 3">
                  <select v-model="order.MasterId" id="MasterId">
                    <option value="" disabled >Выберите из списка</option>
                    <option v-for="user in users" :value="user.Id">{{user.UserFIO}}</option>
                  </select>
                  <label>Мастер</label>
                </div>
                <div class="input-field col s12 m6" v-if="datauser.UserRole < 3">
                  <select v-model="order.Progress" id="Progress">
                    <option v-for="st in status" :value="st.Id">{{st.Title}}</option>
                  </select>
                  <label>Статус</label>
                </div>
              </div>
          </div>
          <div class="card-action hide-on-med-and-up">
            <a class="waves-effect waves-blue btn-flat blue-text " @click="save"><i class="fa fa-floppy-o"></i></i></a>
            <a class="waves-effect waves-light btn right" @click="openDrive"><i class="fa fa-arrow-right"></i></a>
            <a class="waves-effect waves-teal btn-flat left hide" @click="loadInFileds();" id="loadInFileds">Случайные</a>
          </div>
          <div class="card-action hide-on-small-only">
            <a class="waves-effect waves-blue btn-flat blue-text " @click="save"><i class="fa fa-floppy-o left"></i></i>Сохранить</a>
            <a class="waves-effect waves-light btn right" @click="openDrive"><i class="fa fa-arrow-right right"></i>Поехали</a>
            <a class="waves-effect waves-teal btn-flat left hide" @click="loadInFileds();" id="loadInFileds">Случайные</a>
          </div>

        </div>
      </div>
    </div>
    <div id="modalServices" class="modal">
      <div class="modal-content">
        <h4>Выбрать услуги</h4>
        <div class="row">
          <div class="col s12 m6 input-field" v-for="service in services">
            <input type="checkbox" v-bind:id="'service-'+service.Id" class="filled-in" v-model="service.Select" @click="select_item_desc" />
            <label v-bind:for="'service-'+service.Id">{{service.Title}} {{service.Price}}</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-action modal-close waves-effect waves-green btn-flat" @click="select_item_desc">Выбрать</button>
      </div>
    </div>
  </div>
</template>

<script>
  var Order = {
    name: 'order',
    props: ['id'],
    data() {
      return {
        order: {},
        users: [],
        status: [],
        services: []
      }
    },
    methods: {
      save() {
        this.order.Finish_Date = Finish_Date.value;
        this.order.MasterId = MasterId.value;
        this.order.Progress = Progress.value;
        $.post(`${urlServer}/order/${this.id}`, {
          order: this.order
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast('Успешное сохранение', 1000)
            this.$root.$emit('orders-list');
          } else {
            Materialize.toast(json.message, 5000)
          }
        }).fail(err => {
          Materialize.toast('Ошибка соединения.', 5000)
        })
      },
      openDrive() {
        this.order.Finish_Date = Finish_Date.value;
        this.order.MasterId = MasterId.value;
        this.order.Progress = MasterId.Progress;
        this.order.Progress = 2;
        $.post(`${urlServer}/order/${this.id}`, {
          order: this.order
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast('Карт', 1000)
            this.$root.$emit('order-drive', {
              id: json.Id || this.id
            });
          } else {
            Materialize.toast(json.message, 5000)
          }
        }).fail(err => {
          Materialize.toast('Ошибка соединения.', 5000)
        })

      },
      open_list_desc() {
        $('#modalServices').modal('open');
      },
      select_item_desc() {
        this.order.Descript = this.getDesc();
        Descript.value = this.order.Descript || 'Выберите задачи';
      },
      getDesc() {
        return this.services.filter(service => service.Select).map(service => service.Title).join(', ');
      },
      loadInFileds() {
        if (window.dataRandom) {
          this.order.ClientFIO = ClientFIO.value = window.dataRandom.ClientFIO;
          this.order.ClientPhone = ClientPhone.value = window.dataRandom.ClientPhone;
          this.order.ClientTelegram = ClientTelegram.value = window.dataRandom.ClientTelegram;
          this.order.adres = adres.value = window.dataRandom.adres;
          try {
            Materialize.updateTextFields();
          } catch (err) {}
        }
      },
      randomValues() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", `${urlServer}/random`);
        xhr.onreadystatechange = function() {
          if (xhr.readyState != 4) return;
          if (xhr.status != 200) {
            Materialize.toast('Ошибка связи')
          } else {
            let json = JSON.parse(xhr.responseText);
            window.dataRandom = {
              ClientFIO: `${json.lname} ${json.fname} ${json.patronymic}`,
              ClientPhone: json.phone,
              ClientTelegram: `@${json.login}`,
              adres: `г. ${json.city}, ул. ${json.street}, д. ${json.house}, кв. ${json.apartment}`
            };
            //Materialize.toast('Загрузка случайных данных', 1000);
            //loadInFileds.click();
          }
        }
        xhr.send();
      }
    },
    updated() {
      console.log('updated');
      try {
        Materialize.updateTextFields();
      } catch (err) {}
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

            if (this.datauser.UserRole == 3) {
              this.order.ClientFIO = this.datauser.UserFIO
              this.order.ClientPhone = this.datauser.Phone
              this.order.ClientTelegram = this.datauser.Telegram
              this.order.adres = this.datauser.adres
            }

            console.log('selected')
            if (this.order.Descript) {
              for (let i = 0; i < this.services.length; i++)
                this.services[i].Select = (this.order.Descript.indexOf(this.services[i].Title) > -1) ? true : false;
            }

            Materialize.toast('Успешная обработка', 1000)
            this.order.Acception_Date = this.order.Acception_Date || thisDate();
            this.order.Acception_Time = this.order.Acception_Time || thisTime();

            Finish_Date.value = this.order.Finish_Date || thisDate();
            Finish_Time.value = this.order.Finish_Time || thisTime();

            setTimeout(() => {
              $('select').material_select();
              $('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 17, // Creates a dropdown of 15 years to control year
                format: 'yyyy-mm-dd',
              });
              try {
                Materialize.updateTextFields();
              } catch (err) {}
              $('.modal').modal();
            }, 100)
          } else {
            Materialize.toast(json.message, 5000)
          }
        }).fail((err) => {
          Materialize.toast('Ошибка соединения.', 5000)
          Materialize.toast('Обработка подгрузки из кеша.')
        })
        //if (this.id == 'new') {
      this.randomValues()
        //}
    },
    computed: {
      datauser() {
        return this.$store.state.login
      },
      Desc() {
        return this.services.filter(service => service.Select).map(service => service.Title).join(', ');
      }
    }
  }

  export default Order;
</script>

<style>
  label[for=Finish_Time] {
    margin-top: -22px;
  }
  
  #Finish_Date,
  label[for=Finish_Date] {
    cursor: pointer;
  }
  
  .radios_container label {
    margin-right: 15px;
    margin-bottom: 10px;
  }
  
  .has_radio {
    margin-top: -10px;
    margin-bottom: 20px;
  }
  
  @media(min-width: 1000px) {
    .has_radio {
      margin-top: 10px;
      margin-bottom: 20px;
    }
    .radios_container label {
      margin-bottom: 0px;
    }
  }
</style>