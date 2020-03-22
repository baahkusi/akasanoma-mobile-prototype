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
      <Label class="action-bar-title" text="Progress"></Label>
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
        <StackLayout :androidElevation="10" class="stats page-content">
          <Label text="Your Progress so far ..." color="#3c495e" style="font-size:11px" />
          <Label :text="'No. of Translations made by you : '+transc" color="#43b883" />
          <Label :text="'No. of Validations made by you : '+validsc" color="#43b883" />
          <Label :text="'Your Total Points : '+pts" color="#43b883" />
        </StackLayout>
        <StackLayout class="houses page-content">
          <TextView
            class="nalert"
            editable="false"
            :androidElevation="10"
            backgroundColor="#ffffff"
            text="Recent translations ..."
          />
          <StackLayout v-for="(item,i) in trans" :androidElevation="10" class="trans" :key="i">
            <Label text="translation" color="#3c495e" style="font-size:11px" />
            <Label :text="'Entry : '+item.entry" color="#3c495e" style="text-transform:capitalize" />
            <Label :text="'Translation : '+item.trans" color="#3c495e" />
            <Label :text="'Pass > 50 : '+item.p" color="#3c495e" />
            <Label :text="'Fail < 50 : '+item.f" color="#3c495e" />
          </StackLayout>
        </StackLayout>

        <StackLayout class="houses page-content">
          <TextView
            class="nalert"
            editable="false"
            :androidElevation="10"
            backgroundColor="#ffffff"
            text="Recent validations ..."
          />
          <StackLayout v-for="(item,i) in valids" :androidElevation="10" class="valids" :key="i">
            <Label text="validation" color="#43b883" style="font-size:11px" />
            <Label :text="'Entry: '+item.entry" color="#43b883" style="text-transform:capitalize" />
            <Label :text="'Translations: '+item.trans" color="#43b883" />
            <Label :text="'Rating: '+item.rating" color="#43b883" />
            <Label :text="'Pass > 50 : '+item.p" color="#43b883" />
            <Label :text="'Fail < 50 : '+item.f" color="#43b883" />
          </StackLayout>
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { request } from "tns-core-modules/http";
import { mapGetters } from "vuex";
import Home from "./Home.vue";
import Card from "./Card.vue";
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
    SelectedPageService.getInstance().updateSelectedPage("Progress");
    const payload = {
      "111": {
        get_progress: {},
        "000": ["get_progress"]
      },

      "000": ["111"]
    };
    this.httpReq(payload).then(result => {
      const resp = result["111"]["get_progress"];
      if (resp["status"]) {
        setNumber("level", resp["data"].level);
        this.trans = resp["data"].trans;
        this.valids = resp["data"].valids;
        this.points = resp["data"].points;
        this.validsc = resp["data"].validsc;
        this.transc = resp["data"].transc;
        // this.$forceUpdate();
      } else {
        this.showMsg("Something went wrong, restart the app and try again.");
      }
    });
  },
  data() {
    return {
      busy: false,
      trans: [],
      valids: [],
      points: "",
      transc: "",
      validsc: "",
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

.title {
  font-size: 11px;
}

StackLayout {
  &.valids {
    background-color: #ffffff;
    min-height: 120px;
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 10px;
    padding: 10px;
  }

  &.trans {
    background-color: #ffffff;
    min-height: 150px;
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 10px;
    padding: 10px;
  }

  &.houses {
    margin-top: 50px;
  }

  &.stats {
    background-color: #ffffff;
    min-height: 130px;
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 10px;
    padding: 10px;
  }
}

ListView {
  margin-top: 30px;
  margin: 20px;
}

TextView[editable="false"] {

  &.nalert{
    min-height: 50px;
  padding: 20px;
  border-radius: 10px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 14px;
  color: #a7a7a7;
  }
  
}
</style>
