<template>
    <v-container fluid>
        <v-row>
            <v-col class="text-center">
                <h1>Hello World</h1>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-tabs v-model="channelSelected" background-color="primary" dark>
                        <v-tab v-for="channel in channels" :key="channel">
                            {{ channel }}
                        </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="channelSelected">
                        <v-tab-item v-for="channel in channels" :key="channel">
                            <v-card flat>
                                <chat :messages="chatMessages"
                                      :channel="channel"
                                      :badges="badges"/>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Chat from "../components/Chat";

    // const tmi = require('tmi.js');

    export default {
        name: "LoggedIn",
        components: {Chat},
        data() {
            return {
                message: '',
                badges: {},
                channels: [
                    'nekotiki',
                    'maghla',
                    'at0mium',
                    'zerator',
                    'locklear',
                ],
                channelSelected: '',
                channelBadges: {},
                chatClient: null,
                chatMessages: {},
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
        }
    }
</script>

<style>
    .v-tooltip__content {
        opacity: 1 !important;
    }
</style>

<style scoped>

</style>
