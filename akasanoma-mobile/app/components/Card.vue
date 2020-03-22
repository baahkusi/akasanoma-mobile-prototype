<template>
  <DockLayout
    :androidElevation="5"
    @tap="tapped"
    :backgroundColor="tapCol"
    :isUserInteractionEnabled="touch"
  >
    <Label class="top" :text="top" :backgroundColor="tapCol" dock="top" height="40" :isUserInteractionEnabled="touch"/>
    <TextView
      :backgroundColor="tapCol"
      editable="false"
      class="mid"
      :text="mid"
      dock="top"
      height="100"
      :isUserInteractionEnabled="touch"
    />
    <Label class="bot" dock="bottom" :backgroundColor="tapCol" height="40" :isUserInteractionEnabled="touch">
      <FormattedString>
        <span :text="bot" />
      </FormattedString>
    </Label>
  </DockLayout>
</template>

<script>
export default {
  props: {
    top: String,
    mid: String,
    bot: String,
    to: String,
    locked: {
      type: Boolean,
      default: false
    },
    touch:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      col: "#f8f8f8"
    };
  },
  computed: {
    tapCol() {
      if (this.locked) {
        return "#d7d7d7";
      } else {
        return this.col;
      }
    }
  },
  methods: {
    tapped() {
      if (!this.locked) {
        this.$eventBus.$emit("tapped", this.to);
      } 
    }
  }
};
</script>

<style scoped lang="scss">
@import "../app-variables";
label {
  margin: 0px;
  padding: 10px;

  &.bot {
    font-size: 16px;
    font-weight: bold;
    color: #3c495e;
    border-radius: 0px 0px 10px 10px;
  }

  &.top {
    font-size: 18px;
    font-weight: bold;
    color: #3c495e;
    border-radius: 10px 10px 0px 0px;
  }
}

TextView {
  font-size: 16px;
  font-weight: 200;
  color: #3c495e;
  font-style: italic;
  padding: 20px;
}

DockLayout {
  margin: 15px;
  padding: 0px;
  border-radius: 10px;
}
</style>
