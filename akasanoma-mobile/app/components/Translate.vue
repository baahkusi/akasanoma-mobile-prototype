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
      <Label class="action-bar-title" text="Translate"></Label>
    </ActionBar>

    <ScrollView>
      <StackLayout class="page-content">
        <TextView
          editable="false"
          v-if="alert"
          :androidElevation="10"
          :text="msg"
          backgroundColor="#e6e6e6"
          color="#3c495e"
        />
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
          mid="At this level you are tasked to translate some random single words and phrases from english to twi. Each correct translation earns you 1 point."
          :bot="userLevel < 1 ? 'Level locked.' : 'Start.'"
          :locked="userLevel < 1"
          :key="1"
          to="1"
        />
        <Card
          top="Level 2"
          mid="At this level you are tasked to translate some random sentences from english to twi. Each correct translation earns you 2 points."
          :bot="userLevel < 2 ? 'Level locked.' : 'Start.'"
          :locked="userLevel < 2"
          :key="2"
          to="2"
        />
        <Card
          top="Level 3"
          mid="At this level you are tasked to translate some random paragraphs from english to twi. Each correct translation earns you 5 points."
          :bot="userLevel < 3 ? 'Level locked.' : 'Start.'"
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
import Translator from "./Translator.vue";
import Card from "./Card.vue";

export default {
  components: {
    Card
  },
  mounted() {
    this.$eventBus.$on("tapped", to => this.tapped(to));
    SelectedPageService.getInstance().updateSelectedPage("Translate");
  },
  data() {
    return {
      busy: false,
      alert: false,
      msg: ""
    };
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    },
    ...mapGetters(["email", "userLevel", "isLoggedIn"])
  },
  methods: {
    showMsg(msg) {
      this.msg = msg;
      this.alert = true;
      setTimeout(() => (this.alert = false), 3000);
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
          get_entries: { level: to },
          "000": ["get_entries"]
        },

        "000": ["111"]
      };

      this.httpReq(payload).then(result => {
        const resp = result["111"]["get_entries"];
        if (resp["status"]) {
          this.$showModal(Translator, {
            clearHistory: true,
            fullscreen: true,
            props: { dat: resp["data"] }
          }).then(entries => {
            if (!entries) {
              this.showMsg("Cancelled.");
              return false;
            }
            const load = {
              "111": {
                set_translations: {
                  trans: entries
                },
                "000": ["set_translations"]
              },

              "000": ["111"]
            };
            // console.log("Uploading tranlations ...");
            this.httpReq(load).then(result => {
              resp = result["111"]["set_translations"];
              if (resp["status"]) {
                this.showMsg("Well done, task successfully completed.");
                // this.$forceUpdate();
              } else {
                this.showMsg("Error, couldn't upload translations.");
              }
            });
          });
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