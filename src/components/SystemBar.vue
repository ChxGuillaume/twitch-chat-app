<template>
    <v-system-bar class="pr-0" fixed window dark style="-webkit-app-region: drag">
        <v-img :src="require('@/assets/logo-white.png')" width="16" height="16" aspect-ratio="1:1"
               style="max-width: 16px"/>
        <v-spacer class="ml-2">Twitch Chat - Client</v-spacer>
        <v-tooltip bottom color="#6441a5">
            <template v-slot:activator="{ on }">
                <v-btn class="pl-2 pr-2" small text tile height="32" color="#6441a5" @click="disconnect"
                       v-on="on"
                       style="-webkit-app-region: no-drag; min-width: 20px;">
                    <v-icon class="ma-0" color="#6441a5">mdi-cog</v-icon>
                </v-btn>
            </template>
            <span>App Settings</span>
        </v-tooltip>
        <v-tooltip bottom color="red" v-if="access_token">
            <template v-slot:activator="{ on }">
                <v-btn class="pl-2 pr-2" small text tile height="32" color="red" @click="disconnect"
                       v-on="on"
                       style="-webkit-app-region: no-drag; min-width: 20px;">
                    <v-icon class="ma-0" color="red">mdi-logout-variant</v-icon>
                </v-btn>
            </template>
            <span>Disconnect</span>
        </v-tooltip>
        <v-btn class="ml-4 pl-2 pr-2" small text tile height="32" @click="minimize"
               style="-webkit-app-region: no-drag; min-width: 20px;">
            <v-icon class="ma-0">mdi-minus</v-icon>
        </v-btn>
        <v-btn class="pl-2 pr-2" small text tile height="32" @click="maximize"
               style="-webkit-app-region: no-drag; min-width: 20px;">
            <v-icon class="ma-0">mdi-window-maximize</v-icon>
        </v-btn>
        <v-btn class="pl-2 pr-2" small text tile height="32" color="red" @click="close"
               style="-webkit-app-region: no-drag; min-width: 20px;">
            <v-icon class="ma-0">mdi-close</v-icon>
        </v-btn>
    </v-system-bar>
</template>

<script>
    export default {
        name: "SystemBar",
    }
</script>

<style scoped>

</style>
