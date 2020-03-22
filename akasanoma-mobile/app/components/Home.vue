<template>
  <Page class="page" xmlns:mdr="nativescript-material-ripple">
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
      <Label class="action-bar-title" text="Home"></Label>
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
          top="Intro"
          mid="The rules are simple. Make money by providing correct translations & validations."
          bot="Read More."
          to="rules"
          :key="2"
        />
        <StackLayout v-if="!isLoggedIn" class="inner" backgroundColor="#ffffff" :androidElevation="10">
          <AuthData ref="register" key="1" :pinned="rpinned" v-if="reg" />
          <Button
            text="Create Account"
            class="next"
            backgroundColor="#43b883"
            color="white"
            @tap="tapped('reg')"
            row="0"
            col="1"
            :isUserInteractionEnabled="!busy"
          />
          <Button
            marginTop="10px"
            text="Resend Pin"
            backgroundColor="#3c495e"
            color="white"
            @tap="register"
            v-if="rpinned"
            row="0"
            col="0"
          />
        </StackLayout>
        <StackLayout v-if="!isLoggedIn" class="inner" backgroundColor="#ffffff" :androidElevation="10">
          <AuthData ref="login" key="2" :pinned="lpinned" v-if="log" />
          <Button
            text="Login"
            class="next"
            backgroundColor="#43b883"
            color="white"
            @tap="tapped('log')"
            row="0"
            col="1"
            :isUserInteractionEnabled="!busy"
          />
          <Button
            marginTop="10px"
            text="Resend Pin"
            backgroundColor="#3c495e"
            color="white"
            @tap="generatePin"
            v-if="lpinned"
            row="0"
            col="0"
          />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { device } from "tns-core-modules/platform";
import { mapGetters } from "vuex";
import { request } from "tns-core-modules/http";
import * as appSettings from "tns-core-modules/application-settings";
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import Card from "./Card.vue";
import Translator from "./Translator.vue";
import AuthData from "./AuthData.vue";
import About from "./About.vue";

export default {
  data() {
    return {
      busy: false,
      lpinned: false,
      rpinned: false,
      log: false,
      reg: false,
      alert: false,
      msg:""
    };
  },
  components: {
    Card,
    AuthData
  },
  computed: {
    ...mapGetters(["isLoggedIn"])
  },
  methods: {
    showMsg(msg){
      this.msg = msg;
      this.alert = true;
      setTimeout(()=>this.alert=false, 3000);
    },
    tapped(to) {
      switch (to) {
        case "log":
          if (!this.log) {
            this.log = true;
            this.reg = false;
            // this.$forceUpdate();
            return false;
          }
          if (this.lpinned) {
            this.login();
          } else {
            this.generatePin();
          }

          break;
        case "reg":
          if (!this.reg) {
            this.reg = true;
            this.log = false;
            // this.$forceUpdate();
            return false;
          }
          if (this.rpinned) {
            this.login();
          } else {
            this.register();
          }

          break;
        case "rules":
          this.$navigateTo(About, {
            clearHistory: true
          });
          break;
        default:
          break;
      }
    },
    httpReq(payload) {
      // this.repaste(true);
      this.busy = true;
      return request({
        url: "https://akasanoma.herokuapp.com/action",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify(payload)
      }).then(
        response => {
          const result = response.content.toJSON();
          // this.repaste(false);
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
    generatePin() {
      const result = this.getData();
      if(result.email===""){
        return false;
      }
      this.httpReq({
        "111": {
          generate_pin: {
            email: result.email.trim(),
            device: device.uuid
          },
          "000": ["generate_pin"]
        },

        "000": ["111"]
      }).then(response => {
        if (!response["111"]["generate_pin"]["status"]) {
          this.showMsg(
            "Login Failed. User with email does not exist, please register first."
          );
          return false;
        }
        this.lpinned = true;
        // this.$forceUpdate();
      });
    },
    login() {
      const result = this.getData();
      if(result.email==="" || result.pin ===""){
        return false;
      }
      this.httpReq({
        "111": {
          login: {
            email: result.email.trim(),
            device: device.uuid,
            fresh_pin: result.pin.trim()
          },
          "000": ["login"]
        },

        "000": ["111"]
      }).then(resp => {
        if (!resp["111"]["login"]["status"]) {
          this.showMsg("Login Failed. Invalid pin.");
          return false;
        }
        const dat = resp["111"]["login"]["data"];
        appSettings.setString("mail", result.email.trim());
        appSettings.setNumber("level", dat.user_level);
        appSettings.setBoolean("loggedIn", true);
        appSettings.setString(
          "loginToken",
          resp["111"]["login"]["data"]["token"]
        );
        this.$store.commit("login");
        this.$store.commit("set_mail", result.email);
        
        this.showMsg("Login Successful...");
        // this.$forceUpdate();
      });
    },
    register() {
      const result = this.getData();
      if(result.email===""){
        return false;
      }
      this.httpReq({
        "111": {
          register: {
            email: result.email.trim(),
            device: device.uuid,
            user_type: "client"
          },
          "000": ["register"]
        },

        "000": ["111"]
      }).then(response => {
        if (!response["111"]["register"]["status"]) {
          this.showMsg(
            "Registration Failed. User already Exists. You can login with email."
          );
          return false;
        }
        this.rpinned = true;
        // this.$forceUpdate();
      });
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    getData() {
      if (this.log) {
        return this.$refs.login.getData();
      } else if (this.reg) {
        return this.$refs.register.getData();
      } else {
        this.showMsg("Provide data.");
      }
    }
  },

  mounted() {
    this.$eventBus.$on("tapped", to => this.tapped(to));
    SelectedPageService.getInstance().updateSelectedPage("Home");
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../app-variables";
// End custom common variables

// Custom styles
StackLayout {
  &.inner {
    min-height: 150px;
    margin: 20px;
    border-radius: 30px;
    padding: 30px;
  }
}
</style>