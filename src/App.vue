<template>
    <v-app>
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

        <div class="pt-8 d-flex align-center" style="height: 100vh; overflow-x: hidden; overflow-y: auto">
            <v-content>
                <transition name="fade" mode="out-in">
                    <router-view/>
                </transition>
            </v-content>
        </div>
    </v-app>
</template>

<script>
    import {ipcRenderer} from 'electron'
    import {mapMutations, mapState} from "vuex";

    export default {
        name: 'App',
        data: () => ({
            //
        }),
        computed: {
            ...mapState({access_token: 'access_token'})
        },
        methods: {
            disconnect() {
                this.setToken(undefined);
                this.$router.push({name: 'login-page'});
            },
            minimize() {
                const win = require('electron').remote.getCurrentWindow();
                win.minimize();
            },
            maximize() {
                const win = require('electron').remote.getCurrentWindow();
                if (!win.isMaximized()) win.maximize();
                else win.unmaximize();
            },
            close() {
                window.close();
            },
            ...mapMutations({enableDarkMode: 'enableDarkMode', setToken: 'setToken'}),
        },
        mounted() {
            require('electron').remote.getCurrentWindow().show();
            this.$vuetify.theme.dark = this.$store.state.dark_mode;

            ipcRenderer.send('dark-mode-init', this.$store.state.dark_mode);

            ipcRenderer.on('dark-mode-status', (event, arg) => {
                this.$vuetify.theme.dark = arg;
                this.enableDarkMode(arg);
            });
        },
    };
</script>

<style lang="scss">
    html {
        overflow: hidden !important;
    }

    ::-webkit-scrollbar {
        width: 4px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: black;
    }
</style>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition-duration: 0.2s;
        transition-property: opacity;
        transition-timing-function: ease;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0
    }
</style>
