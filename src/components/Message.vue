<template>
    <v-list-item>
        <v-list-item-content class="d-block align-baseline pt-2 pb-2">
            <badge v-for="(badge, index) in message.badges" :badge="badge" :key="index"/>
            <span class="d-inline-block nickname align-baseline" :style="`color:${message.context.color}`">{{ message.context['display-name'] }}</span>
            <span class="d-inline-block mr-1">:</span>
            <div class="d-inline-block message">
                <template v-for="(msg, index) in message.msgArray">
                    <span class="message-item" v-if="msg.type === 'text'"
                          :key="index">{{ msg.value }}</span>
                    <div class="message-item ml-1 mr-1" :key="index"  v-else-if="msg.type === 'emote'"
                        style="height: 28px;">
                        <v-img class="message-emote d-inline-block align-baseline ma-auto"
                               :src="`http://static-cdn.jtvnw.net/emoticons/v1/${msg.value}/3.0`"
                               width="28px" height="28px"/>
                    </div>
                </template>
            </div>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
    import Badge from "./Badge";

    export default {
        name: "Message",
        components: {Badge},
        props: ['message'],
    }
</script>

<style lang="scss" scoped>
    .nickname {
        font-weight: bold;
        font-size: 16px;
    }

    .message {
        vertical-align: middle;
        word-break: break-all;

        .message-item {
            display: inline-block;
            height: auto;
            line-height: 28px;
            vertical-align: top;
            word-wrap: break-word;
        }
    }
</style>
