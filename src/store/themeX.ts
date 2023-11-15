import {defineStore} from "pinia";
import {ref} from "vue";

export const themeX = defineStore(
    "theme",
    () => {
        const dark = ref(false);
        const setDark = (val: boolean) => {
            dark.value = val;
        };
        const removeDark = () => {
            dark.value = false;
        };
        return {
            dark,
            setDark,
            removeDark,
        };
    },
    {
        persist: true,
    }
);




// = defineStore(
//     "theme",
//     {
//         state: () => {
//             return {
//                 dark: false,
//                 color: "#ffffff",
//             };
//         },
//         getters: {
//             getDark: (state) => {
//                 return state.dark
//             },
//         },
//         actions: {
//             saveDark(dark: boolean) {
//                 this.dark = dark;
//             },
//         },
//     }
// );
