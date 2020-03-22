<template>
  <StackLayout>
    <TextField v-model="email" hint="Enter email..."/>
    <TextField v-model="pin" v-if="pinned" hint="Enter pin..."/>
  </StackLayout>
</template>

<script>
export default {
  props: {
    pinned: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: "",
      pin: ""
    };
  },
  methods: {
    getData() {
        return this.$data;
    },
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

StackLayout {
  margin: 15px;
  padding: 0px;
  border-radius: 10px;
}
</style>
