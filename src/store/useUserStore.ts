import {defineStore} from "pinia";
import {ref} from "vue";

export const useUserStore = defineStore(
    "user",
    () => {
        const token = ref("");
        const settoken = (newtoken: any) => {
            token.value = newtoken;
        };
        const removetoken = () => {
            token.value = "";
        };
        return {
            token,
            settoken,
            removetoken,
        };
    },
    {
        persist: true,
    }
);
