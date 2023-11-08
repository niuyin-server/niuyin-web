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

// export const useUserInfoStore = defineStore(
//     "userInfo",
//     () => {
//         const userInfo = ref("");
//         const setUserInfo = (newUserInfo: any) => {
//             userInfo.value = newUserInfo;
//         };
//         const removeUserInfo = () => {
//             userInfo.value = "";
//         };
//         return {
//             userInfo,
//             setUserInfo,
//             removeUserInfo,
//         };
//     },
//     {
//         persist: true,
//     }
// );
