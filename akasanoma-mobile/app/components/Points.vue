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
      <Label class="action-bar-title" text="Points"></Label>
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
          top="@ Hi there,"
          mid="You must be logged in before you can perform this action. Please go to the home page and login or register."
          bot="Start."
          to="home"
          v-if="!isLoggedIn"
        />
        <StackLayout class="inner" backgroundColor="#ffffff" :androidElevation="10">
          <Label style="font-size:18px" color="#3c495e" :text="'Points you have so far : '+pts" />
          <Label style="font-size:18px;margin-top:20px" color="#3c495e" :text="'Money equivalent : GH₵ '+amount" />
          <Button
            text="Redeem Points."
            class="next"
            backgroundColor="#43b883"
            color="white"
            @tap="redeemPoints"
          />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { request } from "tns-core-modules/http";
import { mapGetters } from "vuex";
import Card from "./Card.vue";
import Home from "./Home.vue";
import { getString, setNumber } from "tns-core-modules/application-settings";
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";

export default {
  components:{
    Card
  },
  mounted() {
    this.$eventBus.$on("tapped", to => {
      this.$navigateTo(Home, {
        clearHistory: true
      });
    });
    SelectedPageService.getInstance().updateSelectedPage("Points");

    const payload = {
      "111": {
        get_points: {},
        "000": ["get_points"]
      },

      "000": ["111"]
    };
    this.httpReq(payload).then(result => {
      const resp = result["111"]["get_points"];
      if (resp["status"]) {
        this.points = resp["data"].points;
        this.amount = resp['data'].amount;
        // this.$forceUpdate();
      } else {
        this.showMsg("Something went wrong, restart the app and try again.");
      }
    });
  },
  data() {
    return {
      busy: false,
      points: "",
      amount:"",
      alert: false,
      msg:""
    };
  },
  computed: {
    pts() {
      return this.points < 0 ? 0 : this.points;
    },
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
    getInfo(title, message, text) {
      return prompt({
        title: title,
        message: message,
        okButtonText: "OK",
        cancelButtonText: "Cancel",
        defaultText: text,
        cancelable: false
        // inputType: dialogs.inputType.email
      }).then(result => {
        return Promise.resolve(result);
      });
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
    redeemPoints() {
      if (this.pts == 0) {
        this.showMsg("You have no points to redeem yet.");
      } else {
        this.getInfo("Redeem Points", "Enter MTN phone number.", "").then(
          result => {
            if (!result.result) {
              this.showMsg("Redeem Aborted");
              return false;
            }
            const payload = {
              "111": {
                redeem_points: { phone: result.text },
                "000": ["redeem_points"]
              },

              "000": ["111"]
            };
            this.httpReq(payload).then(result => {
              const resp = result["111"]["redeem_points"];
              if (resp["status"]) {
                this.showMsg("Money Successfully transferred.")
                // this.$forceUpdate();
              } else {
                this.showMsg("Something went wrong, restart the app and try again.");
              }
            });
          }
        );
      }
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


StackLayout {
  
  &.inner {
  min-height: 150px;
  margin: 20px;
  border-radius: 30px;
  padding: 30px;
  }
}

</style>
