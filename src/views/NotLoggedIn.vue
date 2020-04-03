<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">
                <v-img
                        :src="require('../assets/logo.svg')"
                        class="my-3"
                        contain
                        height="200"/>
            </v-col>

            <v-col cols="12" class="mb-4">
                <h1>Welcome to Twitch Chat - Client</h1>
            </v-col>

            <v-col cols="12" class="mb-4">
                <v-btn @click="twitchLogin">
                    Login with
                    <v-icon class="ml-2">mdi-twitch</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    const {BrowserWindow} = require('electron').remote;
    import {mapMutations} from 'vuex';

    export default {
        name: 'HelloWorld',

        data: () => ({}),
        methods: {
            twitchLogin() {
                const config = {
                    client_id: 'jdgwtwpb9p937zqa2973hguvooq1vw',
                    response_type: 'token',
                    redirect_uri: 'http://electron.twitch.localhost',
                    scope: ['viewing_activity_read', 'chat:read', 'chat:edit'].join('+'),
                };

                const url = `https://id.twitch.tv/oauth2/authorize?response_type=${config.response_type}&client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&scope=${config.scope}`;

                const authWindow = new BrowserWindow({width: 430, height: 400, show: false, 'node-integration': false});

                authWindow.setTitle('Login with Twitch');
                authWindow.loadURL(url);
                authWindow.setMenu(null);
                authWindow.show();

                authWindow.webContents.on('did-redirect-navigation', (event, url) => {
                    const accessToken = url.match(/access_token=([^&]*)/gi)[0].split('=')[1];

                    console.log(accessToken, this.$store.state)

                    authWindow.close();

                    this.setToken(accessToken);

                    console.log(accessToken, this.$store.state)

                    this.$router.push({name: 'dashboard'});
                })
            },
            ...mapMutations({setToken: 'setToken'}),
        },
        mounted() {
            console.log(this.$store.state)
        },
        beforeCreate() {
            if (this.$store.state.access_token) this.$router.push({name: 'dashboard'});
        },
    }
</script>
