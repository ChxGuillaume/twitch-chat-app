<template>
    <v-container>
        <v-row>
            <v-col class="text-center">
                <h1>Hello World</h1>
            </v-col>
            <v-col cols="12">
                <v-list>
                    <v-list-item dense v-for="(msg, index) in chatMessages" :key="index">
                        <v-list-item-content>
                            <v-list-item-title><span :style="`color:${msg.owner.color}`">{{ msg.owner['display-name'] }}</span>: {{ msg.msg }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="12">
                <v-text-field label="Message" color="#6441a5" v-model="message" @keydown="sendMessage"></v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    const tmi = require('tmi.js');

    export default {
        name: "LoggedIn",
        data() {
            return {
                message: '',
                badges: {},
                chatClient: undefined,
                chatMessages: [],
            };
        },
        methods: {
            sendMessage(ev) {
                if (ev.key === 'Enter') {
                    this.chatClient.say('nekotiki', this.message);
                    this.message = '';
                }
            },
        },
        mounted() {
            this.axios
                .get('https://badges.twitch.tv/v1/badges/global/display')
                .then(({data: {badge_sets}}) => {
                    this.badges = badge_sets;
                });

            // Define configuration options
            const opts = {
                identity: {
                    username: 'nekotiki',
                    password: this.$store.state.access_token,
                },
                channels: [
                    'nekotiki',
                    'at0mium',
                ],
            };

            this.chatClient = new tmi.client(opts);

            // Register our event handlers (defined below)
            this.chatClient.on('message', (target, context, msg, self) => {
                console.log(target, context, msg, self);
                this.chatMessages.push({ owner: context, msg });
            });

            this.chatClient.on('connected', (addr, port) => {
                console.log(`* Connected to ${addr}:${port}`);
                setTimeout(() => {
                    this.chatClient.raw('CAP REQ :twitch.tv/membership');
                }, 3000);
            });

            this.chatClient.on('join', (channel, username, self) => {
                console.log(channel, username, self);
            });

            this.chatClient.connect();
        },
        beforeDestroy() {
            this.chatClient.disconnect();
        },
    }
</script>

<style scoped>

</style>
