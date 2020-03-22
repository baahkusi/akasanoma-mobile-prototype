<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <!-- 
            Use the NavigationButton as a side-drawer button in Android
            because ActionItems are shown on the right side of the ActionBar
      -->
      <NavigationButton ios:visibility="collapsed" icon="res://menu" @tap="onDrawerButtonTap"></NavigationButton>
      <!-- 
            Use the ActionItem for IOS with position set to left. Using the
            NavigationButton as a side-drawer button in iOS is not possible,
            because its function is to always navigate back in the application.
      -->
      <ActionItem
        icon="res://navigation/menu"
        android:visibility="collapsed"
        @tap="onDrawerButtonTap"
        ios.position="left"
      ></ActionItem>
      <Label class="action-bar-title" text="Validate"></Label>
    </ActionBar>
    <ScrollView>
      <StackLayout class="page-content">
        <TextView editable="false" v-if="alert" :androidElevation="10" :text="msg" backgroundColor="#e6e6e6" color="#3c495e"/>
        <ActivityIndicator
          v-if="busy"
          busy="true"
          :value="80"
          color="#43b883"
          backgroundColor="white"
          style="height:1000px"
        />
        <Card
          top="Hi there,"
          mid="You must be logged in before you can perform this action. Please go to the home page and login or register."
          bot="Login."
          to="home"
          v-if="!isLoggedIn"
        />
        <Card
          top="Level 1"
          mid="At this level you are tasked to rate translations others have made for level 1."
          :bot="userLevel < 1 ? 'Level locked.' : 'Start.'"
          :locked="userLevel < 1"
          :key="1"
          to="1"
        />
        <Card
          top="Level 2"
          mid="At this level you are tasked to rate translations others have made for level 2."
          :bot="userLevel < 2 ? 'Level locked.' : 'Start.'"
          :locked="userLevel < 2"
          :key="2"
          to="2"
        />
        <Card
          top="Level 3"
          mid="At this level you are tasked to rate translations others have made for level 3."
          :bot="userLevel < 3 ? 'Level locked' : 'Start.'"
          :locked="userLevel < 3"
          :key="3"
          to="3"
        />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { request } from "tns-core-modules/http";
import { getString } from "tns-core-modules/application-settings";
import { mapGetters } from "vuex";
import Home from "./Home.vue";
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import Validator from "./Validator.vue";
import Card from "./Card.vue";

export default {
  components: {
    Card
  },
  data() {
    return {
      busy: false,
      alert: false,
      msg:""
    };
  },
  mounted() {
    this.$eventBus.$on("tapped", to => this.tapped(to));
    SelectedPageService.getInstance().updateSelectedPage("Validate");
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    },
    ...mapGetters(["email", "userLevel", "isLoggedIn"])
  },
  methods: {
    showMsg(msg){
      this.msg = msg;
      this.alert = true;
      setTimeout(()=>this.alert=false, 3000);
    },
    httpReq(payload) {
      if (!this.isLoggedIn) {
        return Promise.reject("not logged in");
      }
      this.busy = true;
      const token = getString("loginToken");
      const mail = getString("mail");

      return request({
        url: "https://akasanoma.herokuapp.com/action",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "Account-ID": mail
        },
        content: JSON.stringify(payload)
      }).then(
        response => {
          const result = response.content.toJSON();
          this.busy = false;
          return Promise.resolve(result);
        },
        e => {
          this.busy = false;
          this.showMsg("Bad Internet Connection.");
          return Promise.reject(e);
        }
      );
    },
    tapped(to) {
      if (to === "home") {
        this.$navigateTo(Home, {
          clearHistory: true
        });
        return false;
      }
      const payload = {
        "111": {
          get_translations: { level: to },
          "000": ["get_translations"]
        },

        "000": ["111"]
      };

      this.httpReq(payload).then(result => {
        const resp = result["111"]["get_translations"];
        if (resp["status"]) {
          if (!resp["data"].length) {
            this.showMsg("No data for you yet, come back later.");
          } else {
            this.$showModal(Validator, {
              clearHistory: true,
              fullscreen: true,
              props: { dat: resp["data"] }
            }).then(validations => {
              if (!validations || !validations.verfs) {
                this.showMsg("Cancelled.");
                return false;
              }

              let load;
              if (Object.keys(validations.trans) !== 0) {
                load = {
                  "111": {
                    set_validations: {
                      valids: validations.verfs,
                      level: to
                    },
                    set_translations: {
                      trans: Object.values(validations.trans)
                    },
                    "000": ["set_validations", "set_translations"]
                  },

                  "000": ["111"]
                };
              } else {
                load = {
                  "111": {
                    set_validations: {
                      valids: validations.verfs
                    },
                    "000": ["set_validations"]
                  },

                  "000": ["111"]
                };
              }
              // console.log("Uploading validations ...");
              this.httpReq(load).then(result => {
                resp = result["111"]["set_validations"];
                if (resp["status"]) {
                  this.showMsg("Well done, task successfully completed.");
                  // this.$forceUpdate();
                } else {
                  this.showMsg("Error, couldn't upload validations.");
                }
              });
            });
          }
        } else {
          // console.log(resp["data"]);
        }
      });
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../app-variables";
// End custom common variables

// Custom styles
</style>
