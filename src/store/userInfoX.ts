import {defineStore} from "pinia";
import {ref} from "vue";

export const userInfoX = defineStore(
    "userInfo",
    () => {
        let userInfo = ref("");
        const setUserInfo = (newUserInfo: any) => {
            userInfo.value = newUserInfo;
        };
        const removeUserInfo = () => {
            userInfo.value = "";
        };
        return {
            userInfo,
            setUserInfo,
            removeUserInfo,
        };
    },
    {
        persist: true,
    }
);
