<template>
    <span>
        <v-tooltip color="white" top>
            <template v-slot:activator="{ on }">
                <v-img class="d-inline-block mr-1"
                       :src="badge.img"
                       width="16" v-on="on"/>
            </template>
            <v-img class="ma-auto"
                   :src="badge.img"
                   width="64px"/>
            <div class="mr-auto mt-2 text-center" style="color: black;">
                {{ badge.title }}
            </div>
        </v-tooltip>
    </span>
</template>

<script>
    export default {
        name: "Badge",
        props: {
            badge: {
                type: Object,
                required: true,
            },
        },
    }
</script>

<style scoped>

</style>
