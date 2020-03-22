<template>
    <StackLayout class="outer">
        <StackLayout class="text" backgroundColor="#ffffff">
        <Label text="---> Entry."/>
        <TextView editable="false" :text="entry" backgroundColor="#ffffff"/>
        </StackLayout>
        <StackLayout class="text" backgroundColor="#ffffff">
        <Label text="---> Translation."/>
        <TextView editable="false" :text="trans" backgroundColor="#ffffff"/>
        </StackLayout>
        
        <StackLayout class="alt" backgroundColor="#ffffff">
        <Label text="If you believe that you have a better translation, you can provide it here." textWrap="true"/>
        <GridLayout columns="65, 65, 65, 65" >
            <Button row="0" col="0" class="twi" text="ɛ" @tap="append('ɛ')"/>
            <Button row="0" col="1" class="twi" text="ɔ" @tap="append('ɔ')"/>
            <Button row="0" col="2" class="twi" text="Ɛ" @tap="append('Ɛ')"/>
            <Button row="0" col="3" class="twi" text="Ɔ" @tap="append('Ɔ')"/>
        </GridLayout>
        <TextView editable="true" autocorrect="false" hint="Alternate Translation here ..." v-model="alt"/>
        </StackLayout>

        <StackLayout class="inner" backgroundColor="#ffffff">
        <GridLayout columns="*,auto">
            <Slider :color="colors" :backgroundColor="colors" row="0" col="0" v-model="rating" />
            <Label row="0" col="1" :text="rating+'%'" style="font-size:16px"/>
        </GridLayout>
        <Button text="Rate." color="#ffffff" :backgroundColor="colors" @tap="rated"/>
        </StackLayout>

        
    </StackLayout>
</template>

<script>
export default {
    props:{
        entry:{
            type:String,
            default:"Text Entry"
        },
        trans:{
            type:String,
            default:"Twi Translation."
        },
        index:Number
    },
    data(){
        return{
            rating:0,
            alt:""
        }
    },
    computed: {
        colors(){
            if(this.rating < 25){
                return "red";
            }else if(this.rating < 55){
                return "gold";
            }else if(this.rating < 65){
                return "black";
            }else{
                return "green";
            }
        }
    },
    methods: {
        rated(){
            this.$eventBus.$emit('rated', {rating:this.rating,alt:this.alt});
        },
        append(twi){
            this.alt += twi;
        }
    },
};
</script>

<style scoped lang="scss">
@import "../app-variables";


Button {
    margin:15px;
    border-radius: 20px
}


StackLayout {

    &.outer {
        margin:30px;
        padding: 10px;
    }

    &.inner {
        margin-top:20px;
        padding:25px;
        border-radius: 30px
    }

    &.alt{
        padding:15px;
        border-radius: 30px;
        margin-top:20px;
    }

    &.text{
        padding:10px;
        margin-top:20px;
        border-radius: 20px
    }
    
}

GridLayout {
    margin-bottom:30px
}
</style>
