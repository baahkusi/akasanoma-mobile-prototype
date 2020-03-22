<template>
    <StackLayout class="outer">
        <TextView editable="false" :androidElevation="10" backgroundColor="#e6e6e6" :text="entry"/>
        <GridLayout columns="65, 65, 65, 65" >
            <Button row="0" col="0" class="twi" text="ɛ" @tap="append('ɛ')"/>
            <Button row="0" col="1" class="twi" text="ɔ" @tap="append('ɔ')"/>
            <Button row="0" col="2" class="twi" text="Ɛ" @tap="append('Ɛ')"/>
            <Button row="0" col="3" class="twi" text="Ɔ" @tap="append('Ɔ')"/>
        </GridLayout>
        <StackLayout class="inner" backgroundColor="#ffffff" :androidElevation="10">
        <TextView editable="true" autocorrect="false" hint="Type your Translation here ..." v-model="trans"/>
        <Button text="Submit." class="next" backgroundColor="#43b883" color="white" @tap="translated"/>
        </StackLayout>
    </StackLayout>
</template>

<script>
export default {
    props:{
        entry:{
            type:String,
            default:"Translate the following text."
        }
    },
    data(){
        return{
            trans:""
        }
    },
    methods: {
        translated(){
            this.$eventBus.$emit('translated', this.trans);
        },
        append(twi){
            this.trans += twi;
        }
    },
};
</script>

<style scoped lang="scss">
@import "../app-variables";

TextView[editable="false"]{
    min-height:50px;
    padding: 20px;
    border-radius: 30px 30px 0px 0px;
}

.next {
    border-radius: 0px 0px 30px 30px;
    margin:10px
}

.twi {
    margin:15px;
    border-radius: 20px
}


GridLayout {
    margin: 20px 0px 10px 0px
}

TextView[editable="true"]{
    min-height:50px;
    margin-top:50px
}

StackLayout {
    &.outer {
        margin:30px;
        padding: 10px;
        border-radius:30px
    }  

    &.inner {
        margin-top:20px;
        border-radius:0px 0px 30px 30px;
    }

}
</style>
