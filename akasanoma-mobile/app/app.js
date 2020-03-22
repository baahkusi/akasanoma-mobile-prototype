import Vue from "nativescript-vue";
import Vuex from "vuex";
import {
  getBoolean,
  getString,
  hasKey,
  getNumber,
} from "tns-core-modules/application-settings";
import App from "./components/App";
import Home from "./components/Home";
import DrawerContent from "./components/DrawerContent";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";

Vue.use(RadSideDrawer);
Vue.use(Vuex);

Vue.config.silent = (TNS_ENV === 'production');

Vue.prototype.$eventBus = new Vue();

const store = new Vuex.Store({
  state:{
    mail:'anonymous@akasanoma.com',
    loggedIn: false,
  },
  getters: {
    email: state =>{
      if(hasKey('mail')){
        return getString('mail');
      }else{
        return state.mail;
      }
    },
    isLoggedIn: state =>{
      if(hasKey('loggedIn')){
        return getBoolean('loggedIn');
      }else{
        return state.loggedIn;
      }
    },
    userLevel: ()=> {
      if(hasKey('level')){
        return getNumber('level');
      }else{
        return 1;
      }
    }
  },
  mutations: {
    set_mail (state, mail) {
      state.mail = mail;
    },
    login(state){
      state.loggedIn = true;
    }
  }
});

new Vue({
    store,
    render (h) {
        return h(
          App,
          [
            h(DrawerContent, { slot: 'drawerContent' }),
            h(Home, { slot: 'mainContent' })
          ]
        )
      }
  }).$start();
