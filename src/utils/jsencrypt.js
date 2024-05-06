import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = '【公钥】'

const privateKey = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkh+VtRRqLIW4xBU1aOJp879n6T/SSFO36Fixlf3ymW5m+yv3w9kT6/KHVOQo6sk6sJExRq96MNG8V5ezrAXKmWcelTJGu9H/q8kfD7mSELq2JHnE6WmpGdGb8vZHZxgnROLhKHT2mDC+c7Cn4meHaeAnOeuaiy6goMl58masj7/SG/nt2Dpntb+kwK2YKKCvR6eidJRkwycHyRxhDhOb+cATdrjlKB+CFYLhMG9yjOCQ/IXOC7NAKJpPoALC3LHvPl5C7NnXsZB9zvPiZeoL7YNV1d1TSJFySk3gUn80TRnAXbxSiHJvsXWB/p0Vv0IystyJvV4hJOgf7ggh/qA7XAgMBAAECggEARwy8YZR+4ugb2qVsgvKAnEVDf1m5xr+tCNs8btQ/8uMJoJ+uS7k9jpk8FYTdSv2nBaVjI72xjCA0fGNfDRkB9p48ncBUBRZmiwH3RcATvhUeMWFpCgbzb9tigfAnJMDlimkRBEheT+9hPEWr1kQ1iQ9fRMBECrchtcISlYISqqCHDsiUzYpRgyjygCf49hWmWhrRcZn8/4xBJ41Hqk7LsWNVcYGI14Yy/PFwim27b6Mb5TD/RABvriq3b78FVKl3k/k+UCg09ZtEckveu6Apd2KgRFlm9G7of9g/BSOpqcyrC4SnAKkxRFL1U+KAFI/3rYKszC6LlQ4OrFbQyzo2uQKBgQD4zH2V4w8m7kOOaqrHN/TnEMMW8WZRa+lBWfwVjqBMnaOdOEkDadv16k9NjZue8/3iGTxsWN/ncPdiq8D5QOdPMMCKn7DO/+Z/6+daTBHbuID2qHTLXNzKo45xJsUcuptH9wpHOfd97flxjW/cZOGcVLuof+cB45YrdtzkQHO8UwKBgQCpSwKv4No1Op3s5Lk+sVvxWNqotWJK47O/T1YP9lDVdmGM7v2d7Uc9FRbr3xugtmn1zOCw5W7dz3/rQ2isrGaotEno3lLjEd16pYKf49H9HgWVqs+5l2H+L08jl1hHrOOqhsZYeKbHFnoP5pgpnUE70zUjqyatv8PLfZ8LLAuy7QKBgGFYUULWBlWrH8+XOJ6d7DqEOnC9ntT4rdkeBh3BIkMX4q5fGWI2hxOey8yCPYNh39IZIaUa2PBLKN/4Z5aeqGI5pvwWIy26vksK2AhifxJDDGJ14sy21sSKXe8zxifJc3wi0miv63/gHpspRb0r04JBPPNep9n7XARBi4fbF+11AoGBAICxgQ1qhPbJ5JvdE+VQtnA196Mgn+QGTPI1wVrJCJH9OBMG6s1PP0Rz78THCh2WDd7JLFXNVAZSYw/ZYo1BUZkV1MmtmJz9S7ycbTxW157vX5dzDg4rwlaUaDjKKFX0W+2aHtXKgh3+PDQyO6IG5TwxRsgip3iVuqXKjUjU5t/RAoGBALFocURQHsdFNWxAjok5an8hinEiAMBi8nly/BOZyvyXq8x5fyvzghD8ii1BitK6QhvZsaEwhrhW1PxECsU+NPbSNUaRhFtGi1xQF3WGa/vSMH6bzxL+ip8ZKlCMnX5bDegNFK+/2MvTDVXk98ZAnwQ7sBlM578VjhE7BRpgwWyw"


// 加密
export function encrypt(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPrivateKey(privateKey) // 设置私钥
    return encryptor.decrypt(txt) // 对数据进行解密
}