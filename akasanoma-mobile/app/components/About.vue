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
      <Label class="action-bar-title" text="About"></Label>
    </ActionBar>
    <ScrollView>
    <StackLayout class="page-content">
      <Label class="head" text="About" />
      <TextView
        text="Akasanoma is a project which aims to develop digital artificial intelligence that can translate from English to any local language. This is the first phase of this project which rests upon the help of local citizens to help create the required data to train such a model. Join us make a change."
        editable="false"
      />
      <Label class="head" text="Rules" />
      <TextView text="The rules are simple. Just make some money by providing translations or validations. The details of the rules are below." editable="false" />
      <Label class="head" text="Explanation" />
      <TextView text="At each level you are given english words to translate ( Anyone can be a translator or validator). Your translations will be presented to 10 validators who would rate the translations over the interval 0-100%. Any mark above 50 is given to you as points. Any mark below 50 is 0. Validators are entitled to 5 marks if their validation turns out to be amongst the majority. For instance if more than 5 validators rate a translation above 50%, then all those validators who also gave a rating of above 50% will get 5 points. Whatever points is gainned at each level will be multiplied by the level number. So points gainned in level 3 will be multiplied by  3." editable="false" />
      <Label class="head" text="Calculation of points." />
      <TextView text="For validators, if your validation turns out to be amongst the majority as described above, you gain 5 points multiplied by the level. For instance if you correctly validate a level 3 entry, you gain 3*5 = 15 points. For translators, your points is calculated as follows. Suppose you gain a rating of r, the your point will be p = ((r-50)/50)*5 if r > 50 else p = -1. The maximum points you can get for each validation is 5, which happens when a validator gives you 100% rating." editable="false" />
      <Label class="head" text="Progressing between levels." />
      <TextView text="To progress from 1 level to the other there are certain criterion you must meet. Everyone starts from level 1. To move from level 1 to 2, you must make 250 translations. Validations don't cont when it comes to level progression, but you gain points for validations. Finally, you need to make 500 translations in order to move to level 3." editable="false" />
      <Label class="head" text="Converting Points to money." />
      <TextView text="Yes, exactly. You can convert your points to money at the given rate. Go to the Redeem Points section of the app, there you will see your points and the conversion rates. To convert your points to money, just provide an MTN mobile money account." editable="false" />
    </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import Card from "./Card.vue";

export default {
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("About");
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
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
TextView {
  background-color: white;
  font-size: 16px;
  font-weight: 300;
  color: #3c495e;
  font-style: italic;
  margin: 20px;
  padding: 10px;
  border-radius: 0px 0px 10px 10px;
}

.head {
  border-radius: 10px 10px 0px 0px;
  margin: 20px;
  padding: 10px;
  background-color: white;
  font-size: 18px;
  font-weight: bold;
  color: #3c495e;
}
</style>