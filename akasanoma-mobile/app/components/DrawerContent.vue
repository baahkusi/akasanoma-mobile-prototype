<template lang="html">
<GridLayout rows="auto, *" class="sidedrawer sidedrawer-left">
            <StackLayout row="0" class="sidedrawer-header">
                <Image class="sidedrawer-header-image" src="res://anoma" stretch="none" />
                <Label class="sidedrawer-header-brand" text="Akasanoma"></Label>
                <Label class="footnote" :text="email"></Label>
            </StackLayout>
        
            <ScrollView row="1" class="sidedrawer-content">
                <StackLayout>
                    <GridLayout columns="auto, *" :class="'sidedrawer-list-item' + (selectedPage === 'Home' ? ' selected': '')" @tap="onNavigationItemTap(Home)">
                        <Label col="0" text.decode="&#xf015;" class="fa"></Label>
                        <Label col="1" text="Home" class="p-r-10"></Label>
                    </GridLayout>

                    <GridLayout columns="auto, *" :class="'sidedrawer-list-item' + (selectedPage === 'Translate' ? ' selected': '')" @tap="onNavigationItemTap(Translate)">
                        <Label col="0" text.decode="&#xf056;" class="fa"></Label>
                        <Label col="1" text="Translate" class="p-r-10"></Label>
                    </GridLayout>

                    <GridLayout columns="auto, *" :class="'sidedrawer-list-item' + (selectedPage === 'Validate' ? ' selected': '')" @tap="onNavigationItemTap(Validate)">
                        <Label col="0" text.decode="&#xf087;" class="fa"></Label>
                        <Label col="1" text="Validate" class="p-r-10"></Label>
                    </GridLayout>

                    <GridLayout columns="auto, *" :class="'sidedrawer-list-item' + (selectedPage === 'Progress' ? ' selected': '')" @tap="onNavigationItemTap(Progress)">
                        <Label col="0" text.decode="&#xf099;" class="fa"></Label>
                        <Label col="1" text="Your Progress" class="p-r-10"></Label>
                    </GridLayout>

                    <GridLayout columns="auto, *" :class="'sidedrawer-list-item' + (selectedPage === 'Points' ? ' selected': '')" @tap="onNavigationItemTap(Points)">
                        <Label col="0" text.decode="&#xf051;" class="fa"></Label>
                        <Label col="1" text="Redeem Points" class="p-r-10"></Label>
                    </GridLayout>
        
                    <StackLayout class="hr-light"></StackLayout>

                    <GridLayout columns="auto, *" :class="'sidedrawer-list-item' + (selectedPage === 'About' ? ' selected': '')" @tap="onNavigationItemTap(About)">
                        <Label col="0" text.decode="&#xf013;" class="fa"></Label>
                        <Label col="1" text="About" class="p-r-10"></Label>
                    </GridLayout>
                </StackLayout>
            </ScrollView>
        </GridLayout>
</template>

<script>
import Home from "./Home";
import Translate from "./Translate";
import Validate from "./Validate";
import Progress from "./Progress";
import Points from "./Points";
import About from "./About";
import { mapGetters } from "vuex";
import * as utils from "~/shared/utils";
import SelectedPageService from "~/shared/selected-page-service";

export default {
  mounted() {
    SelectedPageService.getInstance().selectedPage$.subscribe(
      selectedPage => (this.selectedPage = selectedPage)
    );
  },
  data() {
    return {
      Home: Home,
      Translate: Translate,
      Validate: Validate,
      Progress: Progress,
      Points: Points,
      About: About,
      selectedPage: ""
    };
  },
  components: {
    Home,
    Translate,
    Progress,
    Points,
    About,
    Validate
  },
  computed: mapGetters(["email", "isLoggedIn"]),
  methods: {
    onNavigationItemTap(component) {
      this.$navigateTo(component, {
        clearHistory: true
      });
      utils.closeDrawer();
    }
  }
};
</script>

<style scoped lang="scss">
// Custom common variables
@import "../app-variables";

// Drawer navigation custom styles
$sidedrawer-header-image-size: 60;
$sidedrawer-header-image-offset-top: 20;
$sidedrawer-header-image-offset-bottom: 5;
$sidedrawer-list-item-offset-left: 15;
$sidedrawer-list-icon-offset: 10;
$sidedrawer-list-icon-size: 20;
.sidedrawer {
  &.sidedrawer-left {
    background-color: $ab-background;

    .sidedrawer-header-image {
      height: $sidedrawer-header-image-size;
      width: $sidedrawer-header-image-size;
      font-size: $sidedrawer-header-image-size;
      padding: 0;
      margin-bottom: $sidedrawer-header-image-offset-bottom;
      margin-top: $sidedrawer-header-image-offset-top;
    }

    .footnote {
      color: rgba($background-light, 0.5);
    }
  }

  .sidedrawer-header {
    background-color: $ab-background;

    .sidedrawer-header-brand {
      color: $background-light;
    }
  }

  .sidedrawer-content {
    background-color: $ab-background;
  }

  .sidedrawer-list-item {
    padding-left: $sidedrawer-list-item-offset-left;

    label {
      vertical-align: center;
      color: $background-light;
    }

    .fa {
      width: $sidedrawer-list-icon-size;
      margin-right: $sidedrawer-list-icon-offset;
    }

    &.selected {
      background-color: $ab-color;

      label {
        color: $ab-background;
      }
    }
  }
}
</style>