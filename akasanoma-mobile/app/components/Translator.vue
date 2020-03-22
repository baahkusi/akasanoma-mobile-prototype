<template>
<frame>
  <Page class="page">
    <ActionBar class="action-bar">
      <!-- 
            Use the NavigationButton as a side-drawer button in Android
            because ActionItems are shown on the right side of the ActionBar
      -->
      <NavigationButton android.systemIcon="ic_menu_back" @tap="goBack"></NavigationButton>
      <!-- 
            Use the ActionItem for IOS with position set to left. Using the
            NavigationButton as a side-drawer button in iOS is not possible,
            because its function is to always navigate back in the application.
      -->
      <!-- <ActionItem icon="res://navigation/menu" android:visibility="collapsed" ios.position="left"></ActionItem> -->
      <Label class="action-bar-title" text="Translating"></Label>
    </ActionBar>
    <ScrollView>
      <StackLayout class="page-content">
        <TextView editable="false" :androidElevation="10" :text="tTxt" backgroundColor="#e6e6e6" color="#3c495e"/>
        <TextView editable="false" v-if="alert" :androidElevation="10" :text="msg" backgroundColor="#e6e6e6" color="#3c495e"/>
        <TranslateCard :entry="entries[key].entry" :key="key" />
        <GridLayout columns="auto, *, auto">
          <Button
            @tap="prev"
            text="prev"
            :visibility="prevViz"
            row="0"
            col="0"
            style="margin-left:30px"
          />
          <Button
            @tap="next"
            text="next"
            :visibility="nextViz"
            row="0"
            col="2"
            style="margin-right:30px"
          />
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</frame>
</template>

<script>
import TranslateCard from "./TranslateCard.vue";

export default {
  components: {
    TranslateCard
  },
  props:['dat'],
  computed: {
    nextViz() {
      return this.key < this.walks ? "visible" : "hidden";
    },
    prevViz() {
      return this.key == 0 ? "hidden" : "visible";
    },
    tTxt(){
      return `${this.key} out of ${this.entries.length}.`;
    }
  },
  data() {
    return {
      walks: 0,
      key: 0,
      entries: [],
      alert: false,
      msg:""
    };
  },
  methods: {
    showMsg(msg){
      this.msg = msg;
      this.alert = true;
      setTimeout(()=>this.alert=false, 3000);
    },
    goBack(){
      this.$modal.close();
    },
    next() {
      if(this.key + 2 == this.entries.length){
        this.showMsg("After this translation, all your translations will be automatically submitted. You can go back to make changes if you want.");
      }
      if (this.key + 1 == this.entries.length) {
        this.$modal.close(this.entries);
      } else {
        this.walks = this.key++ > this.walks ? this.key : this.walks;
      }
    },
    prev() {
      if (this.key > 0) {
        this.key--;
      }
    },
    translated(trans) {
      if (trans) {
        this.entries[this.key].trans = trans;
        this.next();
      } else {
        this.showMsg("Empty translation, you are not allowed to skip.");
      }
    },
    setUp() {
      this.entries = this.dat;
      
    }
  },
  mounted() {
    this.$eventBus.$on("translated", trans => {
      this.translated(trans);
    });
  },
  beforeMount() {
    this.setUp();
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../app-variables";
// End custom common variables

// Custom styles
</style>