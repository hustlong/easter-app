import request from '@/utils/request'

export function login(username, password) {
    return request({
        url: '/ums/sso/login',
        method: 'post',
        params: {
            email: username,
            password: password
        }
    })
}

export function getInfo() {
    return request({
        url: '/ums/sso/info',
        method: 'get',
    })
}

export function authCode(email) {
    return request({
        url: '/ums/sso/getAuthCode',
        method: 'get',
        params: {
            email: email
        }
    })
}

export function register(email, password, username, authCode) {
    return request({
        url: '/ums/sso/register',
        method: 'post',
        params: {
            email: email,
            password: password,
            username: username,
            authCode: authCode
        }
    })
}

export function updatePassword(email, password, authCode) {
    return request({
        url: '/ums/sso/updatePassword',
        method: 'post',
        params: {
            email: email,
            password: password,
            authCode: authCode
        }
    })
}

export function deleteLoginLog(ids) {
    return request({
        url: '/ums/log/delete',
        method: 'post',
        params: {
            ids: ids
        }
    })
}

export function listLoginLog(pageNum=1, pageSize=10) {
    return request({
        url: '/ums/log/list',
        method: 'get',
        params: {
            pageNum: pageNum,
            pageSize: pageSize
        }
    })
}

export function statistics(userId) {
    return request({
        url: '/ums/statistics/'+userId,
        method: 'get'
    })
}

export function memberInfo(userId) {
    return request({
        url: '/ums/user/'+userId,
        method: 'get'
    })
}

/*
{
  "birthday": "2020-04-27T14:57:23.984Z",
  "city": "string",
  "gender": 0,
  "icon": "string",
  "job": "string",
  "nickname": "string",
  "personalizedSignature": "string",
  "phone": "string"
}
 */
export function updateMemberInfo(memberInfo) {
    return request({
        url: '/ums/user/update',
        method: 'post',
        data: memberInfo
    })
}

export function searchUser(mail) {
    return request({
        url: '/ums/user/search',
        method: 'get',
        params: {
            mail: mail
        }
    })
}

export function rankingFans() {
    return request({
        url: '/ums/user/ranking',
        method: 'get'
    })
}
