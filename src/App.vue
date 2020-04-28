<template>
    <v-app>
        <system-bar />

        <div class="pt-8 d-flex align-center">
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
    import SystemBar from "./components/SystemBar";

    export default {
        name: 'App',
        components: {SystemBar},
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

    #app {
        max-height: 100vh;
        overflow: auto;
    }

    ::-webkit-scrollbar {
        width: 6px;
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
