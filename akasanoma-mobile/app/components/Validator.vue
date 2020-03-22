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
      <ActionItem icon="res://navigation/menu" android:visibility="collapsed" ios.position="left"></ActionItem>
      <Label class="action-bar-title" text="Validating"></Label>
    </ActionBar>
    <ScrollView>
      <TextView
        editable="false"
        :androidElevation="10"
        :text="tTxt"
        backgroundColor="#e6e6e6"
        color="#3c495e"
      />
      <StackLayout class="page-content">
        <TextView editable="false" :androidElevation="10" :text="tTxt" backgroundColor="#e6e6e6" color="#3c495e"/>
                <TextView editable="false" v-if="alert" :androidElevation="10" :text="msg" backgroundColor="#e6e6e6" color="#3c495e"/>
        <VerifyCard :entry="verfs[key].entry" :trans="verfs[key].translation" :key="key" />
        <GridLayout columns="auto, *, auto" style="margin:30px">
          <Button @tap="prev" text="prev" :visibility="prevViz" row="0" col="0" />
          <Button @tap="next" text="next" :visibility="nextViz" row="0" col="2" />
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </Page>
  </frame>
</template>

<script>
import VerifyCard from "./VerifyCard.vue";

export default {
  components: {
    VerifyCard
  },
  props:['dat'],
  computed: {
    nextViz() {
      return this.key < this.walks ? "visible" : "hidden";
    },
    prevViz() {
      return this.key == 0 ? "hidden" : "visible";
    },
    tTxt() {
      return `${this.key} out of ${this.verfs.length}.`;
    }
  },
  data() {
    return {
      walks: 0,
      key: 0,
      verfs: [],
      trans:{},
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

      if(this.key + 2 == this.verfs.length){
        this.showMsg("After this rating, all your ratings will be automatically submitted. You can go back to make changes if you want.");
      }
      
      if (this.key + 1 == this.verfs.length) {
        this.$modal.close(this.$data);
      } else {
        this.walks = this.key++ > this.walks ? this.key : this.walks;
      }
    },
    prev() {
      if (this.key > 0) {
        this.key--;
      }
    },
    rated(rating) {
      
      if (rating.rating) {
        this.verfs[this.key].rating = rating.rating;
        if(rating.alt){
          this.trans[this.verfs[this.key].eid] = {
            entry:this.verfs[this.key].entry,
            trans:rating.alt,
            id:this.verfs[this.key].eid,
          };
        }
        this.next();
      } else {
        this.showMsg("Something not right here 🤔. Please rate above 0.");
      }
    },
    setUp() {
      this.verfs = this.dat;
    }
  },
  mounted() {
    this.$eventBus.$on("rated", rating => {
      this.rated(rating);
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