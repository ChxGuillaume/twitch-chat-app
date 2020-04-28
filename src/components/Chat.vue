<template>
    <v-list class="overflow-auto" max-height="70vh">
        <v-list-item-group>
            <message v-for="(message) in displayMessages" :message="message" :key="message.context.id"/>
        </v-list-item-group>
        <v-item class="pl-4 pr-4">
            <v-text-field label="Message" color="#6441a5" v-model="message" @keydown="sendMessage"></v-text-field>
        </v-item>
    </v-list>
</template>

<script>
    import Message from "./Message";

    const tmi = require('tmi.js');

    export default {
        name: "Chat",
        components: {Message},
        data() {
            return {
                messages: [],
                channelBadges: {},
                chatClient: null,
                connected: false,
            };
        },
        props: ['channel', 'badges'],
        computed: {
            displayMessages() {
                const chatLength = this.messages.length;
                const start = (chatLength - 100) < 0 ? 0 : (chatLength - 100);

                return this.messages.slice(start, chatLength);
            },
        },
        mounted() {
            const opts = {
                identity: {
                    username: 'nekotiki',
                    password: this.$store.state.access_token,
                },
                channels: [this.channel],
            };

            this.axios
                .get(`https://api.twitch.tv/helix/users?login=${this.channel}`, {
                    headers: {
                        'Client-ID': 'jdgwtwpb9p937zqa2973hguvooq1vw',
                    },
                })
                .then(({data: {data}}) => {
                    const channelId = data[0].id;
                    this.axios
                        .get(`https://badges.twitch.tv/v1/badges/channels/${channelId}/display`)
                        .then(({data: {badge_sets}}) => {
                            this.channelBadges = badge_sets;
                        });
                })

            this.chatClient = new tmi.client(opts);

            this.chatClient.on('connected', (addr, port) => {
                console.log(`* Connected to ${addr}:${port}`);
                setTimeout(() => {
                    this.chatClient.raw('CAP REQ :twitch.tv/membership');
                }, 3000);
            });

            this.chatClient.on('join', (channel, username, self) => {
                console.log(channel, username, self);
                if (self) {
                    this.connected = true;
                }
            });

            this.chatClient.on('message', (target, context, msg) => {
                // http://static-cdn.jtvnw.net/emoticons/v1/EMOTE_ID/SIZE
                // console.log(context, msg);
                const channel = target.replace('#', '');

                // TODO SEE ORDER OF THINGS

                let emotes = {};
                if (context.emotes) Object.keys(context.emotes)
                    .forEach(emote => {
                        context.emotes[emote].forEach(position => {
                            const [posFrom, posTo] = position.split('-');
                            emotes[posFrom] = {posFrom: parseInt(posFrom), posTo: parseInt(posTo), emote};
                        })
                    });

                let msgArray = [];
                if (Object.keys(emotes).length > 0) {
                    let lastPos = 0;
                    Object.values(emotes)
                        .forEach((emote, index) => {
                            let messageSlice = msg.slice(lastPos, emote.posFrom);

                            lastPos = (emote.posTo + 1);

                            msgArray.push({type: 'text', value: messageSlice.trim()});
                            msgArray.push({type: 'emote', value: emote.emote});

                            if (index === (Object.keys(emotes).length - 1)) {
                                let messageSlice = msg.slice((emote.posTo + 1), msg.length);
                                msgArray.push({type: 'text', value: messageSlice});
                            }
                        });
                } else {
                    msgArray.push({type: 'text', value: msg});
                }

                const badges = [];
                for (const badge in context.badges) {
                    const level = context.badges[badge];

                    let badgeObj;
                    if (this.channelBadges && this.channelBadges[badge] && this.channelBadges[badge].versions[level]) {
                        badgeObj = this.channelBadges[badge].versions[level];
                    } else if (this.badges && this.badges[badge]) {
                        badgeObj = this.badges[badge].versions[level];
                    }

                    badges.push({
                        title: badgeObj.title,
                        img: badgeObj.image_url_4x,
                    });
                }

                // this.chatMessages[target].push({channel, badges, owner: context, msg});

                // const messages = this.chatMessages[target];
                // messages.push({channel, badges, owner: context, msg});
                // this.$set(this.chatMessages, target, messages);

                this.messages.push({channel, badges, context, msg, msgArray});
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
