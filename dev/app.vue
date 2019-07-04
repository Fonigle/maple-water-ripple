<template>
    <div class="app"
         v-ripple>11111111</div>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";

    @Component
    export default class App extends Vue {
    }
</script>
<style lang="scss">
    html {
        height: 100%;
        body {
            height: 100%;
            padding: 0;
            margin: 0;

            .app {
                height: 100%;
                width: 100%;
                background-image: url("./images/bg2.jpg");
                background-size: cover;
                background-position: 50% 0;
                height: 100%;
            }
        }
    }
</style>