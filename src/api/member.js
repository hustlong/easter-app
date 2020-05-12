import request from '@/utils/request'

export function memberDetail(memberId) {
    return request({
        url: '/ums/user/' + memberId,
        method: 'get'
    })
}