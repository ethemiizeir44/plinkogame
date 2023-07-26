<template>
    <div
        className="flex h-fit flex-col-reverse items-center justify-center gap-4 md:flex-row"
    >
        <BetAction />
        <!-- <MultiplierHistory /> -->
        <div className="flex flex-1 items-center justify-center">
            <div id="plinko"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";
import BetAction from "~~/components/BetAction.vue";
const route = useRoute();
const user = useUserStore();
const name = route.params.id;

watchEffect(() => {
    user.setNewName(route.params.id as string);
});
const router = useRouter();
const go = () => {
    router.push("/");
};
</script>
