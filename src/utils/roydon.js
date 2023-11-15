/**
 * 通用js方法封装处理
 */
import CryptoJS from 'crypto-js'

const aes_secret = "niuyin"

/**
 * 加密
 * @param str
 * @returns {string}
 */
export function encodeData(str) {
    const encryptedData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str))
    console.log('加密后的数据:', encryptedData);
    return encryptedData
}

/**
 * 解密
 * @param str
 * @returns {*}
 */
export function decodeData(str) {
    const decryptedData = CryptoJS.enc.Base64.parse(str).toString(CryptoJS.enc.Utf8)
    console.log('解密后的数据:', decryptedData);
    return parseInt(decryptedData)
}

/**
 * 根据生日获取年龄
 * @param birthday
 * @returns {unknown[]|null}
 */
export function formatAge(birthday) {
    // 新建日期对象
    if (birthday === undefined) {
        return null;
    }
    let day = birthday.split(" ")[0]
    let date = new Date()
    // 今天日期，数组，同 birthday
    let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    // 分别计算年月日差值
    let age = today.map((value, index) => {
        return value - day.split("-")[index]
    })
    // 当天数为负数时，月减 1，天数加上月总天数
    if (age[2] < 0) {
        // 简单获取上个月总天数的方法，不会错
        let lastMonth = new Date(today[0], today[1], 0)
        age[1]--
        age[2] += lastMonth.getDate()
    }
    // 当月数为负数时，年减 1，月数加上 12
    if (age[1] < 0) {
        age[0]--
        age[1] += 12
    }
    // usage
    // console.log(getAge('2013-7-12'.split('-'))) // [8,0,23] 岁 月 天
    return age
}

export function getAge(birthday) {
    if (birthday === undefined) {
        return null;
    }
    let year = birthday.split("-")[0]
    let todayYear = new Date().getFullYear()
    return todayYear - year;
}

/**
 * 智能化显示日期
 * @param date
 * @returns {string}
 */
export function smartDateFormat(date) {
    const ONE_SECOND = 1000;
    const ONE_MINUTE = 60000;
    const ONE_HOUR = 3600000;
    const ONE_DAY = 86400000;
    const ONE_WEEK = 604800000;
    const ONE_MONTH = 2629746000;
    const ONE_YEAR = 31556952000;
    const ONE_SECOND_AGO = "秒前";
    const ONE_MINUTE_AGO = "分钟前";
    const ONE_HOUR_AGO = "小时前";
    const ONE_DAY_AGO = "天前";
    const ONE_MONTH_AGO = "月前";
    const ONE_YEAR_AGO = "年前";
    let delta = new Date().getTime() - new Date(date).getTime()
    if (delta < ONE_MINUTE) {
        let seconds = ~~(delta / ONE_SECOND);
        return (seconds <= 0 ? 1 : seconds) + ONE_SECOND_AGO;
    }
    if (delta < 45 * ONE_MINUTE) {
        let minutes = ~~(delta / ONE_MINUTE)
        return (minutes <= 0 ? 1 : minutes) + ONE_MINUTE_AGO;
    }
    if (delta < 24 * ONE_HOUR) {
        let hours = ~~(delta / ONE_HOUR);
        return (hours <= 0 ? 1 : hours) + ONE_HOUR_AGO;
    }
    if (delta < 48 * ONE_HOUR) {
        return "昨天";
    }
    if (delta < 30 * ONE_DAY) {
        let days = ~~(delta / ONE_DAY);
        return (days <= 0 ? 1 : days) + ONE_DAY_AGO;
    }
    if (delta < 12 * 4 * ONE_WEEK) {
        let months = ~~(delta / ONE_MONTH);
        return (months <= 0 ? 1 : months) + ONE_MONTH_AGO;
    } else {
        let years = ~~(delta / ONE_YEAR);
        return (years <= 0 ? 1 : years) + ONE_YEAR_AGO;
    }
}

// 日期格式化
export function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

// 表单重置
export function resetForm(refName) {
    if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
    }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
    let search = params;
    search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
    dateRange = Array.isArray(dateRange) ? dateRange : [];
    if (typeof (propName) === 'undefined') {
        search.params['beginTime'] = dateRange[0];
        search.params['endTime'] = dateRange[1];
    } else {
        search.params['begin' + propName] = dateRange[0];
        search.params['end' + propName] = dateRange[1];
    }
    return search;
}

// 字符串格式化(%s )
export function sprintf(str) {
    var args = arguments, flag = true, i = 1;
    str = str.replace(/%s/g, function () {
        var arg = args[i++];
        if (typeof arg === 'undefined') {
            flag = false;
            return '';
        }
        return arg;
    });
    return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

// 数据合并
export function mergeRecursive(source, target) {
    for (var p in target) {
        try {
            if (target[p].constructor == Object) {
                source[p] = mergeRecursive(source[p], target[p]);
            } else {
                source[p] = target[p];
            }
        } catch (e) {
            source[p] = target[p];
        }
    }
    return source;
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
    let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };

    var childrenListMap = {};
    var nodeIds = {};
    var tree = [];

    for (let d of data) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }

    for (let d of data) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }

    return tree;
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && value !== "" && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}

// 验证是否为blob格式
export async function blobValidate(data) {
    try {
        const text = await data.text();
        JSON.parse(text);
        return false;
    } catch (error) {
        return true;
    }
}

//判断是否是移动端
export const isMobile = () => {
    return !!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)
}
